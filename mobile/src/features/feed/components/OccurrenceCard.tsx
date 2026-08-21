// ============================================================
// D:\PetRadar\src\mobile\src\features\feed\components\OccurrenceCard.tsx
// ============================================================

import React, { useEffect, useRef } from "react";

import { Animated, Easing, Image, Pressable, Text, View } from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import type { OcorrenciaFeed } from "../types/feed.types";

import { ehUrgente, normalizarTexto } from "../utils/feed.utils";

import { theme } from "../../../theme/colors";

import {
  feedButtonPressedStyle,
  occurrenceCardStyles as styles,
} from "../styles/feed.styles";

// ============================================================
// TIPAGEM
// ============================================================

interface StatusVisual {
  label: string;

  textColor: string;

  backgroundColor: string;
}

interface OccurrenceCardProps {
  occurrence: OcorrenciaFeed;

  forcaLoading: boolean;

  onPress: (occurrenceId: number) => void;

  onToggleForca: (occurrenceId: number) => void;

  onOpenOptions: (occurrenceId: number) => void;
}

// ============================================================
// UTILITÁRIOS EXCLUSIVOS DO CARD
// ============================================================

function capitalizar(valor: string) {
  const texto = valor.trim().toLocaleLowerCase().replace(/_/g, " ");

  if (!texto) {
    return "Animal";
  }

  return texto.charAt(0).toLocaleUpperCase() + texto.slice(1);
}

function formatarDistancia(distanciaKm: number | null | undefined) {
  const distancia = Number(distanciaKm);

  if (!Number.isFinite(distancia) || distancia < 0) {
    return "Distância indisponível";
  }

  if (distancia < 1) {
    return `${Math.round(distancia * 1000)} m`;
  }

  return `${distancia.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

function formatarTempoRelativo(data: string) {
  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }

  const diferencaMs = Date.now() - date.getTime();

  if (diferencaMs <= 0) {
    return "Agora";
  }

  const minutos = Math.floor(diferencaMs / (1000 * 60));

  if (minutos < 1) {
    return "Agora";
  }

  if (minutos < 60) {
    return `há ${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);

  if (horas < 24) {
    return horas === 1 ? "há 1 hora" : `há ${horas} horas`;
  }

  const dias = Math.floor(horas / 24);

  if (dias < 7) {
    return dias === 1 ? "há 1 dia" : `há ${dias} dias`;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function obterStatusVisual(occurrence: OcorrenciaFeed): StatusVisual {
  const status = normalizarTexto(occurrence.status_badge);

  if (status.includes("perdid")) {
    return {
      label: "Perdido",

      textColor: theme.colors.semantic.danger.text,

      backgroundColor: theme.colors.semantic.danger.bg,
    };
  }

  if (status.includes("avist")) {
    return {
      label: "Avistado",

      textColor: theme.colors.semantic.warning.text,

      backgroundColor: theme.colors.semantic.warning.bg,
    };
  }

  return {
    label: "Animal de rua",

    textColor: theme.colors.semantic.success.text,

    backgroundColor: theme.colors.semantic.success.bg,
  };
}

function obterTituloOcorrencia(occurrence: OcorrenciaFeed) {
  const animal = capitalizar(occurrence.tipo_animal);

  const status = normalizarTexto(occurrence.status_badge);

  if (status.includes("perdid")) {
    return `${animal} perdido`;
  }

  if (status.includes("avist")) {
    return `${animal} avistado`;
  }

  return `${animal} precisa de ajuda`;
}

function obterDescricaoOcorrencia(occurrence: OcorrenciaFeed) {
  const observacao = occurrence.observacao?.trim();

  if (observacao) {
    return observacao;
  }

  const titulo = obterTituloOcorrencia(occurrence);

  const endereco = occurrence.endereco_localizacao?.trim();

  if (endereco) {
    return `${titulo}. Localização: ${endereco}.`;
  }

  return `${titulo}. Abra os detalhes para ver todas as informações desta ocorrência.`;
}

function obterIniciais(nome: string | null | undefined) {
  const partes = (nome ?? "").trim().split(/\s+/).filter(Boolean);

  if (partes.length === 0) {
    return "PR";
  }

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toLocaleUpperCase();
  }

  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toLocaleUpperCase();
}

function formatarQuantidadeComentarios(total: number | null | undefined) {
  const quantidade = Number.isFinite(Number(total))
    ? Math.max(0, Number(total))
    : 0;

  return quantidade === 1 ? "1 comentário" : `${quantidade} comentários`;
}

// ============================================================
// CARD DA OCORRÊNCIA
// ============================================================

export default function OccurrenceCard({
  occurrence,

  forcaLoading,

  onPress,

  onToggleForca,

  onOpenOptions,
}: OccurrenceCardProps) {
  const status = obterStatusVisual(occurrence);

  const fotoValida =
    typeof occurrence.foto === "string" && occurrence.foto.trim().length > 0;

  const autorNome = occurrence.autor_nome?.trim() || "Usuário PetRadar";

  const autorFoto = occurrence.autor_foto?.trim() || null;

  const usuarioDeuForca = Boolean(occurrence.usuario_deu_forca);

  const totalForca = Math.max(0, Number(occurrence.total_forca ?? 0));

  const descricao = obterDescricaoOcorrencia(occurrence);

  // ==========================================================
  // ANIMAÇÃO DO ECO
  // ==========================================================
  //
  // A animação acontece somente quando o estado recebido
  // do backend muda.
  //
  // false -> true:
  // gira uma volta e dá um pequeno pulso.
  //
  // true -> false:
  // apenas retrai levemente.
  // ==========================================================

  const echoRotation = useRef(new Animated.Value(0)).current;

  const echoScale = useRef(new Animated.Value(1)).current;

  const previousEchoState = useRef(usuarioDeuForca);

  useEffect(() => {
    const previousState = previousEchoState.current;

    // Não anima na primeira renderização
    // nem em renders onde o estado não mudou.
    if (previousState === usuarioDeuForca) {
      return;
    }

    previousEchoState.current = usuarioDeuForca;

    echoRotation.stopAnimation();

    echoScale.stopAnimation();

    // ======================================================
    // ECO REGISTRADO
    // ======================================================

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

    // ======================================================
    // ECO REMOVIDO
    // ======================================================

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
    <View style={styles.card}>
      {/* ======================================================
          AUTOR DA PUBLICAÇÃO
      ====================================================== */}
      <View style={styles.postHeader}>
        {/* ==================================================
            ÁREA CLICÁVEL DO AUTOR
        ================================================== */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Abrir detalhes de ${obterTituloOcorrencia(
            occurrence,
          )}`}
          accessibilityHint="Abre os detalhes completos da ocorrência"
          onPress={() => onPress(occurrence.id_ocorrencia)}
          style={({ pressed }) => [
            styles.postHeaderMain,

            pressed && styles.contentPressed,
          ]}
        >
          <View style={styles.authorAvatar}>
            {autorFoto ? (
              <Image
                source={{
                  uri: autorFoto,
                }}
                style={styles.authorAvatarImage}
              />
            ) : (
              <Text style={styles.authorInitials}>
                {obterIniciais(autorNome)}
              </Text>
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

                  {
                    backgroundColor: status.backgroundColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,

                    {
                      backgroundColor: status.textColor,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,

                    {
                      color: status.textColor,
                    },
                  ]}
                >
                  {status.label}
                </Text>
              </View>

              {ehUrgente(occurrence.nivel_urgencia) ? (
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

        {/* ==================================================
            MENU / DENÚNCIA

            É um botão separado propositalmente para que
            tocar nos três pontos NÃO abra os detalhes.
        ================================================== */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Opções da publicação"
          accessibilityHint="Abre as opções para denunciar esta ocorrência"
          hitSlop={8}
          onPress={() => onOpenOptions(occurrence.id_ocorrencia)}
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

      {/* ======================================================
          FOTO
      ====================================================== */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${obterTituloOcorrencia(
          occurrence,
        )}`}
        accessibilityHint="Abre os detalhes completos da ocorrência"
        onPress={() => onPress(occurrence.id_ocorrencia)}
        style={({ pressed }) => [
          styles.imageContainer,

          pressed && styles.imagePressed,
        ]}
      >
        {fotoValida ? (
          <Image
            source={{
              uri: occurrence.foto,
            }}
            style={styles.image}
            resizeMode="cover"
          />
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

      {/* ======================================================
          AÇÕES
      ====================================================== */}

      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          {/* COMPARTILHAR - AINDA NÃO FUNCIONAL */}

          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Compartilhar ocorrência"
            accessibilityState={{
              disabled: true,
            }}
            style={styles.actionIconButton}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={theme.colors.textBody}
            />
          </Pressable>

          {/* ==================================================
              ECOAR - FUNCIONAL
          ================================================== */}

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
            onPress={() => onToggleForca(occurrence.id_ocorrencia)}
            style={({ pressed }) => [
              styles.forceButton,

              usuarioDeuForca && styles.forceButtonActive,

              forcaLoading && styles.forceButtonLoading,

              pressed && !forcaLoading && styles.forceButtonPressed,
            ]}
          >
            <Animated.Image
              source={require("../../../../assets/ChatGPT Image 15 de ago. de 2026, 11_30_55.png")}
              resizeMode="contain"
              style={[
                styles.echoIcon,

                {
                  tintColor: usuarioDeuForca
                    ? theme.colors.action
                    : theme.colors.textBody,

                  transform: [
                    {
                      rotate: echoRotate,
                    },

                    {
                      scale: echoScale,
                    },
                  ],
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

          {/* FAVORITO - AINDA NÃO FUNCIONAL */}

          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Favoritar ocorrência"
            accessibilityState={{
              disabled: true,
            }}
            style={styles.actionIconButton}
          >
            <Ionicons
              name="star-outline"
              size={21}
              color={theme.colors.textBody}
            />
          </Pressable>

          {/* COMENTÁRIOS - AINDA NÃO FUNCIONAL */}

          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Abrir comentários"
            accessibilityState={{
              disabled: true,
            }}
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
          {formatarQuantidadeComentarios(occurrence.total_comentarios)}
        </Text>
      </View>

      {/* ======================================================
          DESCRIÇÃO
      ====================================================== */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${obterTituloOcorrencia(
          occurrence,
        )}`}
        accessibilityHint="Abre os detalhes completos da ocorrência"
        onPress={() => onPress(occurrence.id_ocorrencia)}
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
            <Text style={styles.postMetaText}>
              {formatarTempoRelativo(occurrence.data_ocorrencia)}
            </Text>

            <View style={styles.metaDot} />

            <Ionicons
              name="location-outline"
              size={13}
              color={theme.colors.textBody}
            />

            <Text style={styles.postMetaText}>
              {formatarDistancia(occurrence.distancia_km)}
            </Text>
          </View>

          <View style={styles.moreButton}>
            <Text style={styles.moreText}>Mais</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}