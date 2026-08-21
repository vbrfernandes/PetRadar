import React from 'react';

import { AppProviders, RootNavigator } from './src/app';

export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
