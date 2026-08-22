import { useCallback, useState } from "react";

import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

import type { PetSelectedPhoto } from "../types/petForm.types";

export function usePetPhoto() {
    const [photo, setPhoto] = useState<PetSelectedPhoto | null>(null);

    const selectPhoto = useCallback(async () => {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Permissão necessária",
                    "Permita o acesso às fotos para adicionar uma imagem do pet.",
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled || !result.assets?.[0]) {
                return;
            }

            const asset = result.assets[0];
            const fileName =
                asset.fileName || asset.uri.split("/").pop() || "pet.jpg";

            setPhoto({
                uri: asset.uri,
                nome: fileName,
                tipo: asset.mimeType || "image/jpeg",
            });
        } catch (error) {
            console.error("[RegistrarPet] Erro ao selecionar foto:", error);
            Alert.alert("Erro", "Não foi possível selecionar a foto.");
        }
    }, []);

    const clearPhoto = useCallback(() => {
        setPhoto(null);
    }, []);

    return {
        photo,
        selectPhoto,
        clearPhoto,
    };
}
