// ============================================================
// D:\PetRadar\src\mobile\src\features\feed\components\FeedControls.tsx
// ============================================================

import React, {
  useRef,
} from "react";

import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  FiltroFeed,
  ModoFeed,
} from "../types/feed.types";

import {
  theme,
} from "../../../theme/colors";

import {
  feedButtonPressedStyle,
  feedControlsStyles as styles,
} from "../styles/feed.styles";


interface FiltroConfig {
  id: FiltroFeed;

  label: string;

  icon:
  keyof typeof Ionicons.glyphMap;
}

const FILTROS: FiltroConfig[] = [
  {
    id: "TODAS",
    label: "Todas",
    icon: "apps-outline",
  },

  {
    id: "PERDIDOS",
    label: "Perdidos",
    icon: "paw-outline",
  },

  {
    id: "AVISTADOS",
    label: "Avistados",
    icon: "eye-outline",
  },

  {
    id: "RUA",
    label: "Animal de rua",
    icon: "home-outline",
  },

  {
    id: "URGENTES",
    label: "Urgentes",
    icon: "warning-outline",
  },
];

interface FeedControlsProps {
  search: string;
  modoFeed: ModoFeed;
  filtro: FiltroFeed;
  raioPesquisaKm: number;
  refreshing: boolean;
  quantidadeOcorrenciasFiltradas: number;
  onSearchChange: (
    value: string,
  ) => void;
  onSelectMode: (
    mode: ModoFeed,
  ) => void;
  onFilterChange: (
    filter: FiltroFeed,
  ) => void;
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
  const feedModeCarouselRef =
    useRef<ScrollView | null>(
      null,
    );

  return (
    <>
      <View
        style={
          styles.feedModeCarouselWrapper
        }
      >
        <ScrollView
          ref={
            feedModeCarouselRef
          }
          horizontal
          pagingEnabled
          bounces={false}
          scrollEnabled={
            !refreshing
          }
          showsHorizontalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          decelerationRate="fast"
        >
          <View
            style={
              styles.feedModeCarouselPage
            }
          >
            <View
              style={
                styles.searchBox
              }
            >
              <Ionicons
                name="search-outline"
                size={19}
                color={
                  theme.colors
                    .textBody
                }
              />

              <TextInput
                value={
                  search
                }
                onChangeText={
                  onSearchChange
                }
                placeholder="Pesquisar animal ou local..."
                placeholderTextColor={
                  theme.colors
                    .textBody
                }
                style={
                  styles.searchInput
                }
                returnKeyType="search"
              />

              {search.length >
              0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpar pesquisa"
                  hitSlop={8}
                  onPress={() =>
                    onSearchChange(
                      "",
                    )
                  }
                >
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={
                      theme.colors
                        .textBody
                    }
                  />
                </Pressable>
              ) : null}
            </View>

            <View
              style={
                styles.feedSectionHeader
              }
            >
              <View
                style={
                  styles.feedSectionText
                }
              >
                <Text
                  style={
                    styles.feedSectionTitle
                  }
                >
                  Ocorrências
                </Text>

                <Text
                  style={
                    styles.feedSectionSubtitle
                  }
                >
                  Ordenadas da mais próxima para a mais distante
                </Text>
              </View>

              <View
                style={
                  styles.counterBadge
                }
              >
                <Text
                  style={
                    styles.counterText
                  }
                >
                  {
                    quantidadeOcorrenciasFiltradas
                  }
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.feedModeCarouselPage,
              styles.feedModeButtonsPage,
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ocorrências locais"
              accessibilityHint={`Mostra ocorrências dentro do raio de ${raioPesquisaKm} km`}
              accessibilityState={{
                selected:
                  modoFeed ===
                  "PROXIMIDADE",

                disabled:
                  refreshing,
              }}
              disabled={
                refreshing
              }
              onPress={() => {
                onSelectMode(
                  "PROXIMIDADE",
                );
              }}
              style={({
                pressed,
              }) => [
                  styles.feedModeButton,

                  modoFeed ===
                    "PROXIMIDADE" &&
                    styles.feedModeButtonActive,

                  pressed &&
                    !refreshing &&
                    styles.feedModeButtonPressed,
                ]}
            >
              <View
                style={[
                  styles.feedModeIconBox,

                  modoFeed ===
                    "PROXIMIDADE" &&
                    styles.feedModeIconBoxActive,
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={
                    modoFeed ===
                      "PROXIMIDADE"
                      ? theme.colors
                        .surface
                      : theme.colors
                        .brand
                  }
                />
              </View>

              <View
                style={
                  styles.feedModeContent
                }
              >
                <Text
                  style={[
                    styles.feedModeTitle,

                    modoFeed ===
                      "PROXIMIDADE" &&
                      styles.feedModeTitleActive,
                  ]}
                  numberOfLines={1}
                >
                  Ocorrências locais
                </Text>

                <Text
                  style={[
                    styles.feedModeSubtitle,

                    modoFeed ===
                      "PROXIMIDADE" &&
                      styles.feedModeSubtitleActive,
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
                selected:
                  modoFeed ===
                  "ECO",

                disabled:
                  refreshing,
              }}
              disabled={
                refreshing
              }
              onPress={() => {
                onSelectMode(
                  "ECO",
                );
              }}
              style={({
                pressed,
              }) => [
                  styles.feedModeButton,

                  modoFeed ===
                    "ECO" &&
                    styles.feedModeButtonActive,

                  pressed &&
                    !refreshing &&
                    styles.feedModeButtonPressed,
                ]}
            >
              <View
                style={[
                  styles.feedModeIconBox,

                  modoFeed ===
                    "ECO" &&
                    styles.feedModeIconBoxActive,
                ]}
              >
                <Image
                  source={require(
                    "../../../../assets/ChatGPT Image 15 de ago. de 2026, 11_30_55.png"
                  )}
                  resizeMode="contain"
                  style={[
                    styles.feedModeEcoIcon,

                    {
                      tintColor:
                        modoFeed ===
                          "ECO"
                          ? theme.colors
                            .surface
                          : theme.colors
                            .brand,
                    },
                  ]}
                />
              </View>

              <View
                style={
                  styles.feedModeContent
                }
              >
                <Text
                  style={[
                    styles.feedModeTitle,

                    modoFeed ===
                    "ECO" &&
                    styles.feedModeTitleActive,
                  ]}
                  numberOfLines={1}
                >
                  ECO
                </Text>

                <Text
                  style={[
                    styles.feedModeSubtitle,

                    modoFeed ===
                    "ECO" &&
                    styles.feedModeSubtitleActive,
                  ]}
                  numberOfLines={1}
                >
                  Mais ecoadas
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.filtersContent
        }
      >
        {FILTROS.map(
          (
            item,
          ) => {
            const ativo =
              filtro ===
              item.id;

            return (
              <Pressable
                key={
                  item.id
                }
                accessibilityRole="button"
                accessibilityLabel={`Filtrar por ${item.label}`}
                onPress={() =>
                  onFilterChange(
                    item.id,
                  )
                }
                style={({
                  pressed,
                }) => [
                    styles.filterChip,

                    ativo &&
                    styles.filterChipActive,

                    pressed &&
                    feedButtonPressedStyle,
                  ]}
              >
                <Ionicons
                  name={
                    item.icon
                  }
                  size={15}
                  color={
                    ativo
                      ? theme
                        .colors
                        .surface
                      : theme
                        .colors
                        .brand
                  }
                />

                <Text
                  style={[
                    styles.filterText,

                    ativo &&
                    styles.filterTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          },
        )}
      </ScrollView>
    </>
  );
}