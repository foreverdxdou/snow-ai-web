import { Result } from './result';

// 用户信息
export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
  status: number;
  roleIds: number[];
  roleNames: string[];
  createTime: string;
  updateTime: string;
  creatorName: string;
  updaterName: string;
}

// 分页查询参数
export interface UserQuery {
  current: number;
  size: number;
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  status?: number;
}

// 分页查询响应
export interface UserPageResponse {
  records: User[];
  total: number;
}

// 新增/修改用户请求
export interface UserSaveRequest {
  id?: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  status: number;
  roleIds: number[];
}

// 单个查询响应
export interface UserResponse extends Result<User> {} 