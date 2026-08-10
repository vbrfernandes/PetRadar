"""create occurrence care history

Revision ID: a4b7c9d2e5f1
Revises: d3a8b6c4e1f2
"""
from alembic import op
import sqlalchemy as sa


revision = "a4b7c9d2e5f1"
down_revision = "d3a8b6c4e1f2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "historico_cuidados_ocorrencia",
        sa.Column("id_historico", sa.Integer(), nullable=False),
        sa.Column("id_ocorrencia", sa.Integer(), nullable=False),
        sa.Column("id_conta", sa.Integer(), nullable=False),
        sa.Column("tipo_cuidado", sa.String(length=10), nullable=False),
        sa.Column("data_cuidado", sa.DateTime(), nullable=False),
        sa.Column(
            "data_registro", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.CheckConstraint(
            "tipo_cuidado IN ('AGUA', 'COMIDA')",
            name="ck_historico_cuidados_tipo",
        ),
        sa.ForeignKeyConstraint(["id_ocorrencia"], ["ocorrencias.id_ocorrencia"]),
        sa.ForeignKeyConstraint(["id_conta"], ["contas.id_conta"]),
        sa.PrimaryKeyConstraint("id_historico"),
    )
    op.create_index(
        "ix_historico_cuidados_ocorrencia_id_ocorrencia",
        "historico_cuidados_ocorrencia",
        ["id_ocorrencia"],
    )
    op.create_index(
        "ix_historico_cuidados_ocorrencia_id_conta",
        "historico_cuidados_ocorrencia",
        ["id_conta"],
    )
    op.create_index(
        "ix_historico_cuidados_ocorrencia_estado",
        "historico_cuidados_ocorrencia",
        ["id_ocorrencia", "tipo_cuidado", "data_cuidado"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_historico_cuidados_ocorrencia_estado",
        table_name="historico_cuidados_ocorrencia",
    )
    op.drop_index(
        "ix_historico_cuidados_ocorrencia_id_conta",
        table_name="historico_cuidados_ocorrencia",
    )
    op.drop_index(
        "ix_historico_cuidados_ocorrencia_id_ocorrencia",
        table_name="historico_cuidados_ocorrencia",
    )
    op.drop_table("historico_cuidados_ocorrencia")
