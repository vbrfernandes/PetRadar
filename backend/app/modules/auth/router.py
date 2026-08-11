from fastapi import APIRouter, Depends, status, File, UploadFile, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import obter_conta_atual
from app.core.cloudinary import upload_foto_pet
from app.modules.auth.models import Conta
from app.modules.auth.schemas import (
    UsuarioFisicoCriar, 
    ONGCriar, 
    LoginSchema, 
    TokenSchema, 
    ContaResposta,
    EsqueceuSenhaSolicitacao,
    RedefinirSenha,
    ExcluirContaSolicitacao,
)
from app.modules.auth import service
from app.modules.auth.schemas import PerfilDetalhadoResposta, PerfilAtualizacao

router = APIRouter()

@router.post("/registro/usuario", response_model=ContaResposta, status_code=status.HTTP_201_CREATED)
async def registrar_usuario(dados: UsuarioFisicoCriar, db: AsyncSession = Depends(get_db)):
    return await service.criar_usuario_fisico(db, dados)

@router.post("/registro/ong", response_model=ContaResposta, status_code=status.HTTP_201_CREATED)
async def registrar_ong(dados: ONGCriar, db: AsyncSession = Depends(get_db)):
    return await service.criar_ong(db, dados)

@router.post("/login", response_model=TokenSchema)
async def login(dados: LoginSchema, db: AsyncSession = Depends(get_db)):
    return await service.autenticar_usuario(db, dados)

@router.post("/esqueceu-senha")
async def solicitar_codigo(dados: EsqueceuSenhaSolicitacao, db: AsyncSession = Depends(get_db)):
    await service.solicitar_codigo_recuperacao(db, dados.email)
    return {"message": "Se o e-mail estiver cadastrado, o código foi enviado."}

@router.post("/redefinir-senha")
async def redefinir_senha(dados: RedefinirSenha, db: AsyncSession = Depends(get_db)):
    await service.redefinir_senha_com_codigo(db, dados)
    return {"message": "Senha alterada com sucesso!"}

@router.get("/me", response_model=PerfilDetalhadoResposta)
async def obter_meu_perfil(
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db)
):
    return await service.obter_perfil_completo(db, conta_atual)

@router.put("/me", response_model=PerfilDetalhadoResposta)
async def atualizar_meu_perfil(
    dados: PerfilAtualizacao,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db)
):
    return await service.atualizar_perfil(db, conta_atual, dados)

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def excluir_minha_conta(
    dados: ExcluirContaSolicitacao,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    await service.excluir_conta(db, conta_atual, dados.senha)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/me/foto")
async def atualizar_foto_perfil(
    foto: UploadFile = File(...),
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db)
):
    url_foto = await upload_foto_pet(foto, pasta="perfis")
    conta_atual.foto_perfil = url_foto
    await db.commit()
    return {"foto_perfil": url_foto}
