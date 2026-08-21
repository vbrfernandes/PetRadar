import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import {
  feedButtonPressedStyle,
  feedScreenStyles,
} from "../../styles/feedScreen.styles";
import { feedStatesStyles as styles } from "../../styles/feedStates.styles";

interface FeedLocationDeniedStateProps {
  onRetry: () => void;
}

export default function FeedLocationDeniedState({
  onRetry,
}: FeedLocationDeniedStateProps) {
  return (
    <SafeAreaView style={feedScreenStyles.container}>
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <Ionicons
            name="location-outline"
            size={34}
            color={theme.colors.brand}
          />
        </View>
        <Text style={styles.stateTitle}>Localização necessária</Text>
        <Text style={styles.stateDescription}>
          Precisamos da sua localização para mostrar as ocorrências mais próximas
          de você.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tentar permitir localização novamente"
          onPress={onRetry}
          style={({ pressed }) => [
            styles.stateButton,
            pressed && feedButtonPressedStyle,
          ]}
        >
          <Ionicons name="location" size={18} color={theme.colors.surface} />
          <Text style={styles.stateButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
