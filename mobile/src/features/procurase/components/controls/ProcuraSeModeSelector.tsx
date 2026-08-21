import React from "react";

import { Image, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { procuraSeControlsStyles as styles } from "../../styles/procuraseControls.styles";
import type { ModoProcuraSe } from "../../types/procurase.types";

interface ProcuraSeModeSelectorProps {
  mode: ModoProcuraSe;
  raioPesquisaKm: number;
  refreshing: boolean;
  onSelectMode: (mode: ModoProcuraSe) => void;
}

export default function ProcuraSeModeSelector({
  mode,
  raioPesquisaKm,
  refreshing,
  onSelectMode,
}: ProcuraSeModeSelectorProps) {
  return (
    <View style={[styles.feedModeCarouselPage, styles.feedModeButtonsPage]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ocorrências locais"
        accessibilityHint={`Mostra ocorrências dentro do raio de ${raioPesquisaKm} km`}
        accessibilityState={{
          selected: mode === "PROXIMIDADE",
          disabled: refreshing,
        }}
        disabled={refreshing}
        onPress={() => onSelectMode("PROXIMIDADE")}
        style={({ pressed }) => [
          styles.feedModeButton,
          mode === "PROXIMIDADE" && styles.feedModeButtonActive,
          pressed && !refreshing && styles.feedModeButtonPressed,
        ]}
      >
        <View
          style={[
            styles.feedModeIconBox,
            mode === "PROXIMIDADE" && styles.feedModeIconBoxActive,
          ]}
        >
          <Ionicons
            name="location-outline"
            size={24}
            color={
              mode === "PROXIMIDADE"
                ? theme.colors.surface
                : theme.colors.brand
            }
          />
        </View>

        <View style={styles.feedModeContent}>
          <Text
            style={[
              styles.feedModeTitle,
              mode === "PROXIMIDADE" && styles.feedModeTitleActive,
            ]}
            numberOfLines={1}
          >
            Ocorrências locais
          </Text>
          <Text
            style={[
              styles.feedModeSubtitle,
              mode === "PROXIMIDADE" && styles.feedModeSubtitleActive,
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
          selected: mode === "ECO",
          disabled: refreshing,
        }}
        disabled={refreshing}
        onPress={() => onSelectMode("ECO")}
        style={({ pressed }) => [
          styles.feedModeButton,
          mode === "ECO" && styles.feedModeButtonActive,
          pressed && !refreshing && styles.feedModeButtonPressed,
        ]}
      >
        <View
          style={[
            styles.feedModeIconBox,
            mode === "ECO" && styles.feedModeIconBoxActive,
          ]}
        >
          <Image
            source={require("../../../../../assets/images/ChatGPT Image 15 de ago. de 2026, 11_30_55.png")}
            resizeMode="contain"
            style={[
              styles.feedModeEcoIcon,
              {
                tintColor:
                  mode === "ECO"
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
              mode === "ECO" && styles.feedModeTitleActive,
            ]}
            numberOfLines={1}
          >
            ECO
          </Text>
          <Text
            style={[
              styles.feedModeSubtitle,
              mode === "ECO" && styles.feedModeSubtitleActive,
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
