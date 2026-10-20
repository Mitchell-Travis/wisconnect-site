"""Shared expiring rate-limit counters; no account or application changes."""
from alembic import op
import sqlalchemy as sa

revision = "0006_shared_rate_limits"
down_revision = "0005_introductions"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("rate_limit_buckets",
        sa.Column("key_hash", sa.String(64), primary_key=True),
        sa.Column("count", sa.Integer(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("count > 0", name="rate_limit_positive_count"))
    op.create_index("ix_rate_limit_buckets_expires_at", "rate_limit_buckets", ["expires_at"])


def downgrade():
    op.drop_table("rate_limit_buckets")
