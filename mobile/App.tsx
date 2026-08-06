// D:\Pesquisa Pucminas\Pesquisa de animais errantes\PetRadar\...\src\mobile\App.tsx

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Contextos
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';

// Telas (Importações Reais)
import LoginScreen from './src/screens/LoginScreen';
import CadastroUserScreen from './src/screens/CadastroUserScreen';
import TipoCadastroScreen from './src/screens/TipoCadastroScreen';

// ==========================================
// 1. TELAS TEMPORÁRIAS (Placeholders)
// ==========================================
const CadastroONGScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Cadastro ONG</Text></View>;
const FeedScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Feed de Animais (PostGIS)</Text></View>;
const SOSScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Alerta SOS</Text></View>;
const ProfileScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Meu Perfil</Text></View>;

// ==========================================
// 2. CONFIGURAÇÃO DOS NAVEGADORES
// ==========================================
const AuthStack = createNativeStackNavigator();
const AppTabs = createBottomTabNavigator();

// Fluxo Público (Usuário Deslogado)
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="TipoCadastro" component={TipoCadastroScreen} />
      <AuthStack.Screen name="CadastroUser" component={CadastroUserScreen} />
      <AuthStack.Screen name="CadastroONG" component={CadastroONGScreen} />
    </AuthStack.Navigator>
  );
}

// Fluxo Privado (Usuário Logado)
function AppNavigator() {
  return (
    <AppTabs.Navigator screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
      <AppTabs.Screen name="Feed" component={FeedScreen} />
      <AppTabs.Screen name="SOS" component={SOSScreen} />
      <AppTabs.Screen name="Perfil" component={ProfileScreen} />
    </AppTabs.Navigator>
  );
}

// ==========================================
// 3. COMPONENTE DE ROTAS (Ponte)
// ==========================================
function Routes() {
  const { signed, loading } = useContext(AuthContext);

  // Loading state com UX agradável
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F6FA' }}>
        <ActivityIndicator size="large" color="#0052CC" />
      </View>
    );
  }

  return signed ? <AppNavigator /> : <AuthNavigator />;
}

// ==========================================
// 4. COMPONENTE PRINCIPAL (Root)
// ==========================================
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}