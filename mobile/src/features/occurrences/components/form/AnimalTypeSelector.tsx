import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  animalTypeSelectorStyles as styles,
} from "../../styles/occurrenceForm.styles";
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