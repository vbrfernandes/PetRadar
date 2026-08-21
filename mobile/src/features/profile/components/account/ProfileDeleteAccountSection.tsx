import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileAccountStyles as styles } from "../../styles/account/profileAccount.styles";

interface ProfileDeleteAccountSectionProps {
  onOpenDeleteAccount: () => void;
}

export default function ProfileDeleteAccountSection({
  onOpenDeleteAccount,
}: ProfileDeleteAccountSectionProps) {
  return (
    <>
      <Text style={styles.manageAccountLabel}>GERENCIAR CONTA</Text>
      <View style={styles.deleteAccountCard}>
        <View style={styles.deleteAccountHeader}>
          <View style={styles.deleteAccountIcon}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={theme.colors.semantic.danger.text}
            />
          </View>
          <View style={styles.deleteAccountContent}>
            <Text style={styles.deleteAccountTitle}>Excluir minha conta</Text>
            <Text style={styles.deleteAccountDescription}>
              Esta ação é permanente.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteAccountButton}
          onPress={onOpenDeleteAccount}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Excluir minha conta"
          accessibilityHint="Abre a confirmação de exclusão permanente da conta"
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={theme.colors.semantic.danger.text}
          />
          <Text style={styles.deleteAccountButtonText}>
            Excluir minha conta
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
