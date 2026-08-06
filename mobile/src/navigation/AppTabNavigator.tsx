import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Button } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

const Tab = createBottomTabNavigator();

function FeedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed / Mapa de Pets</Text>
    </View>
  );
}

function SOSScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Reportar Pet Perdido / Encontrado</Text>
    </View>
  );
}

function ProfileScreen() {
  const { user, logout } = useAuthStore();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Perfil de {user?.name}</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
}

export function AppTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="SOS" component={SOSScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}