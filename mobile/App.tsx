import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import EsqueceuSenhaScreen from './src/screens/EsqueceuSenhaScreen';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';


// Store do Zustand (Caminho corrigido para 'store' no singular)
import { useAuthStore } from './src/store/useAuthStore';

// Telas Reais
import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import FeedNoticias from './src/screens/FeedNoticias';
import CadastroUserScreen from './src/screens/CadastroUserScreen';
import TipoCadastroScreen from './src/screens/TipoCadastroScreen';
import CadastroONGScreen from './src/screens/CadastroONGScreen';
import CadastroOcorrenciaScreen from './src/screens/CadastroOcorrenciaScreen';
import type {
  AppTabParamList,
  AuthStackParamList,
} from './src/navigation/navigation.types';


// Telas Temporárias

const AppStack = createNativeStackNavigator();
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
    <AppTabs.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true
      }}
    >
      <AppTabs.Screen name="Mapa" component={MapScreen} />
      <AppTabs.Screen
        name="Feed"
        component={FeedNoticias}
      />

      <AppTabs.Screen name="SOS" component={SOSScreen} />
      <AppTabs.Screen name="Perfil" component={ProfileScreen} />
      <AppTabs.Screen
        name="CadastroOcorrencia"
        component={CadastroOcorrenciaScreen}
      />
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
