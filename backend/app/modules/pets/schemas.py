from pydantic import BaseModel

class PetBase(BaseModel):
    nome: str
    especie: str

    raca: str | None = None

    
    sexo: str | None = None

    
    cor: str | None = None

    porte: str | None = None

    
    idade: str | None = None

class PetCriar(PetBase):
    pass

class PetResposta(PetBase):
    id_pet: int
    id_usuario: int
    foto: str | None = None

    class Config:
        from_attributes = True