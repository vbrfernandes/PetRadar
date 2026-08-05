from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.ocorrencias.router import router as ocorrencias_router
from app.modules.ocorrencias.avistamento_router import router as avistamento_router
from app.modules.pets.router import router as pets_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Healthcheck"])
async def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Autenticação"])
app.include_router(ocorrencias_router, prefix=f"{settings.API_V1_STR}/ocorrencias", tags=["Ocorrências"])
app.include_router(avistamento_router, prefix=f"{settings.API_V1_STR}/avistamentos", tags=["Avistamentos"])
app.include_router(pets_router, prefix=f"{settings.API_V1_STR}/pets", tags=["Pets"])