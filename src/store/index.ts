import { configureStore } from '@reduxjs/toolkit';
import knowledgeReducer from './slices/knowledge';
import userReducer from './slices/user';

const store = configureStore({
  reducer: {
    knowledge: knowledgeReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 