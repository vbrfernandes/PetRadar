import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

interface ChoiceButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  danger?: boolean;
}

export default function ChoiceButton({
  label,
  active,
  onPress,
  danger = false,
}: ChoiceButtonProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{
        selected: active,
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceButton,
        active && styles.choiceButtonActive,
        active && danger && styles.choiceButtonDanger,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.choiceButtonText,
          active && styles.choiceButtonTextActive,
          active && danger && styles.choiceButtonTextDanger,
        ]}
      >
        {label}
      </Text>

      {active && (
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={
            danger ? theme.colors.semantic.danger.text : theme.colors.brand
          }
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  choiceButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.10)",
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 12,
  },

  choiceButtonActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.07)",
  },

  choiceButtonDanger: {
    borderColor: theme.colors.semantic.danger.text,
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  choiceButtonText: {
    color: theme.colors.textBody,
    fontSize: 14,
    fontWeight: "700",
  },

  choiceButtonTextActive: {
    color: theme.colors.brand,
  },

  choiceButtonTextDanger: {
    color: theme.colors.semantic.danger.text,
  },

  pressed: {
    opacity: 0.82,
  },
});
