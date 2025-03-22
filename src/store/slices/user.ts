import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  userInfo: {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  } | null;
}

const initialState: UserState = {
  token: localStorage.getItem('token'),
  userInfo: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setUserInfo(state, action: PayloadAction<UserState['userInfo']>) {
      state.userInfo = action.payload;
    },
    logout(state) {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem('token');
    }
  }
});

export const { setToken, setUserInfo, logout } = userSlice.actions;
export default userSlice.reducer; 