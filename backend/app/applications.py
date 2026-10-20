"""Introduction intake and internal review; never grants membership or account access."""
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import Field, field_validator
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .auth import ApplicationReviewer, DB, EmailInput, Input, now, throttle, issue_invitation, lock_invitation_email, invitation_record
from .access import allowed, eligible
from .models import Introduction, IntroductionEvent, User, Invitation

router = APIRouter()
Status = Literal['new', 'reviewing', 'waiting']
LABELS = {'new': 'New', 'reviewing': 'Reviewing', 'waiting': 'Waiting for information'}


class IntroductionInput(EmailInput):
    submission_id: UUID
    name: str = Field(min_length=1, max_length=120)
    location: str = Field(min_length=1, max_length=160)
    expertise: str = Field(min_length=1, max_length=1200)
    contribution: str = Field(min_length=1, max_length=1200)

    @field_validator('name', 'location', 'expertise', 'contribution')
    @classmethod
    def clean(cls, value):
        value = value.strip()
        if not value or '\x00' in value:
            raise ValueError('Enter your answer.')
        return value


class InviteInput(Input):
    request_id: UUID
    version: int = Field(ge=0, strict=True)


class ReviewInput(Input):
    request_id: UUID
    version: int = Field(ge=0, strict=True)
    status: Status
    reviewer_id: int | None = Field(default=None, gt=0, strict=True)
    note: str = Field(default='', max_length=2000)

    @field_validator('note')
    @classmethod
    def clean(cls, value):
        if '\x00' in value:
            raise ValueError('Invalid note.')
        return value.strip()


def record(row, reviewer=None):
    return {key: getattr(row, key) for key in ('id', 'name', 'email', 'location', 'status', 'reviewer_id', 'created_at', 'updated_at', 'version')} | {'reviewer_name': reviewer}


def event_record(row):
    return {key: getattr(row, key) for key in ('id', 'actor_name', 'summary', 'note', 'created_at')}


@router.post('/introductions', status_code=201)
def submit(data: IntroductionInput, request: Request, db: DB):
    key = str(data.submission_id)
    values = data.model_dump(exclude={'submission_id'})
    try:
        row = db.scalar(select(Introduction).where(Introduction.submission_id == key))
        if row is None:
            throttle('introduction:' + request.client.host, 8)
            row = Introduction(submission_id=key, **values, created_at=now(), updated_at=now())
            db.add(row)
            try:
                db.flush()
                db.add(IntroductionEvent(introduction_id=row.id, actor_name='Applicant', summary='Introduction received', note='', created_at=now()))
                db.commit()
            except IntegrityError:
                db.rollback()
                row = db.scalar(select(Introduction).where(Introduction.submission_id == key))
                if row is None:
                    raise
        if any(getattr(row, field) != value for field, value in values.items()):
            raise HTTPException(409, 'This introduction was already received with different details. Start a new introduction to submit changes.')
        return {'received': True, 'reference': row.id}
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, 'We could not save your introduction. Your answers are still here; please try again.')


@router.get('/auth/applications/reviewers')
def reviewers(user: ApplicationReviewer, db: DB):
    return [{'id': row.id, 'name': row.name} for row in db.scalars(select(User).where(eligible('applications.review')).order_by(User.name, User.id))]


@router.get('/auth/applications')
def listing(user: ApplicationReviewer, db: DB, q: str = Query(default='', max_length=100),
            status: Literal['all', 'new', 'reviewing', 'waiting'] = 'all',
            assignment: Literal['all', 'mine', 'unassigned'] = 'all',
            page: int = Query(default=1, ge=1, le=100000)):
    query = select(Introduction)
    if q.strip():
        term = '%' + q.strip().replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_') + '%'
        query = query.where(or_(Introduction.name.ilike(term, escape='\\'), Introduction.email.ilike(term, escape='\\')))
    if status != 'all':
        query = query.where(Introduction.status == status)
    if assignment == 'mine':
        query = query.where(Introduction.reviewer_id == user.id)
    elif assignment == 'unassigned':
        query = query.where(Introduction.reviewer_id.is_(None))
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    rows = db.execute(query.add_columns(User.name).outerjoin(User, User.id == Introduction.reviewer_id).order_by(Introduction.id.desc()).offset((page-1)*25).limit(25))
    return {'items': [record(row, name) for row, name in rows], 'total': total, 'page_size': 25}


def find(db, application_id, lock=False):
    query = select(Introduction).where(Introduction.id == application_id)
    if lock:
        query = query.with_for_update().execution_options(populate_existing=True)
    row = db.scalar(query)
    if row is None:
        raise HTTPException(404, 'Introduction not found. Refresh the list.')
    return row


@router.get('/auth/applications/{application_id}/activity')
def activity(application_id: int, user: ApplicationReviewer, db: DB, before: int | None = Query(default=None, gt=0)):
    find(db, application_id)
    query = select(IntroductionEvent).where(IntroductionEvent.introduction_id == application_id)
    if before:
        query = query.where(IntroductionEvent.id < before)
    rows = list(db.scalars(query.order_by(IntroductionEvent.id.desc()).limit(26)))
    return {'items': [event_record(row) for row in rows[:25]], 'next_cursor': rows[24].id if len(rows) > 25 else None}


@router.get('/auth/applications/{application_id}')
def detail(application_id: int, user: ApplicationReviewer, db: DB):
    row = find(db, application_id)
    reviewer = db.get(User, row.reviewer_id) if row.reviewer_id else None
    latest = db.scalar(select(Invitation).where(Invitation.email == row.email).order_by(Invitation.id.desc()).limit(1))
    access = {'account_exists': db.scalar(select(User.id).where(User.email == row.email)) is not None,
              'invitation': invitation_record(latest) if latest else None}
    return record(row, reviewer.name if reviewer else None) | {'expertise': row.expertise, 'contribution': row.contribution, 'activity': activity(application_id, user, db, None), 'account_access': access}


@router.patch('/auth/applications/{application_id}')
def review(application_id: int, data: ReviewInput, user: ApplicationReviewer, db: DB):
    throttle('review:' + str(user.id), 40)
    row = find(db, application_id, lock=True)
    key = str(data.request_id)
    existing = db.scalar(select(IntroductionEvent).where(IntroductionEvent.request_id == key))
    if existing:
        if (existing.introduction_id != row.id or existing.actor_id != user.id
                or existing.note != data.note or existing.result_status != data.status
                or existing.result_reviewer_id != data.reviewer_id):
            raise HTTPException(409, 'This review request was already used. Reload before making another change.')
        return detail(application_id, user, db)
    if row.version != data.version:
        raise HTTPException(409, 'Another reviewer updated this introduction. Reload the latest review before saving.')
    reviewer = db.get(User, data.reviewer_id) if data.reviewer_id else None
    if data.reviewer_id and (not allowed(reviewer, 'applications.review')):
        raise HTTPException(422, 'Choose an active application reviewer.')
    changes = []
    if row.status != data.status:
        changes.append(f'Status: {LABELS[row.status]} → {LABELS[data.status]}')
    if row.reviewer_id != data.reviewer_id:
        previous = db.get(User, row.reviewer_id) if row.reviewer_id else None
        changes.append(f'Reviewer: {previous.name if previous else "Unassigned"} → {reviewer.name if reviewer else "Unassigned"}')
    if not changes and not data.note:
        return detail(application_id, user, db)
    row.status, row.reviewer_id = data.status, data.reviewer_id
    row.version += 1
    row.updated_at = now()
    db.add(IntroductionEvent(introduction_id=row.id, request_id=key, actor_id=user.id,
        actor_name=user.name, summary='; '.join(changes) or 'Internal note added', note=data.note,
        result_status=data.status, result_reviewer_id=data.reviewer_id, created_at=now()))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, 'This review request was already used. Reload the latest review.')
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, 'Could not confirm the saved review. Retry with the same details.')
    return detail(application_id, user, db)


@router.post('/auth/applications/{application_id}/invite')
def invite_application(application_id: int, data: InviteInput, user: ApplicationReviewer, db: DB):
    if not allowed(user, 'invitations.manage'):
        raise HTTPException(403, 'Invitation permission is required to invite this applicant.')
    application = find(db, application_id)
    lock_invitation_email(db, application.email)
    application = find(db, application_id, lock=True)
    previous = db.scalar(select(Invitation).where(Invitation.request_id == str(data.request_id)))
    if previous:
        if previous.source_application_id != application_id or previous.created_by != user.id or previous.source_version != data.version:
            raise HTTPException(409, 'This invitation request was already used. Reload before sending.')
        return detail(application_id, user, db)
    if application.version != data.version:
        raise HTTPException(409, 'The introduction changed since you opened it. Reload the review before inviting.')
    throttle('invite:' + str(user.id), 20)
    issue_invitation(application.email, user, db, application_id, data.request_id, data.version)
    try: db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, 'Could not confirm the invitation. Retry with the same request.') from None
    return detail(application_id, user, db)
