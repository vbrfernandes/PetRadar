import type {
  AnimalTypeOption,
  OccurrenceTypeOption,
} from "../types/occurrenceForm.types";

export const MAPBOX_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const TIPOS_OCORRENCIA: OccurrenceTypeOption[] = [
  {
    valor: "PET_PERDIDO",
    titulo: "Pet perdido",
    descricao: "Animal com tutor que não foi localizado",
    icone: "paw",
  },
  {
    valor: "PET_AVISTADO",
    titulo: "Pet avistado",
    descricao: "Pet visto e que pode estar perdido",
    icone: "eye-outline",
  },
  {
    valor: "ANIMAL_DE_RUA",
    titulo: "Animal de rua",
    descricao: "Animal encontrado sem tutor identificado",
    icone: "paw-outline",
  },
];

export const TIPOS_ANIMAIS: AnimalTypeOption[] = [
  { valor: "CACHORRO", titulo: "Cachorro", descricao: "Cão", icone: "dog-side" },
  { valor: "GATO", titulo: "Gato", descricao: "Felino", icone: "cat" },
  { valor: "OUTRO", titulo: "Outro", descricao: "Outra espécie", icone: "paw-outline" },
];

export const SEXOS = ["Masculino", "Feminino", "Não sei"];
export const PORTES = ["Pequeno", "Médio", "Grande"];
export const IDADES = ["Filhote", "Adulto", "Idoso"];
export const URGENCIAS = ["Crítico", "Moderado", "Baixo"];

export const PROBLEMAS_SAUDE = [
  "Ferido / machucado",
  "Desnutrido",
  "Desidratado",
  "Ingestão de corpo estranho",
  "Atropelado",
  "Problemas dermatológicos",
];

export const DEFICIENCIAS = [
  "Paralisia de membros",
  "Amputado",
  "Cegueira",
  "Surdez",
  "Incontinência urinária",
  "Incontinência fecal",
];
