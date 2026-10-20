"""Private follow-up metadata and history; never sends replies or grants membership."""
import hashlib
import json
from datetime import date
from typing import Literal
from uuid import UUID
from fastapi import APIRouter, HTTPException, Query
from pydantic import Field, field_validator
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from .auth import InquiryManager, DB, Input, now, throttle
from .access import allowed, eligible
from .models import ContactInquiry, InquiryEvent, User
from .contact import serialize
router = APIRouter()
LABELS = {'open': 'Open', 'in_progress': 'In progress', 'closed': 'Closed'}


class FollowUpInput(Input):
    request_id: UUID
    version: int = Field(ge=0, strict=True)
    status: Literal['open', 'in_progress', 'closed']
    assignee_id: int | None = Field(default=None, gt=0, strict=True)
    follow_up_on: date | None = None
    note: str = Field(default='', max_length=2000)

    @field_validator('note')
    @classmethod
    def safe_note(cls, value):
        if '\x00' in value: raise ValueError('Remove control characters.')
        return value.strip()

    @field_validator('follow_up_on', mode='before')
    @classmethod
    def calendar_date(cls, value):
        if value is not None and (not isinstance(value, str) or len(value) != 10):
            raise ValueError('Use a calendar date in YYYY-MM-DD format.')
        return value


def find(db, inquiry_id, lock=False):
    query = select(ContactInquiry).where(ContactInquiry.id == inquiry_id)
    if lock: query = query.with_for_update().execution_options(populate_existing=True)
    row = db.scalar(query)
    if not row: raise HTTPException(404, 'Inquiry not found.')
    return row


def details(row, db):
    owner = db.get(User, row.assignee_id) if row.assignee_id else None
    return serialize(row, owner.name if owner else None)


@router.get('/auth/contact-inquiries/assignees')
def assignees(user: InquiryManager, db: DB):
    return [{'id': row.id, 'name': row.name} for row in db.scalars(select(User).where(eligible('inquiries.manage')).order_by(User.name, User.id))]


@router.get('/auth/contact-inquiries/{inquiry_id}')
def detail(inquiry_id: int, user: InquiryManager, db: DB):
    return details(find(db, inquiry_id), db)


@router.get('/auth/contact-inquiries/{inquiry_id}/activity')
def activity(inquiry_id: int, user: InquiryManager, db: DB, before: int | None = Query(default=None, gt=0)):
    find(db, inquiry_id)
    query = select(InquiryEvent).where(InquiryEvent.inquiry_id == inquiry_id)
    if before: query = query.where(InquiryEvent.id < before)
    rows = list(db.scalars(query.order_by(InquiryEvent.id.desc()).limit(26)))
    return {'items': [{key: getattr(row, key) for key in ('id', 'actor_name', 'summary', 'note', 'created_at')} for row in rows[:25]],
            'next_cursor': rows[24].id if len(rows) > 25 else None}


@router.patch('/auth/contact-inquiries/{inquiry_id}')
def update(inquiry_id: int, data: FollowUpInput, user: InquiryManager, db: DB):
    row = find(db, inquiry_id, lock=True)
    signature = hashlib.sha256(json.dumps(data.model_dump(mode='json'), sort_keys=True).encode()).hexdigest()
    previous = db.scalar(select(InquiryEvent).where(InquiryEvent.request_id == str(data.request_id)))
    if previous:
        if previous.inquiry_id != row.id or previous.actor_id != user.id or previous.fingerprint != signature:
            raise HTTPException(409, 'This request was already used for another change. Reload before saving.')
        return details(row, db)
    if row.version != data.version:
        raise HTTPException(409, 'Another administrator updated this inquiry. Reload the saved version before saving.')
    throttle('inquiry-followup:'+str(user.id), 80)
    owner = db.get(User, data.assignee_id) if data.assignee_id else None
    if data.assignee_id and (not allowed(owner, 'inquiries.manage')):
        raise HTTPException(422, 'Choose someone with active inquiry access.')
    changes = []
    if row.status != data.status: changes.append(f'Status: {LABELS[row.status]} → {LABELS[data.status]}')
    if row.assignee_id != data.assignee_id:
        old = db.get(User, row.assignee_id) if row.assignee_id else None
        changes.append(f'Assigned: {old.name if old else "Unassigned"} → {owner.name if owner else "Unassigned"}')
    if row.follow_up_on != data.follow_up_on:
        changes.append(f'Follow-up date: {row.follow_up_on or "Not set"} → {data.follow_up_on or "Not set"}')
    row.status, row.assignee_id, row.follow_up_on = data.status, data.assignee_id, data.follow_up_on
    row.updated_at = now(); row.version += 1
    db.add(InquiryEvent(inquiry_id=row.id, actor_id=user.id, actor_name=user.name,
        summary='; '.join(changes) or ('Private note added' if data.note else 'Follow-up saved'), note=data.note,
        request_id=str(data.request_id), fingerprint=signature, created_at=now()))
    try: db.commit()
    except IntegrityError:
        db.rollback(); raise HTTPException(409, 'This request was already used. Reload before saving.') from None
    except SQLAlchemyError:
        db.rollback(); raise HTTPException(503, 'Could not confirm the saved follow-up. Retry with the same details.') from None
    return details(row, db)
