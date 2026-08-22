import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../theme";

import { petsTabStyles as styles } from "../styles/petsTab.styles";

interface PetsAddButtonProps {
    onPress: () => void;
}

export default function PetsAddButton({ onPress }: PetsAddButtonProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Adicionar pet"
            onPress={onPress}
            style={({ pressed }) => [
                styles.addButton,
                pressed && styles.buttonPressed,
            ]}
        >
            <View style={styles.addButtonIcon}>
                <Ionicons
                    name="add"
                    size={22}
                    color={theme.colors.surface}
                />
            </View>

            <View style={styles.addButtonContent}>
                <Text style={styles.addButtonTitle}>Adicionar pet</Text>
                <Text style={styles.addButtonSubtitle}>
                    Cadastre um novo animal
                </Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.surface}
            />
        </Pressable>
    );
}
