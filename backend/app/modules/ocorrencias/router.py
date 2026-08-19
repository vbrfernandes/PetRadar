from fastapi import (
    APIRouter,
    Body,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    Request,
    Response,
    UploadFile,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from geoalchemy2.functions import (
    ST_GeomFromText,
    ST_DWithin,
    ST_X,
    ST_Y,
)
from app.core.database import get_db
from app.core.deps import obter_conta_atual
from app.core.cloudinary import upload_foto_pet
from app.modules.auth.models import Conta, ONG, UsuarioFisico
from app.modules.ocorrencias.models import (
    Avistamento,
    HistoricoCuidadoOcorrencia,
    Ocorrencia,
)
from app.modules.engajamento.models import Comentario, Denuncia, Interacao
from app.modules.ocorrencias.schemas import (
    ComentarioAtualizar,
    ComentarioCriar,
    ComentarioResposta,
    CuidadoOcorrenciaCriar,
    CuidadoOcorrenciaResposta,
    OcorrenciaResposta,
    OcorrenciaDetalheResposta,
)
from datetime import datetime
from sqlalchemy import cast, delete, func
from geoalchemy2 import Geography
from app.modules.pets.models import Pet

router = APIRouter()


def _serializar_cuidado(
    cuidado: HistoricoCuidadoOcorrencia,
    nome_autor: str,
) -> dict:
    return {
        "id_historico": cuidado.id_historico,
        "tipo_cuidado": cuidado.tipo_cuidado,
        "data_cuidado": cuidado.data_cuidado,
        "data_registro": cuidado.data_registro,
        "usuario": {
            "id_conta": cuidado.id_conta,
            "nome": nome_autor,
        },
    }


def _query_cuidados_com_autor(id_ocorrencia: int):
    nome_autor = func.coalesce(
        UsuarioFisico.nome_completo,
        ONG.nome_fantasia,
        Conta.email,
    ).label("nome_autor")
    return (
        select(HistoricoCuidadoOcorrencia, nome_autor)
        .join(Conta, Conta.id_conta == HistoricoCuidadoOcorrencia.id_conta)
        .outerjoin(UsuarioFisico, UsuarioFisico.id_conta == Conta.id_conta)
        .outerjoin(ONG, ONG.id_conta == Conta.id_conta)
        .where(HistoricoCuidadoOcorrencia.id_ocorrencia == id_ocorrencia)
    )


def _serializar_comentario(
    comentario: Comentario,
    nome_autor: str,
    foto_autor: str | None,
    tipo_conta_autor: str,
) -> dict:
    return {
        "id_comentario": comentario.id_comentario,
        "id_ocorrencia": comentario.id_ocorrencia,
        "id_conta": comentario.id_conta,
        "id_comentario_pai": comentario.id_comentario_pai,
        "texto": comentario.texto,
        "data_hora": comentario.data_hora,
        "editado_em": comentario.editado_em,
        "excluido_em": comentario.excluido_em,
        "autor": {
            "id_conta": comentario.id_conta,
            "nome": nome_autor,
            "foto": foto_autor,
            "tipo_conta": tipo_conta_autor,
        },
    }


def _query_comentarios_com_autor(
    id_ocorrencia: int,
):
    nome_autor = func.coalesce(
        UsuarioFisico.nome_completo,
        ONG.nome_fantasia,
        Conta.email,
    ).label("nome_autor")

    foto_autor = Conta.foto_perfil.label("foto_autor")

    tipo_conta_autor = Conta.tipo_conta.label("tipo_conta_autor")

    return (
        select(
            Comentario,
            nome_autor,
            foto_autor,
            tipo_conta_autor,
        )
        .join(
            Conta,
            Conta.id_conta == Comentario.id_conta,
        )
        .outerjoin(
            UsuarioFisico,
            UsuarioFisico.id_conta == Conta.id_conta,
        )
        .outerjoin(
            ONG,
            ONG.id_conta == Conta.id_conta,
        )
        .where(Comentario.id_ocorrencia == id_ocorrencia)
    )


async def _carregar_cuidados_atuais(
    db: AsyncSession,
    id_ocorrencia: int,
) -> dict:
    cuidados_resultado = await db.execute(
        _query_cuidados_com_autor(id_ocorrencia)
        .distinct(HistoricoCuidadoOcorrencia.tipo_cuidado)
        .order_by(
            HistoricoCuidadoOcorrencia.tipo_cuidado,
            HistoricoCuidadoOcorrencia.data_cuidado.desc(),
            HistoricoCuidadoOcorrencia.id_historico.desc(),
        )
    )
    cuidados_atuais = {"agua": None, "comida": None}
    for cuidado, nome_autor in cuidados_resultado.all():
        chave = cuidado.tipo_cuidado.lower()
        if cuidados_atuais[chave] is None:
            cuidados_atuais[chave] = _serializar_cuidado(cuidado, nome_autor)
    return cuidados_atuais


def _validar_proprietario(
    ocorrencia: Ocorrencia,
    conta_atual: Conta,
    mensagem: str,
) -> None:
    if ocorrencia.id_conta != conta_atual.id_conta:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=mensagem,
        )


@router.post(
    "/", response_model=OcorrenciaResposta, status_code=status.HTTP_201_CREATED
)
async def criar_ocorrencia(
    tipo_ocorrencia: str = Form(...),
    status_badge: str = Form(...),
    tipo_animal: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    foto: UploadFile | None = File(None),
    id_pet: int | None = Form(None),
    raca: str | None = Form(None),
    sexo: str | None = Form(None),
    cor: str | None = Form(None),
    porte: str | None = Form(None),
    idade: str | None = Form(None),
    saude_critica: bool = Form(False),
    saude_detalhes: str | None = Form(None),
    cuidados_iniciais: str | None = Form(None),
    deficiencia: bool = Form(False),
    deficiencia_detalhes: str | None = Form(None),
    nivel_urgencia: str = Form("Moderado"),
    endereco_localizacao: str | None = Form(None),
    data_ocorrencia: datetime = Form(...),
    observacao: str | None = Form(None),
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
        raise HTTPException(status_code=422, detail="Coordenadas inválidas.")

    # =========================================================
    # FOTO DA OCORRÊNCIA
    # =========================================================

    url_foto: str | None = None

    # Foto nova enviada pelo usuário
    if foto is not None:
        url_foto = await upload_foto_pet(foto, pasta="ocorrencias")

    # Reutilizar foto de um pet já cadastrado
    elif id_pet is not None:
        query_pet = (
            select(Pet)
            .join(UsuarioFisico, UsuarioFisico.id_usuario == Pet.id_usuario)
            .where(
                Pet.id_pet == id_pet,
                UsuarioFisico.id_conta == conta_atual.id_conta,
            )
        )

        pet_resultado = await db.execute(query_pet)

        pet = pet_resultado.scalar_one_or_none()

        if pet is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pet não encontrado para esta conta.",
            )

        url_foto = pet.foto

    if not url_foto:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Informe uma foto para registrar a ocorrência.",
        )

    ponto_wkt = f"POINT({longitude} {latitude})"

    nova_ocorrencia = Ocorrencia(
        id_conta=conta_atual.id_conta,
        tipo_ocorrencia=tipo_ocorrencia,
        status_badge=status_badge,
        tipo_animal=tipo_animal,
        raca=raca,
        sexo=sexo,
        cor=cor,
        porte=porte,
        idade=idade,
        saude_critica=saude_critica,
        saude_detalhes=saude_detalhes,
        cuidados_iniciais=cuidados_iniciais,
        deficiencia=deficiencia,
        deficiencia_detalhes=deficiencia_detalhes,
        nivel_urgencia=nivel_urgencia,
        endereco_localizacao=endereco_localizacao,
        data_ocorrencia=data_ocorrencia,
        localizacao=ST_GeomFromText(ponto_wkt, 4326),
        foto=url_foto,
        observacao=observacao,
    )

    db.add(nova_ocorrencia)
    await db.commit()
    await db.refresh(nova_ocorrencia)
    return {
        "id_ocorrencia": nova_ocorrencia.id_ocorrencia,
        "id_conta": nova_ocorrencia.id_conta,
        "tipo_ocorrencia": nova_ocorrencia.tipo_ocorrencia,
        "status_badge": nova_ocorrencia.status_badge,
        "tipo_animal": nova_ocorrencia.tipo_animal,
        "foto": nova_ocorrencia.foto,
        "nivel_urgencia": nova_ocorrencia.nivel_urgencia,
        "data_ocorrencia": nova_ocorrencia.data_ocorrencia,
        "endereco_localizacao": nova_ocorrencia.endereco_localizacao,
        "latitude": latitude,
        "longitude": longitude,
    }


from geoalchemy2.functions import (
    ST_GeomFromText,
    ST_DWithin,
    ST_X,
    ST_Y,
)


@router.get("/proximas", response_model=list[OcorrenciaResposta])
async def listar_ocorrencias_proximas(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    raio_km: float = Query(10.0, gt=0, le=100),
    modo: str = Query("proximidade", pattern="^(proximidade|eco)$"),
    limite: int = Query(100, ge=1, le=500),
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    """

    Retorna as ocorrências do feed usando a localização do usuário
    como referência para o cálculo de distância.

    modo=proximidade:
    limita ao raio informado e ordena por distância ASC,
    depois por data da ocorrência DESC.

    modo=eco:
    não limita pelo raio e ordena por total de Ecos DESC,
    distância ASC e data da ocorrência DESC.

    A coluna localizacao é armazenada como Geometry SRID 4326.
    Para calcular distância corretamente em metros, a geometria
    é convertida para Geography.

    """

    # =========================================================
    # PONTO DA LOCALIZAÇÃO DO USUÁRIO
    # =========================================================

    ponto_usuario_geometry = ST_GeomFromText(f"POINT({lng} {lat})", 4326)

    ponto_usuario_geography = cast(
        ponto_usuario_geometry, Geography(geometry_type="POINT", srid=4326)
    )

    # =========================================================
    # RAIO
    # =========================================================

    raio_metros = raio_km * 1000

    # =========================================================
    # LOCALIZAÇÃO DA OCORRÊNCIA
    # =========================================================

    ocorrencia_geography = cast(
        Ocorrencia.localizacao, Geography(geometry_type="POINT", srid=4326)
    )

    distancia_metros = func.ST_Distance(ocorrencia_geography, ponto_usuario_geography)

    # =========================================================
    # AUTOR
    # =========================================================

    autor_nome = func.coalesce(
        UsuarioFisico.nome_completo,
        ONG.nome_fantasia,
        Conta.email,
    ).label("autor_nome")

    autor_foto = Conta.foto_perfil.label("autor_foto")

    # =========================================================
    # TOTAL DE FORÇAS
    # =========================================================

    total_forca = (
        select(func.count(Interacao.id_interacao))
        .where(
            Interacao.id_ocorrencia == Ocorrencia.id_ocorrencia,
            Interacao.tipo_interacao == "FORCA",
        )
        .correlate(Ocorrencia)
        .scalar_subquery()
        .label("total_forca")
    )

    # =========================================================
    # TOTAL DE COMENTÁRIOS
    # =========================================================

    total_comentarios = (
        select(func.count(Comentario.id_comentario))
        .where(
            Comentario.id_ocorrencia == Ocorrencia.id_ocorrencia,
            Comentario.excluido_em.is_(None),
        )
        .correlate(Ocorrencia)
        .scalar_subquery()
        .label("total_comentarios")
    )

    # =========================================================
    # USUÁRIO ATUAL DEU FORÇA?
    # =========================================================

    total_forca_usuario = (
        select(func.count(Interacao.id_interacao))
        .where(
            Interacao.id_ocorrencia == Ocorrencia.id_ocorrencia,
            Interacao.id_conta == conta_atual.id_conta,
            Interacao.tipo_interacao == "FORCA",
        )
        .correlate(Ocorrencia)
        .scalar_subquery()
        .label("total_forca_usuario")
    )

    # =========================================================
    # CONSULTA
    # =========================================================

    query = (
        select(
            Ocorrencia,
            ST_Y(Ocorrencia.localizacao).label("latitude"),
            ST_X(Ocorrencia.localizacao).label("longitude"),
            distancia_metros.label("distancia_metros"),
            autor_nome,
            autor_foto,
            total_forca,
            total_comentarios,
            total_forca_usuario,
        )
        .join(Conta, Conta.id_conta == Ocorrencia.id_conta)
        .outerjoin(UsuarioFisico, UsuarioFisico.id_conta == Conta.id_conta)
        .outerjoin(ONG, ONG.id_conta == Conta.id_conta)
    )

    if modo == "proximidade":
        query = query.where(
            ST_DWithin(ocorrencia_geography, ponto_usuario_geography, raio_metros)
        ).order_by(distancia_metros.asc(), Ocorrencia.data_ocorrencia.desc())

    else:
        query = query.order_by(
            total_forca.desc(),
            distancia_metros.asc(),
            Ocorrencia.data_ocorrencia.desc(),
        )

    query = query.limit(limite)

    resultado = await db.execute(query)

    # =========================================================
    # RESPOSTA
    # =========================================================

    ocorrencias = []

    for (
        ocorrencia,
        latitude,
        longitude,
        distancia_metros_resultado,
        autor_nome_resultado,
        autor_foto_resultado,
        total_forca_resultado,
        total_comentarios_resultado,
        total_forca_usuario_resultado,
    ) in resultado.all():

        ocorrencias.append(
            {
                "id_ocorrencia": ocorrencia.id_ocorrencia,
                "id_conta": ocorrencia.id_conta,
                "tipo_ocorrencia": ocorrencia.tipo_ocorrencia,
                "status_badge": ocorrencia.status_badge,
                "tipo_animal": ocorrencia.tipo_animal,
                "foto": ocorrencia.foto,
                "nivel_urgencia": ocorrencia.nivel_urgencia,
                "data_ocorrencia": ocorrencia.data_ocorrencia,
                "endereco_localizacao": ocorrencia.endereco_localizacao,
                "observacao": ocorrencia.observacao,
                "latitude": float(latitude),
                "longitude": float(longitude),
                "distancia_km": round(float(distancia_metros_resultado) / 1000, 3),
                "autor_nome": autor_nome_resultado,
                "autor_foto": autor_foto_resultado,
                "total_forca": int(total_forca_resultado or 0),
                "total_comentarios": int(total_comentarios_resultado or 0),
                "usuario_deu_forca": int(total_forca_usuario_resultado or 0) > 0,
            }
        )

    return ocorrencias


# =============================================================
# FORÇA
# =============================================================


@router.post("/{id_ocorrencia:int}/forca")
async def alternar_forca_ocorrencia(
    id_ocorrencia: int,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    # =========================================================
    # 1. VERIFICA OCORRÊNCIA
    # =========================================================

    ocorrencia_existe = await db.scalar(
        select(Ocorrencia.id_ocorrencia).where(
            Ocorrencia.id_ocorrencia == id_ocorrencia
        )
    )

    if ocorrencia_existe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ocorrência não encontrada.",
        )

    # =========================================================
    # 2. VERIFICA SE JÁ EXISTE FORÇA
    # =========================================================

    forca_existente = await db.scalar(
        select(Interacao.id_interacao)
        .where(
            Interacao.id_ocorrencia == id_ocorrencia,
            Interacao.id_conta == conta_atual.id_conta,
            Interacao.tipo_interacao == "FORCA",
        )
        .limit(1)
    )

    # =========================================================
    # 3. TOGGLE
    # =========================================================

    if forca_existente is not None:

        # Remove qualquer duplicidade que
        # eventualmente já exista no banco.
        await db.execute(
            delete(Interacao).where(
                Interacao.id_ocorrencia == id_ocorrencia,
                Interacao.id_conta == conta_atual.id_conta,
                Interacao.tipo_interacao == "FORCA",
            )
        )

        ativo = False

    else:
        nova_forca = Interacao(
            id_conta=conta_atual.id_conta,
            id_ocorrencia=id_ocorrencia,
            tipo_interacao="FORCA",
        )

        db.add(nova_forca)

        ativo = True

    await db.commit()

    # =========================================================
    # 4. TOTAL ATUALIZADO
    # =========================================================

    total_forca = await db.scalar(
        select(func.count(Interacao.id_interacao)).where(
            Interacao.id_ocorrencia == id_ocorrencia,
            Interacao.tipo_interacao == "FORCA",
        )
    )

    return {
        "ativo": ativo,
        "total_forca": int(total_forca or 0),
    }


# =============================================================
# DENÚNCIA DE OCORRÊNCIA
# =============================================================


@router.post("/{id_ocorrencia:int}/denuncias")
async def denunciar_ocorrencia(
    id_ocorrencia: int,
    motivo: str = Body(
        ...,
        embed=True,
        min_length=3,
        max_length=500,
    ),
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    # =========================================================
    # 1. VALIDA MOTIVO
    # =========================================================

    motivo_limpo = motivo.strip()

    if len(motivo_limpo) < 3:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Informe um motivo válido para a denúncia.",
        )

    # =========================================================
    # 2. VERIFICA SE A OCORRÊNCIA EXISTE
    # =========================================================

    ocorrencia_existe = await db.scalar(
        select(Ocorrencia.id_ocorrencia).where(
            Ocorrencia.id_ocorrencia == id_ocorrencia
        )
    )

    if ocorrencia_existe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ocorrência não encontrada.",
        )

    # =========================================================
    # 3. PROCURA DENÚNCIA ANTERIOR DO MESMO USUÁRIO
    # =========================================================
    #
    # Evita criar várias denúncias iguais caso o usuário
    # toque novamente.
    #
    # Se já existir, atualizamos o motivo e a data.
    # =========================================================

    denuncia_existente = await db.scalar(
        select(Denuncia)
        .where(
            Denuncia.id_ocorrencia == id_ocorrencia,
            Denuncia.id_conta == conta_atual.id_conta,
        )
        .order_by(Denuncia.id_denuncia.desc())
        .limit(1)
    )

    if denuncia_existente is not None:
        denuncia_existente.motivo = motivo_limpo

        denuncia_existente.data_hora = datetime.utcnow()

        await db.commit()

        return {
            "message": "Denúncia atualizada com sucesso.",
        }

    # =========================================================
    # 4. CRIA NOVA DENÚNCIA
    # =========================================================

    nova_denuncia = Denuncia(
        id_conta=conta_atual.id_conta,
        id_ocorrencia=id_ocorrencia,
        motivo=motivo_limpo,
    )

    db.add(nova_denuncia)

    await db.commit()

    return {
        "message": "Denúncia enviada com sucesso.",
    }


# =============================================================
# COMENTÁRIOS DA OCORRÊNCIA
# =============================================================


@router.get(
    "/{id_ocorrencia:int}/comentarios",
    response_model=list[ComentarioResposta],
)
async def listar_comentarios_ocorrencia(
    id_ocorrencia: int,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    # Mantém a rota protegida por autenticação.
    _ = conta_atual

    ocorrencia_existe = await db.scalar(
        select(Ocorrencia.id_ocorrencia).where(
            Ocorrencia.id_ocorrencia == id_ocorrencia
        )
    )

    if ocorrencia_existe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ocorrência não encontrada.",
        )

    resultado = await db.execute(
        _query_comentarios_com_autor(id_ocorrencia).order_by(
            Comentario.data_hora.asc(),
            Comentario.id_comentario.asc(),
        )
    )

    return [
        _serializar_comentario(
            comentario,
            nome_autor,
            foto_autor,
            tipo_conta_autor,
        )
        for (
            comentario,
            nome_autor,
            foto_autor,
            tipo_conta_autor,
        ) in resultado.all()
    ]


@router.post(
    "/{id_ocorrencia:int}/comentarios",
    response_model=ComentarioResposta,
    status_code=status.HTTP_201_CREATED,
)
async def criar_comentario_ocorrencia(
    id_ocorrencia: int,
    dados: ComentarioCriar,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    ocorrencia_existe = await db.scalar(
        select(Ocorrencia.id_ocorrencia).where(
            Ocorrencia.id_ocorrencia == id_ocorrencia
        )
    )

    if ocorrencia_existe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ocorrência não encontrada.",
        )

    texto = dados.texto.strip()

    if not texto:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Escreva uma mensagem antes de enviar.",
        )

        id_comentario_pai: int | None = None

    if dados.id_comentario_pai is not None:
        comentario_alvo = await db.get(
            Comentario,
            dados.id_comentario_pai,
        )

        if (
            comentario_alvo is None
            or comentario_alvo.id_ocorrencia != id_ocorrencia
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comentário respondido não encontrado.",
            )

        if comentario_alvo.excluido_em is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Não é possível responder a um comentário excluído.",
            )

        # =====================================================
        # NÍVEL 0
        #
        # Comentário principal.
        # A nova mensagem será uma resposta de nível 1.
        # =====================================================

        if comentario_alvo.id_comentario_pai is None:
            id_comentario_pai = comentario_alvo.id_comentario

        else:
            # =================================================
            # O comentário alvo já possui pai.
            #
            # Precisamos descobrir se ele é:
            #
            # nível 1 -> pode receber uma resposta final
            # nível 2 -> não pode receber novas respostas
            # =================================================

            comentario_pai = await db.get(
                Comentario,
                comentario_alvo.id_comentario_pai,
            )

            if (
                comentario_pai is None
                or comentario_pai.id_ocorrencia != id_ocorrencia
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Estrutura de comentários inválida.",
                )

            # Se o pai também possui pai, comentario_alvo
            # já está no último nível permitido.
            if comentario_pai.id_comentario_pai is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Esta resposta já está no último nível permitido.",
                )

            if comentario_pai.excluido_em is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Não é possível responder a um comentário excluído.",
                )

            # comentario_alvo é uma resposta de nível 1.
            # A nova resposta fica ligada diretamente a ela,
            # formando o nível 2.
            id_comentario_pai = comentario_alvo.id_comentario

    novo_comentario = Comentario(
        id_conta=conta_atual.id_conta,
        id_ocorrencia=id_ocorrencia,
        id_comentario_pai=id_comentario_pai,
        texto=texto,
    )

    try:
        db.add(novo_comentario)

        await db.commit()

        await db.refresh(novo_comentario)
    except Exception:
        await db.rollback()
        raise

    resultado = await db.execute(
        _query_comentarios_com_autor(id_ocorrencia).where(
            Comentario.id_comentario == novo_comentario.id_comentario
        )
    )


    (
        comentario,
        nome_autor,
        foto_autor,
        tipo_conta_autor,
    ) = resultado.one()

    return _serializar_comentario(
        comentario,
        nome_autor,
        foto_autor,
        tipo_conta_autor,
    )

@router.patch(
    "/{id_ocorrencia:int}/comentarios/{id_comentario:int}",
    response_model=ComentarioResposta,
)
async def atualizar_comentario_ocorrencia(
    id_ocorrencia: int,
    id_comentario: int,
    dados: ComentarioAtualizar,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    comentario = await db.get(
        Comentario,
        id_comentario,
    )

    if (
        comentario is None
        or comentario.id_ocorrencia != id_ocorrencia
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comentário não encontrado.",
        )

    if comentario.id_conta != conta_atual.id_conta:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode editar seus próprios comentários.",
        )

    if comentario.excluido_em is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Comentário excluído não pode ser editado.",
        )

    texto = dados.texto.strip()

    if not texto:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="O comentário não pode ficar vazio.",
        )

    comentario.texto = texto
    comentario.editado_em = datetime.utcnow()

    await db.commit()
    await db.refresh(comentario)

    resultado = await db.execute(
        _query_comentarios_com_autor(
            id_ocorrencia,
        ).where(
            Comentario.id_comentario
            == id_comentario,
        )
    )

    (
        comentario,
        nome_autor,
        foto_autor,
        tipo_conta_autor,
    ) = resultado.one()

    return _serializar_comentario(
        comentario,
        nome_autor,
        foto_autor,
        tipo_conta_autor,
    )


@router.delete(
    "/{id_ocorrencia:int}/comentarios/{id_comentario:int}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def excluir_comentario_ocorrencia(
    id_ocorrencia: int,
    id_comentario: int,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
) -> None:
    comentario = await db.get(
        Comentario,
        id_comentario,
    )

    if (
        comentario is None
        or comentario.id_ocorrencia != id_ocorrencia
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comentário não encontrado.",
        )

    if comentario.id_conta != conta_atual.id_conta:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode excluir seus próprios comentários.",
        )

    if comentario.excluido_em is not None:
        return

    comentario.texto = ""
    comentario.excluido_em = datetime.utcnow()

    await db.commit()

@router.get("/minhas", response_model=list[OcorrenciaResposta])
async def listar_minhas_ocorrencias(
    conta_atual: Conta = Depends(obter_conta_atual),
    limite: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(
            Ocorrencia,
            ST_Y(Ocorrencia.localizacao).label("latitude"),
            ST_X(Ocorrencia.localizacao).label("longitude"),
        )
        .where(Ocorrencia.id_conta == conta_atual.id_conta)
        .order_by(Ocorrencia.data_ocorrencia.desc())
        .limit(limite)
    )

    resultado = await db.execute(query)

    ocorrencias = []

    for ocorrencia, latitude, longitude in resultado.all():
        ocorrencias.append(
            {
                "id_ocorrencia": ocorrencia.id_ocorrencia,
                "id_conta": ocorrencia.id_conta,
                "tipo_ocorrencia": ocorrencia.tipo_ocorrencia,
                "status_badge": ocorrencia.status_badge,
                "tipo_animal": ocorrencia.tipo_animal,
                "foto": ocorrencia.foto,
                "nivel_urgencia": ocorrencia.nivel_urgencia,
                "data_ocorrencia": ocorrencia.data_ocorrencia,
                "endereco_localizacao": ocorrencia.endereco_localizacao,
                "latitude": float(latitude),
                "longitude": float(longitude),
            }
        )

    return ocorrencias


@router.put(
    "/{id_ocorrencia:int}",
    response_model=OcorrenciaDetalheResposta,
)
async def atualizar_ocorrencia(
    id_ocorrencia: int,
    request: Request,
    tipo_ocorrencia: str | None = Form(None),
    status_badge: str | None = Form(None),
    tipo_animal: str | None = Form(None),
    raca: str | None = Form(None),
    sexo: str | None = Form(None),
    cor: str | None = Form(None),
    porte: str | None = Form(None),
    idade: str | None = Form(None),
    saude_critica: bool | None = Form(None),
    saude_detalhes: str | None = Form(None),
    cuidados_iniciais: str | None = Form(None),
    deficiencia: bool | None = Form(None),
    deficiencia_detalhes: str | None = Form(None),
    nivel_urgencia: str | None = Form(None),
    data_ocorrencia: datetime | None = Form(None),
    endereco_localizacao: str | None = Form(None),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    observacao: str | None = Form(None),
    foto: UploadFile | None = File(None),
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    resultado = await db.execute(
        select(
            Ocorrencia,
            ST_Y(Ocorrencia.localizacao).label("latitude"),
            ST_X(Ocorrencia.localizacao).label("longitude"),
        ).where(Ocorrencia.id_ocorrencia == id_ocorrencia)
    )
    linha = resultado.one_or_none()

    if linha is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ocorrência não encontrada.",
        )

    ocorrencia, latitude_atual, longitude_atual = linha
    _validar_proprietario(
        ocorrencia,
        conta_atual,
        "Você não tem permissão para alterar esta ocorrência.",
    )

    formulario = await request.form()
    campos_texto = {
        "tipo_ocorrencia": tipo_ocorrencia,
        "status_badge": status_badge,
        "tipo_animal": tipo_animal,
        "raca": raca,
        "sexo": sexo,
        "cor": cor,
        "porte": porte,
        "idade": idade,
        "saude_detalhes": saude_detalhes,
        "cuidados_iniciais": cuidados_iniciais,
        "deficiencia_detalhes": deficiencia_detalhes,
        "nivel_urgencia": nivel_urgencia,
        "endereco_localizacao": endereco_localizacao,
        "observacao": observacao,
    }

    try:
        for campo, valor in campos_texto.items():
            if campo in formulario:
                setattr(ocorrencia, campo, valor)

        if "saude_critica" in formulario:
            ocorrencia.saude_critica = bool(saude_critica)
        if "deficiencia" in formulario:
            ocorrencia.deficiencia = bool(deficiencia)
        if "data_ocorrencia" in formulario:
            ocorrencia.data_ocorrencia = data_ocorrencia

        localizacao_modificada = "latitude" in formulario or "longitude" in formulario
        if localizacao_modificada:
            nova_latitude = (
                latitude if "latitude" in formulario else float(latitude_atual)
            )
            nova_longitude = (
                longitude if "longitude" in formulario else float(longitude_atual)
            )
            if (
                nova_latitude is None
                or nova_longitude is None
                or not -90 <= nova_latitude <= 90
                or not -180 <= nova_longitude <= 180
            ):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Coordenadas inválidas.",
                )
            ponto_wkt = f"POINT({nova_longitude} {nova_latitude})"
            ocorrencia.localizacao = ST_GeomFromText(ponto_wkt, 4326)

        if foto is not None:
            ocorrencia.foto = await upload_foto_pet(
                foto,
                pasta="ocorrencias",
            )

        await db.commit()
        await db.refresh(ocorrencia)
    except Exception:
        await db.rollback()
        raise

    detalhe_resultado = await db.execute(
        select(
            Ocorrencia,
            ST_Y(Ocorrencia.localizacao).label("latitude"),
            ST_X(Ocorrencia.localizacao).label("longitude"),
        )
        .options(selectinload(Ocorrencia.avistamentos))
        .where(Ocorrencia.id_ocorrencia == id_ocorrencia)
    )
    ocorrencia_atualizada, latitude_atualizada, longitude_atualizada = (
        detalhe_resultado.one()
    )
    ocorrencia_atualizada.latitude = float(latitude_atualizada)
    ocorrencia_atualizada.longitude = float(longitude_atualizada)
    ocorrencia_atualizada.cuidados_atuais = await _carregar_cuidados_atuais(
        db,
        id_ocorrencia,
    )
    return ocorrencia_atualizada


@router.delete(
    "/{id_ocorrencia:int}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def excluir_ocorrencia(
    id_ocorrencia: int,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
) -> Response:
    ocorrencia = await db.get(Ocorrencia, id_ocorrencia)
    if ocorrencia is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ocorrência não encontrada.",
        )

    _validar_proprietario(
        ocorrencia,
        conta_atual,
        "Você não tem permissão para excluir esta ocorrência.",
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
                delete(modelo).where(modelo.id_ocorrencia == id_ocorrencia)
            )
        await db.execute(
            delete(Ocorrencia).where(Ocorrencia.id_ocorrencia == id_ocorrencia)
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{id_ocorrencia:int}", response_model=OcorrenciaDetalheResposta)
async def obter_ocorrencia_detalhada(
    id_ocorrencia: int, db: AsyncSession = Depends(get_db)
):
    query = (
        select(
            Ocorrencia,
            ST_Y(Ocorrencia.localizacao).label("latitude"),
            ST_X(Ocorrencia.localizacao).label("longitude"),
        )
        .options(selectinload(Ocorrencia.avistamentos))
        .where(Ocorrencia.id_ocorrencia == id_ocorrencia)
    )

    resultado = await db.execute(query)

    linha = resultado.one_or_none()

    if linha is None:
        raise HTTPException(status_code=404, detail="Ocorrência não encontrada.")

    ocorrencia, latitude, longitude = linha
    ocorrencia.latitude = float(latitude)
    ocorrencia.longitude = float(longitude)
    ocorrencia.cuidados_atuais = await _carregar_cuidados_atuais(
        db,
        id_ocorrencia,
    )
    return ocorrencia


@router.post(
    "/{id_ocorrencia:int}/cuidados",
    response_model=CuidadoOcorrenciaResposta,
    status_code=status.HTTP_201_CREATED,
)
async def registrar_cuidado(
    id_ocorrencia: int,
    dados: CuidadoOcorrenciaCriar,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    ocorrencia = await db.get(Ocorrencia, id_ocorrencia)
    if ocorrencia is None:
        raise HTTPException(status_code=404, detail="Ocorrência não encontrada.")

    agora = datetime.now(tz=dados.data_cuidado.tzinfo)
    if dados.data_cuidado > agora:
        raise HTTPException(
            status_code=422,
            detail="A data do cuidado não pode estar no futuro.",
        )

    novo_cuidado = HistoricoCuidadoOcorrencia(
        id_ocorrencia=id_ocorrencia,
        id_conta=conta_atual.id_conta,
        tipo_cuidado=dados.tipo_cuidado,
        data_cuidado=dados.data_cuidado,
    )
    try:
        db.add(novo_cuidado)
        await db.commit()
        await db.refresh(novo_cuidado)
    except Exception:
        await db.rollback()
        raise

    autor_resultado = await db.execute(
        select(
            func.coalesce(
                UsuarioFisico.nome_completo,
                ONG.nome_fantasia,
                Conta.email,
            )
        )
        .select_from(Conta)
        .outerjoin(UsuarioFisico, UsuarioFisico.id_conta == Conta.id_conta)
        .outerjoin(ONG, ONG.id_conta == Conta.id_conta)
        .where(Conta.id_conta == conta_atual.id_conta)
    )
    return _serializar_cuidado(novo_cuidado, autor_resultado.scalar_one())


@router.get(
    "/{id_ocorrencia:int}/cuidados/historico",
    response_model=list[CuidadoOcorrenciaResposta],
)
async def listar_historico_cuidados(
    id_ocorrencia: int,
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db),
):
    if await db.get(Ocorrencia, id_ocorrencia) is None:
        raise HTTPException(status_code=404, detail="Ocorrência não encontrada.")

    resultado = await db.execute(
        _query_cuidados_com_autor(id_ocorrencia).order_by(
            HistoricoCuidadoOcorrencia.data_registro.desc(),
            HistoricoCuidadoOcorrencia.id_historico.desc(),
        )
    )
    return [
        _serializar_cuidado(cuidado, nome_autor)
        for cuidado, nome_autor in resultado.all()
    ]
