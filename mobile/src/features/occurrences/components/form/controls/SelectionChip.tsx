import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  selectionChipStyles as styles,
} from "../../../styles/form/occurrenceFormControls.styles";
import { theme } from "../../../../../theme";

type SelectionChipMode = "single" | "multiple";

interface SelectionChipProps {
  label: string;
  active: boolean;
  mode: SelectionChipMode;
  onPress: () => void;
}

export default function SelectionChip({
  label,
  active,
  mode,
  onPress,
}: SelectionChipProps) {
  const multiple = mode === "multiple";

  return (
    <Pressable
      accessibilityRole={multiple ? "checkbox" : "radio"}
      accessibilityState={
        multiple
          ? {
              checked: active,
            }
          : {
              selected: active,
            }
      }
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionChip,
        active && styles.optionChipActive,
        pressed && styles.pressed,
      ]}
    >
      {multiple && (
        <View
          style={[styles.checkCircle, active && styles.checkCircleActive]}
        >
          {active && (
            <Ionicons
              name="checkmark"
              size={13}
              color={theme.colors.surface}
            />
          )}
        </View>
      )}

      <Text
        style={[
          styles.optionChipText,
          active && styles.optionChipTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
