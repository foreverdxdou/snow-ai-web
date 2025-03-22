import request from './request';
import type { LlmConfig } from '@/types/llm';

export const getLlmConfigs = () => {
  return request.get<LlmConfig[]>('/api/v1/llm/config/list');
};

export const getLlmConfig = (id: number) => {
  return request.get<LlmConfig>(`/api/v1/llm/config/${id}`);
};

export const createLlmConfig = (data: Partial<LlmConfig>) => {
  return request.post<boolean>('/api/v1/llm/config', data);
};

export const updateLlmConfig = (data: Partial<LlmConfig>) => {
  return request.put<boolean>('/api/v1/llm/config', data);
};

export const deleteLlmConfig = (id: number) => {
  return request.delete<boolean>(`/api/v1/llm/config/${id}`);
}; 