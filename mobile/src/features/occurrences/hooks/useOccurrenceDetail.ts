import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { occurrenceService } from "../services/occurrenceService";
import type { OcorrenciaDetalhe } from "../types/occurrenceDetail.types";
import { mensagemErroApi } from "../utils/occurrenceErrors";

interface UseOccurrenceDetailParams {
  visible: boolean;
  occurrenceId: number | null;
}

export function useOccurrenceDetail({
  visible,
  occurrenceId,
}: UseOccurrenceDetailParams) {
  const exclusaoEmAndamento = useRef(false);
  const [occurrence, setOccurrence] = useState<OcorrenciaDetalhe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    if (!visible || occurrenceId === null) {
      return;
    }

    let ativo = true;
    setLoading(true);
    setError(null);
    setOccurrence(null);
    setExcluindo(false);
    exclusaoEmAndamento.current = false;

    const carregarDetalhes = async () => {
      try {
        const response =
          await occurrenceService.getById<OcorrenciaDetalhe>(occurrenceId);
        if (ativo) {
          setOccurrence(response.data);
        }
      } catch (err: unknown) {
        console.warn("[OccurrenceDetailDrawer] Erro ao carregar ocorrência:", err);
        if (ativo) {
          setError(
            mensagemErroApi(
              err,
              "Não foi possível carregar os detalhes da ocorrência.",
            ),
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    };

    void carregarDetalhes();
    return () => {
      ativo = false;
    };
  }, [visible, occurrenceId]);

  const limparDetalhe = useCallback(() => {
    exclusaoEmAndamento.current = false;
    setOccurrence(null);
    setError(null);
    setLoading(false);
    setExcluindo(false);
  }, []);

  const excluirOcorrencia = useCallback(async (): Promise<number | null> => {
    if (!occurrence || exclusaoEmAndamento.current) {
      return null;
    }

    exclusaoEmAndamento.current = true;
    setExcluindo(true);
    const id = occurrence.id_ocorrencia;

    try {
      await occurrenceService.deleteById(id);
      return id;
    } catch (err: unknown) {
      exclusaoEmAndamento.current = false;
      setExcluindo(false);
      Alert.alert(
        "Não foi possível excluir",
        mensagemErroApi(
          err,
          "Não foi possível excluir a ocorrência. Tente novamente.",
        ),
      );
      return null;
    }
  }, [occurrence]);

  return {
    occurrence,
    setOccurrence,
    loading,
    error,
    excluindo,
    limparDetalhe,
    excluirOcorrencia,
  };
}
