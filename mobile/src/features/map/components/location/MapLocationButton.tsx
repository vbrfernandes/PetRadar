import React from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { mapScreenStyles as styles } from "../../styles/map.styles";

interface MapLocationButtonProps {
  onPress: () => void;
}

export function MapLocationButton({ onPress }: MapLocationButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Centralizar minha localização"
      onPress={onPress}
      style={({ pressed }) => [
        styles.locationButton,
        pressed && styles.locationButtonPressed,
      ]}
    >
      <View style={styles.locationButtonInner}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={23}
          color={theme.colors.brand}
        />
      </View>
    </Pressable>
  );
}
