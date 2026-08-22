import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../theme";
import { DENUNCIA_MOTIVOS } from "../constants/feed.constants";
import { feedReportStyles as styles } from "../styles/feedReport.styles";
import { feedButtonPressedStyle } from "../styles/feedScreen.styles";

interface ReportOccurrenceModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSelectReason: (reason: string) => void | Promise<void>;
}

export default function ReportOccurrenceModal({
  visible,
  loading,
  onClose,
  onSelectReason,
}: ReportOccurrenceModalProps) {
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
              disabled={loading}
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.reportCloseButton,
                pressed && feedButtonPressedStyle,
              ]}
            >
              <Ionicons
                name="close"
                size={21}
                color={theme.colors.textBody}
              />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.reportLoading}>
              <ActivityIndicator size="small" color={theme.colors.brand} />
              <Text style={styles.reportLoadingText}>Enviando denúncia...</Text>
            </View>
          ) : (
            <View style={styles.reportReasons}>
              {DENUNCIA_MOTIVOS.map((motivo) => (
                <Pressable
                  key={motivo.id}
                  accessibilityRole="button"
                  accessibilityLabel={motivo.label}
                  onPress={() => void onSelectReason(motivo.label)}
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
                  <Text style={styles.reportReasonText}>{motivo.label}</Text>
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
            disabled={loading}
            onPress={onClose}
            style={({ pressed }) => [
              styles.reportCancelButton,
              pressed && feedButtonPressedStyle,
            ]}
          >
            <Text style={styles.reportCancelText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
