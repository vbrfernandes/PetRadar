from fastapi import (
    APIRouter,
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

@router.post("/", response_model=OcorrenciaResposta, status_code=status.HTTP_201_CREATED)
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
    db: AsyncSession = Depends(get_db)
):
    if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
        raise HTTPException(
            status_code=422,
            detail="Coordenadas inválidas."
        )

    # =========================================================
    # FOTO DA OCORRÊNCIA
    # =========================================================

    url_foto: str | None = None

    # Foto nova enviada pelo usuário
    if foto is not None:
        url_foto = await upload_foto_pet(
            foto,
            pasta="ocorrencias"
        )

    # Reutilizar foto de um pet já cadastrado
    elif id_pet is not None:
        query_pet = (
            select(Pet)
            .join(
                UsuarioFisico,
                UsuarioFisico.id_usuario == Pet.id_usuario
            )
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
        observacao=observacao
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

@router.get(
    "/proximas",
    response_model=list[OcorrenciaResposta]
)
async def listar_ocorrencias_proximas(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    raio_km: float = Query(
        10.0,
        gt=0,
        le=100
    ),
    limite: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    """
    Retorna as ocorrências localizadas dentro do raio informado,
    em quilômetros, a partir da localização do usuário.

    A coluna localizacao é armazenada como Geometry SRID 4326.
    Para calcular distância corretamente em metros, a geometria
    é convertida para Geography antes do ST_DWithin.
    """

    # ---------------------------------------------------------
    # PONTO DA LOCALIZAÇÃO DO USUÁRIO
    # ---------------------------------------------------------

    ponto_usuario_geometry = ST_GeomFromText(
        f"POINT({lng} {lat})",
        4326
    )

    ponto_usuario_geography = cast(
        ponto_usuario_geometry,
        Geography(
            geometry_type="POINT",
            srid=4326
        )
    )

    # ---------------------------------------------------------
    # CONVERSÃO DO RAIO
    # ---------------------------------------------------------

    raio_metros = raio_km * 1000

    # ---------------------------------------------------------
    # LOCALIZAÇÃO DAS OCORRÊNCIAS COMO GEOGRAPHY
    # ---------------------------------------------------------

    ocorrencia_geography = cast(
        Ocorrencia.localizacao,
        Geography(
            geometry_type="POINT",
            srid=4326
        )
    )

    # ---------------------------------------------------------
    # CONSULTA ESPACIAL
    # ---------------------------------------------------------

    query = (
        select(
            Ocorrencia,
            ST_Y(
                Ocorrencia.localizacao
            ).label("latitude"),
            ST_X(
                Ocorrencia.localizacao
            ).label("longitude"),
        )
        .where(
            ST_DWithin(
                ocorrencia_geography,
                ponto_usuario_geography,
                raio_metros
            )
        )
        .order_by(
            Ocorrencia.data_ocorrencia.desc()
        )
        .limit(limite)
    )

    resultado = await db.execute(query)

    # ---------------------------------------------------------
    # FORMATAÇÃO DA RESPOSTA
    # ---------------------------------------------------------

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
                "endereco_localizacao": (
                    ocorrencia.endereco_localizacao
                ),
                "latitude": float(latitude),
                "longitude": float(longitude),
            }
        )

    return ocorrencias

@router.get("/minhas", response_model=list[OcorrenciaResposta])
async def listar_minhas_ocorrencias(
    conta_atual: Conta = Depends(obter_conta_atual),
    limite: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(
            Ocorrencia,
            ST_Y(Ocorrencia.localizacao).label("latitude"),
            ST_X(Ocorrencia.localizacao).label("longitude"),
        )
        .where(
            Ocorrencia.id_conta == conta_atual.id_conta
        )
        .order_by(
            Ocorrencia.data_ocorrencia.desc()
        )
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

        localizacao_modificada = (
            "latitude" in formulario or "longitude" in formulario
        )
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
            delete(Ocorrencia).where(
                Ocorrencia.id_ocorrencia == id_ocorrencia
            )
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{id_ocorrencia:int}",
    response_model=OcorrenciaDetalheResposta
)
async def obter_ocorrencia_detalhada(
    id_ocorrencia: int,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(
            Ocorrencia,
            ST_Y(Ocorrencia.localizacao).label("latitude"),
            ST_X(Ocorrencia.localizacao).label("longitude"),
        )
        .options(
            selectinload(
                Ocorrencia.avistamentos
            )
        )
        .where(
            Ocorrencia.id_ocorrencia
            == id_ocorrencia
        )
    )

    resultado = await db.execute(query)

    linha = resultado.one_or_none()

    if linha is None:
        raise HTTPException(
            status_code=404,
            detail="Ocorrência não encontrada."
        )

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
