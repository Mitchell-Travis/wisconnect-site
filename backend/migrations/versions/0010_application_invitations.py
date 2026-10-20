"""Preserve invitation generations and explicitly link account invitations to introductions."""
from alembic import op
import sqlalchemy as sa
revision = '0010_application_invitations'
down_revision = '0009_inquiry_followup'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_constraint('invitations_email_key', 'invitations', type_='unique')
    op.create_index('ix_invitations_email', 'invitations', ['email'])
    op.add_column('invitations', sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))
    # Existing links always had a 24-hour lifetime; preserve that issue time.
    op.execute("UPDATE invitations SET created_at = expires_at - interval '24 hours'")
    op.add_column('invitations', sa.Column('source_application_id', sa.Integer(), sa.ForeignKey('introductions.id')))
    op.create_index('ix_invitations_source_application_id', 'invitations', ['source_application_id'])
    op.add_column('invitations', sa.Column('request_id', sa.String(36)))
    op.create_unique_constraint('invitations_request_id_key', 'invitations', ['request_id'])
    op.add_column('invitations', sa.Column('source_version', sa.Integer()))


def downgrade():
    # Never silently delete invitation history to restore the old uniqueness rule.
    if op.get_bind().execute(sa.text('SELECT 1 FROM invitations GROUP BY email HAVING count(*) > 1 LIMIT 1')).first():
        raise RuntimeError('Repeated invitation history exists; restore a verified backup rather than deleting history.')
    for column in ['source_version', 'request_id', 'source_application_id', 'created_at']:
        op.drop_column('invitations', column)
    op.drop_index('ix_invitations_email', 'invitations')
    op.create_unique_constraint('invitations_email_key', 'invitations', ['email'])
