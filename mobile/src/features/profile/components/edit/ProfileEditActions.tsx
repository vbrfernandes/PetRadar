import React from "react";

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileEditStyles as styles } from "../../styles/edit/profileEdit.styles";

interface ProfileEditActionsProps {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileEditActions({
  saving,
  onSave,
  onCancel,
}: ProfileEditActionsProps) {
  return (
    <View style={styles.editActions}>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          saving && styles.primaryButtonDisabled,
        ]}
        onPress={onSave}
        disabled={saving}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Salvar alterações"
      >
        {saving ? (
          <ActivityIndicator color={theme.colors.surface} />
        ) : (
          <>
            <Ionicons
              name="checkmark-circle-outline"
              size={21}
              color={theme.colors.surface}
            />
            <Text style={styles.primaryButtonText}>Salvar alterações</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onCancel}
        disabled={saving}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Cancelar edição"
      >
        <Text style={styles.secondaryButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}
