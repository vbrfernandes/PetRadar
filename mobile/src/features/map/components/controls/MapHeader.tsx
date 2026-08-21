import React from "react";
import {
  Animated,
  Image,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { mapScreenStyles as styles } from "../../styles/map.styles";

interface MapHeaderProps {
  search: string;
  profilePhoto: string | null;
  searchFocusAnim: Animated.Value;
  onChangeSearch: (value: string) => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  onOpenMenu: () => void;
  onOpenFilters: () => void;
  onOpenProfile: () => void;
}

export function MapHeader({
  search,
  profilePhoto,
  searchFocusAnim,
  onChangeSearch,
  onSearchFocus,
  onSearchBlur,
  onOpenMenu,
  onOpenFilters,
  onOpenProfile,
}: MapHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
        onPress={onOpenMenu}
        style={({ pressed }) => [
          styles.headerIconButton,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name="menu-outline"
          size={24}
          color={theme.colors.textTitle}
        />
      </Pressable>

      <Animated.View
        style={[
          styles.searchBox,
          {
            borderColor: searchFocusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["transparent", theme.colors.brand],
            }),
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={19}
          color={theme.colors.textBody}
        />

        <TextInput
          value={search}
          onChangeText={onChangeSearch}
          placeholder="Buscar no mapa"
          placeholderTextColor={theme.colors.textBody}
          style={styles.searchInput}
          returnKeyType="search"
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
          accessibilityLabel="Buscar no mapa"
        />

        {search.length > 0 && (
          <Pressable onPress={() => onChangeSearch("")} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.colors.textBody}
            />
          </Pressable>
        )}
      </Animated.View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir filtros"
        onPress={onOpenFilters}
        style={({ pressed }) => [
          styles.headerFilterButton,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name="options-outline"
          size={20}
          color={theme.colors.textTitle}
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir perfil"
        onPress={onOpenProfile}
        style={({ pressed }) => [
          styles.avatarButton,
          pressed && styles.pressed,
        ]}
      >
        <Image
          source={{
            uri: profilePhoto || "https://i.pravatar.cc/150?img=11",
          }}
          style={styles.avatarImage}
        />

        <View style={styles.onlineIndicator} />
      </Pressable>
    </View>
  );
}
