import { useCallback, useRef, useState } from "react";

import { Alert } from "react-native";

import { procuraseService } from "../services/procuraseService";

interface UseProcuraSeEcoParams {
  onEcoUpdated: (
    occurrenceId: number,
    active: boolean,
    total: number,
  ) => void;
}

export function useProcuraSeEco({
  onEcoUpdated,
}: UseProcuraSeEcoParams) {
  const [ecosEmAndamento, setEcosEmAndamento] = useState<Set<number>>(
    () => new Set<number>(),
  );
  const ecosEmAndamentoRef = useRef<Set<number>>(new Set<number>());

  const alternarEco = useCallback(
    async (occurrenceId: number) => {
      if (ecosEmAndamentoRef.current.has(occurrenceId)) {
        return;
      }

      ecosEmAndamentoRef.current.add(occurrenceId);
      setEcosEmAndamento(new Set(ecosEmAndamentoRef.current));

      try {
        const response = await procuraseService.toggleEco(occurrenceId);
        const { ativo, total_forca } = response.data;

        onEcoUpdated(occurrenceId, ativo, total_forca);
      } catch (error: unknown) {
        console.warn(
          "[ProcuraSeScreen] Erro ao atualizar Eco:",
          error,
        );

        Alert.alert(
          "Não foi possível atualizar",
          "Tente Ecoar novamente em alguns instantes.",
        );
      } finally {
        ecosEmAndamentoRef.current.delete(occurrenceId);
        setEcosEmAndamento(new Set(ecosEmAndamentoRef.current));
      }
    },
    [onEcoUpdated],
  );

  return {
    ecosEmAndamento,
    alternarEco,
  };
}
