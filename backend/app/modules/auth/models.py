from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.modules.pets.models import Pet
from geoalchemy2 import Geometry

class Conta(Base):
    __tablename__ = "contas"

    id_conta: Mapped[int] = mapped_column(primary_key=True, index=True)
    tipo_conta: Mapped[str] = mapped_column(String(20), nullable=False) # PESSOA_FISICA | ONG
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    senha: Mapped[str] = mapped_column(String(255), nullable=False)
    telefone: Mapped[str | None] = mapped_column(String(20))
    localizacao_lat: Mapped[float | None] = mapped_column(Numeric(10, 8))
    localizacao_lng: Mapped[float | None] = mapped_column(Numeric(11, 8))
    localizacao: Mapped[bytes | None] = mapped_column(
        Geometry("POINT", srid=4326, spatial_index=False), 
        nullable=True
    )
    foto_perfil: Mapped[str | None] = mapped_column(String(500))
    data_cadastro: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    email_confirmado: Mapped[bool] = mapped_column(Boolean, default=False)
    codigo_confirmacao: Mapped[str | None] = mapped_column(String(6))
    codigo_recuperacao: Mapped[str | None] = mapped_column(String(128))
    codigo_recuperacao_expira: Mapped[datetime | None] = mapped_column(DateTime)
    tentativas_recuperacao: Mapped[int] = mapped_column(default=0, nullable=False)

    usuario_fisico: Mapped["UsuarioFisico"] = relationship("UsuarioFisico", back_populates="conta", uselist=False)
    ong: Mapped["ONG"] = relationship("ONG", back_populates="conta", uselist=False)
    historico_cuidados_ocorrencia: Mapped[list["HistoricoCuidadoOcorrencia"]] = relationship(
        "HistoricoCuidadoOcorrencia", back_populates="conta"
    )

class UsuarioFisico(Base):
    __tablename__ = "usuarios_fisicos"

    id_usuario: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_conta: Mapped[int] = mapped_column(ForeignKey("contas.id_conta"), unique=True, nullable=False)
    nome_completo: Mapped[str] = mapped_column(String(255), nullable=False)
    cpf: Mapped[str | None] = mapped_column(
        String(14),
        unique=True,
        nullable=True
    )
    tem_pet: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    social_login_id: Mapped[str | None] = mapped_column(String(255))
    raio_pesquisa_km: Mapped[int] = mapped_column(default=10)
    pets: Mapped[list["Pet"]] = relationship("Pet", back_populates="usuario", cascade="all, delete-orphan")

    conta: Mapped["Conta"] = relationship("Conta", back_populates="usuario_fisico")

class ONG(Base):
    __tablename__ = "ongs"

    id_ong: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_conta: Mapped[int] = mapped_column(ForeignKey("contas.id_conta"), unique=True, nullable=False)
    cnpj: Mapped[str] = mapped_column(String(18), unique=True, nullable=False)
    razao_social: Mapped[str] = mapped_column(String(255), nullable=False)
    nome_fantasia: Mapped[str] = mapped_column(String(255), nullable=False)
    endereco_completo: Mapped[str] = mapped_column(String(500), nullable=False)
    nome_gestor: Mapped[str] = mapped_column(String(255), nullable=False)
    cpf_gestor: Mapped[str] = mapped_column(String(14), nullable=False)
    comprovante_url: Mapped[str | None] = mapped_column(String(500))
    selo_verificado: Mapped[bool] = mapped_column(Boolean, default=False)
    oferece_lar_temporario: Mapped[bool] = mapped_column(Boolean, default=False)
    vagas_emergenciais: Mapped[bool] = mapped_column(Boolean, default=False)
    capacidade_total: Mapped[int | None] = mapped_column()
    lotacao_atual: Mapped[int | None] = mapped_column()
    link_prestacao_contas: Mapped[str | None] = mapped_column(String(500))

    conta: Mapped["Conta"] = relationship("Conta", back_populates="ong")
