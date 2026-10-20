"""Private inquiry follow-up, independent of notification delivery."""
from alembic import op
import sqlalchemy as sa
revision = '0009_inquiry_followup'
down_revision = '0008_businesses'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('contact_inquiries', sa.Column('status', sa.String(12), nullable=False, server_default='open'))
    op.add_column('contact_inquiries', sa.Column('assignee_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='SET NULL')))
    op.add_column('contact_inquiries', sa.Column('follow_up_on', sa.Date()))
    op.add_column('contact_inquiries', sa.Column('version', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('contact_inquiries', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))
    op.create_check_constraint('inquiry_status', 'contact_inquiries', "status IN ('open', 'in_progress', 'closed')")
    for column in ['status', 'assignee_id', 'follow_up_on']:
        op.create_index('ix_contact_inquiries_'+column, 'contact_inquiries', [column])
    op.create_table('inquiry_events',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('inquiry_id', sa.Integer(), sa.ForeignKey('contact_inquiries.id'), nullable=False),
        sa.Column('actor_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('actor_name', sa.String(120), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False), sa.Column('note', sa.Text(), nullable=False),
        sa.Column('request_id', sa.String(36), unique=True), sa.Column('fingerprint', sa.String(64)),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False))
    op.create_index('ix_inquiry_events_inquiry_id', 'inquiry_events', ['inquiry_id'])
    op.execute("UPDATE contact_inquiries SET updated_at = created_at")
    op.execute("INSERT INTO inquiry_events (inquiry_id, actor_name, summary, note, created_at) SELECT id, 'Website', 'Inquiry received; follow-up tracking added', '', created_at FROM contact_inquiries")


def downgrade():
    op.drop_table('inquiry_events')
    op.drop_constraint('inquiry_status', 'contact_inquiries', type_='check')
    for column in ['status', 'assignee_id', 'follow_up_on']:
        op.drop_index('ix_contact_inquiries_'+column, 'contact_inquiries')
    for column in ['status', 'assignee_id', 'follow_up_on', 'version', 'updated_at']:
        op.drop_column('contact_inquiries', column)
