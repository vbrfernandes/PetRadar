import { useCallback, useState } from "react";

import { Alert } from "react-native";

import { profileService } from "../services/profileService";
import type {
  ProfileFormValues,
  ProfileUpdateResult,
  UserProfile,
} from "../types/profile.types";
import { getProfileErrorMessage } from "../utils/profileErrors";
import {
  INITIAL_PROFILE_FORM_VALUES,
  profileFormToUpdatePayload,
  profileToFormValues,
} from "../utils/profileMappers";
import { validateProfileForm } from "../utils/profileValidation";

interface UseProfileFormParams {
  profile: UserProfile | null;
  onProfileChanged: (profile: UserProfile) => void;
  onProfileUpdated?: (profile: ProfileUpdateResult) => void;
}

export function useProfileForm({
  profile,
  onProfileChanged,
  onProfileUpdated,
}: UseProfileFormParams) {
  const [values, setValues] = useState<ProfileFormValues>(
    INITIAL_PROFILE_FORM_VALUES,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const setField = useCallback(
    <Field extends keyof ProfileFormValues>(
      field: Field,
      value: ProfileFormValues[Field],
    ) => {
      setValues((currentValues) => ({
        ...currentValues,
        [field]: value,
      }));
    },
    [],
  );

  const preencherCampos = useCallback((data: UserProfile) => {
    setValues(profileToFormValues(data));
  }, []);

  const iniciarEdicao = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelarEdicao = useCallback(() => {
    if (profile) {
      preencherCampos(profile);
    }

    setIsEditing(false);
  }, [preencherCampos, profile]);

  const fecharEdicao = useCallback(() => {
    setIsEditing(false);
  }, []);

  const salvarPerfil = useCallback(async () => {
    const validationError = validateProfileForm(
      values,
      profile?.tipo_conta,
    );

    if (validationError) {
      Alert.alert(validationError.title, validationError.message);
      return;
    }

    setSaving(true);

    try {
      const payload = profileFormToUpdatePayload(
        values,
        profile?.tipo_conta,
      );
      const response = await profileService.updateProfile(payload);
      const updatedProfile = response.data;

      onProfileChanged(updatedProfile);
      preencherCampos(updatedProfile);
      onProfileUpdated?.(updatedProfile);
      setIsEditing(false);

      Alert.alert(
        "Perfil atualizado",
        "Suas informações foram salvas com sucesso.",
      );
    } catch (error: unknown) {
      Alert.alert(
        "Erro ao salvar",
        getProfileErrorMessage(
          error,
          "Não foi possível atualizar seu perfil.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }, [
    values,
    profile?.tipo_conta,
    onProfileChanged,
    preencherCampos,
    onProfileUpdated,
  ]);

  return {
    values,
    isEditing,
    saving,
    setField,
    preencherCampos,
    iniciarEdicao,
    cancelarEdicao,
    fecharEdicao,
    salvarPerfil,
  };
}
