import type {
  TipoOcorrenciaFiltro,
  UrgenciaFiltro,
} from "../types/map.types";

export const MAPBOX_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const INITIAL_COORDINATE: [number, number] = [-43.9345, -19.9167];

export const INITIAL_ZOOM = 14;

export const MIN_SEARCH_RADIUS_KM = 1;
export const MAX_SEARCH_RADIUS_KM = 100;
export const DEFAULT_SEARCH_RADIUS_KM = 10;

export const TIPO_OCORRENCIA_FILTER_OPTIONS: readonly TipoOcorrenciaFiltro[] = [
  "Todas",
  "Perdidos",
  "Avistados",
];

export const URGENCIA_FILTER_OPTIONS: readonly UrgenciaFiltro[] = [
  "Todas",
  "Alta",
  "Moderada",
  "Baixa",
];
