import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { occurrenceCardStyles as styles } from "../../styles/occurrenceCard.styles";

interface OccurrenceCardImageProps {
  occurrenceId: number;
  title: string;
  foto: string | null;
  onPress: (occurrenceId: number) => void;
}

export default function OccurrenceCardImage({
  occurrenceId,
  title,
  foto,
  onPress,
}: OccurrenceCardImageProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes de ${title}`}
      accessibilityHint="Abre os detalhes completos da ocorrência"
      onPress={() => onPress(occurrenceId)}
      style={({ pressed }) => [
        styles.imageContainer,
        pressed && styles.imagePressed,
      ]}
    >
      {foto ? (
        <Image source={{ uri: foto }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imageFallback}>
          <MaterialCommunityIcons
            name="paw"
            size={45}
            color={theme.colors.brand}
          />
          <Text style={styles.imageFallbackText}>Foto indisponível</Text>
        </View>
      )}
    </Pressable>
  );
}
