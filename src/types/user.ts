export interface UserState {
  token: string | null;
  userInfo: {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  } | null;
} 