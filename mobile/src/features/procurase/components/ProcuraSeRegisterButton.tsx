import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../theme/colors";

import { procuraSeHeaderStyles as styles } from "../styles/procuraseHeader.styles";

interface ProcuraSeRegisterButtonProps {
  onPress: () => void;
}

export default function ProcuraSeRegisterButton({
  onPress,
}: ProcuraSeRegisterButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Registrar nova ocorrência"
      accessibilityHint="Abre o formulário para registrar um animal"
      onPress={onPress}
      style={({ pressed }) => [
        styles.registerButton,
        pressed && styles.registerButtonPressed,
      ]}
    >
      <View style={styles.registerButtonIcon}>
        <Ionicons name="add" size={23} color={theme.colors.brand} />
      </View>

      <View style={styles.registerButtonContent}>
        <Text style={styles.registerButtonTitle}>
          Registrar ocorrência
        </Text>
        <Text style={styles.registerButtonSubtitle}>
          Avise a comunidade
        </Text>
      </View>

      <View style={styles.registerButtonArrow}>
        <Ionicons
          name="arrow-forward"
          size={19}
          color={theme.colors.surface}
        />
      </View>
    </Pressable>
  );
}
