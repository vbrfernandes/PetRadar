import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { profileDetailStyles as styles } from "../../styles/detail/profileDetail.styles";
import type { ProfileTab } from "../../types/profile.types";

interface ProfileTabBarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  mostrarPets: boolean;
}

function ProfileTabBar({
  activeTab,
  onTabChange,
  mostrarPets,
}: ProfileTabBarProps) {
  return (
    <View style={styles.tabContainer}>
      <Pressable
        style={[
          styles.tabButton,
          activeTab === "perfil" && styles.tabButtonActive,
        ]}
        onPress={() => onTabChange("perfil")}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === "perfil" }}
      >
        <View
          style={[
            styles.tabIconContainer,
            activeTab === "perfil" && styles.tabIconContainerActive,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={18}
            color={
              activeTab === "perfil"
                ? theme.colors.brand
                : theme.colors.textBody
            }
          />
        </View>
        <Text
          style={[
            styles.tabText,
            activeTab === "perfil" && styles.tabTextActive,
          ]}
        >
          Perfil
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.tabButton,
          activeTab === "ocorrencias" && styles.tabButtonActive,
        ]}
        onPress={() => onTabChange("ocorrencias")}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === "ocorrencias" }}
      >
        <View
          style={[
            styles.tabIconContainer,
            activeTab === "ocorrencias" && styles.tabIconContainerActive,
          ]}
        >
          <MaterialCommunityIcons
            name="paw-outline"
            size={19}
            color={
              activeTab === "ocorrencias"
                ? theme.colors.brand
                : theme.colors.textBody
            }
          />
        </View>
        <Text
          style={[
            styles.tabText,
            activeTab === "ocorrencias" && styles.tabTextActive,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          Ocorrências
        </Text>
      </Pressable>

      {mostrarPets && (
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "pets" && styles.tabButtonActive,
          ]}
          onPress={() => onTabChange("pets")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "pets" }}
          accessibilityLabel="Meus pets"
        >
          <View
            style={[
              styles.tabIconContainer,
              activeTab === "pets" && styles.tabIconContainerActive,
            ]}
          >
            <MaterialCommunityIcons
              name="dog-side"
              size={19}
              color={
                activeTab === "pets"
                  ? theme.colors.brand
                  : theme.colors.textBody
              }
            />
          </View>
          <Text
            style={[
              styles.tabText,
              activeTab === "pets" && styles.tabTextActive,
            ]}
          >
            Pets
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export default React.memo(ProfileTabBar);
