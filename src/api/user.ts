import request from '../utils/request';

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
  };
}

export const login = (data: LoginParams) => {
  return request.post<LoginResponse>('/auth/login', data);
}; 