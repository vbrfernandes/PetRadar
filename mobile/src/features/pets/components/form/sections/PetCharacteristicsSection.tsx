import React from "react";

import { Text, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../../theme/colors";

import {
    PET_AGE_OPTIONS,
    PET_SEX_OPTIONS,
    PET_SIZE_OPTIONS,
} from "../../../constants/pet.constants";
import { petFormStyles as styles } from "../../../styles/form/petForm.styles";
import type {
    PetFormFieldSetter,
    PetFormValues,
} from "../../../types/petForm.types";
import PetOptionGroup from "../controls/PetOptionGroup";

interface PetCharacteristicsSectionProps {
    values: PetFormValues;
    setField: PetFormFieldSetter;
}

export default function PetCharacteristicsSection({
    values,
    setField,
}: PetCharacteristicsSectionProps) {
    return (
        <>
            <Text style={styles.label}>Sexo</Text>
            <PetOptionGroup
                options={PET_SEX_OPTIONS}
                value={values.sexo}
                onChange={(value) => setField("sexo", value)}
            />

            <Text style={styles.label}>Cor</Text>
            <View style={styles.inputContainer}>
                <Ionicons
                    name="color-palette-outline"
                    size={19}
                    color={theme.colors.brand}
                />
                <TextInput
                    value={values.cor}
                    onChangeText={(value) => setField("cor", value)}
                    placeholder="Ex.: Preto e branco"
                    placeholderTextColor={theme.colors.muted}
                    style={styles.input}
                    autoCapitalize="sentences"
                    maxLength={50}
                />
            </View>

            <Text style={styles.label}>Porte</Text>
            <PetOptionGroup
                options={PET_SIZE_OPTIONS}
                value={values.porte}
                onChange={(value) => setField("porte", value)}
            />

            <Text style={styles.label}>Idade</Text>
            <PetOptionGroup
                options={PET_AGE_OPTIONS}
                value={values.idade}
                onChange={(value) => setField("idade", value)}
            />
        </>
    );
}
