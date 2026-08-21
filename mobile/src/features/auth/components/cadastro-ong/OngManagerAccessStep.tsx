import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme/colors';
import { cadastroONGStyles as styles } from '../../styles/cadastroONG.styles';
import { AuthInput } from '../common/AuthInput';
import { AuthPasswordInput } from '../common/AuthPasswordInput';
import { AuthSubmitButton } from '../common/AuthSubmitButton';

interface OngManagerAccessStepProps {
  nomeGestor: string;
  cpfGestor: string;
  telefone: string;
  email: string;
  senha: string;
  confirmaSenha: string;
  showPassword: boolean;
  comprovanteUri: string | null;
  loading: boolean;
  onNomeGestorChange: (value: string) => void;
  onCpfGestorChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSenhaChange: (value: string) => void;
  onConfirmaSenhaChange: (value: string) => void;
  onTogglePassword: () => void;
  onSelectDocument: () => void;
  onSubmit: () => void;
}

const lockIcon = (
  <Ionicons name="lock-closed-outline" size={20} color={theme.colors.brand} />
);

export function OngManagerAccessStep({
  nomeGestor,
  cpfGestor,
  telefone,
  email,
  senha,
  confirmaSenha,
  showPassword,
  comprovanteUri,
  loading,
  onNomeGestorChange,
  onCpfGestorChange,
  onTelefoneChange,
  onEmailChange,
  onSenhaChange,
  onConfirmaSenhaChange,
  onTogglePassword,
  onSelectDocument,
  onSubmit,
}: OngManagerAccessStepProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>3. Responsável e Acesso</Text>

      <AuthInput
        label="Nome do Gestor *"
        icon={
          <Ionicons name="person-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="Nome completo do responsável"
        value={nomeGestor}
        onChangeText={onNomeGestorChange}
      />

      <AuthInput
        label="CPF do Gestor *"
        placeholder="000.000.000-00"
        keyboardType="numeric"
        value={cpfGestor}
        onChangeText={onCpfGestorChange}
      />

      <AuthInput
        label="Telefone / WhatsApp *"
        icon={
          <Ionicons name="call-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={onTelefoneChange}
      />

      <AuthInput
        label="E-mail de Acesso *"
        icon={
          <Ionicons name="mail-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="ong@exemplo.com"
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

      <View style={styles.uploadWrapper}>
        <Text style={styles.uploadLabel}>Comprovante de Vínculo (Opcional)</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={onSelectDocument}>
          <Ionicons
            name="document-attach-outline"
            size={20}
            color={theme.colors.brand}
          />
          <Text style={styles.uploadText}>
            {comprovanteUri ? 'Comprovante Anexado ✓' : 'Anexar documento'}
          </Text>
        </TouchableOpacity>
      </View>

      <AuthSubmitButton
        text="Finalizar Cadastro"
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
