import { useCallback, useEffect, useRef, useState } from "react";

import { occurrenceCareService } from "../services/occurrenceCareService";
import type {
  CuidadoOcorrencia,
  OcorrenciaDetalhe,
  TipoCuidado,
} from "../types/occurrenceDetail.types";
import { mensagemErroApi } from "../utils/occurrenceErrors";
import { formatarDataHoraParaApi } from "../utils/occurrenceFormatters";

interface UseOccurrenceCareParams {
  visible: boolean;
  occurrenceId: number | null;
  occurrence: OcorrenciaDetalhe | null;
  setOccurrence: React.Dispatch<React.SetStateAction<OcorrenciaDetalhe | null>>;
}

export function useOccurrenceCare({
  visible,
  occurrenceId,
  occurrence,
  setOccurrence,
}: UseOccurrenceCareParams) {
  const cuidadoEmRegistro = useRef(false);
  const [tipoCuidadoCarregando, setTipoCuidadoCarregando] =
    useState<TipoCuidado | null>(null);
  const [erroCuidado, setErroCuidado] = useState<string | null>(null);
  const [historicoVisivel, setHistoricoVisivel] = useState(false);
  const [historico, setHistorico] = useState<CuidadoOcorrencia[] | null>(null);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [erroHistorico, setErroHistorico] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || occurrenceId === null) {
      return;
    }
    cuidadoEmRegistro.current = false;
    setTipoCuidadoCarregando(null);
    setErroCuidado(null);
    setHistoricoVisivel(false);
    setHistorico(null);
    setCarregandoHistorico(false);
    setErroHistorico(null);
  }, [visible, occurrenceId]);

  const registrarCuidadoAgora = useCallback(
    async (tipo: TipoCuidado) => {
      if (!occurrence || cuidadoEmRegistro.current) {
        return;
      }

      cuidadoEmRegistro.current = true;
      try {
        setTipoCuidadoCarregando(tipo);
        setErroCuidado(null);
        const response = await occurrenceCareService.register(
          occurrence.id_ocorrencia,
          {
            tipo_cuidado: tipo,
            data_cuidado: formatarDataHoraParaApi(),
          },
        );
        const novoCuidado = response.data;
        const chave = tipo === "AGUA" ? "agua" : "comida";

        setOccurrence((atual) =>
          atual
            ? {
                ...atual,
                cuidados_atuais: {
                  ...atual.cuidados_atuais,
                  [chave]: novoCuidado,
                },
              }
            : atual,
        );
        setHistorico((atual) => (atual ? [novoCuidado, ...atual] : atual));
      } catch (err: unknown) {
        const cuidado = tipo === "AGUA" ? "a água" : "a comida";
        setErroCuidado(
          mensagemErroApi(err, `Não foi possível registrar ${cuidado}.`),
        );
      } finally {
        cuidadoEmRegistro.current = false;
        setTipoCuidadoCarregando(null);
      }
    },
    [occurrence, setOccurrence],
  );

  const carregarHistorico = useCallback(async () => {
    if (!occurrence || carregandoHistorico) {
      return;
    }

    try {
      setCarregandoHistorico(true);
      setErroHistorico(null);
      const response = await occurrenceCareService.getHistory(
        occurrence.id_ocorrencia,
      );
      setHistorico(response.data);
    } catch (err: unknown) {
      setErroHistorico(
        mensagemErroApi(err, "Não foi possível carregar o histórico."),
      );
    } finally {
      setCarregandoHistorico(false);
    }
  }, [carregandoHistorico, occurrence]);

  const abrirHistorico = useCallback(() => {
    setHistoricoVisivel(true);
    if (historico === null) {
      void carregarHistorico();
    }
  }, [carregarHistorico, historico]);

  const limparCuidados = useCallback(() => {
    cuidadoEmRegistro.current = false;
    setTipoCuidadoCarregando(null);
    setErroCuidado(null);
    setHistoricoVisivel(false);
    setHistorico(null);
    setCarregandoHistorico(false);
    setErroHistorico(null);
  }, []);

  return {
    tipoCuidadoCarregando,
    erroCuidado,
    historicoVisivel,
    setHistoricoVisivel,
    historico,
    carregandoHistorico,
    erroHistorico,
    registrarCuidadoAgora,
    carregarHistorico,
    abrirHistorico,
    limparCuidados,
  };
}
