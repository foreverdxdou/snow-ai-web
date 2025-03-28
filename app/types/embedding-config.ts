import { Result } from './result';

// Embedding模型配置项
export interface EmbeddingConfig {
  id: number;
  name: string;
  modelType: string;
  apiKey: string;
  baseUrl: string;
  dimensions: number;
  enabled: number;
  createTime: string;
  updateTime: string;
  creatorName: string;
  updaterName: string;
  remark: string;
}

// 分页查询参数
export interface EmbeddingConfigQuery {
  pageNum: number;
  pageSize: number;
  name?: string;
  modelType?: string;
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
  modelType: string;
  apiKey: string;
  baseUrl: string;
  dimensions: number;
  enabled: number;
  remark?: string;
}

// 单个查询响应
export interface EmbeddingConfigResponse extends Result<EmbeddingConfig> {} 