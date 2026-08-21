import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import type { ModoFeed } from "../../types/feed.types";
import { feedControlsStyles as styles } from "../../styles/feedControls.styles";

interface FeedModeSelectorProps {
  modoFeed: ModoFeed;
  raioPesquisaKm: number;
  refreshing: boolean;
  onSelectMode: (mode: ModoFeed) => void;
}

export default function FeedModeSelector({
  modoFeed,
  raioPesquisaKm,
  refreshing,
  onSelectMode,
}: FeedModeSelectorProps) {
  return (
    <View
      style={[styles.feedModeCarouselPage, styles.feedModeButtonsPage]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ocorrências locais"
        accessibilityHint={`Mostra ocorrências dentro do raio de ${raioPesquisaKm} km`}
        accessibilityState={{
          selected: modoFeed === "PROXIMIDADE",
          disabled: refreshing,
        }}
        disabled={refreshing}
        onPress={() => onSelectMode("PROXIMIDADE")}
        style={({ pressed }) => [
          styles.feedModeButton,
          modoFeed === "PROXIMIDADE" && styles.feedModeButtonActive,
          pressed && !refreshing && styles.feedModeButtonPressed,
        ]}
      >
        <View
          style={[
            styles.feedModeIconBox,
            modoFeed === "PROXIMIDADE" && styles.feedModeIconBoxActive,
          ]}
        >
          <Ionicons
            name="location-outline"
            size={24}
            color={
              modoFeed === "PROXIMIDADE"
                ? theme.colors.surface
                : theme.colors.brand
            }
          />
        </View>

        <View style={styles.feedModeContent}>
          <Text
            style={[
              styles.feedModeTitle,
              modoFeed === "PROXIMIDADE" && styles.feedModeTitleActive,
            ]}
            numberOfLines={1}
          >
            Ocorrências locais
          </Text>
          <Text
            style={[
              styles.feedModeSubtitle,
              modoFeed === "PROXIMIDADE" && styles.feedModeSubtitleActive,
            ]}
            numberOfLines={1}
          >
            Até {raioPesquisaKm} km
          </Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ocorrências mais ecoadas"
        accessibilityHint="Mostra ocorrências globais priorizando as que receberam mais Ecos"
        accessibilityState={{
          selected: modoFeed === "ECO",
          disabled: refreshing,
        }}
        disabled={refreshing}
        onPress={() => onSelectMode("ECO")}
        style={({ pressed }) => [
          styles.feedModeButton,
          modoFeed === "ECO" && styles.feedModeButtonActive,
          pressed && !refreshing && styles.feedModeButtonPressed,
        ]}
      >
        <View
          style={[
            styles.feedModeIconBox,
            modoFeed === "ECO" && styles.feedModeIconBoxActive,
          ]}
        >
          <Image
            source={require(
              "../../../../../assets/ChatGPT Image 15 de ago. de 2026, 11_30_55.png"
            )}
            resizeMode="contain"
            style={[
              styles.feedModeEcoIcon,
              {
                tintColor:
                  modoFeed === "ECO"
                    ? theme.colors.surface
                    : theme.colors.brand,
              },
            ]}
          />
        </View>

        <View style={styles.feedModeContent}>
          <Text
            style={[
              styles.feedModeTitle,
              modoFeed === "ECO" && styles.feedModeTitleActive,
            ]}
            numberOfLines={1}
          >
            ECO
          </Text>
          <Text
            style={[
              styles.feedModeSubtitle,
              modoFeed === "ECO" && styles.feedModeSubtitleActive,
            ]}
            numberOfLines={1}
          >
            Mais ecoadas
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
