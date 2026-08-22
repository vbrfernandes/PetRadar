import React from "react";

import { ActivityIndicator, Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { procuraSeStatesStyles as styles } from "../../styles/procuraseStates.styles";

export default function ProcuraSeLoadingState() {
  return (
    <View style={styles.stateContainer}>
      <View style={styles.stateIcon}>
        <MaterialCommunityIcons
          name="paw"
          size={35}
          color={theme.colors.brand}
        />
      </View>
      <ActivityIndicator size="small" color={theme.colors.brand} />
      <Text style={styles.stateTitle}>Buscando ocorrências</Text>
      <Text style={styles.stateDescription}>
        Estamos procurando animais próximos da sua localização.
      </Text>
    </View>
  );
}
