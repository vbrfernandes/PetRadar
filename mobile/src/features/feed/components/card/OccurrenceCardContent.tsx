import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceCardStyles as styles } from "../../styles/occurrenceCard.styles";

interface OccurrenceCardContentProps {
  occurrenceId: number;
  title: string;
  descricao: string;
  tempo: string;
  distancia: string;
  onPress: (occurrenceId: number) => void;
}

export default function OccurrenceCardContent({
  occurrenceId,
  title,
  descricao,
  tempo,
  distancia,
  onPress,
}: OccurrenceCardContentProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes de ${title}`}
      accessibilityHint="Abre os detalhes completos da ocorrência"
      onPress={() => onPress(occurrenceId)}
      style={({ pressed }) => [
        styles.captionContainer,
        pressed && styles.contentPressed,
      ]}
    >
      <Text style={styles.captionText} numberOfLines={3}>
        {descricao}
      </Text>

      <View style={styles.postMetaRow}>
        <View style={styles.postMetaLeft}>
          <Text style={styles.postMetaText}>{tempo}</Text>
          <View style={styles.metaDot} />
          <Ionicons
            name="location-outline"
            size={13}
            color={theme.colors.textBody}
          />
          <Text style={styles.postMetaText}>{distancia}</Text>
        </View>

        <View style={styles.moreButton}>
          <Text style={styles.moreText}>Mais</Text>
        </View>
      </View>
    </Pressable>
  );
}
