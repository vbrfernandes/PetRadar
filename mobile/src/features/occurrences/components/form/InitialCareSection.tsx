import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

interface InitialCareSectionProps {
  aguaRegistrada: boolean;
  comidaRegistrada: boolean;
  aguaTexto: string;
  comidaTexto: string;
  onAguaPress: () => void;
  onComidaPress: () => void;
}

export default function InitialCareSection({
  aguaRegistrada,
  comidaRegistrada,
  aguaTexto,
  comidaTexto,
  onAguaPress,
  onComidaPress,
}: InitialCareSectionProps) {
  return (
    <>
      <View style={styles.careRow}>
        <CareButton
          icon="water"
          label="Água"
          active={aguaRegistrada}
          onPress={onAguaPress}
        />

        <CareButton
          icon="food"
          label="Comida"
          active={comidaRegistrada}
          onPress={onComidaPress}
        />
      </View>

      <View style={styles.caregiverCard}>
        <View style={styles.careInfoRow}>
          <CareInfo icon="water" label="Última água" value={aguaTexto} />

          <CareInfo icon="food" label="Última comida" value={comidaTexto} />
        </View>
      </View>

      <View style={styles.careHint}>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={theme.colors.brand}
        />

        <Text style={styles.careHintText}>
          Toque novamente para desmarcar um cuidado.
        </Text>
      </View>
    </>
  );
}

function CareButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: "water" | "food";
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        selected: active,
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.careButton,
        active && styles.careButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.careIcon, active && styles.careIconActive]}>
        <MaterialCommunityIcons
          name={icon === "water" ? "water" : "food"}
          size={25}
          color={active ? theme.colors.surface : theme.colors.brand}
        />
      </View>

      <Text
        style={[styles.careButtonText, active && styles.careButtonTextActive]}
      >
        {label}
      </Text>

      {active && (
        <View style={styles.careCheck}>
          <Ionicons name="checkmark" size={12} color={theme.colors.surface} />
        </View>
      )}
    </Pressable>
  );
}

function CareInfo({
  icon,
  label,
  value,
}: {
  icon: "water" | "food";
  label: string;
  value: string;
}) {
  return (
    <View style={styles.careInfo}>
      <View style={styles.careInfoHeader}>
        <MaterialCommunityIcons
          name={icon === "water" ? "water" : "food"}
          size={15}
          color={theme.colors.brand}
        />

        <Text style={styles.careInfoLabel}>{label}</Text>
      </View>

      <Text style={styles.careInfoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  careRow: {
    flexDirection: "row",
    gap: 12,
  },

  careButton: {
    flex: 1,
    minHeight: 104,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    position: "relative",
  },

  careButtonActive: {
    backgroundColor: "rgba(31, 92, 77, 0.07)",
    borderColor: theme.colors.brand,
  },

  careIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  careIconActive: {
    backgroundColor: theme.colors.brand,
  },

  careButtonText: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  careButtonTextActive: {
    color: theme.colors.brand,
  },

  careCheck: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },

  caregiverCard: {
    marginTop: 13,
    backgroundColor: theme.colors.background,
    borderRadius: 17,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.06)",
  },

  careInfoRow: {
    flexDirection: "row",
    gap: 9,
  },

  careInfo: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 10,
    minHeight: 65,
  },

  careInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },

  careInfoLabel: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
  },

  careInfoValue: {
    color: theme.colors.textTitle,
    fontSize: 12,
    fontWeight: "700",
  },

  careHint: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  careHintText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 15,
  },

  pressed: {
    opacity: 0.82,
  },
});
