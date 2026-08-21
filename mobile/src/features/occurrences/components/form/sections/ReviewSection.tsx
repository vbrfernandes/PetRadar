import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  reviewSectionStyles as styles,
} from "../../../styles/form/occurrencePhotoReview.styles";
import { theme } from "../../../../../theme";
import type { ReviewItem } from "../../../types/occurrenceForm.types";

export type { ReviewItem } from "../../../types/occurrenceForm.types";

interface ReviewSectionProps {
  items: ReviewItem[];
}

export default function ReviewSection({ items }: ReviewSectionProps) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewHeaderIcon}>
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={theme.colors.brand}
          />
        </View>

        <View style={styles.reviewHeaderContent}>
          <Text style={styles.reviewHeaderTitle}>Tudo pronto?</Text>

          <Text style={styles.reviewHeaderText}>
            Revise os dados abaixo antes de enviar.
          </Text>
        </View>
      </View>

      <View style={styles.reviewDivider} />

      {items.map(({ label, value }) => (
        <View key={label} style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{label}</Text>
          <Text style={styles.reviewValue} numberOfLines={3}>
            {value || "Não informado"}
          </Text>
        </View>
      ))}
    </View>
  );
}
