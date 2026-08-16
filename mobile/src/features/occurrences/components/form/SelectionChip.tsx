import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

type SelectionChipMode = "single" | "multiple";

interface SelectionChipProps {
  label: string;
  active: boolean;
  mode: SelectionChipMode;
  onPress: () => void;
}

export default function SelectionChip({
  label,
  active,
  mode,
  onPress,
}: SelectionChipProps) {
  const multiple = mode === "multiple";

  return (
    <Pressable
      accessibilityRole={multiple ? "checkbox" : "radio"}
      accessibilityState={
        multiple
          ? {
              checked: active,
            }
          : {
              selected: active,
            }
      }
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionChip,
        active && styles.optionChipActive,
        pressed && styles.pressed,
      ]}
    >
      {multiple && (
        <View
          style={[styles.checkCircle, active && styles.checkCircleActive]}
        >
          {active && (
            <Ionicons
              name="checkmark"
              size={13}
              color={theme.colors.surface}
            />
          )}
        </View>
      )}

      <Text
        style={[
          styles.optionChipText,
          active && styles.optionChipTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionChip: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.10)",
    backgroundColor: theme.colors.background,
  },

  optionChipActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.08)",
  },

  optionChipText: {
    color: theme.colors.textBody,
    fontSize: 13,
    fontWeight: "600",
  },

  optionChipTextActive: {
    color: theme.colors.brand,
    fontWeight: "700",
  },

  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "rgba(31, 92, 77, 0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  checkCircleActive: {
    backgroundColor: theme.colors.brand,
    borderColor: theme.colors.brand,
  },

  pressed: {
    opacity: 0.82,
  },
});
