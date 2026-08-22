import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../theme";
import type { ModoFeed } from "../types/feed.types";
import {
  feedButtonPressedStyle,
  feedScreenStyles as styles,
} from "../styles/feedScreen.styles";

interface FeedHeaderProps {
  profilePhoto: string | null;
  modoFeed: ModoFeed;
  raioPesquisaKm: number;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
}

export default function FeedHeader({
  profilePhoto,
  modoFeed,
  raioPesquisaKm,
  onOpenMenu,
  onOpenProfile,
}: FeedHeaderProps) {
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
          pressed && feedButtonPressedStyle,
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
          Ocorrências
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
            pressed && feedButtonPressedStyle,
          ]}
        >
          <Image
            source={{
              uri: profilePhoto || "https://i.pravatar.cc/150?img=11",
            }}
            style={styles.headerAvatarImage}
          />
          <View style={styles.headerOnlineIndicator} />
        </Pressable>

        <View style={styles.radiusBadge}>
          <Ionicons
            name={modoFeed === "ECO" ? "earth-outline" : "navigate-outline"}
            size={13}
            color={theme.colors.brand}
          />
          <Text style={styles.radiusText}>
            {modoFeed === "ECO" ? "Mundo" : `${raioPesquisaKm} km`}
          </Text>
        </View>
      </View>
    </View>
  );
}
