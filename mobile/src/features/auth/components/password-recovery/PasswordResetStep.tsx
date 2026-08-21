import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme';
import { esqueceuSenhaStyles as styles } from '../../styles/esqueceuSenha.styles';
import { AuthInput } from '../common/AuthInput';
import { AuthPasswordInput } from '../common/AuthPasswordInput';
import { AuthSubmitButton } from '../common/AuthSubmitButton';

interface PasswordResetStepProps {
  codigo: string;
  novaSenha: string;
  confirmaSenha: string;
  showPassword: boolean;
  loading: boolean;
  onCodigoChange: (value: string) => void;
  onNovaSenhaChange: (value: string) => void;
  onConfirmaSenhaChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: () => void;
}

const lockIcon = (
  <Ionicons name="lock-closed-outline" size={20} color={theme.colors.brand} />
);

export function PasswordResetStep({
  codigo,
  novaSenha,
  confirmaSenha,
  showPassword,
  loading,
  onCodigoChange,
  onNovaSenhaChange,
  onConfirmaSenhaChange,
  onTogglePassword,
  onSubmit,
}: PasswordResetStepProps) {
  return (
    <>
      <AuthInput
        label="Código de Verificação (6 dígitos)"
        icon={
          <Ionicons name="key-outline" size={20} color={theme.colors.brand} />
        }
        wrapperStyle={styles.inputWrapper}
        placeholder="123456"
        keyboardType="numeric"
        maxLength={6}
        value={codigo}
        onChangeText={onCodigoChange}
      />

      <AuthPasswordInput
        label="Nova Senha"
        icon={lockIcon}
        wrapperStyle={styles.inputWrapper}
        placeholder="••••••••"
        value={novaSenha}
        onChangeText={onNovaSenhaChange}
        isPasswordVisible={showPassword}
        onToggleVisibility={onTogglePassword}
      />

      <AuthPasswordInput
        label="Confirmar Nova Senha"
        icon={lockIcon}
        wrapperStyle={styles.inputWrapper}
        placeholder="••••••••"
        value={confirmaSenha}
        onChangeText={onConfirmaSenhaChange}
        isPasswordVisible={showPassword}
      />

      <AuthSubmitButton
        text="Redefinir Senha"
        onPress={onSubmit}
        loading={loading}
      />
    </>
  );
}
