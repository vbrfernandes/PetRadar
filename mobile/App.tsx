import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';


// Store do Zustand (Caminho corrigido para 'store' no singular)
import { useAuthStore } from './src/store/useAuthStore';

// Telas Temporárias

const AppStack = createNativeStackNavigator();

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
