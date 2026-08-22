import { useCallback, useState } from "react";

import * as Location from "expo-location";

import { occurrenceService } from "../../occurrences/services/occurrenceService";
import type {
  ModoProcuraSe,
  OcorrenciaProcuraSe,
  ProcuraSeLoadingMode,
} from "../types/procurase.types";
import { filterProcuraSeBaseOccurrences } from "../utils/procuraseFilters";

interface UseProcuraSeParams {
  carregarPerfil: () => Promise<number>;
}

export function useProcuraSe({ carregarPerfil }: UseProcuraSeParams) {
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaProcuraSe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localizacaoNegada, setLocalizacaoNegada] = useState(false);

  const carregarFeed = useCallback(
    async (
      loadingMode: ProcuraSeLoadingMode = "normal",
      selectedMode: ModoProcuraSe = "PROXIMIDADE",
    ) => {
      if (loadingMode === "refresh") {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const currentRadius = await carregarPerfil();
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocalizacaoNegada(true);
          setOcorrencias([]);
          return;
        }

        setLocalizacaoNegada(false);

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const response =
          await occurrenceService.getNearby<OcorrenciaProcuraSe>({
            lat: currentLocation.coords.latitude,
            lng: currentLocation.coords.longitude,
            raio_km: currentRadius,
            modo: selectedMode === "ECO" ? "eco" : "proximidade",
          });

        const data = Array.isArray(response.data) ? response.data : [];

        setOcorrencias(filterProcuraSeBaseOccurrences(data));
      } catch (loadError: unknown) {
        console.warn(
          "[ProcuraSeScreen] Erro ao carregar feed:",
          loadError,
        );

        setOcorrencias([]);
        setError(
          selectedMode === "ECO"
            ? "Não foi possível carregar as ocorrências do modo Eco."
            : "Não foi possível carregar as ocorrências próximas.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [carregarPerfil],
  );

  const removerOcorrencia = useCallback((occurrenceId: number) => {
    setOcorrencias((currentOccurrences) =>
      currentOccurrences.filter(
        (occurrence) => occurrence.id_ocorrencia !== occurrenceId,
      ),
    );
  }, []);

  const atualizarEco = useCallback(
    (occurrenceId: number, active: boolean, total: number) => {
      setOcorrencias((currentOccurrences) =>
        currentOccurrences.map((occurrence) => {
          if (occurrence.id_ocorrencia !== occurrenceId) {
            return occurrence;
          }

          return {
            ...occurrence,
            usuario_deu_forca: Boolean(active),
            total_forca: Math.max(0, Number(total) || 0),
          };
        }),
      );
    },
    [],
  );

  return {
    ocorrencias,
    loading,
    refreshing,
    error,
    localizacaoNegada,
    carregarFeed,
    removerOcorrencia,
    atualizarEco,
  };
}
