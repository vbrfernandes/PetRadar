import React from "react";

import { ActivityIndicator, Text, View } from "react-native";

import { theme } from "../../../../theme";

import { petsTabStyles as styles } from "../../styles/petsTab.styles";

export default function PetsLoadingState() {
    return (
        <View style={styles.stateContainer}>
            <ActivityIndicator color={theme.colors.brand} />
            <Text style={styles.stateText}>Carregando seus pets...</Text>
        </View>
    );
}
