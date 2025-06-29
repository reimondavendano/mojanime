import { configureStore } from '@reduxjs/toolkit';
import animeReducer from './features/animeSlice';

export const store = configureStore({
  reducer: {
    anime: animeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;