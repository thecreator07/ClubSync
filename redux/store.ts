import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/services/api';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,      // ← RTK Query reducer
  },
  middleware: (getDefault) =>
    getDefault().concat(api.middleware), // ← RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
