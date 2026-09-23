"""add label to link

Revision ID: 04e2eb536ec2
Revises: 1b0e9d41900e
Create Date: 2026-09-23 16:45:42.446964

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '04e2eb536ec2'
down_revision: Union[str, Sequence[str], None] = '1b0e9d41900e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('links', schema=None) as batch_op:
        batch_op.add_column(sa.Column('label', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('links', schema=None) as batch_op:
        batch_op.drop_column('label')
