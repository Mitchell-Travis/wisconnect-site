"""Local-only invitation pilot. Not a production identity service."""

import gzip
import hashlib
import hmac
import re
import secrets
import smtplib
import threading
import time
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from typing import Annotated
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_core import PydanticCustomError
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .database import engine
from .models import Invitation, LoginSession, User

router = APIRouter(prefix="/auth")
COOKIE = "wisconnect_local_session"
ORIGIN = "http://localhost:3000"
SESSION_SECONDS = 8 * 60 * 60
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

# ponytail: single-process local throttle; use a shared limiter before hosting.
attempts: dict[str, tuple[float, int]] = {}
attempt_lock = threading.Lock()


def throttle(key: str, limit: int):
    with attempt_lock:
        current = time.monotonic()
        for expired in [key for key, (start, _) in attempts.items() if current - start >= 900]:
            del attempts[expired]
        start, count = attempts.get(key, (current, 0))
        if count >= limit or (key not in attempts and len(attempts) >= 4096):
            raise HTTPException(429, "Too many attempts. Try again in 15 minutes.",
                                headers={"Retry-After": "900"})
        attempts[key] = (start, count + 1)


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
    session = db.get(LoginSession, digest(token)) if len(token) == 43 else None
    user = db.get(User, session.user_id) if session and session.expires_at > now() else None
    if not user or not user.active:
        raise HTTPException(401, "Please sign in again.")
    return user


def admin(user: Annotated[User, Depends(current_user)]):
    if user.role != "admin":
        raise HTTPException(403, "Administrator access required.")
    return user


Admin = Annotated[User, Depends(admin)]


def profile(user: User):
    return {"name": user.name, "email": user.email, "role": user.role}


def start_session(db: Session, user: User, request: Request, response: Response):
    db.execute(delete(LoginSession).where(
        (LoginSession.expires_at <= now()) |
        (LoginSession.token_hash == digest(request.cookies.get(COOKIE, "")))
    ))
    token = secrets.token_urlsafe(32)
    db.add(LoginSession(token_hash=digest(token), user_id=user.id,
                        expires_at=now() + timedelta(seconds=SESSION_SECONDS)))
    db.commit()
    # HTTP is restricted to loopback by main.py. Production must use HTTPS/Secure.
    response.set_cookie(COOKIE, token, httponly=True, samesite="strict",
                        secure=False, max_age=SESSION_SECONDS, path="/auth")


@router.post("/login")
def login(data: Credentials, request: Request, response: Response, db: DB):
    throttle("login:" + digest(data.email), 10)
    user = db.scalar(select(User).where(User.email == data.email))
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
    user.name = data.name
    db.commit()
    return profile(user)


@router.post("/logout", status_code=204)
def logout(request: Request, response: Response, db: DB):
    db.execute(delete(LoginSession).where(
        LoginSession.token_hash == digest(request.cookies.get(COOKIE, ""))))
    db.commit()
    response.delete_cookie(COOKIE, path="/auth", httponly=True, samesite="strict")


@router.get("/invitations")
def invitations(user: Admin, db: DB):
    rows = db.scalars(select(Invitation).order_by(Invitation.id.desc()).limit(50))
    return [{"id": row.id, "email": row.email, "expires_at": row.expires_at,
             "status": "used" if row.used_at else "revoked" if row.revoked_at
             else "expired" if row.expires_at <= now() else "pending"} for row in rows]


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
    if member.role != "member" or member.id == user.id:
        raise HTTPException(403, "Administrator accounts cannot be deleted here.")
    # Preserve invitation history; remove every session with the account atomically.
    db.execute(delete(LoginSession).where(LoginSession.user_id == member.id))
    db.delete(member)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "This account has linked records and cannot be deleted.")


@router.post("/invitations", status_code=201)
def invite(data: EmailInput, user: Admin, db: DB):
    throttle("invite:" + str(user.id), 20)
    if db.scalar(select(User.id).where(User.email == data.email)):
        raise HTTPException(409, "This email already has an account.")
    invitation = db.scalar(select(Invitation).where(Invitation.email == data.email).with_for_update())
    if invitation and not invitation.used_at and not invitation.revoked_at and invitation.expires_at > now():
        raise HTTPException(409, "A pending invitation exists. Revoke it before sending another.")
    token = secrets.token_urlsafe(32)
    if not invitation:
        invitation = Invitation(email=data.email)
        db.add(invitation)
    invitation.token_hash = digest(token)
    invitation.created_by = user.id
    invitation.expires_at = now() + timedelta(hours=24)
    invitation.used_at = invitation.revoked_at = None
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "An invitation already exists. Refresh the page.")
    message = EmailMessage()
    message["From"] = "WisConnect local test <invitations@wisconnect.test>"
    message["To"] = data.email
    message["Subject"] = "Your local WisConnect member invitation"
    message.set_content(
        "LOCAL TEST — no real membership email was sent.\n\n"
        "You have been invited to create your WisConnect member account.\n"
        f"{ORIGIN}/signup/#token={token}\n\n"
        "This private link expires in 24 hours and can be used once. Do not forward it.\n"
        "If you were not expecting this invitation, ignore it.\n")
    try:
        # Fixed local Mailpit destination: this pilot cannot send external emails.
        with smtplib.SMTP("127.0.0.1", 1025, timeout=5) as smtp:
            smtp.send_message(message)
    except (OSError, smtplib.SMTPException):
        db.rollback()
        raise HTTPException(503, "Local inbox unavailable. Start Mailpit, then try again.")
    db.commit()
    return {"message": "Invitation delivered to the local test inbox. No real email sent."}


@router.delete("/invitations/{invitation_id}", status_code=204)
def revoke(invitation_id: int, user: Admin, db: DB):
    invitation = db.scalar(select(Invitation).where(Invitation.id == invitation_id).with_for_update())
    if not invitation:
        raise HTTPException(404, "Invitation not found.")
    invitation.revoked_at = now()
    db.commit()


def valid_invitation(token: str, db: Session):
    invitation = db.scalar(select(Invitation).where(
        Invitation.token_hash == digest(token)).with_for_update())
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
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "This invitation cannot be used. Ask your administrator for help.")
    # Deliberately require a fresh sign-in after account activation.
    return {"message": "Account created. You can now sign in."}
