import React from "react";

import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileDetailStyles as styles } from "../../styles/detail/profileDetail.styles";

interface ProfileAvatarProps {
  photoUri: string | null;
  loading: boolean;
  onPress: () => void;
}

function ProfileAvatar({
  photoUri,
  loading,
  onPress,
}: ProfileAvatarProps) {
  const hasPhoto = Boolean(photoUri);

  return (
    <Pressable
      style={styles.avatarWrapper}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={
        hasPhoto ? "Alterar foto de perfil" : "Adicionar foto de perfil"
      }
      accessibilityHint={
        hasPhoto
          ? "Toque para escolher uma nova foto"
          : "Toque para adicionar uma foto de perfil"
      }
    >
      <View style={styles.avatarRing}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.avatarImage}
            accessibilityLabel="Foto de perfil"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={46} color={theme.colors.brand} />
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="small" color={theme.colors.surface} />
          <Text style={styles.uploadingText}>Enviando...</Text>
        </View>
      )}

      {!loading && (
        <View
          style={[
            styles.photoActionBadge,
            hasPhoto ? styles.photoEditBadge : styles.photoAddBadge,
          ]}
        >
          <Ionicons
            name={hasPhoto ? "create-outline" : "add"}
            size={hasPhoto ? 17 : 23}
            color={theme.colors.surface}
          />
        </View>
      )}
    </Pressable>
  );
}

export default React.memo(ProfileAvatar);
