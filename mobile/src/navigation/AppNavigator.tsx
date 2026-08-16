import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import MapScreen from '../screens/MapScreen';
import FeedNoticias from '../screens/FeedNoticias';
import CadastroOcorrenciaScreen from '../screens/CadastroOcorrenciaScreen';
import type { AppTabParamList } from './navigation.types';

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

export default function AppNavigator() {
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
