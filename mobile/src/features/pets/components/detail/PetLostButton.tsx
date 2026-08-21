import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { petDetailStyles as styles } from "../../styles/detail/petDetail.styles";
import type { Pet } from "../../types/pet.types";

interface PetLostButtonProps {
    pet: Pet;
    onReportLost: (pet: Pet) => void;
}

export default function PetLostButton({
    pet,
    onReportLost,
}: PetLostButtonProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Informar ${pet.nome} como perdido`}
            accessibilityHint="Abre uma ocorrência de pet perdido já preenchida com os dados deste animal"
            onPress={() => onReportLost(pet)}
            style={({ pressed }) => [
                styles.lostPetButton,
                pressed && styles.buttonPressed,
            ]}
        >
            <MaterialCommunityIcons
                name="alert-circle-outline"
                size={22}
                color={theme.colors.surface}
            />

            <View style={styles.lostPetButtonContent}>
                <Text style={styles.lostPetButtonTitle}>
                    INFORMAR COMO PERDIDO
                </Text>
                <Text style={styles.lostPetButtonSubtitle}>
                    Criar ocorrência usando estes dados
                </Text>
            </View>

            <Ionicons
                name="arrow-forward"
                size={20}
                color={theme.colors.surface}
            />
        </Pressable>
    );
}
