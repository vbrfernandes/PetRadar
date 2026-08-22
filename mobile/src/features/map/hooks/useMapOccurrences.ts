import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";

import { occurrenceService } from "../../occurrences/services/occurrenceService";
import type {
  OcorrenciaMapa,
  RecarregarListaOcorrencias,
  TipoOcorrenciaFiltro,
  UrgenciaFiltro,
} from "../types/map.types";
import {
  coordenadasOcorrenciaSaoValidas,
  filtrarOcorrenciasMapa,
} from "../utils/map.utils";

interface UseMapOccurrencesParams {
  userLocation: Location.LocationObject | null;
  raioPesquisaKm: number;
  perfilMapaCarregado: boolean;
  obterLocalizacaoInicial: () => Promise<void>;
}

export const useMapOccurrences = ({
  userLocation,
  raioPesquisaKm,
  perfilMapaCarregado,
  obterLocalizacaoInicial,
}: UseMapOccurrencesParams) => {
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] =
    useState<TipoOcorrenciaFiltro>("Todas");
  const [urgenciaFiltro, setUrgenciaFiltro] =
    useState<UrgenciaFiltro>("Todas");
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaMapa[]>([]);
  const [loadingOcorrencias, setLoadingOcorrencias] = useState(false);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    number | null
  >(null);
  const raioPesquisaKmRef = useRef(raioPesquisaKm);
  const recarregarListaOrigemRef = useRef<RecarregarListaOcorrencias | null>(
    null,
  );

  useEffect(() => {
    raioPesquisaKmRef.current = raioPesquisaKm;
  }, [raioPesquisaKm]);

  const ocorrenciasVisiveis = useMemo(
    () =>
      filtrarOcorrenciasMapa(
        ocorrencias,
        search,
        tipoFiltro,
        urgenciaFiltro,
      ),
    [ocorrencias, search, tipoFiltro, urgenciaFiltro],
  );

  const abrirDetalheOcorrencia = useCallback(
    (occurrenceId: number, recarregarLista?: RecarregarListaOcorrencias) => {
      recarregarListaOrigemRef.current = recarregarLista ?? null;
      setSelectedOccurrenceId(occurrenceId);
    },
    [],
  );

  const carregarOcorrenciasProximas = useCallback(
    async (latitude: number, longitude: number, raioKm: number) => {
      try {
        setLoadingOcorrencias(true);

        const response = await occurrenceService.getNearby<OcorrenciaMapa>({
          lat: latitude,
          lng: longitude,
          raio_km: raioKm,
        });

        const dados = Array.isArray(response.data) ? response.data : [];
        const ocorrenciasValidas = dados.filter(coordenadasOcorrenciaSaoValidas);

        setOcorrencias(ocorrenciasValidas);
      } catch (error) {
        console.warn("Erro ao carregar ocorrências próximas:", error);
        setOcorrencias([]);
      } finally {
        setLoadingOcorrencias(false);
      }
    },
    [],
  );

  const recarregarOcorrenciasNoMapa = useCallback(async () => {
    if (userLocation) {
      await carregarOcorrenciasProximas(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        raioPesquisaKmRef.current,
      );
      return;
    }

    await obterLocalizacaoInicial();
  }, [carregarOcorrenciasProximas, obterLocalizacaoInicial, userLocation]);

  const handleOccurrenceDeleted = useCallback(
    async (occurrenceId: number) => {
      setOcorrencias((atuais) =>
        atuais.filter(
          (ocorrencia) => ocorrencia.id_ocorrencia !== occurrenceId,
        ),
      );

      const recarregarListaOrigem = recarregarListaOrigemRef.current;
      recarregarListaOrigemRef.current = null;

      const atualizacoes: Promise<unknown>[] = [recarregarOcorrenciasNoMapa()];
      if (recarregarListaOrigem) {
        atualizacoes.push(Promise.resolve().then(recarregarListaOrigem));
      }

      await Promise.allSettled(atualizacoes);
    },
    [recarregarOcorrenciasNoMapa],
  );

  useFocusEffect(
    useCallback(() => {
      if (!perfilMapaCarregado) {
        return;
      }

      const atualizarMapa = async () => {
        await recarregarOcorrenciasNoMapa();

        const recarregarListaOrigem = recarregarListaOrigemRef.current;
        if (recarregarListaOrigem) {
          recarregarListaOrigemRef.current = null;
          await recarregarListaOrigem();
        }
      };

      void atualizarMapa();
    }, [perfilMapaCarregado, recarregarOcorrenciasNoMapa]),
  );

  return {
    search,
    setSearch,
    tipoFiltro,
    setTipoFiltro,
    urgenciaFiltro,
    setUrgenciaFiltro,
    ocorrenciasVisiveis,
    loadingOcorrencias,
    selectedOccurrenceId,
    setSelectedOccurrenceId,
    abrirDetalheOcorrencia,
    carregarOcorrenciasProximas,
    handleOccurrenceDeleted,
  };
};
