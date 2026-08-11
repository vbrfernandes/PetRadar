from typing import Literal
from pydantic import BaseModel, Field
from datetime import datetime

class OcorrenciaCriar(BaseModel):

    tipo_ocorrencia: str
    status_badge: str
    tipo_animal: str
    raca: str | None = None
    sexo: str | None = None
    cor: str | None = None
    porte: str | None = None
    idade: str | None = None
    saude_critica: bool = False
    saude_detalhes: str | None = None
    cuidados_iniciais: str | None = None
    deficiencia: bool = False
    deficiencia_detalhes: str | None = None
    nivel_urgencia: str = "Moderado"
    data_ocorrencia: datetime
    endereco_localizacao: str | None = None
    latitude: float
    longitude: float
    observacao: str | None = None

class OcorrenciaResposta(BaseModel):
    id_ocorrencia: int
    id_conta: int
    tipo_ocorrencia: str
    status_badge: str
    tipo_animal: str
    foto: str
    nivel_urgencia: str
    data_ocorrencia: datetime
    endereco_localizacao: str | None = None
    latitude: float
    longitude: float
    distancia_km: float | None = None

    class Config:
        from_attributes = True

class AvistamentoResposta(BaseModel):
    id_avistamento: int
    raca: str | None = None
    data_hora: datetime
    foto: str | None = None
    observacao: str | None = None

    class Config:
        from_attributes = True


class AutorCuidadoResposta(BaseModel):
    id_conta: int
    nome: str


class CuidadoOcorrenciaCriar(BaseModel):
    tipo_cuidado: Literal["AGUA", "COMIDA"]
    data_cuidado: datetime


class CuidadoOcorrenciaResposta(BaseModel):
    id_historico: int
    tipo_cuidado: Literal["AGUA", "COMIDA"]
    data_cuidado: datetime
    data_registro: datetime
    usuario: AutorCuidadoResposta


class EstadoCuidadosResposta(BaseModel):
    agua: CuidadoOcorrenciaResposta | None = None
    comida: CuidadoOcorrenciaResposta | None = None


class OcorrenciaDetalheResposta(BaseModel):
    id_ocorrencia: int
    id_conta: int

    tipo_ocorrencia: str
    status_badge: str
    tipo_animal: str

    raca: str | None = None
    sexo: str | None = None
    cor: str | None = None
    porte: str | None = None
    idade: str | None = None

    saude_critica: bool = False
    saude_detalhes: str | None = None

    cuidados_iniciais: str | None = None
    cuidados_atuais: EstadoCuidadosResposta = Field(
        default_factory=EstadoCuidadosResposta
    )

    deficiencia: bool = False
    deficiencia_detalhes: str | None = None

    nivel_urgencia: str
    data_ocorrencia: datetime

    endereco_localizacao: str | None = None
    latitude: float
    longitude: float

    foto: str
    observacao: str | None = None

    avistamentos: list[AvistamentoResposta] = []

    class Config:
        from_attributes = True
