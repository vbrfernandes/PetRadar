import React, { useRef } from "react";
import { ScrollView, View } from "react-native";

import type { FiltroFeed, ModoFeed } from "../../types/feed.types";
import { feedControlsStyles as styles } from "../../styles/feedControls.styles";
import FeedFilterChips from "./FeedFilterChips";
import FeedModeSelector from "./FeedModeSelector";
import FeedSearch from "./FeedSearch";

interface FeedControlsProps {
  search: string;
  modoFeed: ModoFeed;
  filtro: FiltroFeed;
  raioPesquisaKm: number;
  refreshing: boolean;
  quantidadeOcorrenciasFiltradas: number;
  onSearchChange: (value: string) => void;
  onSelectMode: (mode: ModoFeed) => void;
  onFilterChange: (filter: FiltroFeed) => void;
}

export default function FeedControls({
  search,
  modoFeed,
  filtro,
  raioPesquisaKm,
  refreshing,
  quantidadeOcorrenciasFiltradas,
  onSearchChange,
  onSelectMode,
  onFilterChange,
}: FeedControlsProps) {
  const feedModeCarouselRef = useRef<ScrollView | null>(null);

  return (
    <>
      <View style={styles.feedModeCarouselWrapper}>
        <ScrollView
          ref={feedModeCarouselRef}
          horizontal
          pagingEnabled
          bounces={false}
          scrollEnabled={!refreshing}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          decelerationRate="fast"
        >
          <FeedSearch
            search={search}
            quantidadeOcorrenciasFiltradas={
              quantidadeOcorrenciasFiltradas
            }
            onSearchChange={onSearchChange}
          />
          <FeedModeSelector
            modoFeed={modoFeed}
            raioPesquisaKm={raioPesquisaKm}
            refreshing={refreshing}
            onSelectMode={onSelectMode}
          />
        </ScrollView>
      </View>

      <FeedFilterChips filtro={filtro} onFilterChange={onFilterChange} />
    </>
  );
}
