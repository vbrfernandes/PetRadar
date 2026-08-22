import { useCallback, useEffect, useState } from "react";

import { profileService } from "../../profile/services/profileService";
import type { ProfileUpdateResult } from "../../profile/types/profile.types";
import { DEFAULT_SEARCH_RADIUS_KM } from "../constants/map.constants";
import { normalizarRaioPesquisaKm } from "../utils/map.utils";

export const useMapProfile = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [raioPesquisaKm, setRaioPesquisaKm] = useState<number>(
    DEFAULT_SEARCH_RADIUS_KM,
  );
  const [perfilMapaCarregado, setPerfilMapaCarregado] = useState(false);

  const carregarPerfilMapa = useCallback(async () => {
    try {
      const response = await profileService.getProfile();

      setProfilePhoto(response.data?.foto_perfil ?? null);
      setRaioPesquisaKm(
        normalizarRaioPesquisaKm(response.data?.raio_pesquisa_km),
      );
    } catch (error) {
      console.warn("Erro ao carregar perfil do mapa:", error);
    }
  }, []);

  useEffect(() => {
    void carregarPerfilMapa().finally(() => {
      setPerfilMapaCarregado(true);
    });
  }, [carregarPerfilMapa]);

  const aplicarPerfilAtualizado = useCallback(
    (updatedProfile: ProfileUpdateResult) => {
      const novoRaio = normalizarRaioPesquisaKm(
        updatedProfile.raio_pesquisa_km,
      );

      setRaioPesquisaKm(novoRaio);
      setProfilePhoto(updatedProfile.foto_perfil ?? null);

      return novoRaio;
    },
    [],
  );

  return {
    profilePhoto,
    raioPesquisaKm,
    perfilMapaCarregado,
    aplicarPerfilAtualizado,
  };
};
