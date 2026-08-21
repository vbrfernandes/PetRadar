import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileDetailStyles as styles } from "../../styles/detail/profileDetail.styles";

interface ProfileHeaderProps {
  topInset: number;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileHeader({
  topInset,
  onClose,
  onLogout,
}: ProfileHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: topInset + 8 }]}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={onClose}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
      >
        <Ionicons
          name="chevron-back"
          size={23}
          color={theme.colors.textTitle}
        />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Meu perfil</Text>
        <Text style={styles.headerSubtitle}>PetRadar</Text>
      </View>

      <TouchableOpacity
        style={[styles.headerButton, styles.logoutHeaderButton]}
        onPress={onLogout}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
      >
        <Ionicons
          name="log-out-outline"
          size={21}
          color={theme.colors.semantic.danger.text}
        />
      </TouchableOpacity>
    </View>
  );
}
