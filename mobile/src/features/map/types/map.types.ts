import type { OcorrenciaResumo } from "../../occurrences/types/occurrence.types";

export interface OcorrenciaMapa extends OcorrenciaResumo {
  id_conta: number;
  latitude: number;
  longitude: number;
}

export type RecarregarListaOcorrencias = () => void | Promise<void>;

export type TipoOcorrenciaFiltro = "Todas" | "Perdidos" | "Avistados";

export type UrgenciaFiltro = "Todas" | "Alta" | "Moderada" | "Baixa";
