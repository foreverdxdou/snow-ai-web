import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { message } from 'antd';
import type { Result } from '@/app/types/result';
import { API_CONFIG } from '@/app/config/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const request: AxiosInstance = axios.create({
  baseURL: API_CONFIG.prefix,
  timeout: 10000,
});

// 不需要token的接口列表
const noTokenUrls = [
  '/auth/login',
  '/auth/register',
];

const notJumpUrls = [
  '/auth/login',
];

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 检查是否需要token
    const needToken = !noTokenUrls.some(url => config.url?.includes(url));
    if (needToken) {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    message.error('请求发送失败，请检查网络连接');
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<Result<any>>) => {
    const res = response.data as Result<any>;
    
    // 处理成功状态码
    if (res.code === 200) {
      return response;
    } 
 
    
    // 处理特定错误状态码
    switch (res.code) {
      case 401:
        Cookies.remove('token');
        if (notJumpUrls.some(url => response.config.url?.includes(url))) {
          return response;
        }
        message.error('登录已过期，请重新登录');
        break;
      case 403:
        message.error('没有权限访问该资源');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
        message.error(res.message);
        break;
      default:
        message.error(res.message);
    }
    
    return Promise.reject(new Error(res.message));
  },
  (error) => {
    // 处理网络错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Cookies.remove('token');
          if (notJumpUrls.some(url => error.response.config.url?.includes(url))) {
            return error.response;
          }
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error(error.response.data?.message || '服务器内部错误');
          break;
        default:
          message.error(error.response.data?.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络设置');
    } else {
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

export const handleResponse = <T>(response: Result<T>, showMessage: boolean = true): T => {
  if (response.code === 200) {
    return response.data;
  } else {
    if (showMessage) {
      message.error(response.message || '操作失败');
    }
    throw new Error(response.message);
  }
};

export default request;