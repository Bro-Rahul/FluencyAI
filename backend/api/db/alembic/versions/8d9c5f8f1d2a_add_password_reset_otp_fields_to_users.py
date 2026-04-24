"""add password reset otp fields to users

Revision ID: 8d9c5f8f1d2a
Revises: ffc533564289
Create Date: 2026-04-24 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8d9c5f8f1d2a'
down_revision: Union[str, Sequence[str], None] = 'ffc533564289'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('reset_otp_hash', sa.String(), nullable=True))
    op.add_column('users', sa.Column('reset_otp_expires_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'reset_otp_expires_at')
    op.drop_column('users', 'reset_otp_hash')
