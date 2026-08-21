import React, { type PropsWithChildren } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          {children}
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
