import React from "react";

import { Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileAccountStyles as styles } from "../../styles/account/profileAccount.styles";

export default function ProfileAccountSection() {
  return (
    <View style={styles.accountCard}>
      <View style={styles.accountIcon}>
        <Ionicons
          name="shield-checkmark-outline"
          size={21}
          color={theme.colors.brand}
        />
      </View>
      <View style={styles.accountContent}>
        <Text style={styles.accountTitle}>Conta PetRadar</Text>
        <Text style={styles.accountDescription}>
          Seus dados são utilizados para conectar pessoas e organizações às
          ações de proteção animal.
        </Text>
      </View>
    </View>
  );
}
