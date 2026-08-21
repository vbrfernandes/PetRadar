import { useState } from 'react';
import { Alert } from 'react-native';

import authService from '../services/authService';
import type { CadastroUserStep } from '../types/auth.types';
import { getAuthErrorMessage } from '../utils/authErrors';
import { mapRegisterUserPayload } from '../utils/authMappers';
import {
  areTrimmedFieldsPresent,
  doPasswordsMatch,
  isFieldPresent,
} from '../utils/authValidation';
import { useCurrentLocation } from './useCurrentLocation';

export function useCadastroUser(onNavigateToLogin: () => void) {
  const [etapa, setEtapa] = useState<CadastroUserStep>(1);
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [temPet, setTemPet] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { getCurrentLocation } = useCurrentLocation();

  const avançarEtapa1 = () => {
    if (!areTrimmedFieldsPresent(nome, cpf, telefone)) {
      Alert.alert('Campos Obrigatórios', 'Preencha todos os dados pessoais.');
      return;
    }

    setEtapa(2);
  };

  const voltarEtapa = () => {
    setEtapa(1);
  };

  const handleCadastro = async () => {
    if (!areTrimmedFieldsPresent(email) || !isFieldPresent(senha)) {
      Alert.alert('Campos Obrigatórios', 'Preencha e-mail e senha.');
      return;
    }

    if (!doPasswordsMatch(senha, confirmaSenha)) {
      Alert.alert('Erro de Senha', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const location = await getCurrentLocation();
      const payload = mapRegisterUserPayload(
        { nome, cpf, telefone, temPet, email, senha },
        location,
      );

      await authService.registerUser(payload);

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'Ir para Login', onPress: onNavigateToLogin },
      ]);
    } catch (error: unknown) {
      Alert.alert(
        'Erro no Cadastro',
        getAuthErrorMessage(error, 'Ocorreu um erro ao cadastrar.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    etapa,
    loading,
    nome,
    setNome,
    cpf,
    setCpf,
    telefone,
    setTelefone,
    temPet,
    setTemPet,
    email,
    setEmail,
    senha,
    setSenha,
    confirmaSenha,
    setConfirmaSenha,
    showPassword,
    togglePassword: () => setShowPassword((visible) => !visible),
    avançarEtapa1,
    voltarEtapa,
    handleCadastro,
  };
}
