export interface ProfileUpdateResult {
  raio_pesquisa_km?: number;
  tem_pet?: boolean;
  foto_perfil?: string | null;
}

export interface UserProfile {
  id_conta: number;
  email: string;
  tipo_conta: "PESSOA_FISICA" | "ONG";

  telefone: string | null;
  foto_perfil: string | null;

  nome_completo?: string;
  nome_fantasia?: string;

  razao_social?: string;
  cnpj?: string;

  raio_pesquisa_km?: number;
  tem_pet?: boolean;

  endereco_completo?: string;
  nome_gestor?: string;
}

export interface ProfileUpdatePayload {
  nome?: string;
  telefone?: string;
  raio_pesquisa_km?: number;
  endereco_completo?: string;
  tem_pet?: boolean;
}

export interface DeleteProfilePayload {
  senha: string;
}

export interface ProfilePhotoUploadResponse {
  foto_perfil?: string | null;
}

export interface ProfileFormValues {
  nome: string;
  telefone: string;
  raio: string;
  endereco: string;
  temPet: boolean;
}

export type ProfileFormFieldSetter = <Field extends keyof ProfileFormValues>(
  field: Field,
  value: ProfileFormValues[Field],
) => void;

export type ProfileTab = "perfil" | "ocorrencias" | "pets";

export type ProfileOccurrencePressHandler = (
  occurrenceId: number,
  onChanged: () => void | Promise<void>,
) => void;
