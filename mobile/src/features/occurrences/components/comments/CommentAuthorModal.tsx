import React from "react";

import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  AutorComentario,
} from "../../types/occurrence.types";

import {
  theme,
} from "../../../../theme/colors";


interface CommentAuthorModalProps {
  visible: boolean;
  author: AutorComentario | null;
  onClose: () => void;
}


const COLORS = {
  primary: theme.colors.brand,
  background: theme.colors.background,
  surface: theme.colors.surface,
  textTitle: theme.colors.textTitle,
  textBody: theme.colors.textBody,

  successBg:
    theme.colors.semantic.success.bg,

  overlay:
    "rgba(15, 23, 42, 0.58)",

  border:
    "rgba(15, 23, 42, 0.07)",
};


function obterIniciais(
  nome: string,
) {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) {
    return "PR";
  }

  if (partes.length === 1) {
    return partes[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    partes[0][0] +
    partes[
      partes.length - 1
    ][0]
  ).toUpperCase();
}


export default function CommentAuthorModal({
  visible,
  author,
  onClose,
}: CommentAuthorModalProps) {
  if (!author) {
    return null;
  }

  const foto =
    author.foto?.trim() ||
    null;

  const nome =
    author.nome?.trim() ||
    "Usuário PetRadar";

  const tipoConta =
    author.tipo_conta === "ONG"
      ? "ONG / Instituição"
      : "Pessoa Física";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Fechar identificação do perfil"
          onPress={onClose}
        />

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="person-outline"
                size={17}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.headerTitle}>
              Identificação do perfil
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="close"
                size={21}
                color={COLORS.textTitle}
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.avatar}>
              {foto ? (
                <Image
                  source={{
                    uri: foto,
                  }}
                  style={styles.avatarImage}
                  accessibilityLabel={`Foto de ${nome}`}
                />
              ) : (
                <Text style={styles.avatarInitials}>
                  {obterIniciais(nome)}
                </Text>
              )}
            </View>

            <Text
              style={styles.name}
              numberOfLines={2}
            >
              {nome}
            </Text>

            <View style={styles.typeBadge}>
              <Ionicons
                name={
                  author.tipo_conta === "ONG"
                    ? "business-outline"
                    : "person-outline"
                }
                size={14}
                color={COLORS.primary}
              />

              <Text style={styles.typeText}>
                {tipoConta}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>
                    Perfil PetRadar
                  </Text>

                  <Text style={styles.infoValue}>
                    Identificação #{author.id_conta}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.helperText}>
              São exibidas apenas informações públicas de
              identificação deste perfil.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor:
      COLORS.overlay,
  },

  card: {
    width: "100%",
    maxWidth: 380,

    overflow: "hidden",

    borderRadius: 26,

    backgroundColor:
      COLORS.surface,

    ...theme.shadows.elevation1,
  },

  header: {
    minHeight: 64,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,

    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  headerIcon: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 11,

    backgroundColor:
      COLORS.successBg,
  },

  headerTitle: {
    flex: 1,

    marginLeft: 10,

    fontSize: 14,
    fontWeight: "800",

    color:
      COLORS.textTitle,
  },

  closeButton: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 19,

    backgroundColor:
      COLORS.background,
  },

  content: {
    alignItems: "center",

    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
  },

  avatar: {
    width: 92,
    height: 92,

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",

    borderRadius: 46,

    backgroundColor:
      COLORS.successBg,

    borderWidth: 3,
    borderColor:
      COLORS.surface,

    ...theme.shadows.elevation1,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitials: {
    fontSize: 25,
    fontWeight: "900",

    color:
      COLORS.primary,
  },

  name: {
    marginTop: 14,

    fontSize: 19,
    fontWeight: "800",

    textAlign: "center",

    color:
      COLORS.textTitle,
  },

  typeBadge: {
    minHeight: 32,

    flexDirection: "row",
    alignItems: "center",

    marginTop: 8,

    paddingHorizontal: 11,

    gap: 6,

    borderRadius: 100,

    backgroundColor:
      COLORS.successBg,
  },

  typeText: {
    fontSize: 11,
    fontWeight: "800",

    color:
      COLORS.primary,
  },

  infoCard: {
    width: "100%",

    marginTop: 22,

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderRadius: 17,

    backgroundColor:
      COLORS.background,

    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 39,
    height: 39,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11,

    borderRadius: 13,

    backgroundColor:
      COLORS.successBg,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: "600",

    color:
      COLORS.textBody,
  },

  infoValue: {
    marginTop: 2,

    fontSize: 13,
    fontWeight: "800",

    color:
      COLORS.textTitle,
  },

  helperText: {
    marginTop: 15,

    fontSize: 10,
    lineHeight: 15,

    textAlign: "center",

    color:
      COLORS.textBody,
  },

  pressed: {
    opacity: 0.72,
  },
});