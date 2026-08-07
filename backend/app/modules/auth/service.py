from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.modules.auth.models import Conta, UsuarioFisico, ONG
from app.modules.auth.schemas import UsuarioFisicoCriar, ONGCriar, LoginSchema
from app.core.security import gerar_hash_senha, verificar_senha, criar_token_acesso
import random
from datetime import datetime, timedelta, timezone

async def criar_usuario_fisico(db: AsyncSession, dados: UsuarioFisicoCriar) -> Conta:
    query = select(Conta).where(Conta.email == dados.email)
    resultado = await db.execute(query)
    if resultado.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado.")

    nova_conta = Conta(
        tipo_conta="PESSOA_FISICA",
        email=dados.email,
        senha=gerar_hash_senha(dados.senha),
        telefone=dados.telefone,
        localizacao_lat=dados.localizacao_lat,
        localizacao_lng=dados.localizacao_lng
    )
    db.add(nova_conta)
    await db.commit()
    await db.refresh(nova_conta)

    novo_usuario = UsuarioFisico(
        id_conta=nova_conta.id_conta,
        nome_completo=dados.nome_completo,
        tem_pet=dados.tem_pet,
        raio_pesquisa_km=dados.raio_pesquisa_km
    )
    db.add(novo_usuario)
    await db.commit()
    return nova_conta

async def criar_ong(db: AsyncSession, dados: ONGCriar) -> Conta:
    query = select(Conta).where(Conta.email == dados.email)
    resultado = await db.execute(query)
    if resultado.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado.")

    nova_conta = Conta(
        tipo_conta="ONG",
        email=dados.email,
        senha=gerar_hash_senha(dados.senha),
        telefone=dados.telefone,
        localizacao_lat=dados.localizacao_lat,
        localizacao_lng=dados.localizacao_lng
    )
    db.add(nova_conta)
    await db.commit()
    await db.refresh(nova_conta)

    nova_ong = ONG(
        id_conta=nova_conta.id_conta,
        cnpj=dados.cnpj,
        razao_social=dados.razao_social,
        nome_fantasia=dados.nome_fantasia,
        endereco_completo=dados.endereco_completo,
        nome_gestor=dados.nome_gestor,
        cpf_gestor=dados.cpf_gestor,
        oferece_lar_temporario=dados.oferece_lar_temporario,
        vagas_emergenciais=dados.vagas_emergenciais,
        capacidade_total=dados.capacidade_total,
        lotacao_atual=dados.lotacao_atual,
        link_prestacao_contas=dados.link_prestacao_contas
    )
    db.add(nova_ong)
    await db.commit()
    return nova_conta

async def autenticar_usuario(db: AsyncSession, dados_login: LoginSchema) -> str:
    query = select(Conta).where(Conta.email == dados_login.email)
    resultado = await db.execute(query)
    conta = resultado.scalar_one_or_none()

    if not conta or not verificar_senha(dados_login.senha, conta.senha):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas.")

    return criar_token_acesso(subjetivo=conta.id_conta)


async def solicitar_codigo_recuperacao(db: AsyncSession, email: str):
    query = select(Conta).where(Conta.email == email)
    resultado = await db.execute(query)
    conta = resultado.scalar_one_or_none()
    
    if conta:
        codigo = f"{random.randint(100000, 999999)}"
        conta.codigo_recuperacao = codigo
        conta.codigo_recuperacao_expira = datetime.now(timezone.utc) + timedelta(minutes=15)
        await db.commit()
        # TODO: Chavear a função de envio SMTP aqui
        print(f"[SMTP MOCK] Código para {email}: {codigo}")

async def redefinir_senha_com_codigo(db: AsyncSession, dados: RedefinirSenha):
    query = select(Conta).where(Conta.email == dados.email)
    resultado = await db.execute(query)
    conta = resultado.scalar_one_or_none()

    if not conta or conta.codigo_recuperacao != dados.codigo_verificacao:
        raise HTTPException(status_code=400, detail="Código inválido ou expirado.")

    if conta.codigo_recuperacao_expira and conta.codigo_recuperacao_expira.tzinfo is None:
        expira = conta.codigo_recuperacao_expira.replace(tzinfo=timezone.utc)
    else:
        expira = conta.codigo_recuperacao_expira

    if datetime.now(timezone.utc) > expira:
        raise HTTPException(status_code=400, detail="Código expirado.")

    conta.senha = gerar_hash_senha(dados.nova_senha)
    conta.codigo_recuperacao = None
    conta.codigo_recuperacao_expira = None
    await db.commit()