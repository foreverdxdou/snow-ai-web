import request from './request';
import type { Permission, Role, User } from '@/types/permission';

// 权限管理
export const getPermissions = (kbId: number) => {
  return request.get<Permission[]>(`/api/kb/${kbId}/permissions`);
};

export const assignPermissions = (kbId: number, data: {
  userIds?: number[];
  roleIds?: number[];
  permissionType: number;
}) => {
  return request.post(`/api/kb/${kbId}/permissions`, data);
};

// 角色管理
export const getRoles = () => {
  return request.get<Role[]>('/api/system/role/list');
};

// 用户管理
export const getUsers = () => {
  return request.get<User[]>('/api/system/user/list');
}; 