import {
  DEFAULT_SEARCH_RADIUS_KM,
  MAX_SEARCH_RADIUS_KM,
  MIN_SEARCH_RADIUS_KM,
} from "../constants/map.constants";
import type {
  OcorrenciaMapa,
  TipoOcorrenciaFiltro,
  UrgenciaFiltro,
} from "../types/map.types";

export const normalizarRaioPesquisaKm = (valor: unknown): number => {
  if (valor === null || valor === undefined || valor === "") {
    return DEFAULT_SEARCH_RADIUS_KM;
  }

  const raioRecebido = Number(valor);

  return Number.isFinite(raioRecebido)
    ? Math.min(
        MAX_SEARCH_RADIUS_KM,
        Math.max(MIN_SEARCH_RADIUS_KM, raioRecebido),
      )
    : DEFAULT_SEARCH_RADIUS_KM;
};

export const filtrarOcorrenciasMapa = (
  ocorrencias: OcorrenciaMapa[],
  search: string,
  tipoFiltro: TipoOcorrenciaFiltro,
  urgenciaFiltro: UrgenciaFiltro,
): OcorrenciaMapa[] => {
  const termo = search.trim().toLocaleLowerCase();

  return ocorrencias.filter((ocorrencia) => {
    const correspondeBusca =
      !termo ||
      [
        ocorrencia.tipo_animal,
        ocorrencia.tipo_ocorrencia,
        ocorrencia.status_badge,
        ocorrencia.endereco_localizacao || "",
      ].some((valor) => valor.toLocaleLowerCase().includes(termo));
    const correspondeTipo =
      tipoFiltro === "Todas" ||
      (tipoFiltro === "Perdidos" &&
        ocorrencia.status_badge.toLocaleLowerCase().includes("perdid")) ||
      (tipoFiltro === "Avistados" &&
        ocorrencia.status_badge.toLocaleLowerCase().includes("avist"));
    const correspondeUrgencia =
      urgenciaFiltro === "Todas" ||
      ocorrencia.nivel_urgencia
        .toLocaleLowerCase()
        .startsWith(
          urgenciaFiltro.toLocaleLowerCase().replace("moderada", "moderad"),
        );

    return correspondeBusca && correspondeTipo && correspondeUrgencia;
  });
};

export const coordenadasOcorrenciaSaoValidas = (
  ocorrencia: OcorrenciaMapa,
): boolean =>
  Number.isFinite(Number(ocorrencia.latitude)) &&
  Number.isFinite(Number(ocorrencia.longitude));
