import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { feedBannerStyles as styles } from "../../styles/feedBanner.styles";

const AUTO_PLAY_INTERVAL_MS = 6000;

type FeedBannerType = "APP" | "SPONSORED";

interface FeedBannerItem {
  id: string;
  type: FeedBannerType;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const BANNERS: FeedBannerItem[] = [
  {
    id: "comunidade",
    type: "APP",
    title: "Juntos fazemos a diferença",
    description:
      "Acompanhe ocorrências próximas e ajude animais que precisam de cuidado.",
    icon: "heart-pulse",
  },
  {
    id: "registrar",
    type: "APP",
    title: "Viu um animal precisando de ajuda?",
    description:
      "Registre uma ocorrência e ajude a comunidade da região a encontrá-lo e acompanhá-lo.",
    icon: "map-marker-plus-outline",
  },
  {
    id: "ecoar",
    type: "APP",
    title: "Faça a informação chegar mais longe",
    description:
      "Use o Eco para aumentar a visibilidade das ocorrências que precisam de atenção.",
    icon: "access-point-network",
  },
];

export default function FeedBannerCarousel() {
  const { width: windowWidth } = useWindowDimensions();
  const bannerWidth = Math.max(
    1,
    windowWidth - theme.spacing.globalMargin * 2,
  );
  const listRef = useRef<FlatList<FeedBannerItem>>(null);
  const activeIndexRef = useRef(0);
  const interactingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const atualizarIndice = useCallback((index: number) => {
    const indiceSeguro = Math.max(0, Math.min(BANNERS.length - 1, index));

    activeIndexRef.current = indiceSeguro;
    setActiveIndex(indiceSeguro);
  }, []);

  const irParaBanner = useCallback(
    (index: number, animated = true) => {
      atualizarIndice(index);
      listRef.current?.scrollToIndex({ index, animated });
    },
    [atualizarIndice],
  );

  useEffect(() => {
    if (BANNERS.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      if (interactingRef.current) {
        return;
      }

      const proximoIndice = (activeIndexRef.current + 1) % BANNERS.length;
      irParaBanner(proximoIndice, true);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [irParaBanner]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const novoIndice = Math.round(offsetX / bannerWidth);

      atualizarIndice(novoIndice);
      interactingRef.current = false;
    },
    [atualizarIndice, bannerWidth],
  );

  const renderBanner = useCallback(
    ({ item }: { item: FeedBannerItem }) => {
      const patrocinado = item.type === "SPONSORED";

      return (
        <View style={[styles.slide, { width: bannerWidth }]}>
          <View style={styles.banner}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.icon}
                size={25}
                color={theme.colors.brand}
              />
            </View>

            <View style={styles.content}>
              {patrocinado ? (
                <Text style={styles.sponsoredLabel}>Patrocinado</Text>
              ) : (
                <Text style={styles.appLabel}>PetRadar</Text>
              )}

              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.description} numberOfLines={3}>
                {item.description}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [bannerWidth],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderBanner}
        getItemLayout={(_, index) => ({
          length: bannerWidth,
          offset: bannerWidth * index,
          index,
        })}
        onScrollBeginDrag={() => {
          interactingRef.current = true;
        }}
        onScrollEndDrag={() => {
          interactingRef.current = false;
        }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      <View
        style={styles.pagination}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {BANNERS.map((banner, index) => {
          const ativo = index === activeIndex;

          return (
            <View
              key={banner.id}
              style={[
                styles.paginationDot,
                ativo && styles.paginationDotActive,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}
