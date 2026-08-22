import { useCallback, useState } from "react";

import { Alert } from "react-native";

import { profileService } from "../services/profileService";
import type { UserProfile } from "../types/profile.types";
import {
  getProfileErrorContext,
  getProfileErrorMessage,
} from "../utils/profileErrors";

type AfterProfileLoaded = (
  profile: UserProfile,
) => void | Promise<void>;

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const carregarPerfil = useCallback(
    async (afterProfileLoaded?: AfterProfileLoaded) => {
      setLoading(true);

      try {
        let loadedProfile: UserProfile;

        try {
          const response = await profileService.getProfile();
          loadedProfile = response.data;
          setProfile(loadedProfile);
        } catch (error: unknown) {
          const errorContext = getProfileErrorContext(error);

          console.error(
            "[ProfileDetailScreen] Erro ao carregar perfil:",
            errorContext.status,
            errorContext.details,
          );

          Alert.alert(
            "Não foi possível carregar seu perfil",
            getProfileErrorMessage(
              error,
              "Não foi possível obter seus dados. Verifique sua conexão e tente novamente.",
            ),
          );
          return;
        }

        await afterProfileLoaded?.(loadedProfile);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const atualizarProfile = useCallback((updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  }, []);

  const atualizarFoto = useCallback((photo: string) => {
    setProfile((currentProfile) =>
      currentProfile
        ? {
            ...currentProfile,
            foto_perfil: photo,
          }
        : currentProfile,
    );
  }, []);

  return {
    profile,
    loading,
    carregarPerfil,
    atualizarProfile,
    atualizarFoto,
  };
}
