from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, status, HTTPException
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
from app.modules.auth.models import Conta
from app.modules.ocorrencias.models import (
    Ocorrencia,
)
from app.modules.ocorrencias.schemas import (
    OcorrenciaResposta,
    OcorrenciaDetalheResposta,
)
from datetime import datetime
from sqlalchemy import cast
from geoalchemy2 import Geography

router = APIRouter()

@router.post("/", response_model=OcorrenciaResposta, status_code=status.HTTP_201_CREATED)
async def criar_ocorrencia(
    tipo_ocorrencia: str = Form(...),
    status_badge: str = Form(...),
    tipo_animal: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    foto: UploadFile = File(...),
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
        raise HTTPException(status_code=422, detail="Coordenadas inválidas.")

    url_foto = await upload_foto_pet(foto, pasta="ocorrencias")
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
    return nova_ocorrencia

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

@router.get(
    "/{id_ocorrencia:int}",
    response_model=OcorrenciaDetalheResposta
)
async def obter_ocorrencia_detalhada(
    id_ocorrencia: int,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Ocorrencia)
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

    ocorrencia = resultado.scalar_one_or_none()

    if ocorrencia is None:
        raise HTTPException(
            status_code=404,
            detail="Ocorrência não encontrada."
        )

    return ocorrencia
