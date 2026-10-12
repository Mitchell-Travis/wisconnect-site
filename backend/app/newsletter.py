"""Local newsletter intake. Tokens are hashed; only confirmed addresses are active.
The existing loopback/origin boundary applies. Email is captured by Mailpit only.
"""
import secrets
import smtplib
from datetime import timedelta
from email.message import EmailMessage
from typing import Literal

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import field_validator
from sqlalchemy import or_, select, update
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .auth import Admin, DB, EmailInput, TokenInput, digest, now, throttle
from .models import NewsletterSubscriber as Subscriber

router = APIRouter()
CONSENT_VERSION = "newsletter-updates-2026-10-12"
ACCEPTED = {"accepted": True, "confirmation_required": True}


class SubscribeInput(EmailInput):
    consent: Literal[True]

    @field_validator("email")
    @classmethod
    def valid_address(cls, value):
        local, domain = value.rsplit("@", 1)
        if len(local) > 64 or local.startswith('.') or local.endswith('.') or '..' in value:
            raise ValueError("Invalid email")
        if any(not label or len(label) > 63 or label.startswith('-') or label.endswith('-') for label in domain.split('.')):
            raise ValueError("Invalid email")
        return value


def send_confirmation(email, confirmation, unsubscribe):
    message = EmailMessage()
    message["From"] = "WisConnect local preview <newsletter@wisconnect.test>"
    message["To"] = email
    message["Subject"] = "[LOCAL TEST] Confirm your WisConnect updates"
    message.set_content(
        "LOCAL TEST — captured locally, not delivered to your mailbox.\n\n"
        "One more step to stay connected.\n\n"
        "Confirm that you would like WisConnect stories, news and opportunities by email:\n"
        f"http://localhost:3000/newsletter/#confirm={confirmation}\n\n"
        "This confirmation link expires in 24 hours. Open it and choose Confirm subscription.\n"
        "If you didn’t request this, ignore this email; you won’t be subscribed.\n\n"
        "To cancel this request or unsubscribe at any time:\n"
        f"http://localhost:3000/newsletter/#unsubscribe={unsubscribe}\n")
    with smtplib.SMTP("127.0.0.1", 1025, timeout=5) as smtp:
        if smtp.send_message(message):
            raise smtplib.SMTPException("Recipient refused")


@router.post("/newsletter/subscribe", status_code=202)
def subscribe(data: SubscribeInput, request: Request, db: DB):
    throttle("newsletter:" + request.client.host, 12)
    try:
        # Unique email constraint resolves concurrent first requests.
        if db.scalar(select(Subscriber.id).where(Subscriber.email == data.email)) is None:
            db.add(Subscriber(email=data.email, created_at=now(), status="pending", consent_version=CONSENT_VERSION))
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
        confirmation, unsubscribe = secrets.token_urlsafe(32), secrets.token_urlsafe(32)
        timestamp = now()
        # Atomic claim prevents concurrent resends and never resets an active subscription.
        claimed = db.execute(update(Subscriber).where(
            Subscriber.email == data.email, Subscriber.status != "subscribed",
            or_(Subscriber.last_sent_at.is_(None), Subscriber.last_sent_at < timestamp - timedelta(minutes=1)),
        ).values(status="pending", confirmation_hash=digest(confirmation),
                 confirmation_expires_at=timestamp + timedelta(hours=24), unsubscribe_hash=digest(unsubscribe),
                 last_sent_at=timestamp, consent_version=CONSENT_VERSION).returning(Subscriber.id)).scalar_one_or_none()
        db.commit()
        if claimed is not None:
            try:
                send_confirmation(data.email, confirmation, unsubscribe)
            except (OSError, smtplib.SMTPException):
                # Allow a retry without making a failed email into a subscription.
                db.execute(update(Subscriber).where(Subscriber.id == claimed, Subscriber.confirmation_hash == digest(confirmation)).values(
                    last_sent_at=None, confirmation_hash=None, confirmation_expires_at=None))
                db.commit()
                raise HTTPException(503, "We couldn’t send your confirmation email. Please try again shortly.")
        # Same response for existing and pending subscribers: do not reveal list membership.
        return ACCEPTED
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, "We couldn’t save your signup. Please try again shortly.")


@router.post("/newsletter/confirm")
def confirm(data: TokenInput, db: DB):
    try:
        # A conditional update makes confirmation single-use, even with simultaneous requests.
        result = db.execute(update(Subscriber).where(
            Subscriber.confirmation_hash == digest(data.token), Subscriber.status == "pending",
            Subscriber.confirmation_expires_at > now(),
        ).values(status="subscribed", confirmed_at=now(), unsubscribed_at=None,
                 confirmation_hash=None, confirmation_expires_at=None))
        db.commit()
        if not result.rowcount:
            raise HTTPException(400, "This link has expired or has already been used. Subscribe again on the homepage if you still need to confirm.")
        return {"subscribed": True}
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, "Confirmation is temporarily unavailable. Please try again.")


@router.post("/newsletter/unsubscribe")
def unsubscribe(data: TokenInput, db: DB):
    try:
        result = db.execute(update(Subscriber).where(Subscriber.unsubscribe_hash == digest(data.token)).values(
            status="unsubscribed", unsubscribed_at=now(), confirmation_hash=None, confirmation_expires_at=None, last_sent_at=None))
        db.commit()
        if not result.rowcount:
            raise HTTPException(400, "This link is no longer valid. Use the unsubscribe link from your latest WisConnect email.")
        return {"unsubscribed": True}
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, "Unsubscribing is temporarily unavailable. Please try again.")


@router.get("/auth/newsletter-subscribers")
def subscribers(user: Admin, db: DB, before: int | None = Query(default=None, gt=0),
                status: Literal['pending', 'subscribed', 'unsubscribed'] = 'subscribed'):
    query = select(Subscriber).where(Subscriber.status == status).order_by(Subscriber.id.desc()).limit(26)
    if before is not None:
        query = query.where(Subscriber.id < before)
    rows = list(db.scalars(query))
    return {"items": [{"id": row.id, "email": row.email, "status": row.status,
                       "created_at": row.created_at, "confirmed_at": row.confirmed_at,
                       "unsubscribed_at": row.unsubscribed_at, "consent_version": row.consent_version}
                      for row in rows[:25]], "next_cursor": rows[24].id if len(rows) > 25 else None}
