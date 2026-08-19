export type TipoOcorrencia =
  | "PET_PERDIDO"
  | "PET_AVISTADO"
  | "ANIMAL_DE_RUA";

export type TipoAnimal = "CACHORRO" | "GATO" | "OUTRO";

export interface OcorrenciaResumo {
  id_ocorrencia: number;
  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;
  foto: string;
  nivel_urgencia: string;
  data_ocorrencia: string;
  endereco_localizacao?: string | null;
}

export type TipoContaComentario =
  | "PESSOA_FISICA"
  | "ONG";

export interface AutorComentario {
  id_conta: number;
  nome: string;
  foto: string | null;
  tipo_conta: TipoContaComentario;
}

export interface ComentarioOcorrencia {
  id_comentario: number;
  id_ocorrencia: number;
  id_conta: number;

  id_comentario_pai: number | null;

  texto: string;
  data_hora: string;

  editado_em: string | null;
  excluido_em: string | null;

  autor: AutorComentario;
}

export interface CriarComentarioPayload {
  texto: string;
  id_comentario_pai?: number | null;
}

export interface AtualizarComentarioPayload {
  texto: string;
}

