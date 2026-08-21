import React from "react";

import { Image, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../theme/colors";

import { procuraSeHeaderStyles as styles } from "../styles/procuraseHeader.styles";
import { procuraSeButtonPressedStyle } from "../styles/procuraseScreen.styles";
import type { ModoProcuraSe } from "../types/procurase.types";

interface ProcuraSeHeaderProps {
  profilePhoto: string | null;
  mode: ModoProcuraSe;
  raioPesquisaKm: number;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
}

export default function ProcuraSeHeader({
  profilePhoto,
  mode,
  raioPesquisaKm,
  onOpenMenu,
  onOpenProfile,
}: ProcuraSeHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
        accessibilityHint="Abre o menu principal do PetRadar"
        hitSlop={8}
        onPress={onOpenMenu}
        style={({ pressed }) => [
          styles.headerMenuButton,
          pressed && procuraSeButtonPressedStyle,
        ]}
      >
        <Ionicons
          name="menu-outline"
          size={24}
          color={theme.colors.textTitle}
        />
      </Pressable>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Procura-se
        </Text>
      </View>

      <View style={styles.headerActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
          accessibilityHint="Abre as opções da sua conta"
          onPress={onOpenProfile}
          style={({ pressed }) => [
            styles.headerAvatarButton,
            pressed && procuraSeButtonPressedStyle,
          ]}
        >
          <Image
            source={{
              uri:
                profilePhoto ||
                "https://i.pravatar.cc/150?img=11",
            }}
            style={styles.headerAvatarImage}
          />
          <View style={styles.headerOnlineIndicator} />
        </Pressable>

        <View style={styles.radiusBadge}>
          <Ionicons
            name={mode === "ECO" ? "earth-outline" : "navigate-outline"}
            size={13}
            color={theme.colors.brand}
          />
          <Text style={styles.radiusText}>
            {mode === "ECO" ? "Mundo" : `${raioPesquisaKm} km`}
          </Text>
        </View>
      </View>
    </View>
  );
}
