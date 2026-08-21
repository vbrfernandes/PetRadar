import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { occurrenceDetailContentStyles as styles } from "../../styles/detail/occurrenceDetailContent.styles";
import { getStatusColors, getUrgencyColors } from "../../utils/occurrenceDetail.utils";

type OccurrenceStatusBadgesProps =
  | { variant: "status"; value: string }
  | { variant: "urgency"; value: string };

export default function OccurrenceStatusBadges(
  props: OccurrenceStatusBadgesProps,
) {
  if (props.variant === "status") {
    const colors = getStatusColors(props.value);
    return (
      <View style={[styles.statusBadge, { backgroundColor: colors.background }]}>
        <View style={[styles.statusDot, { backgroundColor: colors.text }]} />
        <Text style={[styles.statusText, { color: colors.text }]}>
          {props.value}
        </Text>
      </View>
    );
  }

  const colors = getUrgencyColors(props.value);
  return (
    <View style={styles.badgeRow}>
      <View style={[styles.urgencyBadge, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={16}
          color={colors.text}
        />
        <Text style={[styles.urgencyText, { color: colors.text }]}>
          Urgência: {props.value}
        </Text>
      </View>
    </View>
  );
}
