import { useState } from 'react';
import { Alert } from 'react-native';

import authService from '../services/authService';
import type { PasswordRecoveryStep } from '../types/auth.types';
import { getAuthErrorMessage } from '../utils/authErrors';
import {
  areTrimmedFieldsPresent,
  doPasswordsMatch,
  isFieldPresent,
} from '../utils/authValidation';

export function usePasswordRecovery(onNavigateToLogin: () => void) {
  const [etapa, setEtapa] = useState<PasswordRecoveryStep>(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSolicitarCodigo = async () => {
    if (!areTrimmedFieldsPresent(email)) {
      Alert.alert('Atenção', 'Informe o seu e-mail cadastrado.');
      return;
    }

    setLoading(true);

    try {
      await authService.requestPasswordReset({
        email: email.trim().toLowerCase(),
      });
      Alert.alert(
        'Código Enviado',
        'Verifique seu e-mail/console para obter o código de recuperação.',
      );
      setEtapa(2);
    } catch (error: unknown) {
      Alert.alert(
        'Erro',
        getAuthErrorMessage(error, 'Não foi possível solicitar o código.'),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async () => {
    if (
      !areTrimmedFieldsPresent(codigo) ||
      !isFieldPresent(novaSenha) ||
      !isFieldPresent(confirmaSenha)
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (!doPasswordsMatch(novaSenha, confirmaSenha)) {
      Alert.alert('Erro', 'As senhas informadas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email: email.trim().toLowerCase(),
        codigo_verificacao: codigo.trim(),
        nova_senha: novaSenha.trim(),
      });

      Alert.alert('Sucesso', 'Sua senha foi redefinida com sucesso!', [
        { text: 'Ir para Login', onPress: onNavigateToLogin },
      ]);
    } catch (error: unknown) {
      Alert.alert(
        'Erro na Redefinição',
        getAuthErrorMessage(error, 'Código inválido ou expirado.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    etapa,
    loading,
    email,
    setEmail,
    codigo,
    setCodigo,
    novaSenha,
    setNovaSenha,
    confirmaSenha,
    setConfirmaSenha,
    showPassword,
    togglePassword: () => setShowPassword((visible) => !visible),
    voltarEtapa: () => setEtapa(1),
    handleSolicitarCodigo,
    handleRedefinirSenha,
  };
}
