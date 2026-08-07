from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UsuarioFisicoCriar(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=6)
    telefone: str | None = None
    nome_completo: str
    tem_pet: bool = False
    raio_pesquisa_km: int = 10
    localizacao_lat: float | None = None
    localizacao_lng: float | None = None

class ONGCriar(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=6)
    telefone: str
    cnpj: str
    razao_social: str
    nome_fantasia: str
    endereco_completo: str
    nome_gestor: str
    cpf_gestor: str
    oferece_lar_temporario: bool = False
    vagas_emergenciais: bool = False
    capacidade_total: int | None = None
    lotacao_atual: int | None = None
    link_prestacao_contas: str | None = None
    localizacao_lat: float | None = None
    localizacao_lng: float | None = None

class LoginSchema(BaseModel):
    email: EmailStr
    senha: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ContaResposta(BaseModel):
    id_conta: int
    email: EmailStr
    tipo_conta: str
    data_cadastro: datetime

    class Config:
        from_attributes = True

class EsqueceuSenhaSolicitacao(BaseModel):
    email: EmailStr

class RedefinirSenha(BaseModel):
    email: EmailStr
    codigo_verificacao: str = Field(min_length=6, max_length=6)
    nova_senha: str = Field(min_length=6)