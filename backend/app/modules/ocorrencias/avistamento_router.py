from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from geoalchemy2.functions import ST_GeomFromText
from app.core.database import get_db
from app.core.deps import obter_conta_atual
from app.core.cloudinary import upload_foto_pet
from app.modules.auth.models import Conta
from app.modules.ocorrencias.models import Avistamento

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def registrar_avistamento(
    id_ocorrencia: int = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    eh_de_raca: bool = Form(False),
    raca: str | None = Form(None),
    observacao: str | None = Form(None),
    foto: UploadFile | None = File(None),
    conta_atual: Conta = Depends(obter_conta_atual),
    db: AsyncSession = Depends(get_db)
):
    url_foto = None
    if foto:
        url_foto = await upload_foto_pet(foto, pasta="avistamentos")

    ponto_wkt = f"POINT({longitude} {latitude})"

    novo_avistamento = Avistamento(
        id_ocorrencia=id_ocorrencia,
        id_conta=conta_atual.id_conta,
        eh_de_raca=eh_de_raca,
        raca=raca,
        localizacao=ST_GeomFromText(ponto_wkt, 4326),
        foto=url_foto,
        observacao=observacao
    )

    db.add(novo_avistamento)
    await db.commit()
    await db.refresh(novo_avistamento)

    return {"status": "sucesso", "id_avistamento": novo_avistamento.id_avistamento}