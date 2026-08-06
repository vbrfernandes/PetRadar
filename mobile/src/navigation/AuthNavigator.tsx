import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, Button } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

const Stack = createNativeStackNavigator();

// Telas temporárias para validação
function LoginScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleFakeLogin = () => {
    setAuth('fake-jwt-token-123', {
      id: '1',
      name: 'Usuário Teste',
      email: 'teste@petradar.com',
      isOng: false,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tela de Login</Text>
      <Button title="Entrar (Simular Auth)" onPress={handleFakeLogin} />
    </View>
  );
}

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}