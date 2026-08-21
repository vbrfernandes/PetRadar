import type {
  FiltroFeed,
  ModoFeed,
  OcorrenciaFeed,
} from "../types/feed.types";
import { ehUrgente, normalizarTexto } from "./feed.utils";

export function filtrarOcorrencias(
  ocorrencias: OcorrenciaFeed[],
  search: string,
  filtro: FiltroFeed,
  modoFeed: ModoFeed,
) {
  const termo =
    modoFeed === "PROXIMIDADE" ? normalizarTexto(search) : "";

  return ocorrencias.filter((occurrence) => {
    const correspondeBusca =
      !termo ||
      [
        occurrence.tipo_animal,
        occurrence.tipo_ocorrencia,
        occurrence.status_badge,
        occurrence.nivel_urgencia,
        occurrence.endereco_localizacao,
        occurrence.observacao,
        occurrence.autor_nome,
      ].some((valor) => normalizarTexto(valor).includes(termo));

    if (!correspondeBusca) {
      return false;
    }

    const status = normalizarTexto(occurrence.status_badge);

    switch (filtro) {
      case "PERDIDOS":
        return status.includes("perdid");

      case "AVISTADOS":
        return status.includes("avist");

      case "RUA":
        return (
          status.includes("rua") ||
          normalizarTexto(occurrence.tipo_ocorrencia).includes(
            "animal_de_rua",
          )
        );

      case "URGENTES":
        return ehUrgente(occurrence.nivel_urgencia);

      case "TODAS":
      default:
        return true;
    }
  });
}
