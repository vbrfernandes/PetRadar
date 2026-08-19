from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Interacao(Base):
    __tablename__ = "interacoes"

    id_interacao: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_conta: Mapped[int] = mapped_column(ForeignKey("contas.id_conta"), nullable=False)
    id_ocorrencia: Mapped[int] = mapped_column(
        ForeignKey("ocorrencias.id_ocorrencia"), nullable=False
    )

    tipo_interacao: Mapped[str] = mapped_column(
        String(20), nullable=False
    )  # FORCA | FAVORITO
    data_hora: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Comentario(Base):
    __tablename__ = "comentarios"

    id_comentario: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    id_conta: Mapped[int] = mapped_column(
        ForeignKey("contas.id_conta"),
        nullable=False,
    )

    id_ocorrencia: Mapped[int] = mapped_column(
        ForeignKey("ocorrencias.id_ocorrencia"),
        nullable=False,
    )

    id_comentario_pai: Mapped[int | None] = mapped_column(
        ForeignKey(
            "comentarios.id_comentario",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    texto: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    data_hora: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    editado_em: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    excluido_em: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )


class Denuncia(Base):
    __tablename__ = "denuncias"

    id_denuncia: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_conta: Mapped[int] = mapped_column(ForeignKey("contas.id_conta"), nullable=False)
    id_ocorrencia: Mapped[int] = mapped_column(
        ForeignKey("ocorrencias.id_ocorrencia"), nullable=False
    )

    motivo: Mapped[str] = mapped_column(Text, nullable=False)
    data_hora: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
