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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const COLORS = {
  primary: '#1F5C4D',
  primaryLight: '#E8F5E9',
  background: '#F4F7F6',
  surface: '#FFFFFF',
  textTitle: '#1A1A1A',
  textBody: '#666666',
  border: '#E2E8F0',
  placeholder: '#A0AEC0',
};

export default function EsqueceuSenhaScreen({ navigation }: any) {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSolicitarCodigo = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe o seu e-mail cadastrado.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/esqueceu-senha', { email: email.trim().toLowerCase() });
      Alert.alert('Código Enviado', 'Verifique seu e-mail/console para obter o código de recuperação.');
      setEtapa(2);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.detail || 'Não foi possível solicitar o código.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async () => {
    if (!codigo.trim() || !novaSenha || !confirmaSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (novaSenha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas informadas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/redefinir-senha', {
        email: email.trim().toLowerCase(),
        codigo_verificacao: codigo.trim(),
        nova_senha: novaSenha.trim(),
      });

      Alert.alert('Sucesso', 'Sua senha foi redefinida com sucesso!', [
        { text: 'Ir para Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      Alert.alert('Erro na Redefinição', error.response?.data?.detail || 'Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => etapa === 2 ? setEtapa(1) : navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.stepIndicator}>Passo {etapa} de 2</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.brandTitle}>Recuperar Senha</Text>
            <Text style={styles.brandTagline}>
              {etapa === 1 
                ? 'Informe seu e-mail cadastrado para receber um código de verificação.' 
                : 'Digite o código recebido e defina sua nova senha.'}
            </Text>
          </View>

          <View style={styles.card}>
            {etapa === 1 ? (
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>E-mail Cadastrado</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="seu@email.com"
                      placeholderTextColor={COLORS.placeholder}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSolicitarCodigo} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Enviar Código</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Código de Verificação (6 dígitos)</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="key-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="123456"
                      placeholderTextColor={COLORS.placeholder}
                      keyboardType="numeric"
                      maxLength={6}
                      value={codigo}
                      onChangeText={setCodigo}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Nova Senha</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.placeholder}
                      secureTextEntry={!showPassword}
                      value={novaSenha}
                      onChangeText={setNovaSenha}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.textBody} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Confirmar Nova Senha</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.placeholder}
                      secureTextEntry={!showPassword}
                      value={confirmaSenha}
                      onChangeText={setConfirmaSenha}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleRedefinirSenha} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Redefinir Senha</Text>
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
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  stepIndicator: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  header: { alignItems: 'center', marginBottom: 24 },
  brandTitle: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  brandTagline: { fontSize: 14, color: COLORS.textBody, marginTop: 6, textAlign: 'center', paddingHorizontal: 10 },
  card: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  inputWrapper: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textTitle, marginBottom: 6, textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: COLORS.border },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textTitle, fontWeight: '500' },
  submitButton: { backgroundColor: COLORS.primary, borderRadius: 16, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});