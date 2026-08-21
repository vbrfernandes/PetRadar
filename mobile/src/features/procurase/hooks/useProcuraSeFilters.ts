import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  FiltroProcuraSe,
  ModoProcuraSe,
  OcorrenciaProcuraSe,
  ProcuraSeLoadingMode,
} from "../types/procurase.types";
import { filterProcuraSeOccurrences } from "../utils/procuraseFilters";

interface UseProcuraSeFiltersParams {
  ocorrencias: OcorrenciaProcuraSe[];
  refreshing: boolean;
  carregarFeed: (
    loadingMode?: ProcuraSeLoadingMode,
    selectedMode?: ModoProcuraSe,
  ) => Promise<void>;
}

export function useProcuraSeFilters({
  ocorrencias,
  refreshing,
  carregarFeed,
}: UseProcuraSeFiltersParams) {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<FiltroProcuraSe>("TODAS");
  const [modoProcuraSe, setModoProcuraSe] =
    useState<ModoProcuraSe>("PROXIMIDADE");
  const modoProcuraSeRef = useRef<ModoProcuraSe>("PROXIMIDADE");

  const selecionarModoProcuraSe = useCallback(
    (newMode: ModoProcuraSe) => {
      if (modoProcuraSeRef.current === newMode || refreshing) {
        return;
      }

      modoProcuraSeRef.current = newMode;
      setModoProcuraSe(newMode);

      void carregarFeed("refresh", newMode);
    },
    [carregarFeed, refreshing],
  );

  const getModoProcuraSeAtual = useCallback(
    () => modoProcuraSeRef.current,
    [],
  );

  const limparFiltros = useCallback(() => {
    setSearch("");
    setFiltro("TODAS");
  }, []);

  const ocorrenciasFiltradas = useMemo(
    () =>
      filterProcuraSeOccurrences(
        ocorrencias,
        search,
        filtro,
        modoProcuraSe,
      ),
    [ocorrencias, search, filtro, modoProcuraSe],
  );

  return {
    search,
    filtro,
    modoProcuraSe,
    ocorrenciasFiltradas,
    setSearch,
    setFiltro,
    selecionarModoProcuraSe,
    getModoProcuraSeAtual,
    limparFiltros,
  };
}
