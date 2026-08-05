from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Pet(Base):
    __tablename__ = "pets"

    id_pet: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios_fisicos.id_usuario"), nullable=False)
    
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    especie: Mapped[str] = mapped_column(String(50), nullable=False)
    raca: Mapped[str | None] = mapped_column(String(100))
    porte: Mapped[str | None] = mapped_column(String(20))
    foto: Mapped[str | None] = mapped_column(String(500))

    usuario: Mapped["UsuarioFisico"] = relationship("UsuarioFisico", back_populates="pets")