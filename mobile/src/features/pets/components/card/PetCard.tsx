import React from "react";

import { Image, Pressable, Text, View } from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { petCardStyles as styles } from "../../styles/card/petCard.styles";
import type { Pet } from "../../types/pet.types";

interface PetCardProps {
    pet: Pet;
    onPress: () => void;
}

export default function PetCard({ pet, onPress }: PetCardProps) {
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
                    <Image source={{ uri: pet.foto }} style={styles.petImage} />
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
                            color={theme.colors.brand}
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

            <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.muted}
            />
        </Pressable>
    );
}
