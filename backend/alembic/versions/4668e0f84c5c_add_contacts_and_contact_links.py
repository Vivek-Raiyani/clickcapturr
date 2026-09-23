"""add_contacts_and_contact_links

Revision ID: 4668e0f84c5c
Revises: 04e2eb536ec2
Create Date: 2026-09-23 18:31:29.374422

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4668e0f84c5c'
down_revision: Union[str, Sequence[str], None] = '04e2eb536ec2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create contacts and contact_links tables."""
    op.create_table(
        'contacts',
        sa.Column('email',      sa.String(),                  nullable=True),
        sa.Column('first_name', sa.String(),                  nullable=True),
        sa.Column('last_name',  sa.String(),                  nullable=True),
        sa.Column('phone',      sa.String(),                  nullable=True),
        sa.Column('id',         sa.UUID(),                    nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True),   nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True),   nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    with op.batch_alter_table('contacts', schema=None) as batch_op:
        batch_op.create_index('ix_contacts_email', ['email'], unique=True)
        batch_op.create_index('ix_contacts_id',    ['id'],    unique=False)

    op.create_table(
        'contact_links',
        sa.Column('contact_id',   sa.UUID(),                  nullable=False),
        sa.Column('page_id',      sa.UUID(),                  nullable=False),
        sa.Column('link_id',      sa.UUID(),                  nullable=True),
        sa.Column('campaign_id',  sa.UUID(),                  nullable=True),
        sa.Column('data_json',    sa.JSON(),                  nullable=True),
        sa.Column('country',      sa.String(length=2),        nullable=True),
        sa.Column('country_name', sa.String(),                nullable=True),
        sa.Column('state',        sa.String(),                nullable=True),
        sa.Column('city',         sa.String(),                nullable=True),
        sa.Column('ip_address',   sa.String(),                nullable=True),
        sa.Column('user_agent',   sa.String(),                nullable=True),
        sa.Column('id',           sa.UUID(),                  nullable=False),
        sa.Column('created_at',   sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at',   sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['contact_id'],  ['contacts.id'],  ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['link_id'],     ['links.id'],     ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['page_id'],     ['pages.id'],     ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    with op.batch_alter_table('contact_links', schema=None) as batch_op:
        batch_op.create_index('ix_contact_links_id',           ['id'],                    unique=False)
        batch_op.create_index('ix_contact_links_contact_id',   ['contact_id'],            unique=False)
        batch_op.create_index('ix_contact_links_page_id',      ['page_id'],               unique=False)
        batch_op.create_index('ix_contact_links_link_id',      ['link_id'],               unique=False)
        batch_op.create_index('ix_contact_links_campaign_id',  ['campaign_id'],           unique=False)
        batch_op.create_index('ix_contact_links_page_contact', ['page_id', 'contact_id'], unique=False)


def downgrade() -> None:
    """Drop contacts and contact_links tables."""
    with op.batch_alter_table('contact_links', schema=None) as batch_op:
        batch_op.drop_index('ix_contact_links_page_contact')
        batch_op.drop_index('ix_contact_links_campaign_id')
        batch_op.drop_index('ix_contact_links_link_id')
        batch_op.drop_index('ix_contact_links_page_id')
        batch_op.drop_index('ix_contact_links_contact_id')
        batch_op.drop_index('ix_contact_links_id')
    op.drop_table('contact_links')

    with op.batch_alter_table('contacts', schema=None) as batch_op:
        batch_op.drop_index('ix_contacts_email')
        batch_op.drop_index('ix_contacts_id')
    op.drop_table('contacts')
