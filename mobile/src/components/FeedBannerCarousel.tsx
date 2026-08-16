// ============================================================
// D:\PetRadar\src\mobile\src\components\FeedBannerCarousel.tsx
// ============================================================

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  theme,
} from "../theme/colors";

// ============================================================
// CONSTANTES
// ============================================================

const AUTO_PLAY_INTERVAL_MS =
  6000;

// ============================================================
// TIPAGEM
// ============================================================

type FeedBannerType =
  | "APP"
  | "SPONSORED";

interface FeedBannerItem {
  id: string;

  type: FeedBannerType;

  title: string;

  description: string;

  icon:
    keyof typeof MaterialCommunityIcons.glyphMap;
}

// ============================================================
// BANNERS INTERNOS
// ============================================================
//
// Por enquanto todos são comunicações oficiais do PetRadar.
//
// Futuramente esta lista poderá ser substituída ou complementada
// por dados recebidos do backend.
//
// type: "APP"
// -> comunicação oficial do PetRadar.
//
// type: "SPONSORED"
// -> publicidade paga, exibindo "Patrocinado" no card.
// ============================================================

const BANNERS:
  FeedBannerItem[] = [
    {
      id:
        "comunidade",

      type:
        "APP",

      title:
        "Juntos fazemos a diferença",

      description:
        "Acompanhe ocorrências próximas e ajude animais que precisam de cuidado.",

      icon:
        "heart-pulse",
    },

    {
      id:
        "registrar",

      type:
        "APP",

      title:
        "Viu um animal precisando de ajuda?",

      description:
        "Registre uma ocorrência e ajude a comunidade da região a encontrá-lo e acompanhá-lo.",

      icon:
        "map-marker-plus-outline",
    },

    {
      id:
        "ecoar",

      type:
        "APP",

      title:
        "Faça a informação chegar mais longe",

      description:
        "Use o Eco para aumentar a visibilidade das ocorrências que precisam de atenção.",

      icon:
        "access-point-network",
    },
  ];

// ============================================================
// COMPONENTE
// ============================================================

export default function FeedBannerCarousel() {
  const {
    width:
      windowWidth,
  } =
    useWindowDimensions();

  // O componente fica dentro da FlatList do Feed,
  // que já possui globalMargin dos dois lados.

  const bannerWidth =
    Math.max(
      1,

      windowWidth -
        theme.spacing
          .globalMargin *
          2,
    );

  const listRef =
    useRef<
      FlatList<FeedBannerItem>
    >(null);

  const activeIndexRef =
    useRef(0);

  const interactingRef =
    useRef(false);

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  // ==========================================================
  // ATUALIZAR ÍNDICE
  // ==========================================================

  const atualizarIndice =
    useCallback(
      (
        index:
          number,
      ) => {
        const indiceSeguro =
          Math.max(
            0,

            Math.min(
              BANNERS.length -
                1,

              index,
            ),
          );

        activeIndexRef.current =
          indiceSeguro;

        setActiveIndex(
          indiceSeguro,
        );
      },
      [],
    );

  // ==========================================================
  // IR PARA BANNER
  // ==========================================================

  const irParaBanner =
    useCallback(
      (
        index:
          number,

        animated =
          true,
      ) => {
        atualizarIndice(
          index,
        );

        listRef.current
          ?.scrollToIndex({
            index,

            animated,
          });
      },
      [
        atualizarIndice,
      ],
    );

  // ==========================================================
  // AUTO PLAY
  // ==========================================================

  useEffect(
    () => {
      if (
        BANNERS.length <=
        1
      ) {
        return;
      }

      const interval =
        setInterval(
          () => {
            // Evita trocar automaticamente
            // enquanto o usuário está deslizando.

            if (
              interactingRef
                .current
            ) {
              return;
            }

            const proximoIndice =
              (
                activeIndexRef
                  .current +
                1
              ) %
              BANNERS.length;

            irParaBanner(
              proximoIndice,
              true,
            );
          },

          AUTO_PLAY_INTERVAL_MS,
        );

      return () => {
        clearInterval(
          interval,
        );
      };
    },
    [
      irParaBanner,
    ],
  );

  // ==========================================================
  // SWIPE MANUAL
  // ==========================================================

  const handleMomentumScrollEnd =
    useCallback(
      (
        event:
          NativeSyntheticEvent<
            NativeScrollEvent
          >,
      ) => {
        const offsetX =
          event.nativeEvent
            .contentOffset
            .x;

        const novoIndice =
          Math.round(
            offsetX /
              bannerWidth,
          );

        atualizarIndice(
          novoIndice,
        );

        interactingRef.current =
          false;
      },
      [
        atualizarIndice,
        bannerWidth,
      ],
    );

  // ==========================================================
  // RENDERIZAÇÃO
  // ==========================================================

  const renderBanner =
    useCallback(
      ({
        item,
      }: {
        item:
          FeedBannerItem;
      }) => {
        const patrocinado =
          item.type ===
          "SPONSORED";

        return (
          <View
            style={[
              styles.slide,

              {
                width:
                  bannerWidth,
              },
            ]}
          >
            <View
              style={
                styles.banner
              }
            >
              <View
                style={
                  styles.iconContainer
                }
              >
                <MaterialCommunityIcons
                  name={
                    item.icon
                  }
                  size={25}
                  color={
                    theme.colors
                      .brand
                  }
                />
              </View>

              <View
                style={
                  styles.content
                }
              >
                {patrocinado ? (
                  <Text
                    style={
                      styles.sponsoredLabel
                    }
                  >
                    Patrocinado
                  </Text>
                ) : (
                  <Text
                    style={
                      styles.appLabel
                    }
                  >
                    PetRadar
                  </Text>
                )}

                <Text
                  style={
                    styles.title
                  }
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.description
                  }
                  numberOfLines={3}
                >
                  {
                    item.description
                  }
                </Text>
              </View>
            </View>
          </View>
        );
      },
      [
        bannerWidth,
      ],
    );

  return (
    <View
      style={
        styles.container
      }
    >
      <FlatList
        ref={
          listRef
        }
        data={
          BANNERS
        }
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={
          false
        }
        keyExtractor={(
          item,
        ) =>
          item.id
        }
        renderItem={
          renderBanner
        }
        getItemLayout={(
          _,
          index,
        ) => ({
          length:
            bannerWidth,

          offset:
            bannerWidth *
            index,

          index,
        })}
        onScrollBeginDrag={() => {
          interactingRef.current =
            true;
        }}
        onScrollEndDrag={() => {
          // Caso não haja momentum,
          // permite que o autoplay volte.
          interactingRef.current =
            false;
        }}
        onMomentumScrollEnd={
          handleMomentumScrollEnd
        }
      />

      {/* ======================================================
          INDICADORES
      ====================================================== */}

      <View
        style={
          styles.pagination
        }
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {BANNERS.map(
          (
            banner,
            index,
          ) => {
            const ativo =
              index ===
              activeIndex;

            return (
              <View
                key={
                  banner.id
                }
                style={[
                  styles.paginationDot,

                  ativo &&
                    styles.paginationDotActive,
                ]}
              />
            );
          },
        )}
      </View>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles =
  StyleSheet.create({
    container: {
      width:
        "100%",

      marginTop: 4,

      marginBottom:
        14,
    },

    slide: {
      justifyContent:
        "center",
    },

    banner: {
      minHeight: 104,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        16,

      paddingVertical:
        14,

      borderRadius:
        theme.radius
          .card,

      backgroundColor:
        theme.colors
          .brand,

      ...theme.shadows
        .elevation1,

        marginRight:
          12,
    },

    iconContainer: {
      width: 48,
      height: 48,

      flexShrink: 0,

      borderRadius:
        16,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        theme.colors
          .surface,
    },

    content: {
      flex: 1,

      minWidth: 0,

      marginLeft:
        13,
    },

    appLabel: {
      marginBottom:
        3,

      color:
        theme.colors
          .surface,

      fontSize: 8,

      fontWeight:
        "700",

      opacity:
        0.8,

      textTransform:
        "uppercase",

      letterSpacing:
        0.7,
    },

    sponsoredLabel: {
      alignSelf:
        "flex-start",

      marginBottom:
        4,

      paddingHorizontal:
        6,

      paddingVertical:
        2,

      borderRadius:
        theme.radius
          .button,

      color:
        theme.colors
          .brand,

      fontSize: 8,

      fontWeight:
        "800",

      backgroundColor:
        theme.colors
          .surface,
    },

    title: {
      color:
        theme.colors
          .surface,

      fontSize: 14,

      lineHeight: 18,

      fontWeight:
        "900",
    },

    description: {
      marginTop: 4,

      color:
        theme.colors
          .surface,

      fontSize: 10,

      lineHeight: 15,

      opacity:
        0.92,
    },

    pagination: {
      minHeight: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 5,

      paddingTop:
        8,
    },

    paginationDot: {
      width: 6,
      height: 6,

      borderRadius:
        3,

      backgroundColor:
        theme.colors
          .inputBg,
    },

    paginationDotActive: {
      width: 17,

      backgroundColor:
        theme.colors
          .brand,
    },
  });