import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../../navigation/navigation.types';
import { useAuthStore } from '../../../store/useAuthStore';
import { theme } from '../../../theme/colors';
import { AuthHeader } from '../components/common/AuthHeader';
import { AuthInput } from '../components/common/AuthInput';
import { AuthPasswordInput } from '../components/common/AuthPasswordInput';
import { AuthSubmitButton } from '../components/common/AuthSubmitButton';
import authService from '../services/authService';
import { loginStyles as styles } from '../styles/login.styles';
import { getAuthErrorMessage } from '../utils/authErrors';
import { isFieldPresent } from '../utils/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    if (!isFieldPresent(email) || !isFieldPresent(password)) {
      Alert.alert('Atenção', 'Preencha seu e-mail e senha para continuar.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        senha: password,
      });
      const { access_token, user } = response.data;

      setAuth(access_token, {
        id: String(user.id_conta),
        name: user.name,
        email: user.email,
        isOng: user.tipo_conta === 'ONG',
      });
    } catch (error: unknown) {
      Alert.alert(
        'Falha no Acesso',
        getAuthErrorMessage(
          error,
          'Verifique suas credenciais e tente novamente.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            logo={
              <Image
                source={require('../../../../assets/logo/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            }
          />

          <View style={styles.card}>
            <AuthInput
              label="E-mail"
              icon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.brand}
                />
              }
              wrapperStyle={styles.inputWrapper}
              labelStyle={styles.label}
              containerStyle={styles.inputContainer}
              iconContainerStyle={styles.inputIcon}
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <AuthPasswordInput
              label="Senha"
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.brand}
                />
              }
              wrapperStyle={styles.inputWrapper}
              labelStyle={styles.label}
              containerStyle={styles.inputContainer}
              iconContainerStyle={styles.inputIcon}
              style={styles.input}
              toggleStyle={styles.eyeIcon}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPasswordVisible={showPassword}
              onToggleVisibility={() => setShowPassword((visible) => !visible)}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('EsqueceuSenha')}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <AuthSubmitButton
              text="Entrar na Conta"
              onPress={handleLogin}
              activeOpacity={0.8}
              loading={isLoading}
              style={styles.loginButton}
              icon={
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={theme.colors.surface}
                />
              }
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não possui uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('TipoCadastro')}>
              <Text style={styles.registerText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
