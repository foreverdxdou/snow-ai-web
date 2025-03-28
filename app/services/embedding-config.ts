import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { EmbeddingConfig, EmbeddingConfigQuery, EmbeddingConfigSaveRequest } from '@/app/types/embedding-config';

const BASE_URL = '/embedding/config';

export const embeddingConfigService = {
    // 获取Embedding模型配置列表
    getList: (params: EmbeddingConfigQuery) => {
        return request.get<Result<{
            records: EmbeddingConfig[];
            total: number;
        }>>(`${BASE_URL}/list`, { params });
    },

    // 获取Embedding模型配置详情
    getById: (id: number) => {
        return request.get<Result<EmbeddingConfig>>(`${BASE_URL}/${id}`);
    },

    // 新增Embedding模型配置
    add: (data: EmbeddingConfigSaveRequest) => {
        return request.post<Result<void>>(`${BASE_URL}`, data);
    },

    // 更新Embedding模型配置
    update: (id: number, data: EmbeddingConfigSaveRequest) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}`, data);
    },

    // 删除Embedding模型配置
    delete: (id: number) => {
        return request.delete<Result<void>>(`${BASE_URL}/${id}`);
    },

    // 批量删除Embedding模型配置
    batchDelete: (ids: number[]) => {
        return request.delete<Result<void>>(`${BASE_URL}/batch`, {
            data: ids
        });
    },

    // 刷新Embedding模型配置缓存
    refreshCache: () => {
        return request.post<Result<void>>(`${BASE_URL}/refresh`);
    },

    // 启用/禁用Embedding模型配置
    toggleEnabled: (id: number, enabled: number) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}/status?status=${enabled}`, {
            enabled
        });
    }
}; 