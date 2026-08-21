import {  Text, View } from "react-native";

import ChoiceButton from "../controls/ChoiceButton";
import SelectionChipGroup from "../controls/SelectionChipGroup";
import { DEFICIENCIAS } from "../../../constants/occurrence.constants";
import {
  disabilitySectionStyles as styles,
} from "../../../styles/form/occurrenceFormSections.styles";

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
            options={DEFICIENCIAS}
            mode="multiple"
            selectedValues={deficienciasSelecionadas}
            onSelect={onDeficienciaSelect}
          />
        </View>
      )}
    </>
  );
}
