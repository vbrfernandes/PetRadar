import React from "react";

import { Image, Pressable, Text, View } from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import type { OcorrenciaResumo } from "../../../occurrences/types/occurrence.types";
import { profileOccurrencesStyles as styles } from "../../styles/occurrences/profileOccurrences.styles";

interface ProfileOccurrenceCardProps {
  item: OcorrenciaResumo;
  onPress: (occurrenceId: number) => void;
}

function ProfileOccurrenceCard({
  item,
  onPress,
}: ProfileOccurrenceCardProps) {
  const isPerdido = item.status_badge?.toUpperCase() === "PERDIDO";
  const statusColor = isPerdido
    ? theme.colors.semantic.danger.text
    : theme.colors.semantic.warning.text;
  const statusBackground = isPerdido
    ? theme.colors.semantic.danger.bg
    : theme.colors.semantic.warning.bg;

  return (
    <Pressable
      onPress={() => onPress(item.id_ocorrencia)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes da ocorrência de ${
        item.tipo_animal || "animal"
      }`}
      accessibilityHint="Mostra os detalhes completos desta ocorrência"
      style={({ pressed }) => [
        styles.occurrenceCard,
        pressed && styles.occurrenceCardPressed,
      ]}
    >
      <View style={styles.occurrenceImageWrapper}>
        {item.foto ? (
          <Image source={{ uri: item.foto }} style={styles.occurrenceImage} />
        ) : (
          <View style={styles.occurrenceImagePlaceholder}>
            <MaterialCommunityIcons
              name="paw"
              size={28}
              color={theme.colors.muted}
            />
          </View>
        )}
      </View>

      <View style={styles.occurrenceInfo}>
        <View style={styles.occurrenceTopRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusBackground }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>
              {item.status_badge}
            </Text>
          </View>
          <Text style={styles.urgencyText}>{item.nivel_urgencia}</Text>
        </View>

        <Text style={styles.animalName}>{item.tipo_animal || "Animal"}</Text>
        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={theme.colors.textBody}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.endereco_localizacao || "Localização não informada"}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
    </Pressable>
  );
}

export default React.memo(ProfileOccurrenceCard);
