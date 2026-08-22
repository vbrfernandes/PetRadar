import React from "react";

import { Image, Pressable, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../../theme";

import { petFormStyles as styles } from "../../../styles/form/petForm.styles";
import type { PetSelectedPhoto } from "../../../types/petForm.types";

interface PetPhotoSectionProps {
    photo: PetSelectedPhoto | null;
    onSelectPhoto: () => void;
}

export default function PetPhotoSection({
    photo,
    onSelectPhoto,
}: PetPhotoSectionProps) {
    return (
        <Pressable onPress={onSelectPhoto} style={styles.photoSelector}>
            {photo ? (
                <Image
                    source={{ uri: photo.uri }}
                    style={styles.selectedPhoto}
                />
            ) : (
                <>
                    <MaterialCommunityIcons
                        name="camera-plus-outline"
                        size={34}
                        color={theme.colors.brand}
                    />
                    <Text style={styles.photoTitle}>Adicionar foto</Text>
                    <Text style={styles.photoHint}>Toque para escolher</Text>
                </>
            )}
        </Pressable>
    );
}
