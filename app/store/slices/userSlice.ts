import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  settings: {
    theme: 'light' | 'dark';
    language: string;
  };
}

const initialState: UserState = {
  id: null,
  username: null,
  email: null,
  isAuthenticated: false,
  settings: {
    theme: 'light',
    language: 'zh-CN',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; username: string; email: string }>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.id = null;
      state.username = null;
      state.email = null;
      state.isAuthenticated = false;
    },
    updateSettings: (state, action: PayloadAction<Partial<UserState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { setUser, clearUser, updateSettings } = userSlice.actions;
export default userSlice.reducer; 