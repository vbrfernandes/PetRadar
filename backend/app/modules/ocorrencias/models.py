from datetime import datetime
from sqlalchemy import String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.core.database import Base

class Ocorrencia(Base):
    __tablename__ = "ocorrencias"

    id_ocorrencia: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_conta: Mapped[int] = mapped_column(ForeignKey("contas.id_conta"), nullable=False)
    
    tipo_ocorrencia: Mapped[str] = mapped_column(String(50), nullable=False)
    status_badge: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    ) # PERDIDO | AVISTADO | ANIMAL_DE_RUA
    tipo_animal: Mapped[str] = mapped_column(String(50), nullable=False)
    raca: Mapped[str | None] = mapped_column(String(100))
    sexo: Mapped[str | None] = mapped_column(String(20))
    cor: Mapped[str | None] = mapped_column(String(50))
    porte: Mapped[str | None] = mapped_column(String(20))
    idade: Mapped[str | None] = mapped_column(String(20))
    saude_critica: Mapped[bool] = mapped_column(Boolean, default=False)
    saude_detalhes: Mapped[str | None] = mapped_column(Text)
    cuidados_iniciais: Mapped[str | None] = mapped_column(Text)
    deficiencia: Mapped[bool] = mapped_column(Boolean, default=False)
    deficiencia_detalhes: Mapped[str | None] = mapped_column(Text)
    nivel_urgencia: Mapped[str] = mapped_column(String(20), default="Moderado")
    data_ocorrencia: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    endereco_localizacao: Mapped[str | None] = mapped_column(String(500))
    
    localizacao: Mapped[bytes] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=False), 
        nullable=False
    )
    foto: Mapped[str] = mapped_column(String(500), nullable=False)
    observacao: Mapped[str | None] = mapped_column(Text)

    avistamentos: Mapped[list["Avistamento"]] = relationship("Avistamento", back_populates="ocorrencia")

class Avistamento(Base):
    __tablename__ = "avistamentos"

    id_avistamento: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_ocorrencia: Mapped[int] = mapped_column(ForeignKey("ocorrencias.id_ocorrencia"), nullable=False)
    id_conta: Mapped[int] = mapped_column(ForeignKey("contas.id_conta"), nullable=False)
    
    eh_de_raca: Mapped[bool] = mapped_column(Boolean, default=False)
    raca: Mapped[str | None] = mapped_column(String(100))
    data_hora: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    localizacao: Mapped[bytes] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=False), 
        nullable=False
    )
    foto: Mapped[str | None] = mapped_column(String(500))
    observacao: Mapped[str | None] = mapped_column(Text)

    ocorrencia: Mapped["Ocorrencia"] = relationship("Ocorrencia", back_populates="avistamentos")
