import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  choiceButtonStyles as styles,
} from "../../../styles/form/occurrenceFormControls.styles";
import { theme } from "../../../../../theme/colors";

interface ChoiceButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  danger?: boolean;
}

export default function ChoiceButton({
  label,
  active,
  onPress,
  danger = false,
}: ChoiceButtonProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{
        selected: active,
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceButton,
        active && styles.choiceButtonActive,
        active && danger && styles.choiceButtonDanger,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.choiceButtonText,
          active && styles.choiceButtonTextActive,
          active && danger && styles.choiceButtonTextDanger,
        ]}
      >
        {label}
      </Text>

      {active && (
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={
            danger ? theme.colors.semantic.danger.text : theme.colors.brand
          }
        />
      )}
    </Pressable>
  );
}
