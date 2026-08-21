import { useCallback, useState } from "react";

import { profileService } from "../../profile/services/profileService";
import type { ProfileUpdateResult } from "../../profile/types/profile.types";
import { DEFAULT_SEARCH_RADIUS_KM } from "../constants/procurase.constants";
import { normalizarRaioPesquisa } from "../utils/procurase.utils";

export function useProcuraSeProfile() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [raioPesquisaKm, setRaioPesquisaKm] = useState(
    DEFAULT_SEARCH_RADIUS_KM,
  );

  const carregarPerfil = useCallback(async () => {
    let currentRadius = DEFAULT_SEARCH_RADIUS_KM;

    try {
      const response = await profileService.getProfile();

      setProfilePhoto(response.data?.foto_perfil ?? null);
      currentRadius = normalizarRaioPesquisa(
        response.data?.raio_pesquisa_km,
      );
    } catch (profileError) {
      console.warn(
        "[ProcuraSeScreen] Não foi possível carregar o raio do perfil:",
        profileError,
      );
    }

    setRaioPesquisaKm(currentRadius);
    return currentRadius;
  }, []);

  const aplicarAtualizacaoPerfil = useCallback(
    (updatedProfile: ProfileUpdateResult) => {
      if (updatedProfile.foto_perfil !== undefined) {
        setProfilePhoto(updatedProfile.foto_perfil ?? null);
      }
    },
    [],
  );

  return {
    profilePhoto,
    raioPesquisaKm,
    carregarPerfil,
    aplicarAtualizacaoPerfil,
  };
}
