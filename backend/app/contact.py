"""Contact intake and administrator inbox within the existing local API boundary."""

import os
import smtplib
import ssl
from email.message import EmailMessage
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import Field, field_validator
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .auth import Admin, DB, EmailInput, now, throttle
from .models import ContactInquiry

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


def serialize(row):
    return {"id": row.id, "name": row.name, "email": row.email, "topic": row.topic,
            "message": row.message, "created_at": row.created_at, "email_status": row.email_status,
            "email_mode": row.email_mode, "email_sent_at": row.email_sent_at}


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
def list_inquiries(user: Admin, db: DB, before: int | None = Query(default=None, gt=0)):
    query = select(ContactInquiry).order_by(ContactInquiry.id.desc()).limit(26)
    if before is not None:
        query = query.where(ContactInquiry.id < before)
    rows = list(db.scalars(query))
    return {"items": [serialize(row) for row in rows[:25]], "next_cursor": rows[24].id if len(rows) > 25 else None}


@router.post("/auth/contact-inquiries/{inquiry_id}/retry-email")
def retry_email(inquiry_id: int, user: Admin, db: DB):
    throttle("contact-mail:" + str(user.id), 20)
    if db.get(ContactInquiry, inquiry_id) is None:
        raise HTTPException(404, "Inquiry not found.")
    return serialize(notify(db, inquiry_id))
