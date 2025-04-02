import request from '@/app/utils/request';
import {Result} from '@/app/types/result';
import type { LlmConfig } from '@/app/types/llm';

const BASE_URL = '/llm/config';

export const llmService = {
  // 获取所有大模型配置
  getList: () => {
    return request.get<Result<LlmConfig[]>>(`${BASE_URL}/list`);
  },

  // 获取指定大模型配置
  getById: (id: string) => {
    return request.get<Result<LlmConfig>>(`${BASE_URL}/${id}`);
  },

  // 新增大模型配置
  save: (data: Omit<LlmConfig, 'id' | 'createTime' | 'updateTime'>) => {
    return request.post<Result<boolean>>(BASE_URL, data);
  },

  // 更新大模型配置
  update: (data: LlmConfig) => {
    return request.put<Result<boolean>>(BASE_URL, data);
  },

  // 删除大模型配置
  delete: (id: string) => {
    return request.delete<Result<boolean>>(`${BASE_URL}/${id}`);
  },

  // 获取可用的大模型配置
  getEnabledLlmConfig: () => {
    return request.get<Result<LlmConfig[]>>(`${BASE_URL}/enabled`);
  },
}; 