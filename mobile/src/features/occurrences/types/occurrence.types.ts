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
