import { configureStore } from '@reduxjs/toolkit';
import { clientApi } from './api/clientApi';
import authReducer from '../features/auth/authSlice';
import playerReducer from '../features/player/playerSlice';

export const store = configureStore({
  reducer: {
    [clientApi.reducerPath]: clientApi.reducer,
    auth: authReducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clientApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
