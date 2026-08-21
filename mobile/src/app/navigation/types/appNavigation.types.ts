export interface PetOcorrenciaPrefill {
  id_pet: number;

  nome: string;
  especie: string;

  raca: string | null;
  sexo: string | null;
  cor: string | null;
  porte: string | null;
  idade: string | null;

  foto: string | null;
}

export type AppTabParamList = {
  Mapa: undefined;
  Feed: undefined;
  ProcuraSe: undefined;
  SOS: undefined;
  Perfil: undefined;
  CadastroOcorrencia:
  | {
    pet?: PetOcorrenciaPrefill;
    ocorrenciaId?: number;
  }
  | undefined;
};
