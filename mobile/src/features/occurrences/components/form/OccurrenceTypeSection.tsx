import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import type { TipoOcorrencia } from "../../types/occurrence.types";

export interface OccurrenceTypeOption {
  valor: TipoOcorrencia;
  titulo: string;
  descricao?: string;
  icone: string;
}

interface OccurrenceTypeSectionProps {
  options: OccurrenceTypeOption[];
  selectedType: TipoOcorrencia | null;
  onSelect: (tipo: TipoOcorrencia) => void;
}

export default function OccurrenceTypeSection({
  options,
  selectedType,
  onSelect,
}: OccurrenceTypeSectionProps) {
  return (
    <View style={styles.typeList}>
      {options.map((opcao) => {
        const ativo = selectedType === opcao.valor;

        return (
          <Pressable
            key={opcao.valor}
            accessibilityRole="radio"
            accessibilityState={{
              selected: ativo,
            }}
            onPress={() => onSelect(opcao.valor)}
            style={({ pressed }) => [
              styles.typeCard,
              ativo && styles.typeCardActive,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.typeIcon, ativo && styles.typeIconActive]}>
              <MaterialCommunityIcons
                name={opcao.icone as any}
                size={23}
                color={ativo ? theme.colors.surface : theme.colors.brand}
              />
            </View>

            <View style={styles.typeContent}>
              <Text
                style={[
                  styles.typeTitle,
                  ativo && styles.typeTitleActive,
                ]}
              >
                {opcao.titulo}
              </Text>

              <Text style={styles.typeDescription}>{opcao.descricao}</Text>
            </View>

            <View
              style={[
                styles.radioOuter,
                ativo && styles.radioOuterActive,
              ]}
            >
              {ativo && <View style={styles.radioInner} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  typeList: {
    gap: 10,
  },

  typeCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.10)",
    backgroundColor: theme.colors.background,
  },

  typeCardActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.06)",
  },

  typeIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  typeIconActive: {
    backgroundColor: theme.colors.brand,
  },

  typeContent: {
    flex: 1,
  },

  typeTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "700",
  },

  typeTitleActive: {
    color: theme.colors.brand,
  },

  typeDescription: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },

  radioOuter: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(31, 92, 77, 0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  radioOuterActive: {
    borderColor: theme.colors.brand,
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.brand,
  },

  pressed: {
    opacity: 0.82,
  },
});
