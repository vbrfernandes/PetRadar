import React from "react";
import {  Text, View } from "react-native";

import ChoiceButton from "./ChoiceButton";
import SelectionChipGroup from "./SelectionChipGroup";
import {
  disabilitySectionStyles as styles,
  occurrenceConditionStyles,
  occurrenceFormSharedStyles,
} from "../../styles/occurrenceForm.styles";

const deficiencias = [
  "Paralisia de membros",
  "Amputado",
  "Cegueira",
  "Surdez",
  "Incontinência urinária",
  "Incontinência fecal",
];

interface DisabilitySectionProps {
  deficiencia: boolean;
  onDeficienciaChange: (possuiDeficiencia: boolean) => void;
  deficienciasSelecionadas: string[];
  onDeficienciaSelect: (deficiencia: string) => void;
}

export default function DisabilitySection({
  deficiencia,
  onDeficienciaChange,
  deficienciasSelecionadas,
  onDeficienciaSelect,
}: DisabilitySectionProps) {
  return (
    <>
      <Text style={styles.fieldLabel}>Deficiência?</Text>

      <View style={styles.binaryRow}>
        <ChoiceButton
          label="Sim"
          active={deficiencia}
          onPress={() => onDeficienciaChange(true)}
        />

        <ChoiceButton
          label="Não"
          active={!deficiencia}
          onPress={() => onDeficienciaChange(false)}
        />
      </View>

      {deficiencia && (
        <View style={styles.conditionalBox}>
          <Text style={styles.conditionalTitle}>Quais?</Text>

          <SelectionChipGroup
            options={deficiencias}
            mode="multiple"
            selectedValues={deficienciasSelecionadas}
            onSelect={onDeficienciaSelect}
          />
        </View>
      )}
    </>
  );
}