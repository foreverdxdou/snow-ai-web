import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import { User } from '@/app/types/userinfo';

export const authService = {
  login: (username: string, password: string) => {
    return request.post<Result<{ token: string }>>('/auth/login', { username, password });
  },

  register: (data: {
    username: string;
    password: string;
    nickname: string;
    email: string;
  }) => {
    return request.post('/auth/register', data);
  },

  logout: () => {
    return request.post<Result<void>>('/auth/logout');
  },

  getCurrentUser: () => {
    return request.get<Result<User>>('/auth/current-user');
  },
}; 