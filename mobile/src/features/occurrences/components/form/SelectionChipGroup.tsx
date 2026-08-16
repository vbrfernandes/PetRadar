import React from "react";
import { StyleSheet, View } from "react-native";

import SelectionChip from "./SelectionChip";

interface SelectionChipGroupBaseProps {
  options: string[];
}

interface SingleSelectionChipGroupProps extends SelectionChipGroupBaseProps {
  mode: "single";
  selectedValue: string;
  onSelect: (value: string) => void;
}

interface MultipleSelectionChipGroupProps extends SelectionChipGroupBaseProps {
  mode: "multiple";
  selectedValues: string[];
  onSelect: (value: string) => void;
}

type SelectionChipGroupProps =
  | SingleSelectionChipGroupProps
  | MultipleSelectionChipGroupProps;

export default function SelectionChipGroup(props: SelectionChipGroupProps) {
  return (
    <View style={styles.optionsGrid}>
      {props.options.map((opcao) => {
        const ativo =
          props.mode === "single"
            ? props.selectedValue === opcao
            : props.selectedValues.includes(opcao);

        return (
          <SelectionChip
            key={opcao}
            label={opcao}
            active={ativo}
            mode={props.mode}
            onPress={() => props.onSelect(opcao)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 13,
  },
});
