import { Result } from './result';

// 角色信息
export interface Role {
    id: number;
    roleName: string;
    roleCode: string;
    description: string;
    status: number;
    permissionNames: string;
    permissionCodes: string;
    createTime: string;
    updateTime: string;
    creatorName: string;
    updaterName: string;
}

export interface RoleDTO {
    id?: number;
    roleName: string;
    roleCode: string;
    description: string;
    status: number;
    permissionIds: string[];
}

// 分页查询参数
export interface RoleQuery {
    current: number;
    size: number;
    roleName?: string;
    roleCode?: string;
    status?: number;
}

export interface RoleListData {
    records: Role[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

// 分页查询响应
export interface RolePageResponse {
    records: Role[];
    total: number;
}

// 新增/修改角色请求
export interface RoleSaveRequest {
    id?: number;
    roleName: string;
    roleCode: string;
    description: string;
    permissionIds: string[];
    status: number;
}

// 单个查询响应
export interface RoleResponse extends Result<RoleListData> {} 