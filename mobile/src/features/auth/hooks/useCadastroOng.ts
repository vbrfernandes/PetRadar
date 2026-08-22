import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import authService from '../services/authService';
import type { CadastroOngStep } from '../types/auth.types';
import { getAuthErrorMessage } from '../utils/authErrors';
import { mapRegisterOngPayload } from '../utils/authMappers';
import {
  areTrimmedFieldsPresent,
  doPasswordsMatch,
  isFieldPresent,
} from '../utils/authValidation';
import { useCurrentLocation } from './useCurrentLocation';

export function useCadastroOng(onNavigateToLogin: () => void) {
  const [etapa, setEtapa] = useState<CadastroOngStep>(1);
  const [loading, setLoading] = useState(false);
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [endereco, setEndereco] = useState('');
  const [ofereceLarTemporario, setOfereceLarTemporario] = useState(false);
  const [vagasEmergenciais, setVagasEmergenciais] = useState(false);
  const [capacidadeTotal, setCapacidadeTotal] = useState('');
  const [lotacaoAtual, setLotacaoAtual] = useState('');
  const [linkPrestacao, setLinkPrestacao] = useState('');
  const [nomeGestor, setNomeGestor] = useState('');
  const [cpfGestor, setCpfGestor] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [comprovanteUri, setComprovanteUri] = useState<string | null>(null);
  const { getCurrentLocation } = useCurrentLocation();

  const selecionarComprovante = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setComprovanteUri(result.assets[0].uri);
    }
  };

  const avançarEtapa1 = () => {
    if (!areTrimmedFieldsPresent(cnpj, razaoSocial, nomeFantasia, endereco)) {
      Alert.alert(
        'Campos Obrigatórios',
        'Preencha todos os campos da Etapa 1.',
      );
      return;
    }

    setEtapa(2);
  };

  const avançarEtapa2 = () => {
    setEtapa(3);
  };

  const voltarEtapa = () => {
    setEtapa((etapa - 1) as CadastroOngStep);
  };

  const handleCadastroFinal = async () => {
    if (
      !areTrimmedFieldsPresent(
        nomeGestor,
        cpfGestor,
        email,
        telefone,
      ) ||
      !isFieldPresent(senha)
    ) {
      Alert.alert(
        'Campos Obrigatórios',
        'Preencha todos os campos obrigatórios do gestor e conta.',
      );
      return;
    }

    if (!doPasswordsMatch(senha, confirmaSenha)) {
      Alert.alert('Erro de Senha', 'As senhas informadas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const location = await getCurrentLocation();
      const payload = mapRegisterOngPayload(
        {
          cnpj,
          razaoSocial,
          nomeFantasia,
          endereco,
          ofereceLarTemporario,
          vagasEmergenciais,
          capacidadeTotal,
          lotacaoAtual,
          linkPrestacao,
          nomeGestor,
          cpfGestor,
          telefone,
          email,
          senha,
        },
        location,
      );

      await authService.registerOng(payload);

      Alert.alert('Sucesso', 'Instituição cadastrada com sucesso!', [
        { text: 'Ir para Login', onPress: onNavigateToLogin },
      ]);
    } catch (error: unknown) {
      Alert.alert(
        'Erro no Cadastro',
        getAuthErrorMessage(error, 'Ocorreu um erro ao cadastrar a ONG.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    etapa,
    loading,
    cnpj,
    setCnpj,
    razaoSocial,
    setRazaoSocial,
    nomeFantasia,
    setNomeFantasia,
    endereco,
    setEndereco,
    ofereceLarTemporario,
    setOfereceLarTemporario,
    vagasEmergenciais,
    setVagasEmergenciais,
    capacidadeTotal,
    setCapacidadeTotal,
    lotacaoAtual,
    setLotacaoAtual,
    linkPrestacao,
    setLinkPrestacao,
    nomeGestor,
    setNomeGestor,
    cpfGestor,
    setCpfGestor,
    telefone,
    setTelefone,
    email,
    setEmail,
    senha,
    setSenha,
    confirmaSenha,
    setConfirmaSenha,
    showPassword,
    togglePassword: () => setShowPassword((visible) => !visible),
    comprovanteUri,
    selecionarComprovante,
    avançarEtapa1,
    avançarEtapa2,
    voltarEtapa,
    handleCadastroFinal,
  };
}
