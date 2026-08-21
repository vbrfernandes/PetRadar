import { useCallback, useRef, useState } from "react";
import * as Location from "expo-location";

import api from "../../../services/api";
import { occurrenceService } from "../../occurrences/services/occurrenceService";
import type { ProfileUpdateResult } from "../../profile/types/profile.types";
import {
  DEFAULT_SEARCH_RADIUS_KM,
  MAX_SEARCH_RADIUS_KM,
  MIN_SEARCH_RADIUS_KM,
} from "../constants/feed.constants";
import type {
  FeedLoadingMode,
  ModoFeed,
  OcorrenciaFeed,
} from "../types/feed.types";

export function useFeed() {
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localizacaoNegada, setLocalizacaoNegada] = useState(false);
  const [raioPesquisaKm, setRaioPesquisaKm] = useState(
    DEFAULT_SEARCH_RADIUS_KM,
  );
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [modoFeed, setModoFeed] = useState<ModoFeed>("PROXIMIDADE");
  const modoFeedRef = useRef<ModoFeed>("PROXIMIDADE");

  const carregarFeed = useCallback(
    async (
      modo: FeedLoadingMode = "normal",
      modoSelecionado: ModoFeed = modoFeedRef.current,
    ) => {
      if (modo === "refresh") {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        let raioAtual = DEFAULT_SEARCH_RADIUS_KM;

        try {
          const profileResponse = await api.get("/auth/me");

          setProfilePhoto(profileResponse.data?.foto_perfil ?? null);

          const raioRecebido = Number(
            profileResponse.data?.raio_pesquisa_km,
          );

          if (Number.isFinite(raioRecebido)) {
            raioAtual = Math.min(
              MAX_SEARCH_RADIUS_KM,
              Math.max(MIN_SEARCH_RADIUS_KM, raioRecebido),
            );
          }
        } catch (profileError: unknown) {
          console.warn(
            "[FeedNoticias] Não foi possível carregar o raio do perfil:",
            profileError,
          );
        }

        setRaioPesquisaKm(raioAtual);

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

        const response = await occurrenceService.getNearby<OcorrenciaFeed>({
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude,
          raio_km: raioAtual,
          modo: modoSelecionado === "ECO" ? "eco" : "proximidade",
        });

        const dados = Array.isArray(response.data) ? response.data : [];
        const ocorrenciasValidas = dados.filter(
          (occurrence) =>
            Number.isFinite(Number(occurrence.latitude)) &&
            Number.isFinite(Number(occurrence.longitude)),
        );

        setOcorrencias(ocorrenciasValidas);
      } catch (err: unknown) {
        console.warn("[FeedNoticias] Erro ao carregar feed:", err);
        setOcorrencias([]);
        setError(
          modoSelecionado === "ECO"
            ? "Não foi possível carregar as ocorrências do modo Eco."
            : "Não foi possível carregar as ocorrências próximas.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const selecionarModoFeed = useCallback(
    (novoModo: ModoFeed) => {
      if (modoFeedRef.current === novoModo || refreshing) {
        return;
      }

      modoFeedRef.current = novoModo;
      setModoFeed(novoModo);
      void carregarFeed("refresh", novoModo);
    },
    [carregarFeed, refreshing],
  );

  const handleProfileUpdated = useCallback(
    (updatedProfile: ProfileUpdateResult) => {
      if (updatedProfile.foto_perfil !== undefined) {
        setProfilePhoto(updatedProfile.foto_perfil ?? null);
      }

      void carregarFeed();
    },
    [carregarFeed],
  );

  const removerOcorrencia = useCallback((occurrenceId: number) => {
    setOcorrencias((atuais) =>
      atuais.filter(
        (occurrence) => occurrence.id_ocorrencia !== occurrenceId,
      ),
    );
  }, []);

  return {
    ocorrencias,
    setOcorrencias,
    loading,
    refreshing,
    error,
    localizacaoNegada,
    raioPesquisaKm,
    profilePhoto,
    modoFeed,
    carregarFeed,
    selecionarModoFeed,
    handleProfileUpdated,
    removerOcorrencia,
  };
}
