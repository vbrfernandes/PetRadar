from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UsuarioFisicoCriar(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=6)
    telefone: str | None = None
    nome_completo: str
    cpf: str
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

class UsuarioResposta(BaseModel):
    id_conta: int
    email: EmailStr
    name: str
    tipo_conta: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UsuarioResposta

class PerfilAtualizacao(BaseModel):
    nome: str | None = None  # nome_completo (Pessoa Física) ou nome_fantasia (ONG)
    telefone: str | None = None
    raio_pesquisa_km: int | None = None
    endereco_completo: str | None = None  
    tem_pet: bool | None = None

class PerfilDetalhadoResposta(BaseModel):
    id_conta: int
    email: EmailStr
    tipo_conta: str
    telefone: str | None = None
    foto_perfil: str | None = None
    data_cadastro: datetime
    
    # Se Pessoa Física
    nome_completo: str | None = None
    tem_pet: bool | None = None
    raio_pesquisa_km: int | None = None
    
    # Se ONG
    cnpj: str | None = None
    razao_social: str | None = None
    nome_fantasia: str | None = None
    endereco_completo: str | None = None
    nome_gestor: str | None = None
    cpf_gestor: str | None = None

    class Config:
        from_attributes = True