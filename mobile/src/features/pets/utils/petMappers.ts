import type { PetOcorrenciaPrefill } from "../../../navigation/navigation.types";

import type { Pet } from "../types/pet.types";

export function petToOccurrencePrefill(pet: Pet): PetOcorrenciaPrefill {
    return {
        id_pet: pet.id_pet,
        nome: pet.nome,
        especie: pet.especie,
        raca: pet.raca,
        sexo: pet.sexo,
        cor: pet.cor,
        porte: pet.porte,
        idade: pet.idade,
        foto: pet.foto,
    };
}
