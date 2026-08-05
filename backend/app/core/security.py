from datetime import datetime, timedelta, timezone
from typing import Any
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

contexto_senha = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_senha(senha_plana: str, senha_hashed: str) -> bool:
    return contexto_senha.verify(senha_plana, senha_hashed)

def gerar_hash_senha(senha_plana: str) -> str:
    return contexto_senha.hash(senha_plana)

def criar_token_acesso(subjetivo: str | Any, tempo_expiracao: timedelta | None = None) -> str:
    if tempo_expiracao:
        expiracao = datetime.now(timezone.utc) + tempo_expiracao
    else:
        expiracao = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    dados_token = {"exp": expiracao, "sub": str(subjetivo)}
    return jwt.encode(dados_token, settings.SECRET_KEY, algorithm=settings.ALGORITHM)