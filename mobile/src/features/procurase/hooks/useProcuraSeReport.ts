import { useCallback, useState } from "react";

import { Alert } from "react-native";

import { procuraseService } from "../services/procuraseService";

export function useProcuraSeReport() {
  const [denunciaOccurrenceId, setDenunciaOccurrenceId] =
    useState<number | null>(null);
  const [enviandoDenuncia, setEnviandoDenuncia] = useState(false);

  const abrirDenuncia = useCallback((occurrenceId: number) => {
    setDenunciaOccurrenceId(occurrenceId);
  }, []);

  const fecharDenuncia = useCallback(() => {
    if (enviandoDenuncia) {
      return;
    }

    setDenunciaOccurrenceId(null);
  }, [enviandoDenuncia]);

  const enviarDenuncia = useCallback(
    async (reason: string) => {
      if (denunciaOccurrenceId === null || enviandoDenuncia) {
        return;
      }

      setEnviandoDenuncia(true);

      try {
        await procuraseService.reportOccurrence(
          denunciaOccurrenceId,
          reason,
        );

        setDenunciaOccurrenceId(null);

        Alert.alert(
          "Denúncia enviada",
          "Obrigado. A ocorrência foi sinalizada para análise.",
        );
      } catch (error: unknown) {
        console.warn(
          "[ProcuraSeScreen] Erro ao denunciar ocorrência:",
          error,
        );

        Alert.alert(
          "Não foi possível enviar",
          "Não conseguimos registrar a denúncia agora. Tente novamente em alguns instantes.",
        );
      } finally {
        setEnviandoDenuncia(false);
      }
    },
    [denunciaOccurrenceId, enviandoDenuncia],
  );

  return {
    denunciaOccurrenceId,
    enviandoDenuncia,
    abrirDenuncia,
    fecharDenuncia,
    enviarDenuncia,
  };
}
