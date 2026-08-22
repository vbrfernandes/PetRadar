import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { occurrenceDetailDrawerStyles as styles } from "../../styles/detail/occurrenceDetailDrawer.styles";

interface OccurrenceDetailHeaderProps {
  occurrenceId: number | null;
  onClose: () => void;
}

export default function OccurrenceDetailHeader({
  occurrenceId,
  onClose,
}: OccurrenceDetailHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar detalhes"
        hitSlop={8}
        onPress={onClose}
        style={({ pressed }) => [
          styles.headerButton,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name="chevron-back"
          size={23}
          color={theme.colors.textTitle}
        />
      </Pressable>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle} numberOfLines={1}>Ocorrência</Text>
        <Text style={styles.headerSubtitle}>
          {occurrenceId !== null ? `Registro #${occurrenceId}` : "PetRadar"}
        </Text>
      </View>
      <View style={styles.headerPlaceholder} />
    </View>
  );
}
