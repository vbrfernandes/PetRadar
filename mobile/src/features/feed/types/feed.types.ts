// ============================================================
// D:\PetRadar\src\mobile\src\features\feed\types\feed.types.ts
// ============================================================

import type { OcorrenciaResumo } from "../../occurrences/types/occurrence.types";

export interface OcorrenciaFeed extends OcorrenciaResumo {
  id_conta: number;

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

export type FiltroFeed =
  | "TODAS"
  | "PERDIDOS"
  | "AVISTADOS"
  | "RUA"
  | "URGENTES";

export type ModoFeed =
  | "PROXIMIDADE"
  | "ECO";
