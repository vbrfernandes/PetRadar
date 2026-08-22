import React from "react";

import { Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { profileOccurrencesStyles as styles } from "../../styles/occurrences/profileOccurrences.styles";

export default function ProfileOccurrencesEmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons
          name="paw-outline"
          size={34}
          color={theme.colors.brand}
        />
      </View>
      <Text style={styles.emptyTitle}>Nenhuma ocorrência</Text>
      <Text style={styles.emptyText}>
        Você ainda não registrou nenhuma ocorrência no PetRadar.
      </Text>
    </View>
  );
}
