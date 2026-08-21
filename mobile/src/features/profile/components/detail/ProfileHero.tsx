import React from "react";

import { Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileDetailStyles as styles } from "../../styles/detail/profileDetail.styles";
import ProfileAvatar from "./ProfileAvatar";

interface ProfileHeroProps {
  photoUri: string | null;
  uploadingImage: boolean;
  name: string;
  email?: string;
  accountTypeLabel: string;
  onPhotoPress: () => void;
}

export default function ProfileHero({
  photoUri,
  uploadingImage,
  name,
  email,
  accountTypeLabel,
  onPhotoPress,
}: ProfileHeroProps) {
  return (
    <View style={styles.profileHero}>
      <View style={styles.heroGlow} />

      <ProfileAvatar
        photoUri={photoUri}
        loading={uploadingImage}
        onPress={onPhotoPress}
      />

      <Text style={styles.profileName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.profileEmail} numberOfLines={1}>
        {email}
      </Text>

      <View style={styles.profileMeta}>
        <View style={styles.accountBadge}>
          <View style={styles.accountBadgeDot} />
          <Text style={styles.accountBadgeText}>{accountTypeLabel}</Text>
        </View>
      </View>

      <View style={styles.photoActionHint}>
        <Ionicons
          name={photoUri ? "create-outline" : "add-circle-outline"}
          size={13}
          color={theme.colors.textBody}
        />
        <Text style={styles.photoHint}>
          {photoUri
            ? "Toque no lápis para trocar sua foto"
            : "Toque no + para adicionar sua foto"}
        </Text>
      </View>
    </View>
  );
}
