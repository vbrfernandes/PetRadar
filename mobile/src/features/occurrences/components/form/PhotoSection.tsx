import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

interface PhotoSectionProps {
  fotoUri: string | null;
  onPress: () => void;
}

export default function PhotoSection({ fotoUri, onPress }: PhotoSectionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.photoArea,
        fotoUri && styles.photoAreaFilled,
        pressed && styles.pressed,
      ]}
    >
      {fotoUri ? (
        <>
          <Image
            source={{
              uri: fotoUri,
            }}
            style={styles.photoPreview}
          />

          <View style={styles.photoOverlay}>
            <View style={styles.photoOverlayButton}>
              <Ionicons
                name="camera-outline"
                size={19}
                color={theme.colors.surface}
              />

              <Text style={styles.photoOverlayText}>
                Trocar / adicionar foto
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.photoIcon}>
            <Ionicons
              name="camera-outline"
              size={28}
              color={theme.colors.brand}
            />
          </View>

          <Text style={styles.photoTitle}>Adicionar foto</Text>

          <Text style={styles.photoDescription}>
            Toque para escolher uma imagem da galeria
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  photoArea: {
    height: 210,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(31, 92, 77, 0.22)",
    backgroundColor: "rgba(31, 92, 77, 0.035)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  photoAreaFilled: {
    borderStyle: "solid",
    borderColor: "rgba(31, 92, 77, 0.12)",
  },

  photoIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(31, 92, 77, 0.09)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  photoTitle: {
    color: theme.colors.textTitle,
    fontSize: 15,
    fontWeight: "800",
  },

  photoDescription: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 4,
  },

  photoPreview: {
    width: "100%",
    height: "100%",
  },

  photoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.32)",
    alignItems: "center",
  },

  photoOverlayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  photoOverlayText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.82,
  },
});
