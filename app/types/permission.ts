export interface Permission {
    id: string;
    parentId: string;
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
    id?: string;
    parentId: string;
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
    parentId?: string;
    type?: number;
    status?: number;
}

export interface TreePermission {
    id: string;
    itemId: string;
    parentId: string;
    name: string;
    children?: TreePermission[];
} 