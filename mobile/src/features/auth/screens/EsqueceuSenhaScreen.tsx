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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import authService from '../services/authService';
import { theme } from '../../../theme/colors';

import {
  esqueceuSenhaStyles as styles,
} from '../styles/auth.styles';

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
      await authService.requestPasswordReset({ email: email.trim().toLowerCase() });
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
      await authService.resetPassword({
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => etapa === 2 ? setEtapa(1) : navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.brand} />
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
                    <Ionicons name="mail-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="seu@email.com"
                      placeholderTextColor={theme.colors.placeholder}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSolicitarCodigo} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={theme.colors.surface} />
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
                    <Ionicons name="key-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="123456"
                      placeholderTextColor={theme.colors.placeholder}
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
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={theme.colors.placeholder}
                      secureTextEntry={!showPassword}
                      value={novaSenha}
                      onChangeText={setNovaSenha}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.colors.textBody} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Confirmar Nova Senha</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.brand} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={theme.colors.placeholder}
                      secureTextEntry={!showPassword}
                      value={confirmaSenha}
                      onChangeText={setConfirmaSenha}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleRedefinirSenha} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={theme.colors.surface} />
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