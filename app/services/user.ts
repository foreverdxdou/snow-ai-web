import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { User, UserQuery, UserSaveRequest } from '@/app/types/user';

const BASE_URL = '/system/user';

export const userService = {
    // 获取用户列表
    getList: (params: UserQuery) => {
        // 移除值为空的参数
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => 
                value !== undefined && value !== null && value !== ''
            )
        );
        return request.get<Result<{
            records: User[];
            total: number;
        }>>(`${BASE_URL}/page`, { params: cleanParams });
    },

    // 获取用户详情
    getById: (id: number) => {
        return request.get<Result<User>>(`${BASE_URL}/${id}`);
    },

    // 新增用户
    add: (data: UserSaveRequest) => {
        return request.post<Result<void>>(`${BASE_URL}`, data);
    },

    // 更新用户
    update: (id: number, data: UserSaveRequest) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}`, data);
    },

    // 删除用户
    delete: (id: number) => {
        return request.delete<Result<void>>(`${BASE_URL}/${id}`);
    },

    // 批量删除用户
    batchDelete: (ids: number[]) => {
        return request.delete<Result<void>>(`${BASE_URL}/batch`, {
            data: ids
        });
    },

    // 重置密码
    resetPassword: (id: number) => {
        return request.post<Result<void>>(`${BASE_URL}/${id}/reset-password`);
    },

    // 修改密码
    changePassword: (id: number, oldPassword: string, newPassword: string) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}/password`, {
            oldPassword,
            newPassword
        });
    },

    // 修改状态
    updateStatus: (id: number, status: number) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}/status`, {
            status
        });
    },

    // 更新用户头像
    updateAvatar: (id: number, avatar: string) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}/avatar`, {
            avatar
        });
    },

    // 更新用户基本信息
    updateInfo: (id: number, data: { nickname: string; email?: string; phone?: string }) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}/info`, data);
    }
}; 