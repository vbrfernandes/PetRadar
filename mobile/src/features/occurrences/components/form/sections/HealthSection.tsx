import { Text, View } from "react-native";

import ChoiceButton from "../controls/ChoiceButton";
import SelectionChipGroup from "../controls/SelectionChipGroup";
import { PROBLEMAS_SAUDE } from "../../../constants/occurrence.constants";
import {
  healthSectionStyles as styles,
} from "../../../styles/form/occurrenceFormSections.styles";

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
            options={PROBLEMAS_SAUDE}
            mode="multiple"
            selectedValues={problemasSelecionados}
            onSelect={onProblemaSelect}
          />
        </View>
      )}
    </>
  );
}
