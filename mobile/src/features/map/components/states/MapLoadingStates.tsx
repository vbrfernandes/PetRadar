import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { theme } from "../../../../theme/colors";
import { mapScreenStyles as styles } from "../../styles/map.styles";

interface MapLoadingStatesProps {
  loadingLocation: boolean;
  loadingOcorrencias: boolean;
}

export function MapLoadingStates({
  loadingLocation,
  loadingOcorrencias,
}: MapLoadingStatesProps) {
  return (
    <>
      {loadingLocation && (
        <View style={styles.locationLoading} pointerEvents="none">
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.brand} />

            <Text style={styles.loadingText}>Localizando você...</Text>
          </View>
        </View>
      )}

      {loadingOcorrencias && !loadingLocation && (
        <View style={styles.ocorrenciasLoading} pointerEvents="none">
          <View style={styles.ocorrenciasLoadingBadge}>
            <ActivityIndicator size="small" color={theme.colors.brand} />

            <Text style={styles.ocorrenciasLoadingText}>
              Encontrando ocorrências...
            </Text>
          </View>
        </View>
      )}
    </>
  );
}
