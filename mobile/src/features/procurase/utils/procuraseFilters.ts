import type {
  FiltroProcuraSe,
  ModoProcuraSe,
  OcorrenciaProcuraSe,
} from "../types/procurase.types";
import {
  ehUrgente,
  normalizarTexto,
} from "./procurase.utils";

export function filterProcuraSeBaseOccurrences(
  occurrences: OcorrenciaProcuraSe[],
) {
  return occurrences.filter((occurrence) => {
    const hasValidCoordinates =
      Number.isFinite(Number(occurrence.latitude)) &&
      Number.isFinite(Number(occurrence.longitude));

    if (!hasValidCoordinates) {
      return false;
    }

    const occurrenceType = normalizarTexto(occurrence.tipo_ocorrencia);

    return (
      occurrenceType === "pet_perdido" ||
      occurrenceType === "pet_avistado"
    );
  });
}

export function filterProcuraSeOccurrences(
  occurrences: OcorrenciaProcuraSe[],
  search: string,
  filter: FiltroProcuraSe,
  mode: ModoProcuraSe,
) {
  const normalizedSearch =
    mode === "PROXIMIDADE" ? normalizarTexto(search) : "";

  return occurrences.filter((occurrence) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        occurrence.tipo_animal,
        occurrence.tipo_ocorrencia,
        occurrence.status_badge,
        occurrence.nivel_urgencia,
        occurrence.endereco_localizacao,
        occurrence.observacao,
        occurrence.autor_nome,
      ].some((value) =>
        normalizarTexto(value).includes(normalizedSearch),
      );

    if (!matchesSearch) {
      return false;
    }

    const status = normalizarTexto(occurrence.status_badge);

    switch (filter) {
      case "PERDIDOS":
        return status.includes("perdid");

      case "AVISTADOS":
        return status.includes("avist");

      case "URGENTES":
        return ehUrgente(occurrence.nivel_urgencia);

      case "TODAS":
      default:
        return true;
    }
  });
}
