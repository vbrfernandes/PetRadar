import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceCardStyles as styles } from "../../styles/occurrenceCard.styles";

interface OccurrenceCardActionsProps {
  occurrenceId: number;
  forcaLoading: boolean;
  usuarioDeuForca: boolean;
  totalForca: number;
  comentarios: string;
  onToggleForca: (occurrenceId: number) => void;
}

export default function OccurrenceCardActions({
  occurrenceId,
  forcaLoading,
  usuarioDeuForca,
  totalForca,
  comentarios,
  onToggleForca,
}: OccurrenceCardActionsProps) {
  const echoRotation = useRef(new Animated.Value(0)).current;
  const echoScale = useRef(new Animated.Value(1)).current;
  const previousEchoState = useRef(usuarioDeuForca);

  useEffect(() => {
    const previousState = previousEchoState.current;

    if (previousState === usuarioDeuForca) {
      return;
    }

    previousEchoState.current = usuarioDeuForca;
    echoRotation.stopAnimation();
    echoScale.stopAnimation();

    if (usuarioDeuForca) {
      echoRotation.setValue(0);
      echoScale.setValue(1);

      Animated.parallel([
        Animated.timing(echoRotation, {
          toValue: 1,
          duration: 1680,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(echoScale, {
            toValue: 1.13,
            duration: 150,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(echoScale, {
            toValue: 1,
            duration: 190,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      return;
    }

    echoScale.setValue(1);

    Animated.sequence([
      Animated.timing(echoScale, {
        toValue: 0.93,
        duration: 110,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(echoScale, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [usuarioDeuForca, echoRotation, echoScale]);

  const echoRotate = echoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.actionsRow}>
      <View style={styles.actionsLeft}>
        <Pressable
          disabled
          accessibilityRole="button"
          accessibilityLabel="Compartilhar ocorrência"
          accessibilityState={{ disabled: true }}
          style={styles.actionIconButton}
        >
          <Ionicons
            name="share-social-outline"
            size={20}
            color={theme.colors.textBody}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            usuarioDeuForca ? "Remover Eco da ocorrência" : "Ecoar ocorrência"
          }
          accessibilityHint={
            usuarioDeuForca
              ? "Remove seu Eco desta ocorrência"
              : "Ajuda esta ocorrência a alcançar mais pessoas da comunidade"
          }
          accessibilityState={{
            selected: usuarioDeuForca,
            disabled: forcaLoading,
          }}
          disabled={forcaLoading}
          onPress={() => onToggleForca(occurrenceId)}
          style={({ pressed }) => [
            styles.forceButton,
            usuarioDeuForca && styles.forceButtonActive,
            forcaLoading && styles.forceButtonLoading,
            pressed && !forcaLoading && styles.forceButtonPressed,
          ]}
        >
          <Animated.Image
            source={require(
              "../../../../../assets/ChatGPT Image 15 de ago. de 2026, 11_30_55.png"
            )}
            resizeMode="contain"
            style={[
              styles.echoIcon,
              {
                tintColor: usuarioDeuForca
                  ? theme.colors.action
                  : theme.colors.textBody,
                transform: [{ rotate: echoRotate }, { scale: echoScale }],
              },
            ]}
          />

          {totalForca > 0 ? (
            <Text
              style={[
                styles.echoCount,
                usuarioDeuForca && styles.echoCountActive,
              ]}
            >
              {totalForca}
            </Text>
          ) : null}
        </Pressable>

        <Pressable
          disabled
          accessibilityRole="button"
          accessibilityLabel="Favoritar ocorrência"
          accessibilityState={{ disabled: true }}
          style={styles.actionIconButton}
        >
          <Ionicons
            name="star-outline"
            size={21}
            color={theme.colors.textBody}
          />
        </Pressable>

        <Pressable
          disabled
          accessibilityRole="button"
          accessibilityLabel="Abrir comentários"
          accessibilityState={{ disabled: true }}
          style={styles.actionIconButton}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={theme.colors.textBody}
          />
        </Pressable>
      </View>

      <Text style={styles.commentsCount} numberOfLines={1}>
        {comentarios}
      </Text>
    </View>
  );
}
