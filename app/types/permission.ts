export interface Permission {
    id: number;
    parentId: number;
    name: string;
    type: number;
    permissionCode: string;
    path: string;
    component: string;
    icon: string;
    sort: number;
    status: number;
    hasChildren: number;
    createTime: string;
    updateTime: string;
    children?: Permission[];
}

export interface PermissionDTO {
    id?: number;
    parentId: number;
    name: string;
    type: number;
    permissionCode: string;
    path: string;
    component: string;
    icon: string;
    sort: number;
    status: number;
}

export interface PermissionQuery {
    parentId?: number;
    type?: number;
    status?: number;
} 