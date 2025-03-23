import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import knowledgeReducer from './slices/knowledgeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    knowledge: knowledgeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 