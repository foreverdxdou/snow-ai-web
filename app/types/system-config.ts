import { Result } from './result';

// 系统配置项
export interface SystemConfig {
  id: number;
  configKey: string;
  configValue: string;
  configName: string;
  description: string;
  configType: string;
  createTime: string;
  updateTime: string;
  creatorName: string;
  updaterName: string;
}

// 分页查询参数
export interface SystemConfigQuery {
  pageNum: number;
  pageSize: number;
  configKey?: string;
  configType?: string;
}

// 分页查询响应
export interface SystemConfigPageResponse {
  records: SystemConfig[];
  total: number;
}

// 新增/修改系统配置请求
export interface SystemConfigSaveRequest {
  id?: number;
  configKey: string;
  configValue: string;
  description: string;
  configType: string;
}

// 单个查询响应
export interface SystemConfigResponse extends Result<SystemConfig> {} 