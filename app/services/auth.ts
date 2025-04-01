import request from '@/app/utils/request';
import axios, { AxiosResponse } from 'axios';
import type { Result } from '@/app/types/result';
import { API_CONFIG } from '@/app/config/api';
import { User } from '@/app/types/userinfo';

const authRequest = axios.create({
  baseURL: API_CONFIG.prefix,
  timeout: 10000,
});


// 响应拦截器
authRequest.interceptors.response.use(
  (response: AxiosResponse<Result<any>>) => {
    const res = response.data as Result<any>;
    if (res.code === 200) {
      return response;
    } else {
      return Promise.reject(new Error(res.message || '请求失败'));
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username: string, password: string) => {
    return authRequest.post<Result<{ token: string }>>('/auth/login', { username, password });
  },

  register: (data: {
    username: string;
    password: string;
    nickname: string;
    email: string;
  }) => {
    return authRequest.post('/auth/register', data);
  },

  logout: () => {
    return request.post<Result<void>>('/auth/logout');
  },

  getCurrentUser: () => {
    return request.get<Result<User>>('/auth/current-user');
  },
}; 