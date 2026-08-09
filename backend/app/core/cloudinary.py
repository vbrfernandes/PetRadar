import cloudinary
import cloudinary.uploader
import asyncio
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

async def upload_foto_pet(arquivo: UploadFile, pasta: str = "ocorrencias") -> str:
    tipos_permitidos = {"image/jpeg", "image/png", "image/webp"}
    tamanho_maximo = 10 * 1024 * 1024
    if arquivo.content_type not in tipos_permitidos:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Formato de imagem não suportado.")
    if arquivo.size is not None and arquivo.size > tamanho_maximo:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="A imagem excede o limite de 10 MB.")

    try:
        conteudo = await arquivo.read()
        if len(conteudo) > tamanho_maximo:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="A imagem excede o limite de 10 MB.")
        resultado = await asyncio.to_thread(
            cloudinary.uploader.upload,
            conteudo,
            folder=f"petradar/{pasta}",
            transformation=[
                {"width": 1080, "height": 1080, "crop": "limit"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )
        url = resultado.get("secure_url")
        if not url:
            raise RuntimeError("Cloudinary não retornou uma URL segura.")
        return url
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível enviar a imagem. Tente novamente."
        )
