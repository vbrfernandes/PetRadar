import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import authService from '../services/authService';
import { theme } from '../../../theme/colors';

import {
  cadastroUserStyles as styles,
} from '../styles/auth.styles';


export default function CadastroUsuarioScreen({ navigation }: any) {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Etapa 1: Dados Pessoais
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [temPet, setTemPet] = useState(false);

  // Etapa 2: Acesso
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const avançarEtapa1 = () => {
    if (!nome.trim() || !cpf.trim() || !telefone.trim()) {
      Alert.alert('Campos Obrigatórios', 'Preencha todos os dados pessoais.');
      return;
    }
    setEtapa(2);
  };

  const handleCadastro = async () => {
    if (!email.trim() || !senha) {
      Alert.alert('Campos Obrigatórios', 'Preencha e-mail e senha.');
      return;
    }

    if (senha !== confirmaSenha) {
      Alert.alert('Erro de Senha', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      let lat: number | null = null;
      let lng: number | null = null;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = location.coords.latitude;
        lng = location.coords.longitude;
      }

      const payload = {
        nome_completo: nome.trim(),
        cpf: cpf.trim(),
        telefone: telefone.trim(),
        tem_pet: temPet,
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
        localizacao_lat: lat,
        localizacao_lng: lng,
      };

      await authService.registerUser(payload);

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'Ir para Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.response?.data?.detail || 'Ocorreu um erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => etapa > 1 ? setEtapa(1) : navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.brand} />
            </TouchableOpacity>
            <Text style={styles.stepIndicator}>Etapa {etapa} de 2</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.brandTitle}>Criar Conta</Text>
            <Text style={styles.brandTagline}>Cadastre-se para adotar ou reportar resgates.</Text>
          </View>

          <View style={styles.card}>
            {etapa === 1 ? (
              <>
                <Text style={styles.sectionTitle}>1. Dados Pessoais</Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Nome Completo *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={theme.colors.placeholder} value={nome} onChangeText={setNome} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>CPF *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor={theme.colors.placeholder} keyboardType="numeric" value={cpf} onChangeText={setCpf} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Telefone *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="(00) 00000-0000" placeholderTextColor={theme.colors.placeholder} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
                  </View>
                </View>

                {/* SWITCH: POSSUI PET / CACHORRO */}
                <View style={styles.switchRow}>
                  <View style={styles.switchTextContent}>
                    <Text style={styles.switchLabel}>Possui cachorro / pet?</Text>
                    <Text style={styles.switchSublabel}>Ajuda a personalizar os alertas de resgate e animais perdidos.</Text>
                  </View>
                  <Switch
                    value={temPet}
                    onValueChange={setTemPet}
                    trackColor={{ false: theme.colors.disabled, true: theme.colors.accent }}
                  />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={avançarEtapa1}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.submitButtonText}>Próximo: Dados de Acesso</Text>
                    <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>2. Dados de Acesso</Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>E-mail *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={theme.colors.placeholder} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Senha *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={theme.colors.placeholder} secureTextEntry={!showPassword} value={senha} onChangeText={setSenha} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.colors.textBody} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Confirma Senha *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={theme.colors.placeholder} secureTextEntry={!showPassword} value={confirmaSenha} onChangeText={setConfirmaSenha} />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleCadastro} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={theme.colors.surface} />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.submitButtonText}>Criar Conta</Text>
                      <Ionicons name="checkmark-circle-outline" size={22} color={theme.colors.surface} />
                    </View>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}