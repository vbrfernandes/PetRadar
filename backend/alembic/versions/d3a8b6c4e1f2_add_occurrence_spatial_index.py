"""add spatial index for occurrence search

Revision ID: d3a8b6c4e1f2
Revises: f7c1e4d2a9b0
"""
from alembic import op

revision = "d3a8b6c4e1f2"
down_revision = "f7c1e4d2a9b0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        "CREATE INDEX ix_ocorrencias_localizacao_geography "
        "ON ocorrencias USING gist ((localizacao::geography))"
    )


def downgrade() -> None:
    op.drop_index("ix_ocorrencias_localizacao_geography", table_name="ocorrencias")
