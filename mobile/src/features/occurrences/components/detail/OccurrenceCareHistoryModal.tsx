import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceCareStyles as styles } from "../../styles/detail/occurrenceCare.styles";
import { occurrenceDetailDrawerStyles as drawerStyles } from "../../styles/detail/occurrenceDetailDrawer.styles";
import type { CuidadoOcorrencia } from "../../types/occurrenceDetail.types";
import { formatarDataHora } from "../../utils/occurrenceFormatters";

interface OccurrenceCareHistoryModalProps {
  visible: boolean;
  historico: CuidadoOcorrencia[] | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}

export default function OccurrenceCareHistoryModal({
  visible,
  historico,
  loading,
  error,
  onClose,
  onRetry,
}: OccurrenceCareHistoryModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.historyBackdrop}>
        <View style={styles.historyModal}>
          <View style={styles.historyHeader}>
            <View style={styles.historyHeaderContent}>
              <Text style={styles.historyTitle}>Histórico de cuidados</Text>
              <Text style={styles.historySubtitle}>
                Água e comida registradas nesta ocorrência.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar histórico"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeHistoryButton,
                pressed && drawerStyles.pressed,
              ]}
            >
              <Ionicons name="close" size={21} color={theme.colors.textTitle} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.historyState}>
              <ActivityIndicator color={theme.colors.brand} />
              <Text style={styles.historyStateText}>Carregando histórico...</Text>
            </View>
          ) : error ? (
            <View style={styles.historyState}>
              <View style={styles.historyErrorIcon}>
                <Ionicons
                  name="alert-circle-outline"
                  size={25}
                  color={theme.colors.semantic.danger.text}
                />
              </View>
              <Text style={styles.historyErrorText}>{error}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tentar novamente"
                onPress={onRetry}
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && drawerStyles.pressed,
                ]}
              >
                <Ionicons
                  name="refresh-outline"
                  size={17}
                  color={theme.colors.brand}
                />
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : historico?.length ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.historyList}
            >
              {historico.map((item, index) => {
                const agua = item.tipo_cuidado === "AGUA";
                return (
                  <React.Fragment key={item.id_historico}>
                    <View style={styles.historyItem}>
                      <View style={styles.historyItemIcon}>
                        <MaterialCommunityIcons
                          name={agua ? "water" : "food"}
                          size={21}
                          color={theme.colors.brand}
                        />
                      </View>
                      <View style={styles.historyItemContent}>
                        <Text style={styles.historyItemTitle}>
                          {agua ? "Água" : "Comida"}
                        </Text>
                        <Text style={styles.historyItemDate}>
                          {formatarDataHora(item.data_cuidado)}
                        </Text>
                        <View style={styles.authorRow}>
                          <Ionicons
                            name="person-outline"
                            size={13}
                            color={theme.colors.textBody}
                          />
                          <Text style={styles.historyItemAuthor} numberOfLines={1}>
                            {item.usuario.nome}
                          </Text>
                        </View>
                        <Text style={styles.historyRegistered}>
                          Registrado em {formatarDataHora(item.data_registro)}
                        </Text>
                      </View>
                    </View>
                    {index < historico.length - 1 ? (
                      <View style={styles.historyDivider} />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.historyState}>
              <View style={styles.historyEmptyIcon}>
                <Ionicons name="time-outline" size={26} color={theme.colors.brand} />
              </View>
              <Text style={styles.historyEmptyTitle}>Nenhum cuidado registrado</Text>
              <Text style={styles.historyStateText}>
                Os registros de água e comida aparecerão aqui.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
