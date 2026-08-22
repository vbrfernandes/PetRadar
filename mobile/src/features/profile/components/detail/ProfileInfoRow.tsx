import React from "react";

import { Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { profileDetailStyles as styles } from "../../styles/detail/profileDetail.styles";

interface ProfileInfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconBackground?: string;
}

function ProfileInfoRow({
  icon,
  label,
  value,
  iconBackground = theme.colors.semantic.success.bg,
}: ProfileInfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={18} color={theme.colors.brand} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={3}>
          {value || "Não informado"}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(ProfileInfoRow);
