import request from './request';
import type { Department, Role, Menu } from '@/types/system';

// 部门管理
export const getDepartmentTree = () => {
  return request.get<Department[]>('/api/system/dept/tree');
};

export const createDepartment = (data: Partial<Department>) => {
  return request.post('/api/system/dept', data);
};

export const updateDepartment = (id: number, data: Partial<Department>) => {
  return request.put(`/api/system/dept/${id}`, data);
};

export const deleteDepartment = (id: number) => {
  return request.delete(`/api/system/dept/${id}`);
};

// 角色管理
export const getRoleList = (params?: any) => {
  return request.get<{
    records: Role[];
    total: number;
  }>('/api/system/role/page', { params });
};

export const createRole = (data: Partial<Role>) => {
  return request.post('/api/system/role', data);
};

export const updateRole = (id: number, data: Partial<Role>) => {
  return request.put(`/api/system/role/${id}`, data);
};

export const deleteRole = (id: number) => {
  return request.delete(`/api/system/role/${id}`);
};

// 菜单管理
export const getMenuTree = () => {
  return request.get<Menu[]>('/api/system/menu/tree');
};

export const createMenu = (data: Partial<Menu>) => {
  return request.post('/api/system/menu', data);
};

export const updateMenu = (id: number, data: Partial<Menu>) => {
  return request.put(`/api/system/menu/${id}`, data);
};

export const deleteMenu = (id: number) => {
  return request.delete(`/api/system/menu/${id}`);
};

// 角色菜单权限
export const getRoleMenuIds = (roleId: number) => {
  return request.get<number[]>(`/api/system/role/${roleId}/menuIds`);
};

export const updateRoleMenus = (roleId: number, menuIds: number[]) => {
  return request.put(`/api/system/role/${roleId}/menuIds`, { menuIds });
}; 