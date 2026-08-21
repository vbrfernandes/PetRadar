import React, { useState } from "react";
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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import authService from "../services/authService";
import { useAuthStore } from "../../../store/useAuthStore";
import { theme } from '../../../theme/colors';

import {
  loginStyles as styles,
} from '../styles/auth.styles';


export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha seu e-mail e senha para continuar.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        senha: password,
      });

      // Recebe o token e o objeto user retornado pela API
      const { access_token, user } = response.data;

      // Grava na store com o nome e tipo de conta corretos
      setAuth(access_token, {
        id: String(user.id_conta),
        name: user.name,
        email: user.email,
        isOng: user.tipo_conta === "ONG",
      });
    } catch (error: any) {
      Alert.alert(
        "Falha no Acesso",
        error.response?.data?.detail ||
          "Verifique suas credenciais e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header com a Logo da aplicação */}
          <View style={styles.header}>
            <Image
              source={require("../../../../assets/logo/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Form Card Premium */}
          <View style={styles.card}>
            {/* Input E-mail */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.brand}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor={theme.colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Input Senha */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.brand}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.placeholder}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={theme.colors.textBody}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Esqueceu a Senha */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate("EsqueceuSenha")}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.surface} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.loginButtonText}>Entrar na Conta</Text>
                  <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não possui uma conta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("TipoCadastro")}
            >
              <Text style={styles.registerText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}