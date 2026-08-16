import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import type { TipoAnimal } from "../../types/occurrence.types";

export interface AnimalTypeOption {
  valor: TipoAnimal;
  titulo: string;
  descricao?: string;
  icone: string;
}

interface AnimalTypeSelectorProps {
  options: AnimalTypeOption[];
  selectedType: TipoAnimal | null;
  onSelect: (tipo: TipoAnimal) => void;
}

export default function AnimalTypeSelector({
  options,
  selectedType,
  onSelect,
}: AnimalTypeSelectorProps) {
  return (
    <View style={styles.animalGrid}>
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
              styles.animalCard,
              ativo && styles.animalCardActive,
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.animalIcon,
                ativo && styles.animalIconActive,
              ]}
            >
              <MaterialCommunityIcons
                name={opcao.icone as any}
                size={24}
                color={ativo ? theme.colors.surface : theme.colors.brand}
              />
            </View>

            <Text
              style={[
                styles.animalTitle,
                ativo && styles.animalTitleActive,
              ]}
            >
              {opcao.titulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  animalGrid: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 4,
  },

  animalCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.10)",
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  animalCardActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.07)",
  },

  animalIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  animalIconActive: {
    backgroundColor: theme.colors.brand,
  },

  animalTitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    fontWeight: "700",
  },

  animalTitleActive: {
    color: theme.colors.brand,
  },

  pressed: {
    opacity: 0.82,
  },
});
