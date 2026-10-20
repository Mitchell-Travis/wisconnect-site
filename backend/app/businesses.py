"""Permission-checked business editing; public readers see only explicitly published snapshots."""
import hashlib
import json
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from pydantic import Field, field_validator
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError

from .auth import BusinessEditor, BusinessPublisher, DB, EmailInput, Input, now, throttle
from .access import allowed
from .models import Business, BusinessEvent, User

router = APIRouter()
SEED = json.loads((Path(__file__).parents[1] / "migrations/data/businesses_0008.json").read_text())
IMAGES = {item["visual"]["image"] for item in SEED} | {
    "https://myilava.com/cdn/shop/files/GAB_3273_2.jpg?v=1789587557&width=1500",
}
PROFILES = {item["profile"] for item in SEED if item["profile"]} | {"Rahel Mwitula-Williams"}
Status = Literal["draft", "published", "archived"]


class Visual(Input):
    name: str = Field(min_length=1, max_length=100)
    sub: str = Field(default="", max_length=100)
    tone: Literal["purple", "gold", "cobalt", "plum", "lilac", "orange", "mauve"] = "purple"
    poster: Literal["print", "arch", "editorial", "photo", "split", "citrus", "landscape", "mineral"] = "editorial"
    group: Literal["Food & hospitality", "Design", "Child care", "Professional", "Industry"] = "Professional"
    image: str = ""
    alt: str = Field(default="", max_length=300)

    @field_validator("name", "sub", "alt")
    @classmethod
    def safe_text(cls, value, info):
        value = value.strip()
        if any(ord(c) < 32 for c in value) or (info.field_name == "name" and not value):
            raise ValueError("Use readable text without control characters.")
        return value

    @field_validator("image")
    @classmethod
    def known_image(cls, value):
        if value and value not in IMAGES:
            raise ValueError("Choose an approved image.")
        return value


class PublicFields(Input):
    name: str = Field(min_length=1, max_length=120)
    person: str | None = Field(default=None, max_length=180)
    country: str = Field(min_length=1, max_length=80)
    location: str = Field(min_length=1, max_length=160)
    sector: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=2000)
    profile: str | None = None
    public_email: str = Field(default="", max_length=254)
    public_phone: str = Field(default="", max_length=40)
    website: str = Field(default="", max_length=500)
    visual: Visual

    @field_validator("name", "country", "location", "sector", "description")
    @classmethod
    def required_text(cls, value):
        if not value.strip() or any(ord(c) < 32 and c not in "\n\t" for c in value):
            raise ValueError("Text is required without control characters.")
        return value.strip()

    @field_validator("public_email")
    @classmethod
    def valid_email(cls, value):
        return EmailInput(email=value).email if value.strip() else ""

    @field_validator("public_phone", "person")
    @classmethod
    def safe_optional(cls, value):
        if value and any(ord(c) < 32 for c in value):
            raise ValueError("Remove control characters.")
        return value.strip() if value else value

    @field_validator("profile")
    @classmethod
    def known_profile(cls, value):
        if value is not None and value not in PROFILES:
            raise ValueError("Choose an existing public profile.")
        return value

    @field_validator("website")
    @classmethod
    def safe_website(cls, value):
        if not value: return ""
        parsed = urlsplit(value)
        if (parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password
                or any(c.isspace() or ord(c) < 32 for c in value) or "\\" in value):
            raise ValueError("Use a complete HTTPS website address without credentials.")
        return value


class DraftInput(Input):
    public: PublicFields
    owner_id: int | None = Field(default=None, gt=0, strict=True)
    internal_email: str = Field(default="", max_length=254)
    internal_phone: str = Field(default="", max_length=40)
    internal_notes: str = Field(default="", max_length=2000)

    @field_validator("internal_email")
    @classmethod
    def contact_email(cls, value):
        return EmailInput(email=value).email if value.strip() else ""

    @field_validator("internal_phone", "internal_notes")
    @classmethod
    def safe_text(cls, value):
        if "\x00" in value: raise ValueError("Remove control characters.")
        return value.strip()


class CreateInput(DraftInput):
    slug: str = Field(min_length=1, max_length=80, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    request_id: UUID


class EditInput(DraftInput):
    version: int = Field(ge=0, strict=True)
    request_id: UUID


class ActionInput(Input):
    action: Literal["publish", "archive", "restore"]
    version: int = Field(ge=0, strict=True)
    request_id: UUID


def public_record(row):
    # Re-validate/allowlist at the response boundary; private columns never enter it.
    return {"id": row.slug, **PublicFields.model_validate(row.published).model_dump()}


def record(row, db):
    owner = db.get(User, row.owner_id) if row.owner_id else None
    return {"id": row.id, "slug": row.slug, "public": row.draft, "published": row.published,
            "owner_id": row.owner_id, "owner_name": owner.name if owner else None,
            "internal_email": row.internal_email, "internal_phone": row.internal_phone, "internal_notes": row.internal_notes,
            "status": row.status, "version": row.version, "has_unpublished_changes": row.draft != row.published,
            "updated_at": row.updated_at, "published_at": row.published_at}


def check_owner(data, db):
    if data.owner_id is not None:
        owner = db.get(User, data.owner_id)
        if not owner or not owner.active:
            raise HTTPException(422, "Choose an active account for the private owner link.")


def fingerprint(action, data):
    return hashlib.sha256(json.dumps({"action": action, **data.model_dump(mode="json")}, sort_keys=True).encode()).hexdigest()


def existing_request(db, user, request_id, signature, business_id=None):
    event = db.scalar(select(BusinessEvent).where(BusinessEvent.request_id == str(request_id)))
    if not event: return None
    if event.actor_id != user.id or event.fingerprint != signature or (business_id and event.business_id != business_id):
        raise HTTPException(409, "This request was already used for a different change. Reload before trying again.")
    return record(db.get(Business, event.business_id), db)


def add_event(db, row, user, action, data, signature):
    db.add(BusinessEvent(business_id=row.id, actor_id=user.id, actor_name=user.name, action=action,
                         request_id=str(data.request_id), fingerprint=signature, created_at=now()))


def locked_business(db, business_id):
    row = db.scalar(select(Business).where(Business.id == business_id).with_for_update())
    if not row: raise HTTPException(404, "Business not found.")
    return row


@router.get("/businesses")
def published_businesses(db: DB, after: int = Query(default=0, ge=0)):
    rows = list(db.scalars(select(Business).where(Business.status == "published", Business.id > after)
                           .order_by(Business.id).limit(101)))
    return {"items": [public_record(row) for row in rows[:100]], "next_cursor": rows[99].id if len(rows) > 100 else None}


@router.get("/auth/businesses/options")
def options(user: BusinessEditor):
    return {"images": [{"file": item["visual"]["image"], "alt": item["visual"]["alt"]} for item in SEED],
            "profiles": sorted(PROFILES)}


@router.get("/auth/businesses/owners")
def owners(user: BusinessEditor, db: DB, q: str = Query(default="", max_length=100)):
    term = "%" + q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"
    rows = db.scalars(select(User).where(User.active.is_(True), or_(User.name.ilike(term, escape="\\"), User.email.ilike(term, escape="\\"))).order_by(User.name, User.id).limit(25))
    return [{"id": row.id, "name": row.name, "email": row.email} for row in rows]


@router.get("/auth/businesses")
def list_businesses(user: BusinessEditor, db: DB, q: str = Query(default="", max_length=100),
                    status: Literal["all", "draft", "published", "archived"] = "all", page: int = Query(default=1, ge=1, le=100000)):
    query = select(Business)
    if status != "all": query = query.where(Business.status == status)
    if q.strip():
        term = "%" + q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"
        query = query.where(or_(Business.draft["name"].astext.ilike(term, escape="\\"), Business.slug.ilike(term, escape="\\")))
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    rows = db.scalars(query.order_by(Business.draft["name"].astext, Business.id).offset((page-1)*25).limit(25))
    return {"items": [record(row, db) for row in rows], "total": total, "page": page, "page_size": 25}


@router.post("/auth/businesses", status_code=201)
def create_business(data: CreateInput, user: BusinessEditor, db: DB):
    signature = fingerprint("create", data)
    previous = existing_request(db, user, data.request_id, signature)
    if previous: return previous
    throttle("business-edit:" + str(user.id), 80)
    check_owner(data, db)
    row = Business(slug=data.slug, draft=data.public.model_dump(), owner_id=data.owner_id,
                   internal_email=data.internal_email, internal_phone=data.internal_phone, internal_notes=data.internal_notes,
                   created_at=now(), updated_at=now())
    try:
        db.add(row); db.flush(); add_event(db, row, user, "created", data, signature); db.commit()
    except IntegrityError:
        db.rollback()
        previous = existing_request(db, user, data.request_id, signature)
        if previous: return previous
        raise HTTPException(409, "That directory address is already used. Choose another address.") from None
    return record(row, db)


@router.get("/auth/businesses/{business_id}")
def business_detail(business_id: int, user: BusinessEditor, db: DB):
    row = db.get(Business, business_id)
    if not row: raise HTTPException(404, "Business not found.")
    return record(row, db)


@router.get("/auth/businesses/{business_id}/activity")
def activity(business_id: int, user: BusinessEditor, db: DB, before: int | None = Query(default=None, gt=0)):
    if not db.get(Business, business_id): raise HTTPException(404, "Business not found.")
    query = select(BusinessEvent).where(BusinessEvent.business_id == business_id)
    if before: query = query.where(BusinessEvent.id < before)
    rows = list(db.scalars(query.order_by(BusinessEvent.id.desc()).limit(26)))
    return {"items": [{"id": row.id, "actor_name": row.actor_name, "action": row.action, "created_at": row.created_at} for row in rows[:25]],
            "next_cursor": rows[24].id if len(rows) > 25 else None}


def apply_change(business_id, data, user, db, action):
    signature = fingerprint(action, data)
    row = locked_business(db, business_id)
    previous = existing_request(db, user, data.request_id, signature, business_id)
    if previous: return previous
    if row.version != data.version:
        raise HTTPException(409, "This business changed since you opened it. Reload the latest version before saving.")
    throttle("business-edit:" + str(user.id), 80)
    if action == "saved":
        check_owner(data, db)
        row.draft = data.public.model_dump()
        row.owner_id = data.owner_id
        row.internal_email, row.internal_phone, row.internal_notes = data.internal_email, data.internal_phone, data.internal_notes
    elif action == "publish":
        if row.status == "archived": raise HTTPException(409, "Restore the business to a draft before publishing.")
        if row.draft["visual"]["image"] and not row.draft["visual"]["alt"].strip():
            raise HTTPException(422, "Add an image description before publishing.")
        row.published = PublicFields.model_validate(row.draft).model_dump()
        row.status = "published"; row.published_at = now()
    elif action == "archive":
        row.status = "archived"
    elif action == "restore":
        if row.status != "archived": raise HTTPException(409, "Only an archived business can be restored.")
        row.status = "draft"  # Restore never silently republishes old information.
    row.version += 1; row.updated_at = now()
    add_event(db, row, user, action, data, signature)
    try: db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "That request was already used. Reload the business.") from None
    return record(row, db)


@router.patch("/auth/businesses/{business_id}")
def edit_business(business_id: int, data: EditInput, user: BusinessEditor, db: DB):
    return apply_change(business_id, data, user, db, "saved")


@router.post("/auth/businesses/{business_id}/publication")
def publication(business_id: int, data: ActionInput, user: BusinessPublisher, db: DB):
    if not allowed(user, "businesses.edit"):
        raise HTTPException(403, "Business editing permission is also required.")
    return apply_change(business_id, data, user, db, data.action)
