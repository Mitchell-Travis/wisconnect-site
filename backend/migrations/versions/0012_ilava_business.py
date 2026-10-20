"""Add Rahel Mwitula-Williams's ILAVA listing."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = "0012_ilava_business"
down_revision = "0011_team_permissions"
branch_labels = None
depends_on = None


BUSINESS = {
    "name": "ILAVA",
    "person": "Rahel Mwitula-Williams · Founder",
    "country": "United States",
    "location": "Chicago",
    "sector": "Ethical fashion & lifestyle",
    "description": "A purpose-driven fashion and lifestyle brand rooted in Tanzania, creating contemporary, globally inspired pieces handmade there while supporting economic opportunity for women.",
    "profile": "Rahel Mwitula-Williams",
    "public_email": "",
    "public_phone": "",
    "website": "https://myilava.com",
    "visual": {
        "name": "ILAVA",
        "sub": "IT CAN BE DONE",
        "tone": "plum",
        "poster": "editorial",
        "group": "Design",
        "image": "https://myilava.com/cdn/shop/files/GAB_3273_2.jpg?v=1789587557&width=1500",
        "alt": "ILAVA lifestyle campaign photograph",
    },
}


def upgrade():
    connection = op.get_bind()
    businesses = sa.table(
        "businesses",
        sa.column("id", sa.Integer()),
        sa.column("slug", sa.String()),
        sa.column("draft", JSONB()),
        sa.column("published", JSONB()),
        sa.column("internal_email", sa.String()),
        sa.column("internal_phone", sa.String()),
        sa.column("internal_notes", sa.Text()),
        sa.column("status", sa.String()),
        sa.column("version", sa.Integer()),
        sa.column("created_at", sa.DateTime(timezone=True)),
        sa.column("updated_at", sa.DateTime(timezone=True)),
        sa.column("published_at", sa.DateTime(timezone=True)),
    )
    events = sa.table(
        "business_events",
        sa.column("business_id", sa.Integer()),
        sa.column("actor_name", sa.String()),
        sa.column("action", sa.String()),
        sa.column("created_at", sa.DateTime(timezone=True)),
    )
    now = sa.func.now()
    business_id = connection.execute(
        businesses.insert().values(
            slug="ilava", draft=BUSINESS, published=BUSINESS, internal_email="",
            internal_phone="", internal_notes="", status="published", version=0,
            created_at=now, updated_at=now, published_at=now,
        ).returning(businesses.c.id)
    ).scalar_one()
    connection.execute(events.insert().values(
        business_id=business_id, actor_name="WisConnect directory", action="imported", created_at=now,
    ))


def downgrade():
    connection = op.get_bind()
    business = sa.table("businesses", sa.column("id", sa.Integer()), sa.column("slug", sa.String()))
    events = sa.table("business_events", sa.column("business_id", sa.Integer()), sa.column("action", sa.String()))
    business_id = connection.execute(sa.select(business.c.id).where(business.c.slug == "ilava")).scalar_one_or_none()
    if business_id is None:
        return
    later_activity = connection.execute(sa.select(events.c.business_id).where(
        events.c.business_id == business_id, events.c.action != "imported",
    ).limit(1)).first()
    if later_activity:
        raise RuntimeError("ILAVA has business activity; preserve its history instead of removing the listing.")
    connection.execute(events.delete().where(events.c.business_id == business_id))
    connection.execute(business.delete().where(business.c.id == business_id))
