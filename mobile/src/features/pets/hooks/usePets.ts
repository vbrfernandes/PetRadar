import { useCallback, useEffect, useState } from "react";

import { Alert } from "react-native";

import { petService } from "../services/petService";
import type { Pet } from "../types/pet.types";
import {
    getPetErrorContext,
    getPetErrorMessage,
} from "../utils/petErrors";

export function usePets() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    const carregarPets = useCallback(async () => {
        try {
            setLoading(true);

            const response = await petService.getMyPets();

            setPets(Array.isArray(response.data) ? response.data : []);
        } catch (error: unknown) {
            const errorContext = getPetErrorContext(error);

            console.error(
                "[RegistrarPet] Erro ao carregar pets:",
                errorContext.status,
                errorContext.details,
            );

            Alert.alert(
                "Não foi possível carregar",
                getPetErrorMessage(
                    error,
                    "Não foi possível carregar seus pets.",
                ),
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void carregarPets();
    }, [carregarPets]);

    const adicionarPetCriado = useCallback((pet: Pet) => {
        setPets((currentPets) => [pet, ...currentPets]);
    }, []);

    return {
        pets,
        loading,
        carregarPets,
        adicionarPetCriado,
    };
}
