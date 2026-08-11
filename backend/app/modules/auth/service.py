from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, or_
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.modules.auth.models import Conta, UsuarioFisico, ONG
from app.modules.auth.schemas import UsuarioFisicoCriar, ONGCriar, LoginSchema, RedefinirSenha, PerfilAtualizacao
from app.modules.chat.models import MensagemChat
from app.modules.engajamento.models import Interacao, Comentario, Denuncia
from app.modules.ocorrencias.models import (
    Ocorrencia,
    Avistamento,
    HistoricoCuidadoOcorrencia,
)
from app.modules.pets.models import Pet
from app.modules.ong.models import ProjetoAdocao, VoluntariadoSeguidor
from app.core.security import gerar_hash_senha, verificar_senha, criar_token_acesso
import secrets
from datetime import datetime, timedelta, timezone

async def criar_usuario_fisico(db: AsyncSession, dados: UsuarioFisicoCriar) -> Conta:
    query = select(Conta).where(Conta.email == dados.email)
    resultado = await db.execute(query)
    if resultado.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado.")
    cpf_existente = await db.scalar(select(UsuarioFisico.id_usuario).where(UsuarioFisico.cpf == dados.cpf))
    if cpf_existente is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CPF já cadastrado.")

    nova_conta = Conta(
        tipo_conta="PESSOA_FISICA",
        email=dados.email,
        senha=gerar_hash_senha(dados.senha),
        telefone=dados.telefone,
        localizacao_lat=dados.localizacao_lat,
        localizacao_lng=dados.localizacao_lng
    )
    try:
        db.add(nova_conta)
        await db.flush()
        db.add(UsuarioFisico(
            id_conta=nova_conta.id_conta,
            nome_completo=dados.nome_completo,
            cpf=dados.cpf,
            tem_pet=dados.tem_pet,
            raio_pesquisa_km=dados.raio_pesquisa_km
        ))
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail ou CPF já cadastrado.")
    await db.refresh(nova_conta)
    return nova_conta

async def criar_ong(db: AsyncSession, dados: ONGCriar) -> Conta:
    query = select(Conta).where(Conta.email == dados.email)
    resultado = await db.execute(query)
    if resultado.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado.")
    cnpj_existente = await db.scalar(select(ONG.id_ong).where(ONG.cnpj == dados.cnpj))
    if cnpj_existente is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CNPJ já cadastrado.")

    nova_conta = Conta(
        tipo_conta="ONG",
        email=dados.email,
        senha=gerar_hash_senha(dados.senha),
        telefone=dados.telefone,
        localizacao_lat=dados.localizacao_lat,
        localizacao_lng=dados.localizacao_lng
    )
    try:
        db.add(nova_conta)
        await db.flush()
        db.add(ONG(
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
        ))
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail ou CNPJ já cadastrado.")
    await db.refresh(nova_conta)
    return nova_conta

async def autenticar_usuario(db: AsyncSession, dados_login: LoginSchema) -> dict:
    query = select(Conta).where(Conta.email == dados_login.email)
    resultado = await db.execute(query)
    conta = resultado.scalar_one_or_none()

    if not conta or not verificar_senha(dados_login.senha, conta.senha):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas.")

    token = criar_token_acesso(subjetivo=conta.id_conta)

    # Busca o nome real de acordo com o tipo de conta
    nome_exibicao = "Usuário"
    if conta.tipo_conta == "PESSOA_FISICA":
        query_usr = select(UsuarioFisico).where(UsuarioFisico.id_conta == conta.id_conta)
        res_usr = await db.execute(query_usr)
        usr = res_usr.scalar_one_or_none()
        if usr and usr.nome_completo:
            nome_exibicao = usr.nome_completo
    elif conta.tipo_conta == "ONG":
        query_ong = select(ONG).where(ONG.id_conta == conta.id_conta)
        res_ong = await db.execute(query_ong)
        ong = res_ong.scalar_one_or_none()
        if ong and ong.nome_fantasia:
            nome_exibicao = ong.nome_fantasia

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id_conta": conta.id_conta,
            "email": conta.email,
            "name": nome_exibicao,
            "tipo_conta": conta.tipo_conta
        }
    }

async def solicitar_codigo_recuperacao(db: AsyncSession, email: str):
    query = select(Conta).where(Conta.email == email)
    resultado = await db.execute(query)
    conta = resultado.scalar_one_or_none()
    
    if conta:
        codigo = f"{secrets.randbelow(900000) + 100000}"
        conta.codigo_recuperacao = gerar_hash_senha(codigo)
        conta.codigo_recuperacao_expira = datetime.now(timezone.utc) + timedelta(minutes=15)
        conta.tentativas_recuperacao = 0
        await db.commit()

async def redefinir_senha_com_codigo(db: AsyncSession, dados: RedefinirSenha):
    query = select(Conta).where(Conta.email == dados.email)
    resultado = await db.execute(query)
    conta = resultado.scalar_one_or_none()

    if not conta or not conta.codigo_recuperacao:
        raise HTTPException(status_code=400, detail="Código inválido ou expirado.")

    if conta.codigo_recuperacao_expira and conta.codigo_recuperacao_expira.tzinfo is None:
        expira = conta.codigo_recuperacao_expira.replace(tzinfo=timezone.utc)
    else:
        expira = conta.codigo_recuperacao_expira

    if not expira or datetime.now(timezone.utc) > expira:
        raise HTTPException(status_code=400, detail="Código expirado.")

    if conta.tentativas_recuperacao >= 5:
        raise HTTPException(status_code=429, detail="Muitas tentativas. Solicite um novo código.")

    if not verificar_senha(dados.codigo_verificacao, conta.codigo_recuperacao):
        conta.tentativas_recuperacao += 1
        await db.commit()
        raise HTTPException(status_code=400, detail="Código inválido ou expirado.")

    conta.senha = gerar_hash_senha(dados.nova_senha)
    conta.codigo_recuperacao = None
    conta.codigo_recuperacao_expira = None
    conta.tentativas_recuperacao = 0
    await db.commit()

async def obter_perfil_completo(db: AsyncSession, conta: Conta) -> dict:
    dados = {
        "id_conta": conta.id_conta,
        "email": conta.email,
        "tipo_conta": conta.tipo_conta,
        "telefone": conta.telefone,
        "foto_perfil": conta.foto_perfil,
        "data_cadastro": conta.data_cadastro,
    }
    if conta.tipo_conta == "PESSOA_FISICA":
        query = select(UsuarioFisico).where(UsuarioFisico.id_conta == conta.id_conta)
        res = await db.execute(query)
        usr = res.scalar_one_or_none()
        if usr:
            dados.update({
                "nome_completo": usr.nome_completo,
                "tem_pet": usr.tem_pet,
                "raio_pesquisa_km": usr.raio_pesquisa_km
            })
    elif conta.tipo_conta == "ONG":
        query = select(ONG).where(ONG.id_conta == conta.id_conta)
        res = await db.execute(query)
        ong = res.scalar_one_or_none()
        if ong:
            dados.update({
                "cnpj": ong.cnpj,
                "razao_social": ong.razao_social,
                "nome_fantasia": ong.nome_fantasia,
                "endereco_completo": ong.endereco_completo,
                "nome_gestor": ong.nome_gestor,
                "cpf_gestor": ong.cpf_gestor,
            })
    return dados

async def atualizar_perfil(db: AsyncSession, conta: Conta, dados: PerfilAtualizacao) -> dict:

    
    if dados.telefone is not None:
        conta.telefone = dados.telefone

    if conta.tipo_conta == "PESSOA_FISICA":
        query = select(UsuarioFisico).where(UsuarioFisico.id_conta == conta.id_conta)
        res = await db.execute(query)
        usr = res.scalar_one_or_none()
        if usr:
            if dados.nome is not None:
                usr.nome_completo = dados.nome
            if dados.raio_pesquisa_km is not None:
                usr.raio_pesquisa_km = dados.raio_pesquisa_km
            if dados.tem_pet is not None:
                usr.tem_pet = dados.tem_pet
    elif conta.tipo_conta == "ONG":
        query = select(ONG).where(ONG.id_conta == conta.id_conta)
        res = await db.execute(query)
        ong = res.scalar_one_or_none()
        if ong:
            if dados.nome is not None:
                ong.nome_fantasia = dados.nome
            if dados.endereco_completo is not None:
                ong.endereco_completo = dados.endereco_completo

    await db.commit()
    await db.refresh(conta)
    return await obter_perfil_completo(db, conta)

async def excluir_conta(
    db: AsyncSession,
    conta: Conta,
    senha_atual: str,
) -> None:
    if not verificar_senha(senha_atual, conta.senha):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Senha atual incorreta.",
        )

    id_conta = conta.id_conta
    ocorrencias_da_conta = select(Ocorrencia.id_ocorrencia).where(
        Ocorrencia.id_conta == id_conta
    )

    try:
        for modelo in (
            Interacao,
            Comentario,
            Denuncia,
            HistoricoCuidadoOcorrencia,
            Avistamento,
        ):
            await db.execute(
                delete(modelo).where(
                    or_(
                        modelo.id_conta == id_conta,
                        modelo.id_ocorrencia.in_(ocorrencias_da_conta),
                    )
                )
            )

        await db.execute(
            delete(Ocorrencia).where(Ocorrencia.id_conta == id_conta)
        )

        await db.execute(
            delete(MensagemChat).where(
                or_(
                    MensagemChat.id_remetente_conta == id_conta,
                    MensagemChat.id_destinatario_conta == id_conta,
                )
            )
        )

        if conta.tipo_conta == "PESSOA_FISICA":
            id_usuario = await db.scalar(
                select(UsuarioFisico.id_usuario).where(
                    UsuarioFisico.id_conta == id_conta
                )
            )

            if id_usuario is not None:
                await db.execute(
                    delete(VoluntariadoSeguidor).where(
                        VoluntariadoSeguidor.id_usuario == id_usuario
                    )
                )
                await db.execute(delete(Pet).where(Pet.id_usuario == id_usuario))
                await db.execute(
                    delete(UsuarioFisico).where(
                        UsuarioFisico.id_usuario == id_usuario
                    )
                )

        elif conta.tipo_conta == "ONG":
            id_ong = await db.scalar(
                select(ONG.id_ong).where(ONG.id_conta == id_conta)
            )

            if id_ong is not None:
                await db.execute(
                    delete(VoluntariadoSeguidor).where(
                        VoluntariadoSeguidor.id_ong == id_ong
                    )
                )
                await db.execute(
                    delete(ProjetoAdocao).where(ProjetoAdocao.id_ong == id_ong)
                )
                await db.execute(delete(ONG).where(ONG.id_ong == id_ong))

        await db.execute(delete(Conta).where(Conta.id_conta == id_conta))
        await db.commit()
    except Exception:
        await db.rollback()
        raise
