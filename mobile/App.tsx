import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';
import AuthNavigator from './src/navigation/AuthNavigator';


// Store do Zustand (Caminho corrigido para 'store' no singular)
import { useAuthStore } from './src/store/useAuthStore';

// Telas Reais
import MapScreen from './src/screens/MapScreen';
import FeedNoticias from './src/screens/FeedNoticias';
import CadastroOcorrenciaScreen from './src/screens/CadastroOcorrenciaScreen';
import type { AppTabParamList } from './src/navigation/navigation.types';


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

const AppTabs = createBottomTabNavigator<AppTabParamList>();

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
