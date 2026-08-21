import type {
    PetAge,
    PetFormValues,
    PetSex,
    PetSize,
    PetSpecies,
} from "../types/petForm.types";

export const PET_SPECIES_OPTIONS = [
    {
        value: "Cachorro" as PetSpecies,
        label: "Cachorro",
        icon: "dog" as const,
    },
    {
        value: "Gato" as PetSpecies,
        label: "Gato",
        icon: "cat" as const,
    },
    {
        value: "Outro" as PetSpecies,
        label: "Outro",
        icon: "paw-outline" as const,
    },
] as const;

export const PET_SEX_OPTIONS = [
    { value: "Masculino" as PetSex, label: "Masculino" },
    { value: "Feminino" as PetSex, label: "Feminino" },
    { value: "Não sei" as PetSex, label: "Não sei" },
] as const;

export const PET_SIZE_OPTIONS = [
    { value: "Pequeno" as PetSize, label: "Pequeno" },
    { value: "Médio" as PetSize, label: "Médio" },
    { value: "Grande" as PetSize, label: "Grande" },
] as const;

export const PET_AGE_OPTIONS = [
    { value: "Filhote" as PetAge, label: "Filhote" },
    { value: "Adulto" as PetAge, label: "Adulto" },
    { value: "Idoso" as PetAge, label: "Idoso" },
] as const;

export const INITIAL_PET_FORM_VALUES: PetFormValues = {
    nome: "",
    especie: "Cachorro",
    especieOutro: "",
    raca: "",
    sexo: "",
    cor: "",
    porte: "Médio",
    idade: "",
};
