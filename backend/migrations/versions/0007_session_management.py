"""Private session inventory and idle expiry; preserve existing session tokens."""
from alembic import op
import sqlalchemy as sa

revision = "0007_session_management"
down_revision = "0006_shared_rate_limits"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("login_sessions", sa.Column("public_id", sa.String(36), nullable=False, server_default=sa.text("gen_random_uuid()::text")))
    op.create_unique_constraint("uq_login_sessions_public_id", "login_sessions", ["public_id"])
    op.add_column("login_sessions", sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))
    op.add_column("login_sessions", sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))
    op.add_column("login_sessions", sa.Column("client_name", sa.String(80), nullable=False, server_default="Existing session"))
    # Existing sessions were issued with a fixed eight-hour absolute lifetime.
    op.execute("UPDATE login_sessions SET created_at = expires_at - interval '8 hours'")
    # Their prior activity was not recorded. Give unexpired sessions one idle window
    # from migration, retaining the original absolute expiry and cookie/token.


def downgrade():
    op.drop_constraint("uq_login_sessions_public_id", "login_sessions", type_="unique")
    for column in ["client_name", "last_seen_at", "created_at", "public_id"]:
        op.drop_column("login_sessions", column)
