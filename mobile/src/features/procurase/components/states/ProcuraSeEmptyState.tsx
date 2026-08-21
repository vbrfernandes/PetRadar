import React from "react";

import { Pressable, Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { procuraSeButtonPressedStyle } from "../../styles/procuraseScreen.styles";
import { procuraSeStatesStyles as styles } from "../../styles/procuraseStates.styles";
import type {
  FiltroProcuraSe,
  ModoProcuraSe,
} from "../../types/procurase.types";

interface ProcuraSeEmptyStateProps {
  hasOccurrences: boolean;
  mode: ModoProcuraSe;
  raioPesquisaKm: number;
  search: string;
  filter: FiltroProcuraSe;
  onClearFilters: () => void;
}

export default function ProcuraSeEmptyState({
  hasOccurrences,
  mode,
  raioPesquisaKm,
  search,
  filter,
  onClearFilters,
}: ProcuraSeEmptyStateProps) {
  const description = !hasOccurrences
    ? mode === "ECO"
      ? "Não encontramos ocorrências disponíveis no modo Eco."
      : `Não encontramos ocorrências dentro do raio de ${raioPesquisaKm} km.`
    : "Não encontramos ocorrências correspondentes à pesquisa ou ao filtro selecionado.";

  const canClearFilters =
    (mode === "PROXIMIDADE" && Boolean(search)) || filter !== "TODAS";

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
      <Text style={styles.emptyText}>{description}</Text>

      {canClearFilters ? (
        <Pressable
          onPress={onClearFilters}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && procuraSeButtonPressedStyle,
          ]}
        >
          <Text style={styles.clearButtonText}>Limpar filtros</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
