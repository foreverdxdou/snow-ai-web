import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { message } from 'antd';
import type { Result } from '@/app/types/result';
import { API_CONFIG } from '@/app/config/api';
import Cookies from 'js-cookie';
const request: AxiosInstance = axios.create({
  baseURL: API_CONFIG.prefix,
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
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

export const handleResponse = <T>(response: Result<T>, showMessage: boolean = true): T => {
  if (response.code === 200) {
    if (showMessage) {
      message.success(response.message || '操作成功');
    }
    return response.data;
  } else {
    if (showMessage) {
      message.error(response.message || '操作失败');
    }
    throw new Error(response.message);
  }
};

export default request;