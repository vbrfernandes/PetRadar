import { useMemo, useState } from "react";

import type {
  FiltroFeed,
  ModoFeed,
  OcorrenciaFeed,
} from "../types/feed.types";
import { filtrarOcorrencias } from "../utils/feedFilters";

export function useFeedFilters(
  ocorrencias: OcorrenciaFeed[],
  modoFeed: ModoFeed,
) {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<FiltroFeed>("TODAS");

  const ocorrenciasFiltradas = useMemo(
    () => filtrarOcorrencias(ocorrencias, search, filtro, modoFeed),
    [ocorrencias, search, filtro, modoFeed],
  );

  const limparFiltros = () => {
    setSearch("");
    setFiltro("TODAS");
  };

  return {
    search,
    setSearch,
    filtro,
    setFiltro,
    ocorrenciasFiltradas,
    limparFiltros,
  };
}
