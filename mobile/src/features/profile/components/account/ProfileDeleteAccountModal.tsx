import React from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileAccountStyles as styles } from "../../styles/account/profileAccount.styles";

interface ProfileDeleteAccountModalProps {
  visible: boolean;
  password: string;
  deleting: boolean;
  showPassword: boolean;
  onPasswordChange: (password: string) => void;
  onTogglePasswordVisibility: () => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ProfileDeleteAccountModal({
  visible,
  password,
  deleting,
  showPassword,
  onPasswordChange,
  onTogglePasswordVisibility,
  onClose,
  onConfirm,
}: ProfileDeleteAccountModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.deleteModalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={styles.deleteModalBackdrop}
          onPress={onClose}
          disabled={deleting}
          accessibilityLabel="Cancelar exclusão da conta"
        />

        <View style={styles.deleteModalCard}>
          <View style={styles.deleteModalIcon}>
            <Ionicons
              name="warning-outline"
              size={26}
              color={theme.colors.semantic.danger.text}
            />
          </View>

          <Text style={styles.deleteModalTitle}>Excluir conta</Text>
          <Text style={styles.deleteModalDescription}>
            Esta ação é permanente. Seus dados e registros associados à sua
            conta serão removidos do PetRadar.
          </Text>

          <Text style={styles.deletePasswordLabel}>Senha atual</Text>
          <View style={styles.deletePasswordWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={19}
              color={theme.colors.textBody}
            />
            <TextInput
              style={styles.deletePasswordInput}
              value={password}
              onChangeText={onPasswordChange}
              placeholder="Digite sua senha atual"
              placeholderTextColor={theme.colors.textBody}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!deleting}
              accessibilityLabel="Senha atual"
            />
            <Pressable
              style={styles.deletePasswordToggle}
              onPress={onTogglePasswordVisibility}
              disabled={deleting}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Ocultar senha" : "Mostrar senha"
              }
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.textBody}
              />
            </Pressable>
          </View>

          <View style={styles.deleteModalActions}>
            <TouchableOpacity
              style={styles.deleteModalCancelButton}
              onPress={onClose}
              disabled={deleting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Cancelar exclusão"
            >
              <Text style={styles.deleteModalCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteModalConfirmButton,
                deleting && styles.deleteModalButtonDisabled,
              ]}
              onPress={onConfirm}
              disabled={deleting}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Excluir conta definitivamente"
            >
              {deleting ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.surface}
                />
              ) : (
                <>
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={theme.colors.surface}
                  />
                  <Text style={styles.deleteModalConfirmText}>
                    Excluir definitivamente
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
