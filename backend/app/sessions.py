"""Account holders manage only their own sessions, using non-credential IDs."""
from datetime import timedelta
from uuid import UUID

from fastapi import APIRouter, HTTPException, Request
from sqlalchemy import delete, select

from .accounts import CurrentUser, event, locked_member
from .auth import COOKIE, DB, SESSION_IDLE_SECONDS, digest, now, throttle
from .models import LoginSession

router = APIRouter(prefix="/auth/sessions")


@router.get("")
def list_sessions(request: Request, user: CurrentUser, db: DB):
    timestamp = now()
    current = digest(request.cookies.get(COOKIE, ""))
    rows = db.scalars(select(LoginSession).where(
        LoginSession.user_id == user.id, LoginSession.expires_at > timestamp,
        LoginSession.last_seen_at > timestamp - timedelta(seconds=SESSION_IDLE_SECONDS),
    ).order_by(LoginSession.created_at.desc(), LoginSession.public_id))
    return {"items": [{"id": row.public_id, "client_name": row.client_name,
                       "created_at": row.created_at, "last_seen_at": row.last_seen_at,
                       "expires_at": row.expires_at, "current": row.token_hash == current} for row in rows],
            "idle_minutes": SESSION_IDLE_SECONDS // 60}


@router.post("/revoke-others")
def revoke_others(request: Request, user: CurrentUser, db: DB):
    throttle("session-revoke:" + str(user.id), 20)
    locked_member(db, user.id)  # Serialize with login and password/access changes.
    removed = db.execute(delete(LoginSession).where(
        LoginSession.user_id == user.id,
        LoginSession.token_hash != digest(request.cookies.get(COOKIE, "")),
    )).rowcount
    if removed:
        event(db, user.id, user.id, "other_sessions_revoked")
    db.commit()
    return {"revoked": removed}


@router.delete("/{session_id}", status_code=204)
def revoke_session(session_id: UUID, request: Request, user: CurrentUser, db: DB):
    throttle("session-revoke:" + str(user.id), 20)
    locked_member(db, user.id)
    row = db.scalar(select(LoginSession).where(
        LoginSession.public_id == str(session_id), LoginSession.user_id == user.id,
    ).with_for_update())
    if not row:
        raise HTTPException(404, "Session not found. Refresh your sessions.")
    if row.token_hash == digest(request.cookies.get(COOKIE, "")):
        raise HTTPException(409, "Use Sign out to end this session.")
    db.delete(row)
    event(db, user.id, user.id, "session_revoked")
    db.commit()
