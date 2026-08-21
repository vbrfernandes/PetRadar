import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import {
  TIPO_OCORRENCIA_FILTER_OPTIONS,
  URGENCIA_FILTER_OPTIONS,
} from "../../constants/map.constants";
import { mapScreenStyles as styles } from "../../styles/map.styles";
import type {
  TipoOcorrenciaFiltro,
  UrgenciaFiltro,
} from "../../types/map.types";

interface MapFiltersModalProps {
  visible: boolean;
  tipoFiltro: TipoOcorrenciaFiltro;
  urgenciaFiltro: UrgenciaFiltro;
  onChangeTipoFiltro: (value: TipoOcorrenciaFiltro) => void;
  onChangeUrgenciaFiltro: (value: UrgenciaFiltro) => void;
  onClose: () => void;
}

export function MapFiltersModal({
  visible,
  tipoFiltro,
  urgenciaFiltro,
  onChangeTipoFiltro,
  onChangeUrgenciaFiltro,
  onClose,
}: MapFiltersModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.filterModalContainer}>
        <Pressable style={styles.filterBackdrop} onPress={onClose} />

        <View style={styles.filterSheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Filtrar ocorrências</Text>

              <Text style={styles.sheetSubtitle}>
                Personalize o que aparece no mapa
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.sheetClose}>
              <Ionicons
                name="close"
                size={21}
                color={theme.colors.textTitle}
              />
            </Pressable>
          </View>

          <Text style={styles.filterSectionTitle}>Tipo de ocorrência</Text>

          <View style={styles.chipGrid}>
            {TIPO_OCORRENCIA_FILTER_OPTIONS.map((label) => (
              <Pressable
                key={label}
                style={[
                  styles.filterChip,
                  label === tipoFiltro && styles.filterChipSelected,
                ]}
                onPress={() => onChangeTipoFiltro(label)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    label === tipoFiltro && styles.filterChipTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.filterSectionTitle, styles.secondFilterSection]}>
            Nível de urgência
          </Text>

          <View style={styles.chipGrid}>
            {URGENCIA_FILTER_OPTIONS.map((label) => (
              <Pressable
                key={label}
                style={[
                  styles.filterChip,
                  label === urgenciaFiltro && styles.filterChipSelected,
                ]}
                onPress={() => onChangeUrgenciaFiltro(label)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    label === urgenciaFiltro && styles.filterChipTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.filterActions}>
            <Pressable
              onPress={() => {
                onChangeTipoFiltro("Todas");
                onChangeUrgenciaFiltro("Todas");
              }}
              style={styles.clearFiltersButton}
            >
              <Text style={styles.clearFiltersText}>Limpar</Text>
            </Pressable>

            <Pressable onPress={onClose} style={styles.applyFiltersButton}>
              <Text style={styles.applyFiltersText}>Aplicar filtros</Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={theme.colors.surface}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
