# app/modules/chat/models.py
from datetime import datetime
from sqlalchemy import Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class MensagemChat(Base):
    __tablename__ = "mensagens_chat"

    id_mensagem: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_remetente_conta: Mapped[int] = mapped_column(ForeignKey("contas.id_conta"), nullable=False)
    id_destinatario_conta: Mapped[int] = mapped_column(ForeignKey("contas.id_conta"), nullable=False)
    conteudo: Mapped[str] = mapped_column(Text, nullable=False)
    data_hora: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    lida: Mapped[bool] = mapped_column(Boolean, default=False)