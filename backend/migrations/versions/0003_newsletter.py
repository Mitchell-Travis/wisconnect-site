"""Confirmed newsletter subscriptions, separate from cooperative membership."""
from alembic import op
import sqlalchemy as sa

revision = "0003_newsletter"
down_revision = "0002_contact_inquiries"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("newsletter_subscribers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(254), nullable=False, unique=True),
        sa.Column("status", sa.String(12), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("confirmed_at", sa.DateTime(timezone=True)),
        sa.Column("unsubscribed_at", sa.DateTime(timezone=True)),
        sa.Column("confirmation_hash", sa.String(64), unique=True),
        sa.Column("confirmation_expires_at", sa.DateTime(timezone=True)),
        sa.Column("unsubscribe_hash", sa.String(64), unique=True),
        sa.Column("last_sent_at", sa.DateTime(timezone=True)),
        sa.Column("consent_version", sa.String(40), nullable=False),
        sa.CheckConstraint("status IN ('pending', 'subscribed', 'unsubscribed')", name="newsletter_status"))


def downgrade():
    op.drop_table("newsletter_subscribers")
