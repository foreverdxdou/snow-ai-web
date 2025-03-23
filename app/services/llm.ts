import request from '../utils/request';
import type { LlmConfig } from '../types/llm';
import type { Result } from '../utils/response';

const BASE_URL = '/v1/llm/config';

// 扩展 axios 实例，添加泛型支持
const http = {
  get: <T>(url: string, config?: any): Promise<T> => {
    return request.get(url, config);
  },
  post: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return request.post(url, data, config);
  },
  put: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return request.put(url, data, config);
  },
  delete: <T>(url: string, config?: any): Promise<T> => {
    return request.delete(url, config);
  },
};

export const llmService = {
  // 获取所有大模型配置
  getList: () => {
    return http.get<Result<LlmConfig[]>>(`${BASE_URL}/list`);
  },

  // 获取指定大模型配置
  getById: (id: number) => {
    return http.get<Result<LlmConfig>>(`${BASE_URL}/${id}`);
  },

  // 新增大模型配置
  save: (data: Omit<LlmConfig, 'id' | 'createTime' | 'updateTime'>) => {
    return http.post<Result<boolean>>(BASE_URL, data);
  },

  // 更新大模型配置
  update: (data: LlmConfig) => {
    return http.put<Result<boolean>>(BASE_URL, data);
  },

  // 删除大模型配置
  delete: (id: number) => {
    return http.delete<Result<boolean>>(`${BASE_URL}/${id}`);
  }
}; 