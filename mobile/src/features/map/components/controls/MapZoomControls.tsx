import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { mapScreenStyles as styles } from "../../styles/map.styles";

interface MapZoomControlsProps {
  onChangeZoom: (zoomIn: boolean) => void;
}

export function MapZoomControls({ onChangeZoom }: MapZoomControlsProps) {
  return (
    <View style={styles.mapZoomControls}>
      <View style={styles.controlGroup}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aumentar zoom"
          onPress={() => onChangeZoom(true)}
          style={({ pressed }) => [
            styles.mapControlButton,
            pressed && styles.controlPressed,
          ]}
        >
          <Ionicons name="add" size={22} color={theme.colors.textTitle} />
        </Pressable>

        <View style={styles.controlDivider} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Diminuir zoom"
          onPress={() => onChangeZoom(false)}
          style={({ pressed }) => [
            styles.mapControlButton,
            pressed && styles.controlPressed,
          ]}
        >
          <Ionicons name="remove" size={22} color={theme.colors.textTitle} />
        </Pressable>
      </View>
    </View>
  );
}
