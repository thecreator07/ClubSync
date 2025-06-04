// src/app/providers.tsx
'use client';

import { persistor, store } from '@/services/api';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from '@/store/store';
// import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
