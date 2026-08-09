from pydantic import BaseModel
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

    deficiencia: bool = False
    deficiencia_detalhes: str | None = None

    nivel_urgencia: str
    data_ocorrencia: datetime

    endereco_localizacao: str | None = None

    foto: str
    observacao: str | None = None

    avistamentos: list[AvistamentoResposta] = []

    class Config:
        from_attributes = True