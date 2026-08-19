import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

export interface ReviewItem {
  label: string;
  value: string;
}

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

const styles = StyleSheet.create({
  reviewCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
    overflow: "hidden",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  reviewHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(31, 92, 77, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  reviewHeaderContent: {
    flex: 1,
  },

  reviewHeaderTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  reviewHeaderText: {
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },

  reviewDivider: {
    height: 1,
    backgroundColor: "rgba(31, 92, 77, 0.08)",
  },

  reviewItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(31, 92, 77, 0.06)",
  },

  reviewLabel: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 3,
  },

  reviewValue: {
    color: theme.colors.textTitle,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
});
