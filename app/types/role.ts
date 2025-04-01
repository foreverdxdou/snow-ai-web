export interface Role {
    id: number;
    roleName: string;
    roleCode: string;
    description: string;
    permissionNames: string;
    permissionCodes: string;
    createTime: string;
    updateTime: string;
}

export interface RoleDTO {
    id?: number;
    roleName: string;
    roleCode: string;
    description: string;
    permissionCodes: string[];
}

export interface RoleQuery {
    roleName?: string;
    roleCode?: string;
    pageNum: number;
    pageSize: number;
}

export interface RoleListData {
    records: Role[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

export type RoleResponse = ApiResponse<RoleListData>; 