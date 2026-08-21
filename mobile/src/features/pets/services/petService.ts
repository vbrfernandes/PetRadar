import api from "../../../services/api";

import type { Pet } from "../types/pet.types";

export const petService = {
    getMyPets: () =>
        api.get<Pet[]>("/pets/meus"),

    createPet: (
        formData: FormData,
    ) =>
        api.post<Pet>("/pets/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
};