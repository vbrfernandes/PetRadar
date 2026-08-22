import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { procuraSeButtonPressedStyle } from "../../styles/procuraseScreen.styles";
import { procuraSeStatesStyles as styles } from "../../styles/procuraseStates.styles";

interface ProcuraSeErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ProcuraSeErrorState({
  message,
  onRetry,
}: ProcuraSeErrorStateProps) {
  return (
    <View style={styles.stateContainer}>
      <View style={[styles.stateIcon, styles.errorIcon]}>
        <Ionicons
          name="cloud-offline-outline"
          size={34}
          color={theme.colors.semantic.danger.text}
        />
      </View>
      <Text style={styles.stateTitle}>Não foi possível carregar</Text>
      <Text style={styles.stateDescription}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tentar carregar feed novamente"
        onPress={onRetry}
        style={({ pressed }) => [
          styles.stateButton,
          pressed && procuraSeButtonPressedStyle,
        ]}
      >
        <Ionicons
          name="refresh"
          size={18}
          color={theme.colors.surface}
        />
        <Text style={styles.stateButtonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}
