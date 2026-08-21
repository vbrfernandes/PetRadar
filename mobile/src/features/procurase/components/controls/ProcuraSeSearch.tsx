import React from "react";

import { Pressable, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { procuraSeControlsStyles as styles } from "../../styles/procuraseControls.styles";

interface ProcuraSeSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ProcuraSeSearch({
  search,
  onSearchChange,
}: ProcuraSeSearchProps) {
  return (
    <View style={styles.searchBox}>
      <Ionicons
        name="search-outline"
        size={19}
        color={theme.colors.textBody}
      />

      <TextInput
        value={search}
        onChangeText={onSearchChange}
        placeholder="Pesquisar animal ou local..."
        placeholderTextColor={theme.colors.textBody}
        style={styles.searchInput}
        returnKeyType="search"
      />

      {search.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpar pesquisa"
          hitSlop={8}
          onPress={() => onSearchChange("")}
        >
          <Ionicons
            name="close-circle"
            size={19}
            color={theme.colors.textBody}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
