import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { Permission, PermissionDTO, PermissionQuery, TreePermission } from '@/app/types/permission';

const BASE_URL = '/system/permission';

export const permissionService = {
    // 获取权限树
    getTree: (params?: PermissionQuery) => {
        return request.get<Result<Permission[]>>(`${BASE_URL}/tree`, { params });
    },

    // 获取权限详情
    getById: (id: number) => {
        return request.get<Result<Permission>>(`${BASE_URL}/${id}`);
    },

    // 新增权限
    add: (data: PermissionDTO) => {
        return request.post<Result<void>>(`${BASE_URL}`, data);
    },

    // 更新权限
    update: (id: number, data: PermissionDTO) => {
        return request.put<Result<void>>(`${BASE_URL}/${id}`, data);
    },

    // 删除权限
    delete: (id: number) => {
        return request.delete<Result<void>>(`${BASE_URL}/${id}`);
    },

    // 获取用户权限列表
    getUserPermissions: (userId: number) => {
        return request.get<Result<Permission[]>>(`${BASE_URL}/user/${userId}`);
    },

    // 获取角色权限列表
    getRolePermissions: (roleIds: number[]) => {
        return request.get<Result<Permission[]>>(`${BASE_URL}/role`, {
            params: { roleIds }
        });
    },

    /**
     * 获取权限树（用于前端控件）
     */
    getTreeForControl: () => {
        return request.get<Result<TreePermission[]>>(`${BASE_URL}/tree/select`);
    }
}; 