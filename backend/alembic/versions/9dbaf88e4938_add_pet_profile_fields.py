"""add pet profile fields

Revision ID: 9dbaf88e4938
Revises: 'a4b7c9d2e5f1'
Create Date: 2026-08-10 16:21:14.265860

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import geoalchemy2


# revision identifiers, used by Alembic.
revision: str = '9dbaf88e4938'
down_revision: Union[str, None] = 'a4b7c9d2e5f1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "pets",
        sa.Column(
            "sexo",
            sa.String(length=20),
            nullable=True,
        ),
    )

    op.add_column(
        "pets",
        sa.Column(
            "cor",
            sa.String(length=50),
            nullable=True,
        ),
    )

    op.add_column(
        "pets",
        sa.Column(
            "idade",
            sa.String(length=20),
            nullable=True,
        ),
    )
    
def downgrade() -> None:
    op.drop_column("pets", "idade")
    op.drop_column("pets", "cor")
    op.drop_column("pets", "sexo")