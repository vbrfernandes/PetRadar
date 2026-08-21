import { DEFAULT_PROFILE_RADIUS } from "../constants/profile.constants";
import type {
  ProfileFormValues,
  ProfileUpdatePayload,
  UserProfile,
} from "../types/profile.types";

export const INITIAL_PROFILE_FORM_VALUES: ProfileFormValues = {
  nome: "",
  telefone: "",
  raio: DEFAULT_PROFILE_RADIUS,
  endereco: "",
  temPet: false,
};

export function profileToFormValues(
  profile: UserProfile,
): ProfileFormValues {
  return {
    nome: profile.nome_completo || profile.nome_fantasia || "",
    telefone: profile.telefone || "",
    raio: profile.raio_pesquisa_km
      ? String(profile.raio_pesquisa_km)
      : DEFAULT_PROFILE_RADIUS,
    endereco: profile.endereco_completo || "",
    temPet: Boolean(profile.tem_pet),
  };
}

export function profileFormToUpdatePayload(
  values: ProfileFormValues,
  accountType: UserProfile["tipo_conta"] | undefined,
): ProfileUpdatePayload {
  const payload: ProfileUpdatePayload = {
    nome: values.nome.trim(),
    telefone: values.telefone.trim() || undefined,
  };

  if (accountType === "PESSOA_FISICA") {
    payload.raio_pesquisa_km = Math.round(Number(values.raio));
    payload.tem_pet = values.temPet;
  }

  if (accountType === "ONG") {
    payload.endereco_completo = values.endereco.trim();
  }

  return payload;
}

export function getProfileDisplayName(
  profile: UserProfile | null,
  formName: string,
) {
  return (
    profile?.nome_completo ||
    profile?.nome_fantasia ||
    formName ||
    "Usuário"
  );
}

export function getProfileAccountTypeLabel(profile: UserProfile | null) {
  return profile?.tipo_conta === "ONG"
    ? "ONG / Instituição"
    : "Pessoa Física";
}
