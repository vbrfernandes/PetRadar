import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceDetailContentStyles as styles } from "../../styles/detail/occurrenceDetailContent.styles";
import { occurrenceDetailDrawerStyles as drawerStyles } from "../../styles/detail/occurrenceDetailDrawer.styles";
import { OccurrenceSectionHeader } from "./OccurrenceDetailsCard";

interface OccurrenceManagementSectionProps {
  visible: boolean;
  excluding: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function OccurrenceManagementSection({
  visible,
  excluding,
  onEdit,
  onDelete,
}: OccurrenceManagementSectionProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.managementSection}>
      <OccurrenceSectionHeader
        title="Gerenciar ocorrência"
        subtitle="Edite as informações ou remova este registro."
      />
      <View style={styles.managementActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar ocorrência"
          disabled={excluding}
          onPress={onEdit}
          style={({ pressed }) => [
            styles.managementButton,
            pressed && drawerStyles.pressed,
            excluding && styles.managementButtonDisabled,
          ]}
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.brand} />
          <Text style={styles.managementButtonText}>Editar ocorrência</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Excluir ocorrência"
          accessibilityState={{ disabled: excluding }}
          disabled={excluding}
          onPress={onDelete}
          style={({ pressed }) => [
            styles.managementButton,
            styles.managementDeleteButton,
            pressed && drawerStyles.pressed,
            excluding && styles.managementButtonDisabled,
          ]}
        >
          {excluding ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.semantic.danger.text}
            />
          ) : (
            <Ionicons
              name="trash-outline"
              size={20}
              color={theme.colors.semantic.danger.text}
            />
          )}
          <Text
            style={[
              styles.managementButtonText,
              styles.managementDeleteButtonText,
            ]}
          >
            {excluding ? "Excluindo..." : "Excluir ocorrência"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
