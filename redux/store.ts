// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// 1️⃣ Persist config for the RTK Query cache slice
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: [api.reducerPath], // only persist the RTK Query cache
};

// 2️⃣ Wrap the API reducer
const persistedReducer = persistReducer(
  persistConfig,
  api.reducer
);

export const store = configureStore({
  reducer: {
    // replace the raw api.reducer with the persisted one
    [api.reducerPath]: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist action types to ignore in serializability checks
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
