import React from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { FEED_FILTERS } from "../../constants/feed.constants";
import type { FiltroFeed } from "../../types/feed.types";
import { feedControlsStyles as styles } from "../../styles/feedControls.styles";
import { feedButtonPressedStyle } from "../../styles/feedScreen.styles";

interface FeedFilterChipsProps {
  filtro: FiltroFeed;
  onFilterChange: (filter: FiltroFeed) => void;
}

export default function FeedFilterChips({
  filtro,
  onFilterChange,
}: FeedFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContent}
    >
      {FEED_FILTERS.map((item) => {
        const ativo = filtro === item.id;

        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar por ${item.label}`}
            onPress={() => onFilterChange(item.id)}
            style={({ pressed }) => [
              styles.filterChip,
              ativo && styles.filterChipActive,
              pressed && feedButtonPressedStyle,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={15}
              color={ativo ? theme.colors.surface : theme.colors.brand}
            />
            <Text
              style={[styles.filterText, ativo && styles.filterTextActive]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
