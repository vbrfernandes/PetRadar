import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme/colors';
import { esqueceuSenhaStyles as styles } from '../../styles/esqueceuSenha.styles';
import { AuthInput } from '../common/AuthInput';
import { AuthSubmitButton } from '../common/AuthSubmitButton';

interface PasswordResetRequestStepProps {
  email: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}

export function PasswordResetRequestStep({
  email,
  loading,
  onEmailChange,
  onSubmit,
}: PasswordResetRequestStepProps) {
  return (
    <>
      <AuthInput
        label="E-mail Cadastrado"
        icon={
          <Ionicons name="mail-outline" size={20} color={theme.colors.brand} />
        }
        wrapperStyle={styles.inputWrapper}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={onEmailChange}
      />

      <AuthSubmitButton
        text="Enviar Código"
        onPress={onSubmit}
        loading={loading}
      />
    </>
  );
}
