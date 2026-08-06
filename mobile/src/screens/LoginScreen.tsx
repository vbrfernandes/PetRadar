import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { theme } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

type AuthStackParamList = {
  Login: undefined;
  CadastroUser: undefined;
  CadastroONG: undefined;
  TipoCadastro: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const passwordInputRef = useRef<TextInput>(null);

  const validateEmail = (targetEmail: string) => /\S+@\S+\.\S+/.test(targetEmail);

  const handleLogin = async () => {
    Keyboard.dismiss();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Por favor, preencha e-mail e senha.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await signIn(cleanEmail, cleanPassword);
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Credenciais inválidas ou erro de rede.';
      setErrorMsg(msg);
      Alert.alert('Falha na Autenticação', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>PetRadar</Text>
              <Text style={styles.subtitle}>Bem-vindo de volta! Faça login para continuar.</Text>
            </View>

            <View style={styles.form}>
              {errorMsg ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor={theme.colors.textBody}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMsg) setErrorMsg('');
                }}
                editable={!isLoading}
              />

              <View style={styles.passwordWrapper}>
                <TextInput
                  ref={passwordInputRef}
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Senha"
                  placeholderTextColor={theme.colors.textBody}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMsg) setErrorMsg('');
                  }}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.toggleShow}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.toggleShowText}>{showPassword ? 'Ocultar' : 'Exibir'}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword} disabled={isLoading}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, theme.shadows.buttonGlow, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.colors.surface} />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('TipoCadastro')}
                disabled={isLoading}
              >
                <Text style={styles.linkText}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.globalMargin * 1.2,
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.globalMargin * 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: theme.colors.brand,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textBody,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.padding,
    marginBottom: theme.spacing.globalMargin,
    fontSize: 16,
    color: theme.colors.textTitle,
    borderWidth: 1,
    borderColor: theme.colors.inputBg,
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 75,
  },
  toggleShow: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  toggleShowText: {
    color: theme.colors.brand,
    fontSize: 13,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.globalMargin * 1.2,
  },
  forgotPasswordText: {
    color: theme.colors.brand,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: theme.colors.brand,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: theme.colors.semantic.danger.bg,
    padding: theme.spacing.padding,
    borderRadius: theme.radius.card,
    marginBottom: theme.spacing.globalMargin,
  },
  errorText: {
    color: theme.colors.semantic.danger.text,
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.globalMargin * 2,
  },
  footerText: {
    color: theme.colors.textBody,
    fontSize: 15,
  },
  linkText: {
    color: theme.colors.action,
    fontSize: 15,
    fontWeight: 'bold',
  },
});