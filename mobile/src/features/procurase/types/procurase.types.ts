// ============================================================
// D:\PetRadar\src\mobile\src\features\procurase\types\procurase.types.ts
// ============================================================

import type {
  OcorrenciaFeed,
} from "../../feed/types/feed.types";

export type OcorrenciaProcuraSe =
  OcorrenciaFeed;

export type FiltroProcuraSe =
  | "TODAS"
  | "PERDIDOS"
  | "AVISTADOS"
  | "URGENTES";

export type ModoProcuraSe =
  | "PROXIMIDADE"
  | "ECO";

export interface ProcuraSeEcoResponse {
  ativo: boolean;
  total_forca: number;
}

export type ProcuraSeLoadingMode =
  | "normal"
  | "refresh";

export type RecarregarListaOcorrencias =
  () => void | Promise<void>;
