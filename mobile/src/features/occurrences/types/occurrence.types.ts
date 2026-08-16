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
