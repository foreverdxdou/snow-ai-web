export interface Permission {
  id: number;
  kbId: number;
  userId?: number;
  userName?: string;
  roleId?: number;
  roleName?: string;
  permissionType: number; // 1: 只读, 2: 读写, 3: 管理
  createTime: string;
  updateTime: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  deptId: number;
  deptName: string;
  status: number;
  createTime: string;
  updateTime: string;
} 