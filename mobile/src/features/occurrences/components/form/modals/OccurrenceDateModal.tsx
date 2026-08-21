import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../../theme/colors";
import { cadastroOcorrenciaScreenStyles as styles } from "../../../styles/form/occurrenceFormScreen.styles";
import {
  formatarEntradaData,
  interpretarDataDigitada,
} from "../../../utils/occurrenceForm.utils";

interface OccurrenceDateModalProps {
  visible: boolean;
  value: string;
  onChangeText: (value: string) => void;
  onConfirm: (date: Date, formatted: string) => void;
  onClose: () => void;
}

export default function OccurrenceDateModal({
  visible,
  value,
  onChangeText,
  onConfirm,
  onClose,
}: OccurrenceDateModalProps) {
  const confirmar = () => {
    const resultado = interpretarDataDigitada(value);
    if (resultado.kind === "incomplete") {
      Alert.alert(
        "Data incompleta",
        "Digite a data completa no formato DD/MM/AAAA.",
      );
      return;
    }
    if (resultado.kind === "invalid") {
      Alert.alert(
        "Data inválida",
        "Informe uma data válida no formato DD/MM/AAAA.",
      );
      return;
    }
    onConfirm(resultado.date, resultado.formatted);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.dateModalBackdrop}>
        <View style={styles.dateModalCard}>
          <View style={styles.dateModalHeader}>
            <View>
              <Text style={styles.dateModalTitle}>Escolher data</Text>
              <Text style={styles.dateModalSubtitle}>
                Informe a data da ocorrência.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar seletor de data"
              onPress={onClose}
              style={styles.dateModalClose}
            >
              <Ionicons name="close" size={20} color={theme.colors.textTitle} />
            </Pressable>
          </View>

          <Text style={styles.dateModalLabel}>Data</Text>
          <View style={styles.dateModalInputContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.brand}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(texto) => onChangeText(formatarEntradaData(texto))}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={theme.colors.textBody}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={10}
              autoCorrect={false}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={confirmar}
            style={({ pressed }) => [
              styles.dateModalConfirm,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.dateModalConfirmText}>Confirmar data</Text>
            <Ionicons name="checkmark" size={19} color={theme.colors.surface} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
