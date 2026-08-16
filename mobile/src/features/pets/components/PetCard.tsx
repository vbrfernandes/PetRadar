import React from "react";

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../theme/colors";

import type { Pet } from "../types/pet.types";

interface PetCardProps {
    pet: Pet;
    onPress: () => void;
}

const COLORS = {
    primary: theme.colors.brand,
    surface: theme.colors.surface,
    textTitle: theme.colors.textTitle,
    textBody: theme.colors.textBody,
    successBg: theme.colors.semantic.success.bg,
    muted: "#94A3B8",
};

export default function PetCard({
    pet,
    onPress,
}: PetCardProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Abrir detalhes de ${pet.nome}`}
            style={({ pressed }) => [
                styles.petCard,
                pressed && styles.buttonPressed,
            ]}
        >
            <View style={styles.petImageWrapper}>
                {pet.foto ? (
                    <Image
                        source={{
                            uri: pet.foto,
                        }}
                        style={styles.petImage}
                    />
                ) : (
                    <View style={styles.petPlaceholder}>
                        <MaterialCommunityIcons
                            name={
                                pet.especie.toLowerCase() === "gato"
                                    ? "cat"
                                    : pet.especie.toLowerCase() === "cachorro"
                                        ? "dog"
                                        : "paw-outline"
                            }
                            size={30}
                            color={COLORS.primary}
                        />
                    </View>
                )}
            </View>

            <View style={styles.petInfo}>
                <Text style={styles.petName} numberOfLines={1}>
                    {pet.nome}
                </Text>

                <Text style={styles.petMeta} numberOfLines={1}>
                    {pet.especie}

                    {pet.raca ? ` • ${pet.raca}` : ""}
                </Text>

                {pet.porte ? (
                    <Text style={styles.petSize}>Porte {pet.porte}</Text>
                ) : null}
            </View>

            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    petCard: {
        minHeight: 84,

        marginBottom: 10,
        padding: 12,

        borderRadius: 18,

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: COLORS.surface,

        borderWidth: 1,
        borderColor: "rgba(15,23,42,0.06)",

        ...theme.shadows.elevation1,
    },

    petImageWrapper: {
        width: 58,
        height: 58,
        borderRadius: 18,
        overflow: "hidden",
    },

    petImage: {
        width: "100%",
        height: "100%",
    },

    petPlaceholder: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: COLORS.successBg,
    },

    petInfo: {
        flex: 1,
        marginLeft: 12,
    },

    petName: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.textTitle,
    },

    petMeta: {
        marginTop: 3,
        fontSize: 12,
        color: COLORS.textBody,
    },

    petSize: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: "600",
        color: COLORS.primary,
    },

    buttonPressed: {
        opacity: 0.85,

        transform: [
            {
                scale: 0.99,
            },
        ],
    },
});
