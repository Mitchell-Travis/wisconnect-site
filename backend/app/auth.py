"""Local-only invitation pilot. Not a production identity service."""

import gzip
import hashlib
import hmac
import re
import secrets
import smtplib
import threading
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from typing import Annotated
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_core import PydanticCustomError
from sqlalchemy import delete, select, update, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .database import engine
from .preview_config import ORIGIN
from .rate_limits import throttle
from .models import AccountEvent, Invitation, LoginSession, User, Introduction, IntroductionEvent
from .access import capabilities, allowed

router = APIRouter(prefix="/auth")
COOKIE = "wisconnect_local_session"
SESSION_SECONDS = 8 * 60 * 60
SESSION_IDLE_SECONDS = 30 * 60
MAX_SESSIONS = 10
PASSWORD_COMMON_MESSAGE = "This password is too common or easy to guess. Choose unrelated words or use a password manager."
with gzip.open(Path(__file__).with_name("password_data") / "common-passwords.txt.gz", "rt", encoding="utf-8") as password_file:
    COMMON_PASSWORDS = frozenset(line.strip() for line in password_file) | {
        "passwordpassword", "passwordpassword!", "123456789012345", "qwertyuiopasdfgh",
        "correct horse battery staple", "wisconnect123456", "wisconnect123456!",
        "wisconnectpassword", "wisconnectpassword!",
    }


def now():
    return datetime.now(timezone.utc)


def digest(token: str):
    return hashlib.sha256(token.encode()).hexdigest()


# OWASP scrypt baseline. Bound parallel hashing to avoid exhausting local RAM.
hash_slots = threading.BoundedSemaphore(2)


def password_hash(password: str, salt: str | None = None):
    salt = salt or secrets.token_hex(16)
    with hash_slots:
        result = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt),
                                n=2**17, r=8, p=1, maxmem=256 * 1024**2)
    return f"scrypt-v1${salt}${result.hex()}"


def password_matches(password: str, stored: str):
    return hmac.compare_digest(password_hash(password, stored.split("$")[1]), stored)


DUMMY_HASH = password_hash(secrets.token_urlsafe(32))

def database():
    with Session(engine) as db:
        yield db


DB = Annotated[Session, Depends(database)]


class Input(BaseModel):
    model_config = ConfigDict(extra="forbid", hide_input_in_errors=True)


class EmailInput(Input):
    email: str = Field(max_length=254)

    @field_validator("email")
    @classmethod
    def email_address(cls, value: str):
        value = value.strip().lower()
        # Intentionally accepts ordinary ASCII addresses for this local pilot.
        if not re.fullmatch(r"[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}", value):
            raise ValueError("Enter a valid email address.")
        return value


class Credentials(EmailInput):
    password: str = Field(min_length=1, max_length=128)


class TokenInput(Input):
    token: str = Field(pattern=r"^[A-Za-z0-9_-]{43}$")


class ProfileInput(Input):
    name: str = Field(min_length=1, max_length=100)

    @field_validator("name")
    @classmethod
    def nonempty_name(cls, value: str):
        if not value.strip():
            raise ValueError("Enter your name.")
        return value.strip()


class AccountInput(ProfileInput):
    password: str = Field(min_length=15, max_length=128)

    @field_validator("password")
    @classmethod
    def uncommon_password(cls, value: str):
        candidate = value.strip().lower()
        if candidate in COMMON_PASSWORDS or len(set(candidate)) <= 1:
            raise PydanticCustomError("password_common", PASSWORD_COMMON_MESSAGE)
        # Compare the whole candidate; never alter the password that is hashed.
        return value


class AcceptInvitation(TokenInput, AccountInput):
    pass


def current_user(request: Request, db: DB):
    token = request.cookies.get(COOKIE, "")
    timestamp = now()
    user_id = None
    if len(token) == 43:
        # Conditional UPDATE cannot revive a revoked or expired session. Commit
        # before business operations so session locks never reverse user-lock order.
        user_id = db.scalar(update(LoginSession).where(
            LoginSession.token_hash == digest(token), LoginSession.expires_at > timestamp,
            LoginSession.last_seen_at > timestamp - timedelta(seconds=SESSION_IDLE_SECONDS),
            LoginSession.user_id.in_(select(User.id).where(User.active.is_(True))),
        ).values(last_seen_at=timestamp).returning(LoginSession.user_id))
        db.commit()
    user = db.get(User, user_id) if user_id else None
    if not user or not user.active:
        raise HTTPException(401, "Please sign in again.")
    return user


def admin(user: Annotated[User, Depends(current_user)]):
    if user.role != "admin":
        raise HTTPException(403, "Administrator access required.")
    return user


Admin = Annotated[User, Depends(admin)]


def require_capability(capability):
    def authorize(user: Annotated[User, Depends(current_user)]):
        if not allowed(user, capability):
            raise HTTPException(403, "You do not have permission to access this area.")
        return user
    return authorize


BusinessEditor = Annotated[User, Depends(require_capability("businesses.edit"))]
BusinessPublisher = Annotated[User, Depends(require_capability("businesses.publish"))]
ApplicationReviewer = Annotated[User, Depends(require_capability("applications.review"))]
InvitationManager = Annotated[User, Depends(require_capability("invitations.manage"))]
InquiryManager = Annotated[User, Depends(require_capability("inquiries.manage"))]
ReportReader = Annotated[User, Depends(require_capability("reports.view"))]


def profile(user: User):
    return {"name": user.name, "email": user.email, "role": user.role, "capabilities": capabilities(user)}


def start_session(db: Session, user: User, request: Request, response: Response):
    timestamp = now()
    db.execute(delete(LoginSession).where(
        (LoginSession.expires_at <= timestamp) |
        (LoginSession.last_seen_at <= timestamp - timedelta(seconds=SESSION_IDLE_SECONDS)) |
        (LoginSession.token_hash == digest(request.cookies.get(COOKIE, "")))
    ))
    oldest = select(LoginSession.token_hash).where(LoginSession.user_id == user.id).order_by(
        LoginSession.created_at.desc(), LoginSession.public_id).offset(MAX_SESSIONS - 1)
    db.execute(delete(LoginSession).where(LoginSession.token_hash.in_(oldest)))
    token = secrets.token_urlsafe(32)
    db.add(LoginSession(token_hash=digest(token), user_id=user.id,
                        expires_at=timestamp + timedelta(seconds=SESSION_SECONDS),
                        created_at=timestamp, last_seen_at=timestamp,
                        client_name=session_client_name(request.headers.get("user-agent", ""))))
    db.add(AccountEvent(actor_id=user.id, subject_id=user.id, action="signed_in", created_at=timestamp))
    db.commit()
    # HTTP is restricted to loopback by main.py. Production must use HTTPS/Secure.
    response.set_cookie(COOKIE, token, httponly=True, samesite="strict",
                        secure=False, max_age=SESSION_SECONDS, path="/auth")


def session_client_name(user_agent: str):
    # A coarse, unverified label only: never store raw headers, IPs or locations.
    browser = next((label for marker, label in [("Edg/", "Edge"), ("Firefox/", "Firefox"),
                   ("FxiOS/", "Firefox"), ("Chrome/", "Chrome"), ("CriOS/", "Chrome"),
                   ("Safari/", "Safari")] if marker in user_agent), "Browser")
    system = next((label for marker, label in [("iPhone", "iOS"), ("iPad", "iPadOS"),
                  ("Android", "Android"), ("Windows", "Windows"), ("Macintosh", "macOS"),
                  ("Linux", "Linux")] if marker in user_agent), "unknown device")
    return f"{browser} on {system}"


@router.post("/login")
def login(data: Credentials, request: Request, response: Response, db: DB):
    throttle("login:" + digest(data.email), 10)
    user = db.scalar(select(User).where(User.email == data.email).with_for_update())
    valid = password_matches(data.password, user.password_hash if user else DUMMY_HASH)
    if not valid or not user or not user.active:
        raise HTTPException(401, "Email or password is incorrect.")
    start_session(db, user, request, response)
    return profile(user)


@router.get("/me")
def me(user: Annotated[User, Depends(current_user)]):
    return profile(user)


@router.patch("/me")
def update_profile(data: ProfileInput, user: Annotated[User, Depends(current_user)], db: DB):
    throttle("profile:" + str(user.id), 20)
    user = db.scalar(select(User).where(User.id == user.id).with_for_update().execution_options(populate_existing=True))
    if not user.active:
        raise HTTPException(401, "Please sign in again.")
    user.name = data.name
    user.version += 1
    db.add(AccountEvent(actor_id=user.id, subject_id=user.id, action="profile_updated", created_at=now()))
    db.commit()
    return profile(user)


@router.post("/logout", status_code=204)
def logout(request: Request, response: Response, db: DB):
    user_id = db.scalar(delete(LoginSession).where(
        LoginSession.token_hash == digest(request.cookies.get(COOKIE, ""))).returning(LoginSession.user_id))
    if user_id:
        db.add(AccountEvent(actor_id=user_id, subject_id=user_id, action="signed_out", created_at=now()))
    db.commit()
    response.delete_cookie(COOKIE, path="/auth", httponly=True, samesite="strict")


def invitation_record(row):
    return {"id": row.id, "email": row.email, "created_at": row.created_at, "expires_at": row.expires_at,
            "source_application_id": row.source_application_id,
            "status": "used" if row.used_at else "revoked" if row.revoked_at else "expired" if row.expires_at <= now() else "pending"}


@router.get("/invitations")
def invitations(user: InvitationManager, db: DB):
    rows = db.scalars(select(Invitation).order_by(Invitation.id.desc()).limit(50))
    return [invitation_record(row) for row in rows]


@router.get("/members")
def members(user: Admin, db: DB):
    # ponytail: local-only directory; add pagination before production-scale use.
    rows = db.scalars(select(User).order_by(User.name, User.id))
    return [{"id": row.id, **profile(row), "active": row.active} for row in rows]


@router.delete("/members/{member_id}", status_code=204)
def delete_member(member_id: int, user: Admin, db: DB):
    member = db.scalar(select(User).where(User.id == member_id).with_for_update())
    if not member:
        raise HTTPException(404, "Member account not found. Refresh the directory.")
    if member.role != "member" or member.capabilities or member.id == user.id:
        raise HTTPException(403, "Staff and administrator accounts cannot be deleted here. Manage their access in Team & permissions.")
    # Preserve invitation history; remove every session with the account atomically.
    db.execute(delete(LoginSession).where(LoginSession.user_id == member.id))
    db.delete(member)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "This account has linked records and cannot be deleted.")


def lock_invitation_email(db, email):
    # All invitation issuance/acceptance uses the same transaction-scoped email lock.
    # Hash collisions only serialize unrelated recipients; they cannot grant access.
    db.execute(text("SELECT pg_advisory_xact_lock(781220, hashtext(:email))"), {"email": email})


def application_invitation_event(db, invitation, actor, summary):
    if invitation.source_application_id is None: return
    application = db.scalar(select(Introduction).where(Introduction.id == invitation.source_application_id).with_for_update())
    application.version += 1; application.updated_at = now()
    db.add(IntroductionEvent(introduction_id=application.id, actor_id=actor.id, actor_name=actor.name,
        summary=f'Account invitation #{invitation.id}: {summary}', note='', created_at=now()))


def issue_invitation(email, user, db, application_id=None, request_id=None, source_version=None):
    lock_invitation_email(db, email)
    if db.scalar(select(User.id).where(User.email == email)):
        raise HTTPException(409, "This email already has an account.")
    pending = db.scalar(select(Invitation.id).where(Invitation.email == email, Invitation.used_at.is_(None), Invitation.revoked_at.is_(None), Invitation.expires_at > now()))
    if pending:
        raise HTTPException(409, "A pending invitation exists. Revoke it before sending another.")
    token = secrets.token_urlsafe(32)
    invitation = Invitation(email=email, token_hash=digest(token), created_by=user.id,
        created_at=now(), expires_at=now()+timedelta(hours=24), source_application_id=application_id,
        request_id=str(request_id) if request_id else None, source_version=source_version)
    db.add(invitation)
    try: db.flush()
    except IntegrityError:
        db.rollback(); raise HTTPException(409, "That invitation request already exists. Reload before sending.") from None
    message = EmailMessage()
    message["From"] = "WisConnect local test <invitations@wisconnect.test>"
    message["To"] = email
    message["Subject"] = "Your local WisConnect account invitation"
    message.set_content(
        "LOCAL TEST — no external email was sent.\n\n"
        "You have been invited to create your WisConnect workspace account.\n"
        f"{ORIGIN}/signup/#token={token}\n\n"
        "This private link expires in 24 hours and can be used once. Do not forward it.\n"
        "Account access does not confirm cooperative membership.\n"
        "If you were not expecting this invitation, ignore it.\n")
    try:
        # Fixed local Mailpit destination: this pilot cannot send external emails.
        with smtplib.SMTP("127.0.0.1", 1025, timeout=5) as smtp:
            if smtp.send_message(message): raise smtplib.SMTPException("Recipient refused")
    except (OSError, smtplib.SMTPException):
        db.rollback()
        raise HTTPException(503, "Local inbox unavailable. Start Mailpit, then try again.")
    application_invitation_event(db, invitation, user, 'sent to the local test inbox; not a membership decision')
    return invitation


@router.post("/invitations", status_code=201)
def invite(data: EmailInput, user: InvitationManager, db: DB):
    throttle("invite:" + str(user.id), 20)
    issue_invitation(data.email, user, db)
    db.commit()
    return {"message": "Invitation delivered to the local test inbox. No real email sent."}


@router.delete("/invitations/{invitation_id}", status_code=204)
def revoke(invitation_id: int, user: InvitationManager, db: DB):
    candidate = db.get(Invitation, invitation_id)
    if not candidate:
        raise HTTPException(404, "Invitation not found.")
    lock_invitation_email(db, candidate.email)
    invitation = db.scalar(select(Invitation).where(Invitation.id == invitation_id).with_for_update().execution_options(populate_existing=True))
    if invitation.used_at: raise HTTPException(409, "An accepted invitation cannot be revoked. Manage the account separately.")
    if not invitation.revoked_at:
        invitation.revoked_at = now()
        application_invitation_event(db, invitation, user, 'revoked')
    db.commit()


def valid_invitation(token: str, db: Session):
    candidate = db.scalar(select(Invitation).where(Invitation.token_hash == digest(token)))
    if candidate: lock_invitation_email(db, candidate.email)
    invitation = db.scalar(select(Invitation).where(
        Invitation.token_hash == digest(token)).with_for_update().execution_options(populate_existing=True))
    if (not invitation or invitation.used_at or invitation.revoked_at
            or invitation.expires_at <= now()):
        raise HTTPException(400, "This invitation is invalid, expired, or already used. Ask your administrator for a new one.")
    return invitation


@router.post("/invitation")
def inspect_invitation(data: TokenInput, db: DB):
    invitation = valid_invitation(data.token, db)
    return {"email": invitation.email, "expires_at": invitation.expires_at}


@router.post("/accept", status_code=201)
def accept(data: AcceptInvitation, db: DB):
    invitation = valid_invitation(data.token, db)
    user = User(email=invitation.email, name=data.name,
                password_hash=password_hash(data.password), role="member")
    db.add(user)
    invitation.used_at = now()
    try:
        db.flush()
        application_invitation_event(db, invitation, user, 'accepted; workspace account created')
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "This invitation cannot be used. Ask your administrator for help.")
    # Deliberately require a fresh sign-in after account activation.
    return {"message": "Account created. You can now sign in."}
