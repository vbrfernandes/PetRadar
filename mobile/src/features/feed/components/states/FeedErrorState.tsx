import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import {
  feedButtonPressedStyle,
  feedScreenStyles,
} from "../../styles/feedScreen.styles";
import { feedStatesStyles as styles } from "../../styles/feedStates.styles";

interface FeedErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function FeedErrorState({
  error,
  onRetry,
}: FeedErrorStateProps) {
  return (
    <SafeAreaView style={feedScreenStyles.container}>
      <View style={styles.stateContainer}>
        <View style={[styles.stateIcon, styles.errorIcon]}>
          <Ionicons
            name="cloud-offline-outline"
            size={34}
            color={theme.colors.semantic.danger.text}
          />
        </View>
        <Text style={styles.stateTitle}>Não foi possível carregar</Text>
        <Text style={styles.stateDescription}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tentar carregar feed novamente"
          onPress={onRetry}
          style={({ pressed }) => [
            styles.stateButton,
            pressed && feedButtonPressedStyle,
          ]}
        >
          <Ionicons name="refresh" size={18} color={theme.colors.surface} />
          <Text style={styles.stateButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
