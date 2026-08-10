from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.deps import obter_conta_atual
from app.core.cloudinary import upload_foto_pet
from app.modules.auth.models import Conta, UsuarioFisico
from app.modules.pets.models import Pet
from app.modules.pets.schemas import PetResposta

router = APIRouter()

@router.post("/", response_model=PetResposta, status_code=status.HTTP_201_CREATED)
async def cadastrar_pet(
    nome: str = Form(...),
    especie: str = Form(...),

    raca: str | None = Form(None),

    
    sexo: str | None = Form(None),

    
    cor: str | None = Form(None),

    porte: str | None = Form(None),

    
    idade: str | None = Form(None),

    foto: UploadFile | None = File(None),

    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db)
):
    if conta_atual.tipo_conta != "PESSOA_FISICA":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas contas de Pessoa Física podem cadastrar pets de tutor."
        )

    # Busca o perfil de usuario_fisico vinculado à conta
    query_user = select(UsuarioFisico).where(UsuarioFisico.id_conta == conta_atual.id_conta)
    user_res = await db.execute(query_user)
    usuario = user_res.scalar_one_or_none()
    if usuario is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil de usuário não encontrado.")

    url_foto = None
    if foto:
        url_foto = await upload_foto_pet(foto, pasta="pets")

    novo_pet = Pet(
        id_usuario=usuario.id_usuario,
        nome=nome,
        especie=especie,
        raca=raca,
        porte=porte,
        sexo=sexo,
        cor=cor,
        idade=idade,
        foto=url_foto
    )
    
    db.add(novo_pet)
    await db.commit()
    await db.refresh(novo_pet)
    
    return novo_pet

@router.get("/meus", response_model=list[PetResposta])
async def listar_meus_pets(
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db)
):
    if conta_atual.tipo_conta != "PESSOA_FISICA":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Apenas contas de Pessoa Física possuem pets de tutor.")

    query_user = select(UsuarioFisico).where(UsuarioFisico.id_conta == conta_atual.id_conta)
    user_res = await db.execute(query_user)
    usuario = user_res.scalar_one_or_none()
    if usuario is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil de usuário não encontrado.")

    query_pets = select(Pet).where(Pet.id_usuario == usuario.id_usuario)
    resultado = await db.execute(query_pets)
    return resultado.scalars().all()
