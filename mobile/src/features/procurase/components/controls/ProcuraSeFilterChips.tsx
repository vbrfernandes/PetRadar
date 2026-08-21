import React from "react";

import { Pressable, ScrollView, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { PROCURA_SE_FILTERS } from "../../constants/procurase.constants";
import { procuraSeControlsStyles as styles } from "../../styles/procuraseControls.styles";
import { procuraSeButtonPressedStyle } from "../../styles/procuraseScreen.styles";
import type { FiltroProcuraSe } from "../../types/procurase.types";

interface ProcuraSeFilterChipsProps {
  filter: FiltroProcuraSe;
  onFilterChange: (filter: FiltroProcuraSe) => void;
}

export default function ProcuraSeFilterChips({
  filter,
  onFilterChange,
}: ProcuraSeFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContent}
    >
      {PROCURA_SE_FILTERS.map((item) => {
        const active = filter === item.id;

        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar por ${item.label}`}
            onPress={() => onFilterChange(item.id)}
            style={({ pressed }) => [
              styles.filterChip,
              active && styles.filterChipActive,
              pressed && procuraSeButtonPressedStyle,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={15}
              color={active ? theme.colors.surface : theme.colors.brand}
            />
            <Text
              style={[
                styles.filterText,
                active && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
