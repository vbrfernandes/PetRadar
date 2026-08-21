import type {
    PetFormValues,
    PetSelectedPhoto,
} from "../types/petForm.types";

export function getPetSpeciesValue(values: PetFormValues) {
    return values.especie === "Outro"
        ? values.especieOutro.trim()
        : values.especie;
}

export function buildPetFormData(
    values: PetFormValues,
    photo: PetSelectedPhoto | null,
) {
    const formData = new FormData();

    formData.append("nome", values.nome.trim());
    formData.append("especie", getPetSpeciesValue(values));

    if (values.raca.trim()) {
        formData.append("raca", values.raca.trim());
    }

    if (values.sexo) {
        formData.append("sexo", values.sexo);
    }

    if (values.cor.trim()) {
        formData.append("cor", values.cor.trim());
    }

    formData.append("porte", values.porte);

    if (values.idade) {
        formData.append("idade", values.idade);
    }

    if (photo) {
        formData.append("foto", {
            uri: photo.uri,
            name: photo.nome,
            type: photo.tipo,
        } as unknown as Blob);
    }

    return formData;
}
