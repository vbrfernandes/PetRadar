import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import api from '../services/api';

const COLORS = {
  primary: '#1F5C4D',
  primaryLight: '#E8F5E9',
  accent: '#10B981',
  background: '#F4F7F6',
  surface: '#FFFFFF',
  textTitle: '#1A1A1A',
  textBody: '#666666',
  border: '#E2E8F0',
  placeholder: '#A0AEC0',
};

export default function CadastroUsuarioScreen({ navigation }: any) {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Etapa 1: Dados Pessoais
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

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
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
        localizacao_lat: lat,
        localizacao_lng: lng,
      };

      await api.post('/auth/registro/usuario', payload);

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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => etapa > 1 ? setEtapa(1) : navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
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
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={COLORS.placeholder} value={nome} onChangeText={setNome} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>CPF *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor={COLORS.placeholder} keyboardType="numeric" value={cpf} onChangeText={setCpf} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Telefone / WhatsApp *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="(00) 00000-0000" placeholderTextColor={COLORS.placeholder} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={avançarEtapa1}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.submitButtonText}>Próximo: Dados de Acesso</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>2. Dados de Acesso</Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>E-mail *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={COLORS.placeholder} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Senha *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={COLORS.placeholder} secureTextEntry={!showPassword} value={senha} onChangeText={setSenha} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.textBody} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Confirma Senha *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={COLORS.placeholder} secureTextEntry={!showPassword} value={confirmaSenha} onChangeText={setConfirmaSenha} />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleCadastro} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.submitButtonText}>Criar Conta</Text>
                      <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  stepIndicator: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  header: { alignItems: 'center', marginBottom: 20 },
  brandTitle: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  brandTagline: { fontSize: 13, color: COLORS.textBody, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 16 },
  inputWrapper: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textTitle, marginBottom: 6, textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: COLORS.border },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textTitle, fontWeight: '500' },
  submitButton: { backgroundColor: COLORS.primary, borderRadius: 16, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});