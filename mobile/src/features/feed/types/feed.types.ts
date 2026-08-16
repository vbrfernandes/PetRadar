// ============================================================
// D:\PetRadar\src\mobile\src\features\feed\types\feed.types.ts
// ============================================================

export interface OcorrenciaFeed {
  id_ocorrencia: number;
  id_conta: number;

  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;

  foto: string;

  nivel_urgencia: string;
  data_ocorrencia: string;

  endereco_localizacao?:
  | string
  | null;

  observacao?:
  | string
  | null;

  latitude: number;
  longitude: number;

  distancia_km?:
  | number
  | null;

  autor_nome?:
  | string
  | null;

  autor_foto?:
  | string
  | null;

  total_forca?: number;
  total_comentarios?: number;

  usuario_deu_forca?: boolean;
}
