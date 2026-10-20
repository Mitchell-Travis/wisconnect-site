"""Saved business drafts and published snapshots, preserving the eleven listings."""
import json
from pathlib import Path
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = "0008_businesses"
down_revision = "0007_session_management"
branch_labels = None
depends_on = None


def upgrade():
    table = op.create_table("businesses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(80), nullable=False, unique=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("draft", JSONB(), nullable=False), sa.Column("published", JSONB()),
        sa.Column("internal_email", sa.String(254), nullable=False),
        sa.Column("internal_phone", sa.String(40), nullable=False), sa.Column("internal_notes", sa.Text(), nullable=False),
        sa.Column("status", sa.String(12), nullable=False), sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint("status IN ('draft','published','archived')", name="business_status"))
    op.create_index("ix_businesses_owner_id", "businesses", ["owner_id"])
    events = op.create_table("business_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("business_id", sa.Integer(), sa.ForeignKey("businesses.id"), nullable=False),
        sa.Column("actor_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("actor_name", sa.String(120), nullable=False), sa.Column("action", sa.String(20), nullable=False),
        sa.Column("request_id", sa.String(36), unique=True), sa.Column("fingerprint", sa.String(64)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_business_events_business_id", "business_events", ["business_id"])
    connection = op.get_bind()
    # Immutable migration snapshot; future catalog edits must never change this seed.
    for item in json.loads((Path(__file__).parents[1] / "data/businesses_0008.json").read_text()):
        slug = item.pop("id")
        business_id = connection.execute(table.insert().values(
            slug=slug, draft=item, published=item, internal_email="", internal_phone="", internal_notes="",
            status="published", version=0, created_at=sa.func.now(), updated_at=sa.func.now(), published_at=sa.func.now(),
        ).returning(table.c.id)).scalar_one()
        connection.execute(events.insert().values(business_id=business_id, actor_name="Existing website", action="imported", created_at=sa.func.now()))


def downgrade():
    op.drop_table("business_events")
    op.drop_table("businesses")
