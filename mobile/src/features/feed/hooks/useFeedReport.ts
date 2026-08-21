import { useCallback, useState } from "react";
import { Alert } from "react-native";

import api from "../../../core/api";

export function useFeedReport() {
  const [denunciaOccurrenceId, setDenunciaOccurrenceId] = useState<
    number | null
  >(null);
  const [enviandoDenuncia, setEnviandoDenuncia] = useState(false);

  const abrirOpcoesOcorrencia = useCallback((occurrenceId: number) => {
    setDenunciaOccurrenceId(occurrenceId);
  }, []);

  const fecharDenuncia = useCallback(() => {
    if (enviandoDenuncia) {
      return;
    }

    setDenunciaOccurrenceId(null);
  }, [enviandoDenuncia]);

  const enviarDenuncia = useCallback(
    async (motivo: string) => {
      if (denunciaOccurrenceId === null || enviandoDenuncia) {
        return;
      }

      setEnviandoDenuncia(true);

      try {
        await api.post(
          `/ocorrencias/${denunciaOccurrenceId}/denuncias`,
          { motivo },
        );
        setDenunciaOccurrenceId(null);
        Alert.alert(
          "Denúncia enviada",
          "Obrigado. A ocorrência foi sinalizada para análise.",
        );
      } catch (err: unknown) {
        console.warn("[FeedNoticias] Erro ao denunciar ocorrência:", err);
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
    abrirOpcoesOcorrencia,
    fecharDenuncia,
    enviarDenuncia,
  };
}
