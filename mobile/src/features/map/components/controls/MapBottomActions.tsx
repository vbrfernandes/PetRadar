import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { mapScreenStyles as styles } from "../../styles/map.styles";

interface MapBottomActionsProps {
  onRegisterOccurrence: () => void;
}

export function MapBottomActions({
  onRegisterOccurrence,
}: MapBottomActionsProps) {
  return (
    <View style={styles.bottomArea}>
      <View style={styles.adBanner}>
        <View style={styles.adBadge}>
          <Text style={styles.adBadgeText}>ANÚNCIO</Text>
        </View>

        <View style={styles.adContent}>
          <Text style={styles.adTitle}>Espaço publicitário</Text>

          <Text style={styles.adDescription}>
            Banner provisório para futura integração de anúncios
          </Text>
        </View>

        <View style={styles.adIcon}>
          <Ionicons
            name="megaphone-outline"
            size={20}
            color={theme.colors.brand}
          />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Registrar ocorrência"
        onPress={onRegisterOccurrence}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
        ]}
      >
        <View style={styles.primaryButtonIcon}>
          <MaterialCommunityIcons
            name="plus"
            size={21}
            color={theme.colors.brand}
          />
        </View>

        <View style={styles.primaryButtonContent}>
          <Text style={styles.primaryButtonLabel}>REGISTRAR OCORRÊNCIA</Text>

          <Text style={styles.primaryButtonHint}>Avise a comunidade</Text>
        </View>

        <View style={styles.primaryButtonArrow}>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={theme.colors.surface}
          />
        </View>
      </Pressable>
    </View>
  );
}
