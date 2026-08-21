import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import type { FiltroFeed, ModoFeed } from "../../types/feed.types";
import { feedButtonPressedStyle } from "../../styles/feedScreen.styles";
import { feedStatesStyles as styles } from "../../styles/feedStates.styles";

interface FeedEmptyStateProps {
  totalOcorrencias: number;
  modoFeed: ModoFeed;
  raioPesquisaKm: number;
  search: string;
  filtro: FiltroFeed;
  onClearFilters: () => void;
}

export default function FeedEmptyState({
  totalOcorrencias,
  modoFeed,
  raioPesquisaKm,
  search,
  filtro,
  onClearFilters,
}: FeedEmptyStateProps) {
  const mensagem =
    totalOcorrencias === 0
      ? modoFeed === "ECO"
        ? "Não encontramos ocorrências disponíveis no modo Eco."
        : `Não encontramos ocorrências dentro do raio de ${raioPesquisaKm} km.`
      : "Não encontramos ocorrências correspondentes à pesquisa ou ao filtro selecionado.";
  const mostrarLimpar =
    (modoFeed === "PROXIMIDADE" && Boolean(search)) || filtro !== "TODAS";

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons
          name="paw-outline"
          size={34}
          color={theme.colors.brand}
        />
      </View>
      <Text style={styles.emptyTitle}>Nenhuma ocorrência encontrada</Text>
      <Text style={styles.emptyText}>{mensagem}</Text>

      {mostrarLimpar ? (
        <Pressable
          onPress={onClearFilters}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && feedButtonPressedStyle,
          ]}
        >
          <Text style={styles.clearButtonText}>Limpar filtros</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
