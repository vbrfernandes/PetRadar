import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { feedControlsStyles as styles } from "../../styles/feedControls.styles";

interface FeedSearchProps {
  search: string;
  quantidadeOcorrenciasFiltradas: number;
  onSearchChange: (value: string) => void;
}

export default function FeedSearch({
  search,
  quantidadeOcorrenciasFiltradas,
  onSearchChange,
}: FeedSearchProps) {
  return (
    <View style={styles.feedModeCarouselPage}>
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

      <View style={styles.feedSectionHeader}>
        <View style={styles.feedSectionText}>
          <Text style={styles.feedSectionTitle}>Ocorrências</Text>
          <Text style={styles.feedSectionSubtitle}>
            Ordenadas da mais próxima para a mais distante
          </Text>
        </View>

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {quantidadeOcorrenciasFiltradas}
          </Text>
        </View>
      </View>
    </View>
  );
}
