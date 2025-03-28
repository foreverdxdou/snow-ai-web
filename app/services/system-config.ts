import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { SystemConfig, SystemConfigQuery, SystemConfigSaveRequest } from '@/app/types/system-config';

const BASE_URL = '/system/config';

export const systemConfigService = {
    // 获取系统配置列表
    getList: (params: SystemConfigQuery) => {
        return request.get<Result<{
            records: SystemConfig[];
            total: number;
        }>>(`${BASE_URL}/list`, { params });
    },

    // 获取系统配置详情
    getById: (id: number) => {
        return request.get<Result<SystemConfig>>(`${BASE_URL}/${id}`);
    },

    // 新增系统配置
    add: (data: SystemConfigSaveRequest) => {
        return request.post<Result<void>>(`${BASE_URL}`, data);
    },

    // 更新系统配置
    update: (id: number, data: SystemConfigSaveRequest) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}`, data);
    },

    // 删除系统配置
    delete: (id: number) => {
        return request.delete<Result<void>>(`${BASE_URL}/${id}`);
    },

    // 批量删除系统配置
    batchDelete: (ids: number[]) => {
        return request.delete<Result<void>>(`${BASE_URL}/batch`, {
            data: ids
        });
    },

    // 刷新系统配置缓存
    refreshCache: () => {
        return request.post<Result<void>>(`${BASE_URL}/refresh`);
    },

    // 获取系统配置值
    getValue: (configKey: string) => {
        return request.get<Result<string>>(`${BASE_URL}/value/${configKey}`);
    },

    // 更新系统配置值
    updateValue: (configKey: string, configValue: string) => {
        return request.put<Result<void>>(`${BASE_URL}/value/${configKey}`, {
            configValue
        });
    }
}; 