from datetime import date, datetime

from sqlalchemy import Boolean, CheckConstraint, Date, DateTime, ForeignKey, String, Text, func, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB


class Base(DeclarativeBase):
    pass


class RateLimitBucket(Base):
    __tablename__ = "rate_limit_buckets"
    __table_args__ = (CheckConstraint("count > 0", name="rate_limit_positive_count"),)
    key_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    count: Mapped[int] = mapped_column()
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class Business(Base):
    __tablename__ = "businesses"
    __table_args__ = (CheckConstraint("status IN ('draft','published','archived')", name="business_status"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    draft: Mapped[dict] = mapped_column(JSONB)
    published: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    internal_email: Mapped[str] = mapped_column(String(254), default="")
    internal_phone: Mapped[str] = mapped_column(String(40), default="")
    internal_notes: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(12), default="draft")
    version: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class BusinessEvent(Base):
    __tablename__ = "business_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"), index=True)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    actor_name: Mapped[str] = mapped_column(String(120))
    action: Mapped[str] = mapped_column(String(20))
    request_id: Mapped[str | None] = mapped_column(String(36), unique=True)
    fingerprint: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class User(Base):
    __tablename__ = "users"
    __table_args__ = (CheckConstraint("role IN ('admin', 'member')", name="user_role"),
                      CheckConstraint("jsonb_typeof(capabilities) = 'array'", name="user_capabilities_array"))

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(254), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    password_hash: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(10), default="member")
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    phone: Mapped[str] = mapped_column(String(40), default="", server_default="")
    location: Mapped[str] = mapped_column(String(160), default="", server_default="")
    bio: Mapped[str] = mapped_column(Text, default="", server_default="")
    version: Mapped[int] = mapped_column(default=0, server_default="0")
    capabilities: Mapped[list[str]] = mapped_column(JSONB, default=list, server_default=text("'[]'::jsonb"))


class TeamEvent(Base):
    __tablename__ = "team_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    subject_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    actor_name: Mapped[str] = mapped_column(String(100))
    before: Mapped[dict] = mapped_column(JSONB)
    after: Mapped[dict] = mapped_column(JSONB)
    request_id: Mapped[str] = mapped_column(String(36), unique=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class Invitation(Base):
    __tablename__ = "invitations"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(254), index=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    source_application_id: Mapped[int | None] = mapped_column(ForeignKey('introductions.id'), index=True)
    request_id: Mapped[str | None] = mapped_column(String(36), unique=True)
    source_version: Mapped[int | None] = mapped_column()
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class LoginSession(Base):
    __tablename__ = "login_sessions"

    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    public_id: Mapped[str] = mapped_column(String(36), unique=True, server_default=text("gen_random_uuid()::text"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    client_name: Mapped[str] = mapped_column(String(80), server_default="Existing session")


class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"
    __table_args__ = (CheckConstraint("status IN ('open', 'in_progress', 'closed')", name="inquiry_status"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    submission_id: Mapped[str] = mapped_column(String(36), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(254))
    topic: Mapped[str] = mapped_column(String(40))
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    email_status: Mapped[str] = mapped_column(String(12), default="pending")
    email_mode: Mapped[str] = mapped_column(String(10), default="local")
    email_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


    status: Mapped[str] = mapped_column(String(12), server_default="open", index=True)
    assignee_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    follow_up_on: Mapped[date | None] = mapped_column(Date, index=True)
    version: Mapped[int] = mapped_column(server_default="0")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class InquiryEvent(Base):
    __tablename__ = "inquiry_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    inquiry_id: Mapped[int] = mapped_column(ForeignKey("contact_inquiries.id"), index=True)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    actor_name: Mapped[str] = mapped_column(String(120))
    summary: Mapped[str] = mapped_column(Text)
    note: Mapped[str] = mapped_column(Text)
    request_id: Mapped[str | None] = mapped_column(String(36), unique=True)
    fingerprint: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"
    __table_args__ = (CheckConstraint("status IN ('pending', 'subscribed', 'unsubscribed')", name="newsletter_status"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(254), unique=True)
    status: Mapped[str] = mapped_column(String(12), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    unsubscribed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    confirmation_hash: Mapped[str | None] = mapped_column(String(64), unique=True)
    confirmation_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    unsubscribe_hash: Mapped[str | None] = mapped_column(String(64), unique=True)
    last_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    consent_version: Mapped[str] = mapped_column(String(40))


class PasswordReset(Base):
    __tablename__ = "password_resets"
    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class AccountEvent(Base):
    __tablename__ = "account_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    subject_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    action: Mapped[str] = mapped_column(String(40))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class Introduction(Base):
    __tablename__ = 'introductions'
    __table_args__ = (CheckConstraint("status IN ('new', 'reviewing', 'waiting')", name='introduction_status'),)
    id: Mapped[int] = mapped_column(primary_key=True)
    submission_id: Mapped[str] = mapped_column(String(36), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(254))
    location: Mapped[str] = mapped_column(String(160))
    expertise: Mapped[str] = mapped_column(Text)
    contribution: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(16), default='new')
    reviewer_id: Mapped[int | None] = mapped_column(ForeignKey('users.id', ondelete='SET NULL'), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    version: Mapped[int] = mapped_column(default=0)


class IntroductionEvent(Base):
    __tablename__ = 'introduction_events'
    id: Mapped[int] = mapped_column(primary_key=True)
    introduction_id: Mapped[int] = mapped_column(ForeignKey('introductions.id', ondelete='CASCADE'), index=True)
    request_id: Mapped[str | None] = mapped_column(String(36), unique=True)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey('users.id', ondelete='SET NULL'))
    actor_name: Mapped[str] = mapped_column(String(120))
    summary: Mapped[str] = mapped_column(Text)
    note: Mapped[str] = mapped_column(Text)
    result_status: Mapped[str | None] = mapped_column(String(16))
    result_reviewer_id: Mapped[int | None] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
