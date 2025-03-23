import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { Result } from '../types/knowledge';

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<Result<any>>) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request; 