import { useCallback, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";

import api from "../../../core/api";
import type { ForcaResponse, OcorrenciaFeed } from "../types/feed.types";

export function useFeedEco(
  setOcorrencias: Dispatch<SetStateAction<OcorrenciaFeed[]>>,
) {
  const [forcasEmAndamento, setForcasEmAndamento] = useState<Set<number>>(
    () => new Set<number>(),
  );
  const forcasEmAndamentoRef = useRef<Set<number>>(new Set<number>());

  const alternarForca = useCallback(async (occurrenceId: number) => {
    if (forcasEmAndamentoRef.current.has(occurrenceId)) {
      return;
    }

    forcasEmAndamentoRef.current.add(occurrenceId);
    setForcasEmAndamento(new Set(forcasEmAndamentoRef.current));

    try {
      const response = await api.post<ForcaResponse>(
        `/ocorrencias/${occurrenceId}/forca`,
      );
      const { ativo, total_forca } = response.data;

      setOcorrencias((atuais) =>
        atuais.map((occurrence) => {
          if (occurrence.id_ocorrencia !== occurrenceId) {
            return occurrence;
          }

          return {
            ...occurrence,
            usuario_deu_forca: Boolean(ativo),
            total_forca: Math.max(0, Number(total_forca) || 0),
          };
        }),
      );
    } catch (err: unknown) {
      console.warn("[FeedNoticias] Erro ao atualizar Eco:", err);
      Alert.alert(
        "Não foi possível atualizar",
        "Tente Ecoar novamente em alguns instantes.",
      );
    } finally {
      forcasEmAndamentoRef.current.delete(occurrenceId);
      setForcasEmAndamento(new Set(forcasEmAndamentoRef.current));
    }
  }, []);

  return {
    forcasEmAndamento,
    alternarForca,
  };
}
