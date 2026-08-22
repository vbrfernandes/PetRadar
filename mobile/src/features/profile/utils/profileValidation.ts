import {
  MAX_PROFILE_RADIUS,
  MIN_PROFILE_RADIUS,
} from "../constants/profile.constants";
import type {
  ProfileFormValues,
  UserProfile,
} from "../types/profile.types";

interface ProfileValidationError {
  title: string;
  message: string;
}

export function validateProfileForm(
  values: ProfileFormValues,
  accountType: UserProfile["tipo_conta"] | undefined,
): ProfileValidationError | null {
  if (!values.nome.trim()) {
    return {
      title: "Nome obrigatório",
      message: "Informe seu nome para continuar.",
    };
  }

  const radius = Number(values.raio);

  if (
    accountType === "PESSOA_FISICA" &&
    (!Number.isFinite(radius) ||
      radius < MIN_PROFILE_RADIUS ||
      radius > MAX_PROFILE_RADIUS)
  ) {
    return {
      title: "Raio inválido",
      message: `Informe um raio entre ${MIN_PROFILE_RADIUS} e ${MAX_PROFILE_RADIUS} km.`,
    };
  }

  return null;
}
