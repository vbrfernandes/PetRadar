"""secure password-reset code storage

Revision ID: f7c1e4d2a9b0
Revises: 28a9a8d94dc2
"""
from alembic import op
import sqlalchemy as sa

revision = "f7c1e4d2a9b0"
down_revision = "28a9a8d94dc2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column("contas", "codigo_recuperacao", type_=sa.String(length=128))
    op.add_column(
        "contas",
        sa.Column("tentativas_recuperacao", sa.Integer(), nullable=False, server_default="0"),
    )


def downgrade() -> None:
    op.drop_column("contas", "tentativas_recuperacao")
    op.alter_column("contas", "codigo_recuperacao", type_=sa.String(length=6))
