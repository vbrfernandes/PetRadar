import { useCallback, useState } from "react";

import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { profileService } from "../services/profileService";
import type { UserProfile } from "../types/profile.types";
import { getProfileErrorMessage } from "../utils/profileErrors";

interface UseProfilePhotoParams {
  profile: UserProfile | null;
  onPhotoUpdated: (photo: string) => void;
}

export function useProfilePhoto({
  profile,
  onPhotoUpdated,
}: UseProfilePhotoParams) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const alterarFoto = useCallback(async () => {
    if (uploadingImage) {
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          "Conceda acesso à galeria para adicionar uma foto de perfil.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      setUploadingImage(true);

      const asset = result.assets[0];
      const formData = new FormData();
      const filename =
        asset.fileName || asset.uri.split("/").pop() || "foto_perfil.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("foto", {
        uri: asset.uri,
        name: filename,
        type,
      } as unknown as Blob);

      const response = await profileService.uploadProfilePhoto(formData);
      const newPhoto = response.data?.foto_perfil;

      if (newPhoto) {
        onPhotoUpdated(newPhoto);
      }

      Alert.alert(
        "Foto atualizada",
        profile?.foto_perfil
          ? "Sua foto de perfil foi alterada com sucesso."
          : "Sua foto de perfil foi adicionada com sucesso.",
      );
    } catch (error: unknown) {
      Alert.alert(
        "Erro ao atualizar foto",
        getProfileErrorMessage(
          error,
          "Não foi possível enviar a imagem. Tente novamente.",
        ),
      );
    } finally {
      setUploadingImage(false);
    }
  }, [onPhotoUpdated, profile?.foto_perfil, uploadingImage]);

  return {
    uploadingImage,
    alterarFoto,
  };
}
