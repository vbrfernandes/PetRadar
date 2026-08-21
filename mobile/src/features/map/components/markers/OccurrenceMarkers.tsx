import React from "react";
import { Image, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";

import { theme } from "../../../../theme";
import { mapScreenStyles as styles } from "../../styles/map.styles";
import type { OcorrenciaMapa } from "../../types/map.types";

interface OccurrenceMarkersProps {
  ocorrencias: OcorrenciaMapa[];
  onOccurrencePress: (occurrenceId: number) => void;
}

export function OccurrenceMarkers({
  ocorrencias,
  onOccurrencePress,
}: OccurrenceMarkersProps) {
  return (
    <>
      {ocorrencias.map((ocorrencia) => {
        const latitude = Number(ocorrencia.latitude);
        const longitude = Number(ocorrencia.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        const animalEhGato = ocorrencia.tipo_animal
          ?.toLowerCase()
          .includes("gato");

        return (
          <Mapbox.MarkerView
            key={ocorrencia.id_ocorrencia}
            coordinate={[longitude, latitude]}
            anchor={{
              x: 0.5,
              y: 1,
            }}
            allowOverlap={true}
            allowOverlapWithPuck={true}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Ocorrência de ${
                ocorrencia.tipo_animal || "animal"
              }`}
              accessibilityHint="Mostra os detalhes desta ocorrência"
              onPress={() => {
                onOccurrencePress(ocorrencia.id_ocorrencia);
              }}
              style={({ pressed }) => [
                styles.markerPressable,
                pressed && styles.markerPressed,
              ]}
            >
              <View collapsable={false} style={styles.occurrenceMarker}>
                <View style={styles.markerPin}>
                  <View style={styles.markerPhotoWrapper}>
                    {ocorrencia.foto ? (
                      <Image
                        source={{
                          uri: ocorrencia.foto,
                        }}
                        style={styles.markerPhoto}
                      />
                    ) : (
                      <View style={styles.markerPhotoPlaceholder}>
                        <MaterialCommunityIcons
                          name={animalEhGato ? "cat" : "dog"}
                          size={24}
                          color={theme.colors.textBody}
                        />
                      </View>
                    )}

                    <View style={styles.markerAnimalBadge}>
                      <MaterialCommunityIcons
                        name={animalEhGato ? "cat" : "dog"}
                        size={11}
                        color={theme.colors.surface}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.markerPointer} />
              </View>
            </Pressable>
          </Mapbox.MarkerView>
        );
      })}
    </>
  );
}
