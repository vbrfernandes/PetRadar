import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme/colors';
import { cadastroUserStyles as styles } from '../../styles/cadastroUser.styles';
import { AuthInput } from '../common/AuthInput';
import { AuthPasswordInput } from '../common/AuthPasswordInput';
import { AuthSubmitButton } from '../common/AuthSubmitButton';

interface UserAccessStepProps {
  email: string;
  senha: string;
  confirmaSenha: string;
  showPassword: boolean;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onSenhaChange: (value: string) => void;
  onConfirmaSenhaChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: () => void;
}

const lockIcon = (
  <Ionicons name="lock-closed-outline" size={20} color={theme.colors.brand} />
);

export function UserAccessStep({
  email,
  senha,
  confirmaSenha,
  showPassword,
  loading,
  onEmailChange,
  onSenhaChange,
  onConfirmaSenhaChange,
  onTogglePassword,
  onSubmit,
}: UserAccessStepProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>2. Dados de Acesso</Text>

      <AuthInput
        label="E-mail *"
        icon={
          <Ionicons name="mail-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={onEmailChange}
      />

      <AuthPasswordInput
        label="Senha *"
        icon={lockIcon}
        placeholder="••••••••"
        value={senha}
        onChangeText={onSenhaChange}
        isPasswordVisible={showPassword}
        onToggleVisibility={onTogglePassword}
      />

      <AuthPasswordInput
        label="Confirma Senha *"
        icon={lockIcon}
        placeholder="••••••••"
        value={confirmaSenha}
        onChangeText={onConfirmaSenhaChange}
        isPasswordVisible={showPassword}
      />

      <AuthSubmitButton
        text="Criar Conta"
        onPress={onSubmit}
        loading={loading}
        icon={
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={theme.colors.surface}
          />
        }
      />
    </>
  );
}
