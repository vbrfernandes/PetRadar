import { useCallback, useState } from "react";

import { occurrenceService } from "../../occurrences/services/occurrenceService";
import type { OcorrenciaResumo } from "../../occurrences/types/occurrence.types";
import { getProfileErrorContext } from "../utils/profileErrors";

export function useProfileOccurrences() {
  const [minhasOcorrencias, setMinhasOcorrencias] = useState<
    OcorrenciaResumo[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarOcorrencias = useCallback(async () => {
    try {
      const response = await occurrenceService.getMine();

      setMinhasOcorrencias(
        Array.isArray(response.data) ? response.data : [],
      );
    } catch (error: unknown) {
      const errorContext = getProfileErrorContext(error);

      console.error(
        "[ProfileDetailScreen] Erro ao carregar ocorrências:",
        errorContext.status,
        errorContext.details,
      );

      setMinhasOcorrencias([]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return {
    minhasOcorrencias,
    refreshing,
    carregarOcorrencias,
  };
}
