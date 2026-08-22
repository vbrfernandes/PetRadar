import React, { useRef } from "react";

import { ScrollView, Text, View } from "react-native";

import { procuraSeControlsStyles as styles } from "../../styles/procuraseControls.styles";
import type {
  FiltroProcuraSe,
  ModoProcuraSe,
} from "../../types/procurase.types";
import ProcuraSeFilterChips from "./ProcuraSeFilterChips";
import ProcuraSeModeSelector from "./ProcuraSeModeSelector";
import ProcuraSeSearch from "./ProcuraSeSearch";

interface ProcuraSeControlsProps {
  search: string;
  mode: ModoProcuraSe;
  filter: FiltroProcuraSe;
  raioPesquisaKm: number;
  refreshing: boolean;
  quantidadeOcorrenciasFiltradas: number;
  onSearchChange: (value: string) => void;
  onSelectMode: (mode: ModoProcuraSe) => void;
  onFilterChange: (filter: FiltroProcuraSe) => void;
}

export default function ProcuraSeControls({
  search,
  mode,
  filter,
  raioPesquisaKm,
  refreshing,
  quantidadeOcorrenciasFiltradas,
  onSearchChange,
  onSelectMode,
  onFilterChange,
}: ProcuraSeControlsProps) {
  const modeCarouselRef = useRef<ScrollView | null>(null);

  return (
    <>
      <View style={styles.feedModeCarouselWrapper}>
        <ScrollView
          ref={modeCarouselRef}
          horizontal
          pagingEnabled
          bounces={false}
          scrollEnabled={!refreshing}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          decelerationRate="fast"
        >
          <View style={styles.feedModeCarouselPage}>
            <ProcuraSeSearch
              search={search}
              onSearchChange={onSearchChange}
            />

            <View style={styles.feedSectionHeader}>
              <View style={styles.feedSectionText}>
                <Text style={styles.feedSectionTitle}>Procura-se</Text>
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

          <ProcuraSeModeSelector
            mode={mode}
            raioPesquisaKm={raioPesquisaKm}
            refreshing={refreshing}
            onSelectMode={onSelectMode}
          />
        </ScrollView>
      </View>

      <ProcuraSeFilterChips
        filter={filter}
        onFilterChange={onFilterChange}
      />
    </>
  );
}
