import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../../theme";
import {
  locationSectionStyles as styles,
} from "../../../styles/form/occurrenceLocation.styles";
import type { SugestaoEndereco } from "../../../types/occurrenceForm.types";

export type { SugestaoEndereco } from "../../../types/occurrenceForm.types";

interface LocationSectionProps {
  endereco: string;
  sugestoesEndereco: SugestaoEndereco[];
  buscandoEndereco: boolean;
  localizando: boolean;
  localizacaoMarcada: boolean;
  onEnderecoChange: (texto: string) => void;
  onSugestaoPress: (sugestao: SugestaoEndereco) => void;
  onUsarLocalizacaoPress: () => void;
}

export default function LocationSection({
  endereco,
  sugestoesEndereco,
  buscandoEndereco,
  localizando,
  localizacaoMarcada,
  onEnderecoChange,
  onSugestaoPress,
  onUsarLocalizacaoPress,
}: LocationSectionProps) {
  return (
    <>
      <Text style={styles.fieldLabel}>Endereço visto pela última vez *</Text>

      <View style={[styles.inputContainer, styles.addressInput]}>
        <Ionicons
          name="location-outline"
          size={20}
          color={theme.colors.brand}
          style={styles.inputIcon}
        />

        <TextInput
          style={styles.input}
          value={endereco}
          onChangeText={onEnderecoChange}
          placeholder="Rua, número, bairro e cidade"
          placeholderTextColor={theme.colors.textBody}
          multiline
        />

        {buscandoEndereco && (
          <ActivityIndicator
            size="small"
            color={theme.colors.brand}
            style={styles.addressLoading}
          />
        )}
      </View>

      {sugestoesEndereco.length > 0 && (
        <View style={styles.addressSuggestions}>
          {sugestoesEndereco.map((sugestao, index) => {
            const titulo =
              sugestao.properties.name_preferred || sugestao.properties.name;

            const subtitulo =
              sugestao.properties.place_formatted ||
              sugestao.properties.full_address;

            return (
              <React.Fragment key={sugestao.id}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar endereço ${titulo}`}
                  onPress={() => onSugestaoPress(sugestao)}
                  style={({ pressed }) => [
                    styles.addressSuggestionItem,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.addressSuggestionIcon}>
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color={theme.colors.brand}
                    />
                  </View>

                  <View style={styles.addressSuggestionContent}>
                    <Text
                      style={styles.addressSuggestionTitle}
                      numberOfLines={1}
                    >
                      {titulo}
                    </Text>

                    {subtitulo ? (
                      <Text
                        style={styles.addressSuggestionSubtitle}
                        numberOfLines={2}
                      >
                        {subtitulo}
                      </Text>
                    ) : null}
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={theme.colors.textBody}
                  />
                </Pressable>

                {index < sugestoesEndereco.length - 1 && (
                  <View style={styles.addressSuggestionDivider} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={onUsarLocalizacaoPress}
        disabled={localizando}
        style={({ pressed }) => [
          styles.locationButton,
          pressed && styles.pressed,
        ]}
      >
        {localizando ? (
          <ActivityIndicator color={theme.colors.brand} />
        ) : (
          <Ionicons
            name="navigate-outline"
            size={19}
            color={theme.colors.brand}
          />
        )}

        <Text style={styles.locationButtonText}>
          {localizando
            ? "Obtendo localização..."
            : localizacaoMarcada
              ? "Localização marcada"
              : "Usar minha localização"}
        </Text>

        {localizacaoMarcada && (
          <Ionicons
            name="checkmark-circle"
            size={19}
            color={theme.colors.semantic.success.text}
          />
        )}
      </Pressable>
    </>
  );
}
