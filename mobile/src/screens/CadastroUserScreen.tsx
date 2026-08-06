import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import api from '../services/api';
import { theme } from '../theme/colors';

type AuthStackParamList = {
  Login: undefined;
  CadastroUser: undefined;
  CadastroONG: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'CadastroUser'>;

export default function CadastroUserScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    const cleanNome = nome.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSenha = senha.trim();

    if (!cleanNome || !cleanEmail || !cleanSenha) {
      Alert.alert('Erro de Validação', 'Por favor, preencha os campos obrigatórios (*).');
      return;
    }

    setLoading(true);

    try {
      let lat: number | null = null;
      let lng: number | null = null;

      // Solicitação de GPS com timeout e precisão otimizada para performance
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = location.coords.latitude;
        lng = location.coords.longitude;
      } else {
        Alert.alert(
          'Aviso de Localização',
          'Sem permissão de GPS, algumas funcionalidades de busca por proximidade ficarão limitadas.'
        );
      }

      const payload = {
        tipo_conta: 'PESSOA_FISICA',
        email: cleanEmail,
        senha: cleanSenha,
        telefone: telefone.trim(),
        localizacao_lat: lat,
        localizacao_lng: lng,
        usuario_fisico: {
          nome_completo: cleanNome,
          tem_pet: false,
          raio_pesquisa_km: 10,
        },
      };

      await api.post('/auth/cadastro', payload);

      Alert.alert('Sucesso', 'Sua conta foi criada com sucesso!', [
        { text: 'Ir para Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || 'Não foi possível realizar o cadastro. Tente novamente.';
      Alert.alert('Erro no Cadastro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineMedium" style={styles.title}>Crie sua Conta</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Encontre e ajude pets na sua região.
      </Text>

      <TextInput
        label="Nome Completo *"
        mode="outlined"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        autoCapitalize="words"
        disabled={loading}
        activeOutlineColor={theme.colors.brand}
      />

      <TextInput
        label="E-mail *"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={loading}
        activeOutlineColor={theme.colors.brand}
      />

      <TextInput
        label="Telefone"
        mode="outlined"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        keyboardType="phone-pad"
        disabled={loading}
        activeOutlineColor={theme.colors.brand}
      />

      <TextInput
        label="Senha *"
        mode="outlined"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={!showPassword}
        disabled={loading}
        style={styles.input}
        activeOutlineColor={theme.colors.brand}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <Button
        mode="contained"
        onPress={handleCadastro}
        disabled={loading}
        style={styles.button}
        buttonColor={theme.colors.brand}
      >
        {loading ? <ActivityIndicator color={theme.colors.surface} /> : 'Cadastrar'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing.globalMargin,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: theme.colors.textTitle,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.textBody,
  },
  input: {
    marginBottom: 14,
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.card,
  },
});