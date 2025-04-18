import request from '@/app/utils/request';
import type { Role, RoleDTO, RoleQuery, RoleResponse } from '@/app/types/role';
import type { Result } from '@/app/types/result';

const BASE_URL = '/system/role';

class RoleService {
    // 获取角色列表
    getList(params: RoleQuery) {
        return request<RoleResponse>({
            url: `${BASE_URL}/page`,
            method: 'get',
            params,
        });
    }

    // 获取角色详情
    getDetail(id: number) {
        return request<Result<Role>>({
            url: `${BASE_URL}/${id}`,
            method: 'get',
        });
    }

    // 创建角色
    add(data: RoleDTO) {
        return request<Result<Role>>({
            url: BASE_URL,
            method: 'post',
            data,
        });
    }

    // 更新角色
    update(id: number, data: RoleDTO) {
        return request<Result<Role>>({
            url: `${BASE_URL}/${id}`,
            method: 'put',
            data,
        });
    }

    // 删除角色
    delete(id: number) {
        return request<Result<void>>({
            url: `${BASE_URL}/${id}`,
            method: 'delete',
        });
    }

    // 批量删除角色
    batchDelete(ids: number[]) {
        return request<Result<void>>({
            url: `${BASE_URL}/batch`,
            method: 'delete',
            data: ids,
        });
    }

    // 获取角色权限
    getPermissions(id: number) {
        return request<Result<string[]>>({
            url: `${BASE_URL}/${id}/permissions`,
            method: 'get',
        });
    }

    // 更新角色权限
    updatePermissions(id: number, permissionCodes: string[]) {
        return request<Result<void>>({
            url: `${BASE_URL}/${id}/permissions`,
            method: 'put',
            data: { permissionCodes },
        });
    }
}

export const roleService = new RoleService(); 