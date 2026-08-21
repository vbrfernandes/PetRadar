import React from "react";

import { ActivityIndicator, Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileDetailStyles as styles } from "../../styles/detail/profileDetail.styles";

export default function ProfileLoadingState() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingIcon}>
        <MaterialCommunityIcons
          name="paw"
          size={30}
          color={theme.colors.brand}
        />
      </View>
      <ActivityIndicator size="small" color={theme.colors.brand} />
      <Text style={styles.loadingText}>Carregando seu perfil...</Text>
    </View>
  );
}
