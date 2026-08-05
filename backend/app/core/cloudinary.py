import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

async def upload_foto_pet(arquivo: UploadFile, pasta: str = "ocorrencias") -> str:
    try:
        conteudo = await arquivo.read()
        resultado = cloudinary.uploader.upload(
            conteudo,
            folder=f"petradar/{pasta}",
            transformation=[
                {"width": 1080, "height": 1080, "crop": "limit"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )
        return resultado.get("secure_url")
    except Exception as erro:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao realizar upload da imagem: {str(erro)}"
        )