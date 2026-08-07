from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.auth.schemas import (
    UsuarioFisicoCriar, 
    ONGCriar, 
    LoginSchema, 
    TokenSchema, 
    ContaResposta,
    EsqueceuSenhaSolicitacao,
    RedefinirSenha
)
from app.modules.auth import service

router = APIRouter()

@router.post("/registro/usuario", response_model=ContaResposta, status_code=status.HTTP_201_CREATED)
async def registrar_usuario(dados: UsuarioFisicoCriar, db: AsyncSession = Depends(get_db)):
    return await service.criar_usuario_fisico(db, dados)

@router.post("/registro/ong", response_model=ContaResposta, status_code=status.HTTP_201_CREATED)
async def registrar_ong(dados: ONGCriar, db: AsyncSession = Depends(get_db)):
    return await service.criar_ong(db, dados)

@router.post("/login", response_model=TokenSchema)
async def login(dados: LoginSchema, db: AsyncSession = Depends(get_db)):
    token = await service.autenticar_usuario(db, dados)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/esqueceu-senha")
async def solicitar_codigo(dados: EsqueceuSenhaSolicitacao, db: AsyncSession = Depends(get_db)):
    await service.solicitar_codigo_recuperacao(db, dados.email)
    return {"message": "Se o e-mail estiver cadastrado, o código foi enviado."}

@router.post("/redefinir-senha")
async def redefinir_senha(dados: RedefinirSenha, db: AsyncSession = Depends(get_db)):
    await service.redefinir_senha_com_codigo(db, dados)
    return {"message": "Senha alterada com sucesso!"}