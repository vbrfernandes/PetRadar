import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceCareStyles as styles } from "../../styles/detail/occurrenceCare.styles";
import { occurrenceDetailDrawerStyles as drawerStyles } from "../../styles/detail/occurrenceDetailDrawer.styles";
import type { TipoCuidado } from "../../types/occurrenceDetail.types";

interface OccurrenceCareButtonProps {
  tipo: TipoCuidado;
  disabled: boolean;
  loading: boolean;
  onPress: (tipo: TipoCuidado) => void;
}

export default function OccurrenceCareButton({
  tipo,
  disabled,
  loading,
  onPress,
}: OccurrenceCareButtonProps) {
  const agua = tipo === "AGUA";
  const label = agua ? "Água" : "Comida";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Registrar ${label.toLowerCase()} agora`}
      accessibilityHint="Registra o cuidado usando a data e hora atuais"
      disabled={disabled}
      onPress={() => onPress(tipo)}
      style={({ pressed }) => [
        styles.careButton,
        pressed && !disabled && drawerStyles.pressed,
        disabled && drawerStyles.disabled,
      ]}
    >
      <View style={styles.careButtonIcon}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.brand} />
        ) : (
          <MaterialCommunityIcons
            name={agua ? "water" : "food"}
            size={26}
            color={theme.colors.brand}
          />
        )}
      </View>
      <Text style={styles.careButtonTitle}>{label}</Text>
      <Text style={styles.careButtonSubtitle}>
        {loading ? "Registrando..." : "Registrar agora"}
      </Text>
    </Pressable>
  );
}
