# app/modules/ong/models.py
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class ProjetoAdocao(Base):
    __tablename__ = "projetos_adocao"

    id_projeto: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_ong: Mapped[int] = mapped_column(ForeignKey("ongs.id_ong"), nullable=False)
    tipo_conteudo: Mapped[str] = mapped_column(String(20), nullable=False) # PROJETO | ADOCAO | INST
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    descricao: Mapped[str] = mapped_column(Text, nullable=False)
    foto: Mapped[str | None] = mapped_column(String(500))
    data_publicacao: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class VoluntariadoSeguidor(Base):
    __tablename__ = "voluntariados_seguidores"

    id_relacao: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios_fisicos.id_usuario"), nullable=False)
    id_ong: Mapped[int] = mapped_column(ForeignKey("ongs.id_ong"), nullable=False)
    tipo_relacao: Mapped[str] = mapped_column(String(20), nullable=False) # VOLUNTARIO | SEGUIDOR
    data_inicio: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    status_aprovacao: Mapped[str] = mapped_column(String(20), default="PENDENTE")