// 部门
export interface Department {
  id: number;
  name: string;
  parentId: number;
  sort: number;
  leader: string;
  phone: string;
  email: string;
  status: number;
  createTime: string;
  updateTime: string;
  children?: Department[];
}

// 角色
export interface Role {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number; // 1: 系统角色, 2: 自定义角色
  remark: string;
  menuIds: number[]; // 菜单权限
  createTime: string;
  updateTime: string;
}

// 菜单
export interface Menu {
  id: number;
  name: string;
  permission: string;
  type: number; // 1: 目录, 2: 菜单, 3: 按钮
  sort: number;
  parentId: number;
  path: string;
  icon: string;
  component: string;
  status: number;
  createTime: string;
  updateTime: string;
  children?: Menu[];
} 