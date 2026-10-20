"""Introduction intake and private review history."""
from alembic import op
import sqlalchemy as sa

revision = '0005_introductions'
down_revision = '0004_account_foundation'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('introductions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('submission_id', sa.String(36), nullable=False, unique=True),
        sa.Column('name', sa.String(120), nullable=False),
        sa.Column('email', sa.String(254), nullable=False),
        sa.Column('location', sa.String(160), nullable=False),
        sa.Column('expertise', sa.Text(), nullable=False),
        sa.Column('contribution', sa.Text(), nullable=False),
        sa.Column('status', sa.String(16), nullable=False),
        sa.Column('reviewer_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('version', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("status IN ('new', 'reviewing', 'waiting')", name='introduction_status'))
    op.create_index('ix_introductions_reviewer_id', 'introductions', ['reviewer_id'])
    op.create_table('introduction_events',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('introduction_id', sa.Integer(), sa.ForeignKey('introductions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('request_id', sa.String(36), unique=True),
        sa.Column('actor_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('actor_name', sa.String(120), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('note', sa.Text(), nullable=False),
        sa.Column('result_status', sa.String(16)),
        sa.Column('result_reviewer_id', sa.Integer()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False))
    op.create_index('ix_introduction_events_introduction_id', 'introduction_events', ['introduction_id'])


def downgrade():
    op.drop_table('introduction_events')
    op.drop_table('introductions')
