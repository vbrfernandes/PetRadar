import React from "react";

import { Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { petsTabStyles as styles } from "../../styles/petsTab.styles";

export default function PetsEmptyState() {
    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
                <MaterialCommunityIcons
                    name="paw-outline"
                    size={36}
                    color={theme.colors.brand}
                />
            </View>

            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptyText}>
                Adicione seus pets para mantê-los vinculados ao seu perfil no
                PetRadar.
            </Text>
        </View>
    );
}
