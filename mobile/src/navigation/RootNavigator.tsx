import React from 'react';

import { useAuthStore } from '../store/useAuthStore';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

export default function RootNavigator() {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
