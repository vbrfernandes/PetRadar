import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../../theme";
import type { TipoOcorrencia } from "../../../types/occurrence.types";
import type { OccurrenceTypeOption } from "../../../types/occurrenceForm.types";
import {
  occurrenceTypeSectionStyles as styles,
} from "../../../styles/form/occurrenceFormSections.styles";

export type { OccurrenceTypeOption } from "../../../types/occurrenceForm.types";

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
