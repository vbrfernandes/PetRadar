import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import type { StatusVisual } from "../../types/feed.types";
import { occurrenceCardStyles as styles } from "../../styles/occurrenceCard.styles";
import { feedButtonPressedStyle } from "../../styles/feedScreen.styles";

interface OccurrenceCardHeaderProps {
  occurrenceId: number;
  title: string;
  autorNome: string;
  autorFoto: string | null;
  autorIniciais: string;
  status: StatusVisual;
  urgente: boolean;
  onPress: (occurrenceId: number) => void;
  onOpenOptions: (occurrenceId: number) => void;
}

export default function OccurrenceCardHeader({
  occurrenceId,
  title,
  autorNome,
  autorFoto,
  autorIniciais,
  status,
  urgente,
  onPress,
  onOpenOptions,
}: OccurrenceCardHeaderProps) {
  return (
    <View style={styles.postHeader}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${title}`}
        accessibilityHint="Abre os detalhes completos da ocorrência"
        onPress={() => onPress(occurrenceId)}
        style={({ pressed }) => [
          styles.postHeaderMain,
          pressed && styles.contentPressed,
        ]}
      >
        <View style={styles.authorAvatar}>
          {autorFoto ? (
            <Image source={{ uri: autorFoto }} style={styles.authorAvatarImage} />
          ) : (
            <Text style={styles.authorInitials}>{autorIniciais}</Text>
          )}
        </View>

        <View style={styles.authorContent}>
          <Text style={styles.authorName} numberOfLines={1}>
            {autorNome}
          </Text>

          <View style={styles.authorMetaRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: status.backgroundColor },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: status.textColor }]}
              />
              <Text style={[styles.statusText, { color: status.textColor }]}>
                {status.label}
              </Text>
            </View>

            {urgente ? (
              <View style={styles.urgentBadge}>
                <Ionicons
                  name="warning-outline"
                  size={11}
                  color={theme.colors.semantic.danger.text}
                />
                <Text style={styles.urgentText}>Urgente</Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Opções da publicação"
        accessibilityHint="Abre as opções para denunciar esta ocorrência"
        hitSlop={8}
        onPress={() => onOpenOptions(occurrenceId)}
        style={({ pressed }) => [
          styles.moreOptionsButton,
          pressed && feedButtonPressedStyle,
        ]}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={21}
          color={theme.colors.textBody}
        />
      </Pressable>
    </View>
  );
}
