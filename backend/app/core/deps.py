from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.config import settings
from app.core.database import get_db
from app.modules.auth.models import Conta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def obter_conta_atual(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Conta:
    excecao_credenciais = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        id_conta: str = payload.get("sub")
        if id_conta is None:
            raise excecao_credenciais
    except JWTError:
        raise excecao_credenciais

    query = select(Conta).where(Conta.id_conta == int(id_conta))
    resultado = await db.execute(query)
    conta = resultado.scalar_one_or_none()

    if conta is None:
        raise excecao_credenciais
    return conta