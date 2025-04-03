export type ModelType = 'text-generation' | 'text-embedding' | 'image-generation' | 'speech-to-text' | 'text-to-speech';

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