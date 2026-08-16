// ============================================================
// D:\PetRadar\src\mobile\src\features\feed\components\FeedControls.tsx
// ============================================================

import React, {
  useRef,
} from "react";

import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
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
} from "../styles/feed.styles";

const FEED_MODE_CAROUSEL_WIDTH =
  Dimensions.get("window").width -
  theme.spacing.globalMargin * 2;

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

const styles =
  StyleSheet.create({
    feedModeCarouselWrapper: {
      width: "100%",

      overflow:
        "hidden",
    },

    feedModeCarouselPage: {
      width:
        FEED_MODE_CAROUSEL_WIDTH,
    },

    searchBox: {
      width: "100%",
      minHeight: 48,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        14,

      borderRadius:
        15,

      backgroundColor:
        theme.colors
          .surface,

      ...theme.shadows
        .elevation1,
    },

    searchInput: {
      flex: 1,

      height: 48,

      marginLeft: 9,

      color:
        theme.colors
          .textTitle,

      fontSize: 13,
    },

    feedSectionHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginTop: 22,

      marginBottom:
        12,
    },

    feedSectionText: {
      flex: 1,

      paddingRight: 12,
    },

    feedSectionTitle: {
      color:
        theme.colors
          .textTitle,

      fontSize: 16,

      fontWeight:
        "900",
    },

    feedSectionSubtitle: {
      marginTop: 3,

      color:
        theme.colors
          .textBody,

      fontSize: 10,
    },

    counterBadge: {
      minWidth: 34,
      height: 30,

      paddingHorizontal:
        9,

      borderRadius:
        theme.radius
          .button,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .inputBg,
    },

    counterText: {
      color:
        theme.colors
          .brand,

      fontSize: 11,

      fontWeight:
        "900",
    },

    feedModeButtonsPage: {
      minHeight: 112,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 10,

      paddingBottom: 12,
    },

    feedModeButton: {
      flex: 1,

      minWidth: 0,
      minHeight: 88,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal: 12,

      borderWidth: 1,

      borderColor:
        theme.colors
          .inputBg,

      borderRadius: 18,

      backgroundColor:
        theme.colors
          .surface,

      ...theme.shadows
        .elevation1,
    },

    feedModeButtonActive: {
      borderColor:
        theme.colors
          .brand,

      backgroundColor:
        theme.colors
          .brand,
    },

    feedModeButtonPressed: {
      opacity: 0.82,

      transform: [
        {
          scale: 0.985,
        },
      ],
    },

    feedModeIconBox: {
      width: 42,
      height: 42,

      flexShrink: 0,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius: 14,

      backgroundColor:
        theme.colors
          .semantic
          .success
          .bg,
    },

    feedModeIconBoxActive: {
      backgroundColor:
        theme.colors
          .action,
    },

    feedModeEcoIcon: {
      width: 26,
      height: 26,
    },

    feedModeContent: {
      flex: 1,

      minWidth: 0,

      marginLeft: 10,
    },

    feedModeTitle: {
      color:
        theme.colors
          .textTitle,

      fontSize: 12,

      fontWeight:
        "900",
    },

    feedModeTitleActive: {
      color:
        theme.colors
          .surface,
    },

    feedModeSubtitle: {
      marginTop: 4,

      color:
        theme.colors
          .textBody,

      fontSize: 9,

      fontWeight:
        "600",
    },

    feedModeSubtitleActive: {
      color:
        theme.colors
          .surface,
    },

    filtersContent: {
      gap: 8,

      paddingBottom:
        14,

      paddingRight:
        6,
    },

    filterChip: {
      minHeight: 38,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 6,

      paddingHorizontal:
        13,

      borderRadius:
        theme.radius
          .button,

      borderWidth:
        1,

      borderColor:
        theme.colors
          .inputBg,

      backgroundColor:
        theme.colors
          .surface,
    },

    filterChipActive: {
      borderColor:
        theme.colors
          .brand,

      backgroundColor:
        theme.colors
          .brand,
    },

    filterText: {
      color:
        theme.colors
          .textBody,

      fontSize: 11,

      fontWeight:
        "700",
    },

    filterTextActive: {
      color:
        theme.colors
          .surface,
    },
  });
