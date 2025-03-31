import { Result } from './result';

// Embedding模型配置项
export interface EmbeddingConfig {
  id: number;
  name: string;
  baseUrl: string;
  apiKey: string;
  remark: string;
  modelType: string;
  dimensions: number;
  status: number;
  createTime: string;
  updateTime: string;
  creator: string;
  updater: string;
}

// 分页查询参数
export interface EmbeddingConfigQuery {
  current: number;
  size: number;
  name?: string;
  status?: number;
}

// 分页查询响应
export interface EmbeddingConfigPageResponse {
  records: EmbeddingConfig[];
  total: number;
}

// 新增/修改Embedding模型配置请求
export interface EmbeddingConfigSaveRequest {
  id?: number;
  name: string;
  baseUrl: string;
  apiKey: string;
  remark: string;
  modelType: string;
  dimensions: number;
  status: number;
}

// 单个查询响应
export interface EmbeddingConfigResponse extends Result<EmbeddingConfig> {} 