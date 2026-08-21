import React from "react";

import { Text, TextInput, View } from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../../theme/colors";

import { PET_SPECIES_OPTIONS } from "../../../constants/pet.constants";
import { petFormStyles as styles } from "../../../styles/form/petForm.styles";
import type {
    PetFormFieldSetter,
    PetFormValues,
} from "../../../types/petForm.types";
import PetOptionGroup from "../controls/PetOptionGroup";

interface PetBasicInfoSectionProps {
    values: PetFormValues;
    setField: PetFormFieldSetter;
}

export default function PetBasicInfoSection({
    values,
    setField,
}: PetBasicInfoSectionProps) {
    return (
        <>
            <Text style={styles.label}>Nome *</Text>
            <View style={styles.inputContainer}>
                <Ionicons
                    name="paw-outline"
                    size={19}
                    color={theme.colors.brand}
                />
                <TextInput
                    value={values.nome}
                    onChangeText={(value) => setField("nome", value)}
                    placeholder="Nome do pet"
                    placeholderTextColor={theme.colors.muted}
                    style={styles.input}
                    autoCapitalize="words"
                />
            </View>

            <Text style={styles.label}>Espécie *</Text>
            <PetOptionGroup
                options={PET_SPECIES_OPTIONS}
                value={values.especie}
                onChange={(value) => setField("especie", value)}
            />

            {values.especie === "Outro" && (
                <>
                    <Text style={styles.label}>Qual animal? *</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="paw-outline"
                            size={19}
                            color={theme.colors.brand}
                        />
                        <TextInput
                            value={values.especieOutro}
                            onChangeText={(value) =>
                                setField("especieOutro", value)
                            }
                            placeholder="Ex.: Coelho, ave, furão..."
                            placeholderTextColor={theme.colors.muted}
                            style={styles.input}
                            autoCapitalize="sentences"
                            maxLength={50}
                        />
                    </View>
                </>
            )}

            <Text style={styles.label}>Raça</Text>
            <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                    name="paw-outline"
                    size={19}
                    color={theme.colors.brand}
                />
                <TextInput
                    value={values.raca}
                    onChangeText={(value) => setField("raca", value)}
                    placeholder="Ex.: Border Collie"
                    placeholderTextColor={theme.colors.muted}
                    style={styles.input}
                    autoCapitalize="words"
                />
            </View>
        </>
    );
}
