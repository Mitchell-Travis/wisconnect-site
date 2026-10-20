"""Private profiles, recovery and account activity."""
from alembic import op
import sqlalchemy as sa

revision = "0004_account_foundation"
down_revision = "0003_newsletter"
branch_labels = None
depends_on = None


def upgrade():
    for name, kind, default in [("phone", sa.String(40), ""), ("location", sa.String(160), ""), ("bio", sa.Text(), ""), ("version", sa.Integer(), "0")]:
        op.add_column("users", sa.Column(name, kind, nullable=False, server_default=default))
    op.create_table("password_resets",
        sa.Column("token_hash", sa.String(64), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_password_resets_user_id", "password_resets", ["user_id"])
    op.create_table("account_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("actor_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("subject_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("action", sa.String(40), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_account_events_subject_id", "account_events", ["subject_id"])


def downgrade():
    op.drop_table("account_events")
    op.drop_table("password_resets")
    for name in ["version", "bio", "location", "phone"]:
        op.drop_column("users", name)
