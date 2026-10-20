"""Local account management. Account access does not establish membership standing."""
import logging
import secrets
import smtplib
from datetime import timedelta
from email.message import EmailMessage
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import Field, StrictBool, field_validator
from sqlalchemy import delete, func, or_, select

from .auth import (AccountInput, Admin, DB, EmailInput, Input, ORIGIN, ProfileInput,
                   TokenInput, current_user, digest, now, password_hash, profile, throttle)
from .models import AccountEvent, ContactInquiry, Invitation, LoginSession, PasswordReset, User

router = APIRouter(prefix="/auth")
CurrentUser = Annotated[User, Depends(current_user)]


def record(user):
    return {"id": user.id, **profile(user), "active": user.active,
            "phone": user.phone, "location": user.location, "bio": user.bio, "version": user.version}


def event(db, actor, subject, action):
    db.add(AccountEvent(actor_id=actor, subject_id=subject, action=action, created_at=now()))


class MemberProfileInput(ProfileInput):
    phone: str = Field(default="", max_length=40)
    location: str = Field(default="", max_length=160)
    bio: str = Field(default="", max_length=2000)
    version: int = Field(ge=0, strict=True)

    @field_validator("phone", "location", "bio")
    @classmethod
    def trim(cls, value):
        return value.strip()


class AccessInput(Input):
    active: StrictBool
    version: int = Field(ge=0, strict=True)


def locked_member(db, member_id):
    row = db.scalar(select(User).where(User.id == member_id).with_for_update().execution_options(populate_existing=True))
    if not row:
        raise HTTPException(404, "Account not found. Refresh the directory.")
    return row


def check_version(row, version):
    if row.version != version:
        raise HTTPException(409, "This profile changed since you opened it. Reload the profile before saving again.")


def save_profile(db, row, data, actor):
    check_version(row, data.version)
    for key in ["name", "phone", "location", "bio"]:
        setattr(row, key, getattr(data, key))
    row.version += 1
    event(db, actor, row.id, "profile_updated")
    db.commit()
    return record(row)


@router.get("/profile")
def own_profile(user: CurrentUser):
    return record(user)


@router.patch("/profile")
def update_own_profile(data: MemberProfileInput, user: CurrentUser, db: DB):
    throttle("profile:" + str(user.id), 20)
    row = locked_member(db, user.id)
    if not row.active:
        raise HTTPException(401, "Please sign in again.")
    return save_profile(db, row, data, user.id)


@router.get("/overview")
def overview(user: Admin, db: DB):
    # Count the complete data set in one snapshot, not the paginated previews.
    counts = db.execute(select(
        select(func.count()).select_from(User).scalar_subquery().label("total_accounts"),
        select(func.count()).select_from(User).where(User.active.is_(True)).scalar_subquery().label("active_accounts"),
        select(func.count()).select_from(Invitation).where(
            Invitation.used_at.is_(None), Invitation.revoked_at.is_(None), Invitation.expires_at > now()
        ).scalar_subquery().label("pending_invitations"),
        select(func.count()).select_from(ContactInquiry).scalar_subquery().label("contact_inquiries"),
        select(func.count()).select_from(ContactInquiry).where(ContactInquiry.status != "closed").scalar_subquery().label("active_inquiries"),
        select(func.count()).select_from(ContactInquiry).where(ContactInquiry.status != "closed", ContactInquiry.follow_up_on <= now().date()).scalar_subquery().label("due_inquiries"),
    )).mappings().one()
    return dict(counts)


@router.get("/member-directory")
def directory(user: Admin, db: DB, q: str = Query(default="", max_length=100),
              status: Literal["all", "active", "inactive"] = "all",
              page: int = Query(default=1, ge=1, le=100000), page_size: int = Query(default=25, ge=1, le=50)):
    query = select(User)
    if q.strip():
        term = "%" + q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"
        query = query.where(or_(User.name.ilike(term, escape="\\"), User.email.ilike(term, escape="\\")))
    if status != "all":
        query = query.where(User.active == (status == "active"))
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    rows = db.scalars(query.order_by(func.lower(User.name), User.id).offset((page - 1) * page_size).limit(page_size))
    return {"items": [record(row) for row in rows], "total": total, "page": page, "page_size": page_size}


@router.get("/members/{member_id}/profile")
def member_profile(member_id: int, user: Admin, db: DB):
    row = db.get(User, member_id)
    if not row:
        raise HTTPException(404, "Account not found.")
    events = db.scalars(select(AccountEvent).where(AccountEvent.subject_id == member_id).order_by(AccountEvent.id.desc()).limit(20))
    return {**record(row), "events": [{"id": item.id, "action": item.action, "actor_id": item.actor_id, "created_at": item.created_at} for item in events]}


@router.patch("/members/{member_id}/profile")
def update_member_profile(member_id: int, data: MemberProfileInput, user: Admin, db: DB):
    throttle("member-edit:" + str(user.id), 40)
    row = locked_member(db, member_id)
    if row.role == "admin":
        raise HTTPException(403, "Administrator profiles must be edited in their own account settings.")
    save_profile(db, row, data, user.id)
    return member_profile(member_id, user, db)


@router.patch("/members/{member_id}/access")
def update_access(member_id: int, data: AccessInput, user: Admin, db: DB):
    throttle("member-access:" + str(user.id), 40)
    row = locked_member(db, member_id)
    if row.role == "admin" or row.capabilities:
        raise HTTPException(403, "Staff and administrator access must be changed in Team & permissions.")
    check_version(row, data.version)
    if row.active != data.active:
        row.active = data.active
        row.version += 1
        # Reactivation never revives an old session or password-reset link.
        db.execute(delete(LoginSession).where(LoginSession.user_id == row.id))
        db.execute(delete(PasswordReset).where(PasswordReset.user_id == row.id))
        event(db, user.id, row.id, "account_reactivated" if row.active else "account_deactivated")
    db.commit()
    return member_profile(member_id, user, db)


class ResetInput(TokenInput):
    password: str = Field(min_length=15, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        return AccountInput.uncommon_password(value)


@router.post("/password-reset/request", status_code=202)
def request_reset(data: EmailInput, request: Request, db: DB):
    throttle("reset-ip:" + request.client.host, 12)
    throttle("reset-email:" + digest(data.email), 3)
    row = db.scalar(select(User).where(User.email == data.email).with_for_update())
    if row and row.active:
        token = secrets.token_urlsafe(32)
        db.execute(delete(PasswordReset).where(PasswordReset.user_id == row.id))
        db.add(PasswordReset(token_hash=digest(token), user_id=row.id, expires_at=now() + timedelta(minutes=30)))
        message = EmailMessage()
        message["From"] = "WisConnect local test <accounts@wisconnect.test>"
        message["To"] = row.email
        message["Subject"] = "Reset your local WisConnect password"
        message.set_content("LOCAL TEST — captured in the local inbox only.\n\n"
                            f"Choose a new password: {ORIGIN}/reset-password/#token={token}\n\n"
                            "This link expires in 30 minutes and works once. If you did not request it, ignore this message.\n")
        try:
            with smtplib.SMTP("127.0.0.1", 1025, timeout=5) as smtp:
                if smtp.send_message(message):
                    raise smtplib.SMTPException("Recipient refused")
            event(db, None, row.id, "password_reset_requested")
            db.commit()
        except (OSError, smtplib.SMTPException):
            db.rollback()
            # Never disclose whether this email owns an account, including on mail failure.
            logging.getLogger(__name__).warning("Local password-reset delivery failed; check Mailpit.")
    return {"message": "If this email has an active account, a reset link will appear in the local test inbox. If no email arrives, check that the local mail service is running."}


@router.post("/password-reset/confirm")
def confirm_reset(data: ResetInput, db: DB):
    # Always lock user before reset row, matching request/access operations.
    reset = db.get(PasswordReset, digest(data.token))
    if not reset:
        raise HTTPException(400, "This reset link is invalid or expired. Request a new one.")
    user = locked_member(db, reset.user_id)
    reset = db.scalar(select(PasswordReset).where(PasswordReset.token_hash == digest(data.token)).with_for_update().execution_options(populate_existing=True))
    if not reset or reset.expires_at <= now() or not user.active:
        raise HTTPException(400, "This reset link is invalid or expired. Request a new one.")
    user.password_hash = password_hash(data.password)
    user.version += 1
    db.execute(delete(PasswordReset).where(PasswordReset.user_id == user.id))
    db.execute(delete(LoginSession).where(LoginSession.user_id == user.id))
    event(db, user.id, user.id, "password_reset_completed")
    db.commit()
    return {"message": "Password updated. Sign in with your new password."}
