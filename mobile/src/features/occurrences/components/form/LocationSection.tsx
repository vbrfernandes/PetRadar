import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceFormSharedStyles } from "./occurrenceForm.styles";

export interface SugestaoEndereco {
  id: string;

  geometry: {
    type: "Point";
    coordinates: [number, number];
  };

  properties: {
    mapbox_id: string;
    feature_type: string;
    name: string;
    name_preferred?: string;
    place_formatted?: string;
    full_address?: string;
  };
}

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

const styles = StyleSheet.create({
  ...occurrenceFormSharedStyles,

  addressInput: {
    alignItems: "flex-start",
    paddingTop: 3,
    paddingBottom: 3,
  },

  addressLoading: {
    marginTop: 14,
    marginLeft: 8,
  },

  addressSuggestions: {
    marginTop: -4,
    marginBottom: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.10)",
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    ...theme.shadows.elevation1,
  },

  addressSuggestionItem: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  addressSuggestionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "rgba(31, 92, 77, 0.06)",
  },

  addressSuggestionContent: {
    flex: 1,
    paddingRight: 8,
  },

  addressSuggestionTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },

  addressSuggestionSubtitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    lineHeight: 17,
  },

  addressSuggestionDivider: {
    height: 1,
    marginLeft: 58,
    backgroundColor: "rgba(31, 92, 77, 0.08)",
  },

  locationButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.14)",
    backgroundColor: "rgba(31, 92, 77, 0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },

  locationButtonText: {
    color: theme.colors.brand,
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.82,
  },
});
