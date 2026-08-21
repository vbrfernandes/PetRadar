import React from "react";
import { Animated, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { mapScreenStyles as styles } from "../../styles/map.styles";

interface MapDiscoveryStatusProps {
  discoveryVisible: boolean;
  discoveryAnim: Animated.Value;
}

export function MapDiscoveryStatus({
  discoveryVisible,
  discoveryAnim,
}: MapDiscoveryStatusProps) {
  return (
    <View style={styles.statusCardContainer} pointerEvents="none">
      {discoveryVisible && (
        <Animated.View
          style={[
            styles.statusCard,
            {
              opacity: discoveryAnim,
              transform: [
                {
                  translateY: discoveryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.statusIcon}>
            <MaterialCommunityIcons
              name="map-marker-radius-outline"
              size={20}
              color={theme.colors.brand}
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>Área de busca</Text>

            <Text style={styles.statusDescription}>
              Explorando ocorrências próximas
            </Text>
          </View>
        </Animated.View>
      )}

      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />

        <Text style={styles.liveText}>ATIVO</Text>
      </View>
    </View>
  );
}
