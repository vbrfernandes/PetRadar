import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import EsqueceuSenhaScreen from './src/screens/EsqueceuSenhaScreen';

// Store do Zustand (Caminho corrigido para 'store' no singular)
import { useAuthStore } from './src/store/useAuthStore'; 

// Telas Reais
import LoginScreen from './src/screens/LoginScreen';
import CadastroUserScreen from './src/screens/CadastroUserScreen';
import TipoCadastroScreen from './src/screens/TipoCadastroScreen';
import CadastroONGScreen from './src/screens/CadastroONGScreen';

// Tipagem das Rotas do Autenticação
export type AuthStackParamList = {
  Login: undefined;
  TipoCadastro: undefined;
  CadastroUser: undefined;
  CadastroONG: undefined;
  EsqueceuSenha: undefined;
};


// Tipagem das Rotas da Aplicação Principal
export type AppTabParamList = {
  Feed: undefined;
  SOS: undefined;
  Perfil: undefined;
};


// Telas Temporárias
const FeedScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Feed de Animais (PostGIS)</Text>
  </View>
);

const SOSScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Alerta SOS</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Meu Perfil</Text>
  </View>
);

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="TipoCadastro" component={TipoCadastroScreen} />
      <AuthStack.Screen name="CadastroUser" component={CadastroUserScreen} />
      <AuthStack.Screen name="CadastroONG" component={CadastroONGScreen} />
      <AuthStack.Screen name="EsqueceuSenha" component={EsqueceuSenhaScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppTabs.Navigator screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
      <AppTabs.Screen name="Feed" component={FeedScreen} />
      <AppTabs.Screen name="SOS" component={SOSScreen} />
      <AppTabs.Screen name="Perfil" component={ProfileScreen} />
    </AppTabs.Navigator>
  );
}

function Routes() {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Routes />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}