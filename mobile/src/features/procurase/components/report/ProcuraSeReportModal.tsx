import React from "react";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { PROCURA_SE_REPORT_REASONS } from "../../constants/procurase.constants";
import { procuraSeReportStyles as styles } from "../../styles/procuraseReport.styles";
import { procuraSeButtonPressedStyle } from "../../styles/procuraseScreen.styles";

interface ProcuraSeReportModalProps {
  visible: boolean;
  sending: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void | Promise<void>;
}

export default function ProcuraSeReportModal({
  visible,
  sending,
  onClose,
  onSubmit,
}: ProcuraSeReportModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.reportOverlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar denúncia"
          onPress={onClose}
          style={styles.reportBackdrop}
        />

        <View style={styles.reportSheet}>
          <View style={styles.reportHandle} />

          <View style={styles.reportHeader}>
            <View style={styles.reportHeaderIcon}>
              <Ionicons
                name="flag-outline"
                size={21}
                color={theme.colors.semantic.danger.text}
              />
            </View>

            <View style={styles.reportHeaderContent}>
              <Text style={styles.reportTitle}>Denunciar publicação</Text>
              <Text style={styles.reportDescription}>
                Selecione o motivo da denúncia.
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              disabled={sending}
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.reportCloseButton,
                pressed && procuraSeButtonPressedStyle,
              ]}
            >
              <Ionicons
                name="close"
                size={21}
                color={theme.colors.textBody}
              />
            </Pressable>
          </View>

          {sending ? (
            <View style={styles.reportLoading}>
              <ActivityIndicator
                size="small"
                color={theme.colors.brand}
              />
              <Text style={styles.reportLoadingText}>
                Enviando denúncia...
              </Text>
            </View>
          ) : (
            <View style={styles.reportReasons}>
              {PROCURA_SE_REPORT_REASONS.map((reason) => (
                <Pressable
                  key={reason.id}
                  accessibilityRole="button"
                  accessibilityLabel={reason.label}
                  onPress={() => void onSubmit(reason.label)}
                  style={({ pressed }) => [
                    styles.reportReasonButton,
                    pressed && styles.reportReasonButtonPressed,
                  ]}
                >
                  <View style={styles.reportReasonIcon}>
                    <Ionicons
                      name="flag-outline"
                      size={17}
                      color={theme.colors.textBody}
                    />
                  </View>

                  <Text style={styles.reportReasonText}>{reason.label}</Text>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={theme.colors.textBody}
                  />
                </Pressable>
              ))}
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancelar denúncia"
            disabled={sending}
            onPress={onClose}
            style={({ pressed }) => [
              styles.reportCancelButton,
              pressed && procuraSeButtonPressedStyle,
            ]}
          >
            <Text style={styles.reportCancelText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
