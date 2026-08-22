export type PetSpecies = "Cachorro" | "Gato" | "Outro";

export type PetSex = "Masculino" | "Feminino" | "Não sei";

export type PetSize = "Pequeno" | "Médio" | "Grande";

export type PetAge = "Filhote" | "Adulto" | "Idoso";

export interface PetSelectedPhoto {
    uri: string;
    nome: string;
    tipo: string;
}

export interface PetFormValues {
    nome: string;
    especie: PetSpecies;
    especieOutro: string;
    raca: string;
    sexo: PetSex | "";
    cor: string;
    porte: PetSize;
    idade: PetAge | "";
}

export type PetFormFieldSetter = <Field extends keyof PetFormValues>(
    field: Field,
    value: PetFormValues[Field],
) => void;
