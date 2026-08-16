import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import TipoCadastroScreen from '../features/auth/screens/TipoCadastroScreen';
import CadastroUserScreen from '../screens/CadastroUserScreen';
import CadastroONGScreen from '../screens/CadastroONGScreen';
import EsqueceuSenhaScreen from '../screens/EsqueceuSenhaScreen';
import type { AuthStackParamList } from './navigation.types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
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
