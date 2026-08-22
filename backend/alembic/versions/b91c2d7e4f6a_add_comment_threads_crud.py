"""add comment threads crud

Revision ID: b91c2d7e4f6a
Revises: 9dbaf88e4938
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b91c2d7e4f6a"
down_revision: Union[str, None] = "9dbaf88e4938"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "comentarios",
        sa.Column(
            "id_comentario_pai",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "comentarios",
        sa.Column(
            "editado_em",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.add_column(
        "comentarios",
        sa.Column(
            "excluido_em",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "fk_comentarios_id_comentario_pai",
        "comentarios",
        "comentarios",
        ["id_comentario_pai"],
        ["id_comentario"],
        ondelete="SET NULL",
    )

    op.create_index(
        "ix_comentarios_id_comentario_pai",
        "comentarios",
        ["id_comentario_pai"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_comentarios_id_comentario_pai",
        table_name="comentarios",
    )

    op.drop_constraint(
        "fk_comentarios_id_comentario_pai",
        "comentarios",
        type_="foreignkey",
    )

    op.drop_column(
        "comentarios",
        "excluido_em",
    )

    op.drop_column(
        "comentarios",
        "editado_em",
    )

    op.drop_column(
        "comentarios",
        "id_comentario_pai",
    )