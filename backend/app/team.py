"""Administrator-managed staff grants with reauthentication and serialized lockout protection."""
import hashlib
import json
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from pydantic import Field, StrictBool, model_validator
from sqlalchemy import delete, func, or_, select, text
from sqlalchemy.exc import SQLAlchemyError

from .access import CAPABILITIES, capabilities
from .auth import Admin, DB, Input, now, password_matches, throttle
from .models import AccountEvent, LoginSession, PasswordReset, TeamEvent, User

router = APIRouter(prefix="/auth/team")


def access_state(user):
    return {"role": user.role, "active": user.active, "capabilities": sorted(user.capabilities or [])}


def record(user):
    return {"id": user.id, "name": user.name, "email": user.email, "version": user.version,
            **access_state(user), "effective_capabilities": capabilities(user)}


@router.get("")
def listing(user: Admin, db: DB, q: str = Query("", max_length=100),
            access: Literal["all", "admin", "staff", "member"] = "all",
            page: int = Query(1, ge=1, le=100000)):
    query = select(User)
    if q.strip():
        term = "%" + q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"
        query = query.where(or_(User.name.ilike(term, escape="\\"), User.email.ilike(term, escape="\\")))
    if access == "admin": query = query.where(User.role == "admin")
    elif access == "staff": query = query.where(User.role == "member", User.capabilities != [])
    elif access == "member": query = query.where(User.role == "member", User.capabilities == [])
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    return {"items": [record(row) for row in db.scalars(query.order_by(func.lower(User.name), User.id).offset((page-1)*25).limit(25))],
            "total": total, "page": page, "page_size": 25, "current_user_id": user.id,
            "capabilities": [{"key": key, "label": value[0], "description": value[1]} for key, value in CAPABILITIES.items()]}


@router.get("/{user_id}")
def detail(user_id: int, user: Admin, db: DB):
    row = db.get(User, user_id)
    if not row: raise HTTPException(404, "Account not found.")
    events = db.scalars(select(TeamEvent).where(TeamEvent.subject_id == row.id).order_by(TeamEvent.id.desc()).limit(25))
    return {**record(row), "current_user_id": user.id, "events": [{"id": event.id, "actor_name": event.actor_name,
        "before": event.before, "after": event.after, "created_at": event.created_at} for event in events]}


class ChangeInput(Input):
    role: Literal["admin", "member"]
    active: StrictBool
    capabilities: list[str] = Field(max_length=len(CAPABILITIES))
    version: int = Field(ge=0, strict=True)
    request_id: UUID
    password: str = Field(min_length=1, max_length=128, repr=False)

    @model_validator(mode="after")
    def valid_grants(self):
        grants = set(self.capabilities)
        if grants - CAPABILITIES.keys() or len(grants) != len(self.capabilities):
            raise ValueError("Choose distinct supported permissions.")
        if self.role == "admin" and grants:
            raise ValueError("Administrators already have all permissions.")
        if "businesses.publish" in grants and "businesses.edit" not in grants:
            raise ValueError("Publishing also requires business editing.")
        self.capabilities = sorted(grants)
        return self


@router.patch("/{user_id}")
def change(user_id: int, data: ChangeInput, user: Admin, db: DB):
    actor_id = user.id
    throttle("team-reauth:" + str(actor_id), 5)
    # All administrator/staff changes share one transaction lock. Refresh the
    # actor after acquiring it: a concurrently demoted actor cannot grant access.
    try:
        db.execute(text("SET LOCAL lock_timeout = '3s'"))
        db.execute(text("SELECT pg_advisory_xact_lock(872061001)"))
        people = {row.id: row for row in db.scalars(select(User).where(User.id.in_({actor_id, user_id})).order_by(User.id).with_for_update().execution_options(populate_existing=True))}
        actor = people.get(actor_id)
        if not actor or not actor.active or actor.role != "admin": raise HTTPException(403, "Administrator access changed. Sign in again.")
        if not password_matches(data.password, actor.password_hash): raise HTTPException(403, "Your password was not confirmed. Check it and try again.")
        target = people.get(user_id)
        if not target: raise HTTPException(404, "Account not found.")
        fingerprint = hashlib.sha256(json.dumps(data.model_dump(exclude={"password", "request_id"}), sort_keys=True).encode()).hexdigest()
        previous = db.scalar(select(TeamEvent).where(TeamEvent.request_id == str(data.request_id)))
        if previous:
            if previous.actor_id != actor_id or previous.subject_id != user_id or previous.fingerprint != fingerprint:
                raise HTTPException(409, "That request was already used for a different access change.")
            return detail(user_id, actor, db)
        if target.version != data.version: raise HTTPException(409, "This account changed. Reload its access settings before saving.")
        if target.active and target.role == "admin" and (not data.active or data.role != "admin"):
            remaining = db.scalar(select(func.count()).select_from(User).where(User.active.is_(True), User.role == "admin", User.id != target.id))
            if not remaining: raise HTTPException(409, "Keep at least one active administrator.")
        if target.id == actor_id: raise HTTPException(403, "Another administrator must change your access.")
        before = access_state(target)
        after = {"role": data.role, "active": data.active, "capabilities": data.capabilities}
        if before == after: return detail(user_id, actor, db)
        target.role, target.active, target.capabilities = data.role, data.active, data.capabilities
        target.version += 1
        db.execute(delete(LoginSession).where(LoginSession.user_id == target.id))
        db.execute(delete(PasswordReset).where(PasswordReset.user_id == target.id))
        db.add(TeamEvent(subject_id=target.id, actor_id=actor.id, actor_name=actor.name, before=before, after=after,
                         request_id=str(data.request_id), fingerprint=fingerprint, created_at=now()))
        db.add(AccountEvent(actor_id=actor.id, subject_id=target.id, action="team_access_changed", created_at=now()))
        db.commit()
        return detail(user_id, actor, db)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, "Could not save access. Try again with the same change.") from None
