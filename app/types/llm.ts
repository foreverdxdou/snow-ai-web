export type ModelType = 'GENERAL' | 'REASONING' | 'EMBEDDING';

export interface LlmConfig {
  id: string;
  modelName: string;
  modelCode: string;
  modelProvider: string;
  modelType: ModelType;
  apiUrl: string;
  apiKey: string;
  enabled: boolean;
  createTime: string;
  updateTime: string;
} 