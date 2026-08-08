"""add cpf usuario

Revision ID: 28a9a8d94dc2
Revises: be3d516310b6
Create Date: 2026-08-08 09:25:44.932371
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.

revision: str = "28a9a8d94dc2"
down_revision: Union[str, None] = "be3d516310b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "usuarios_fisicos",
        sa.Column(
            "cpf",
            sa.String(length=14),
            nullable=True
        )
    )

    op.create_unique_constraint(
        "uq_usuarios_fisicos_cpf",
        "usuarios_fisicos",
        ["cpf"]
    )


def downgrade() -> None:
    op.drop_constraint(
        "uq_usuarios_fisicos_cpf",
        "usuarios_fisicos",
        type_="unique"
    )

    op.drop_column(
        "usuarios_fisicos",
        "cpf"
    )