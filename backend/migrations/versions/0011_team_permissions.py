"""Explicit staff capabilities and access-change history; preserve existing privileges."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0011_team_permissions"
down_revision = "0010_application_invitations"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("capabilities", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")))
    op.create_check_constraint("user_capabilities_array", "users", "jsonb_typeof(capabilities) = 'array'")
    op.create_index("ix_users_capabilities", "users", ["capabilities"], postgresql_using="gin")
    op.create_table("team_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("subject_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("actor_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("actor_name", sa.String(100), nullable=False),
        sa.Column("before", postgresql.JSONB(), nullable=False),
        sa.Column("after", postgresql.JSONB(), nullable=False),
        sa.Column("request_id", sa.String(36), nullable=False, unique=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_team_events_subject_id", "team_events", ["subject_id"])


def downgrade():
    bind = op.get_bind()
    if bind.execute(sa.text("SELECT 1 FROM team_events LIMIT 1")).first() or bind.execute(sa.text("SELECT 1 FROM users WHERE capabilities <> '[]'::jsonb LIMIT 1")).first():
        raise RuntimeError("Staff grants or access history exist; restore a verified backup instead of discarding them.")
    op.drop_table("team_events")
    op.drop_index("ix_users_capabilities", "users")
    op.drop_constraint("user_capabilities_array", "users", type_="check")
    op.drop_column("users", "capabilities")
