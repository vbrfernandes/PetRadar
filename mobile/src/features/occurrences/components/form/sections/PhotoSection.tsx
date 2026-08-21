import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  photoSectionStyles as styles,
} from "../../../styles/form/occurrencePhotoReview.styles";
import { theme } from "../../../../../theme/colors";

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
