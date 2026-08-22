import { Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../../theme";
import { IDADES, PORTES, SEXOS, TIPOS_ANIMAIS } from "../../../constants/occurrence.constants";
import type { TipoAnimal } from "../../../types/occurrence.types";
import AnimalTypeSelector from "../controls/AnimalTypeSelector";
import ChoiceButton from "../controls/ChoiceButton";
import SelectionChipGroup from "../controls/SelectionChipGroup";
import {
  animalSectionStyles as styles,
} from "../../../styles/form/occurrenceFormSections.styles";
interface AnimalSectionProps {
  tipoAnimal: TipoAnimal | null;
  onTipoAnimalChange: (tipo: TipoAnimal) => void;
  tipoAnimalOutro: string;
  onTipoAnimalOutroChange: (value: string) => void;
  ehPet: boolean;
  racaConhecida: boolean | null;
  onRacaConhecidaChange: (conhecida: boolean) => void;
  raca: string;
  onRacaChange: (value: string) => void;
  sexo: string;
  onSexoChange: (value: string) => void;
  cor: string;
  onCorChange: (value: string) => void;
  porte: string;
  onPorteChange: (value: string) => void;
  idade: string;
  onIdadeChange: (value: string) => void;
}

export default function AnimalSection({
  tipoAnimal,
  onTipoAnimalChange,
  tipoAnimalOutro,
  onTipoAnimalOutroChange,
  ehPet,
  racaConhecida,
  onRacaConhecidaChange,
  raca,
  onRacaChange,
  sexo,
  onSexoChange,
  cor,
  onCorChange,
  porte,
  onPorteChange,
  idade,
  onIdadeChange,
}: AnimalSectionProps) {
  return (
    <>
      <Text style={styles.fieldLabel}>Tipo de animal</Text>

      <AnimalTypeSelector
        options={TIPOS_ANIMAIS}
        selectedType={tipoAnimal}
        onSelect={onTipoAnimalChange}
      />

      {tipoAnimal === "OUTRO" && (
        <View style={styles.otherAnimalField}>
          <Text style={styles.fieldLabel}>Qual animal?</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="paw-outline"
              size={20}
              color={theme.colors.brand}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={tipoAnimalOutro}
              onChangeText={onTipoAnimalOutroChange}
              placeholder="Digite o tipo do animal..."
              placeholderTextColor={theme.colors.textBody}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
        </View>
      )}

      {ehPet && (
        <>
          <Text style={[styles.fieldLabel, styles.fieldLabelSpacing]}>
            Você sabe a raça?
          </Text>

          <View style={styles.binaryRow}>
            <ChoiceButton
              label="Sim"
              active={racaConhecida === true}
              onPress={() => onRacaConhecidaChange(true)}
            />

            <ChoiceButton
              label="Não"
              active={racaConhecida === false}
              onPress={() => onRacaConhecidaChange(false)}
            />
          </View>

          {racaConhecida === true && (
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="dog"
                size={20}
                color={theme.colors.brand}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                value={raca}
                onChangeText={onRacaChange}
                placeholder="Ex.: Border Collie"
                placeholderTextColor={theme.colors.textBody}
              />
            </View>
          )}
        </>
      )}

      <Text style={[styles.fieldLabel, styles.fieldLabelSpacing]}>Sexo</Text>

      <SelectionChipGroup
        options={SEXOS}
        mode="single"
        selectedValue={sexo}
        onSelect={onSexoChange}
      />

      <Text style={styles.fieldLabel}>Cor</Text>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="palette-outline"
          size={20}
          color={theme.colors.brand}
          style={styles.inputIcon}
        />

        <TextInput
          style={styles.input}
          value={cor}
          onChangeText={onCorChange}
          placeholder="Ex.: preto e branco"
          placeholderTextColor={theme.colors.textBody}
        />

        <Text style={styles.optionalText}>Opcional</Text>
      </View>

      <Text style={styles.fieldLabel}>Porte</Text>

      <SelectionChipGroup
        options={PORTES}
        mode="single"
        selectedValue={porte}
        onSelect={onPorteChange}
      />

      <Text style={styles.fieldLabel}>Idade</Text>

      <SelectionChipGroup
        options={IDADES}
        mode="single"
        selectedValue={idade}
        onSelect={onIdadeChange}
      />
    </>
  );
}
