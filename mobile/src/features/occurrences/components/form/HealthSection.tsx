import React from "react";
import { Text, View } from "react-native";

import ChoiceButton from "./ChoiceButton";
import SelectionChipGroup from "./SelectionChipGroup";
import {
  healthSectionStyles as styles,
  occurrenceConditionStyles,
  occurrenceFormSharedStyles,
} from "../../styles/occurrenceForm.styles";

const problemasSaude = [
  "Ferido / machucado",
  "Desnutrido",
  "Desidratado",
  "Ingestão de corpo estranho",
  "Atropelado",
  "Problemas dermatológicos",
];

interface HealthSectionProps {
  saudeCritica: boolean;
  onSaudeCriticaChange: (critica: boolean) => void;
  problemasSelecionados: string[];
  onProblemaSelect: (problema: string) => void;
}

export default function HealthSection({
  saudeCritica,
  onSaudeCriticaChange,
  problemasSelecionados,
  onProblemaSelect,
}: HealthSectionProps) {
  return (
    <>
      <Text style={styles.fieldLabel}>Saúde crítica?</Text>

      <View style={styles.binaryRow}>
        <ChoiceButton
          label="Sim"
          active={saudeCritica}
          danger={saudeCritica}
          onPress={() => onSaudeCriticaChange(true)}
        />

        <ChoiceButton
          label="Não"
          active={!saudeCritica}
          onPress={() => onSaudeCriticaChange(false)}
        />
      </View>

      {saudeCritica && (
        <View style={styles.conditionalBox}>
          <Text style={styles.conditionalTitle}>
            O que você identificou?
          </Text>

          <SelectionChipGroup
            options={problemasSaude}
            mode="multiple"
            selectedValues={problemasSelecionados}
            onSelect={onProblemaSelect}
          />
        </View>
      )}
    </>
  );
}