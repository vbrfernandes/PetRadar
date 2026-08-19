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
  