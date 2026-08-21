import { Pressable, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  initialCareSectionStyles as styles,
} from "../../../styles/form/occurrenceFormSections.styles";
import { theme } from "../../../../../theme/colors";

interface InitialCareSectionProps {
  aguaRegistrada: boolean;
  comidaRegistrada: boolean;
  aguaTexto: string;
  comidaTexto: string;
  onAguaPress: () => void;
  onComidaPress: () => void;
}

export default function InitialCareSection({
  aguaRegistrada,
  comidaRegistrada,
  aguaTexto,
  comidaTexto,
  onAguaPress,
  onComidaPress,
}: InitialCareSectionProps) {
  return (
    <>
      <View style={styles.careRow}>
        <CareButton
          icon="water"
          label="Água"
          active={aguaRegistrada}
          onPress={onAguaPress}
        />

        <CareButton
          icon="food"
          label="Comida"
          active={comidaRegistrada}
          onPress={onComidaPress}
        />
      </View>

      <View style={styles.caregiverCard}>
        <View style={styles.careInfoRow}>
          <CareInfo icon="water" label="Última água" value={aguaTexto} />

          <CareInfo icon="food" label="Última comida" value={comidaTexto} />
        </View>
      </View>

      <View style={styles.careHint}>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={theme.colors.brand}
        />

        <Text style={styles.careHintText}>
          Toque novamente para desmarcar um cuidado.
        </Text>
      </View>
    </>
  );
}

function CareButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: "water" | "food";
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        selected: active,
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.careButton,
        active && styles.careButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.careIcon, active && styles.careIconActive]}>
        <MaterialCommunityIcons
          name={icon === "water" ? "water" : "food"}
          size={25}
          color={active ? theme.colors.surface : theme.colors.brand}
        />
      </View>

      <Text
        style={[styles.careButtonText, active && styles.careButtonTextActive]}
      >
        {label}
      </Text>

      {active && (
        <View style={styles.careCheck}>
          <Ionicons name="checkmark" size={12} color={theme.colors.surface} />
        </View>
      )}
    </Pressable>
  );
}

function CareInfo({
  icon,
  label,
  value,
}: {
  icon: "water" | "food";
  label: string;
  value: string;
}) {
  return (
    <View style={styles.careInfo}>
      <View style={styles.careInfoHeader}>
        <MaterialCommunityIcons
          name={icon === "water" ? "water" : "food"}
          size={15}
          color={theme.colors.brand}
        />

        <Text style={styles.careInfoLabel}>{label}</Text>
      </View>

      <Text style={styles.careInfoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
