"""Persist website inquiries independently of email delivery."""

from alembic import op
import sqlalchemy as sa

revision = "0002_contact_inquiries"
down_revision = "0001_member_access"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("contact_inquiries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("submission_id", sa.String(36), nullable=False, unique=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("topic", sa.String(40), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("email_status", sa.String(12), nullable=False),
        sa.Column("email_mode", sa.String(10), nullable=False),
        sa.Column("email_sent_at", sa.DateTime(timezone=True)))


def downgrade():
    op.drop_table("contact_inquiries")
