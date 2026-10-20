"""Contact intake and administrator inbox within the existing local API boundary."""

import os
import smtplib
import ssl
from email.message import EmailMessage
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import Field, field_validator
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .auth import InquiryManager, DB, EmailInput, now, throttle
from .models import ContactInquiry, InquiryEvent, User

router = APIRouter()
RECIPIENT = "hello@wisconnect.co"


class ContactInput(EmailInput):
    submission_id: UUID
    name: str = Field(min_length=1, max_length=120)
    topic: Literal["General inquiry", "Membership", "Partnerships", "Member enterprises"] = "General inquiry"
    message: str = Field(min_length=1, max_length=3000)

    @field_validator("name", "message")
    @classmethod
    def clean_text(cls, value):
        value = value.strip()
        if not value or "\x00" in value:
            raise ValueError("Enter your name and message.")
        return value


def mail_mode():
    mode = os.getenv("WISCONNECT_CONTACT_MAIL_MODE", "local")
    return mode if mode in {"local", "smtp"} else "disabled"


def send_email(row: ContactInquiry):
    mode = mail_mode()
    message = EmailMessage()
    message["To"] = RECIPIENT
    message["Reply-To"] = row.email
    message["Subject"] = f"{'[LOCAL TEST] ' if mode == 'local' else ''}WisConnect inquiry #{row.id} — {row.topic}"
    message["Message-ID"] = f"<contact-{row.submission_id}@wisconnect.co>"
    message.set_content(
        ("LOCAL TEST — captured in Mailpit; not delivered to the real mailbox.\n\n" if mode == "local" else "")
        + f"New website inquiry #{row.id}\n\nName: {row.name}\nEmail: {row.email}\nTopic: {row.topic}\n\n{row.message}\n\n"
        + "This inquiry is saved in the WisConnect administrator dashboard.\n")
    if mode == "local":
        message["From"] = "WisConnect local test <contact@wisconnect.test>"
        with smtplib.SMTP("127.0.0.1", 1025, timeout=5) as smtp:
            if smtp.send_message(message):
                raise smtplib.SMTPException("Recipient refused")
    elif mode == "smtp":
        host = os.environ["WISCONNECT_CONTACT_SMTP_HOST"]
        user = os.environ["WISCONNECT_CONTACT_SMTP_USER"]
        password = os.environ["WISCONNECT_CONTACT_SMTP_PASSWORD"]
        message["From"] = os.environ["WISCONNECT_CONTACT_FROM"]
        security = os.getenv("WISCONNECT_CONTACT_SMTP_SECURITY", "starttls")
        if security not in {"starttls", "ssl"}:
            raise ValueError("TLS is required for contact email")
        port = int(os.getenv("WISCONNECT_CONTACT_SMTP_PORT", "465" if security == "ssl" else "587"))
        context = ssl.create_default_context()
        client = smtplib.SMTP_SSL(host, port, timeout=10, context=context) if security == "ssl" else smtplib.SMTP(host, port, timeout=10)
        with client as smtp:
            if security == "starttls":
                smtp.starttls(context=context)
            smtp.login(user, password)
            if smtp.send_message(message):
                raise smtplib.SMTPException("Recipient refused")
    else:
        raise ValueError("Unknown contact mail mode")


def notify(db, inquiry_id):
    # Save first, then serialize delivery attempts. A failed email never loses an inquiry.
    row = db.scalar(select(ContactInquiry).where(ContactInquiry.id == inquiry_id).with_for_update().execution_options(populate_existing=True))
    if row.email_status == "sent":
        return row
    row.email_mode = mail_mode()
    try:
        send_email(row)
        row.email_status = "sent"
        row.email_sent_at = now()
    except (OSError, smtplib.SMTPException, ValueError, KeyError):
        row.email_status = "failed"
    db.commit()
    return row


def serialize(row, assignee_name=None):
    return {"id": row.id, "name": row.name, "email": row.email, "topic": row.topic,
            "message": row.message, "created_at": row.created_at, "email_status": row.email_status,
            "email_mode": row.email_mode, "email_sent_at": row.email_sent_at,
            "status": row.status, "assignee_id": row.assignee_id, "assignee_name": assignee_name,
            "follow_up_on": row.follow_up_on, "version": row.version, "updated_at": row.updated_at}


@router.post("/contact", status_code=201)
def submit_contact(data: ContactInput, request: Request, db: DB):
    values = {"name": data.name, "email": data.email, "topic": data.topic, "message": data.message}
    key = str(data.submission_id)
    try:
        row = db.scalar(select(ContactInquiry).where(ContactInquiry.submission_id == key))
        if row is None:
            throttle("contact:" + request.client.host, 8)
            row = ContactInquiry(submission_id=key, **values, created_at=now(), email_status="pending", email_mode=mail_mode())
            db.add(row)
            try:
                db.flush()
                db.add(InquiryEvent(inquiry_id=row.id, actor_name="Website", summary="Inquiry received", note="", created_at=now()))
                db.commit()
            except IntegrityError:
                db.rollback()
                row = db.scalar(select(ContactInquiry).where(ContactInquiry.submission_id == key))
                if row is None:
                    raise
        if any(getattr(row, key) != value for key, value in values.items()):
            raise HTTPException(409, "This submission was already received with different details. Refresh before starting a new message.")
        inquiry_id = row.id
        try:
            notify(db, inquiry_id)
        except SQLAlchemyError:
            # Receipt is durable even if notification bookkeeping fails afterward.
            db.rollback()
        return {"received": True, "reference": inquiry_id, "test_mode": mail_mode() != "smtp"}
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, "We couldn’t save your message. Your answers are still here; please try again.")


@router.get("/auth/contact-inquiries")
def list_inquiries(user: InquiryManager, db: DB, before: int | None = Query(default=None, gt=0),
                   q: str = Query(default='', max_length=100),
                   status: Literal['all', 'active', 'open', 'in_progress', 'closed'] = 'all',
                   assignment: Literal['all', 'mine', 'unassigned'] = 'all',
                   due: Literal['all', 'due', 'overdue', 'unscheduled'] = 'all',
                   delivery: Literal['all', 'pending', 'failed', 'sent'] = 'all'):
    query = select(ContactInquiry)
    if q.strip():
        term = '%' + q.strip().replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_') + '%'
        query = query.where(or_(ContactInquiry.name.ilike(term, escape='\\'), ContactInquiry.email.ilike(term, escape='\\'), ContactInquiry.topic.ilike(term, escape='\\')))
    if status == 'active': query = query.where(ContactInquiry.status != 'closed')
    elif status != 'all': query = query.where(ContactInquiry.status == status)
    if assignment == 'mine': query = query.where(ContactInquiry.assignee_id == user.id)
    elif assignment == 'unassigned': query = query.where(ContactInquiry.assignee_id.is_(None))
    if due == 'unscheduled': query = query.where(ContactInquiry.follow_up_on.is_(None), ContactInquiry.status != 'closed')
    elif due != 'all':
        query = query.where(ContactInquiry.status != 'closed', ContactInquiry.follow_up_on < now().date() if due == 'overdue' else ContactInquiry.follow_up_on <= now().date())
    if delivery != 'all': query = query.where(ContactInquiry.email_status == delivery)
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    if before is not None: query = query.where(ContactInquiry.id < before)
    rows = list(db.execute(query.add_columns(User.name).outerjoin(User, User.id == ContactInquiry.assignee_id).order_by(ContactInquiry.id.desc()).limit(26)))
    return {"items": [serialize(row, name) for row, name in rows[:25]], "total": total,
            "next_cursor": rows[24][0].id if len(rows) > 25 else None, "today": now().date()}


@router.post("/auth/contact-inquiries/{inquiry_id}/retry-email")
def retry_email(inquiry_id: int, user: InquiryManager, db: DB):
    throttle("contact-mail:" + str(user.id), 20)
    if db.get(ContactInquiry, inquiry_id) is None:
        raise HTTPException(404, "Inquiry not found.")
    return serialize(notify(db, inquiry_id))
