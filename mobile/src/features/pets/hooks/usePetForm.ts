import { useCallback, useState } from "react";

import { Alert } from "react-native";

import { INITIAL_PET_FORM_VALUES } from "../constants/pet.constants";
import type { PetFormValues } from "../types/petForm.types";
import { getPetSpeciesValue } from "../utils/petFormData";

export function usePetForm() {
    const [values, setValues] = useState<PetFormValues>(
        INITIAL_PET_FORM_VALUES,
    );
    const [saving, setSaving] = useState(false);

    const setField = useCallback(
        <Field extends keyof PetFormValues>(
            field: Field,
            value: PetFormValues[Field],
        ) => {
            setValues((currentValues) => ({
                ...currentValues,
                [field]: value,
            }));
        },
        [],
    );

    const resetForm = useCallback(() => {
        setValues(INITIAL_PET_FORM_VALUES);
    }, []);

    const validateName = useCallback(() => {
        if (values.nome.trim()) {
            return true;
        }

        Alert.alert("Nome obrigatório", "Informe o nome do pet.");
        return false;
    }, [values.nome]);

    const validateSpecies = useCallback(() => {
        if (getPetSpeciesValue(values)) {
            return true;
        }

        Alert.alert(
            "Espécie obrigatória",
            "Informe qual é o animal.",
        );
        return false;
    }, [values]);

    return {
        values,
        saving,
        setSaving,
        setField,
        resetForm,
        validateName,
        validateSpecies,
    };
}
