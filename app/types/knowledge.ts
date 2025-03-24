export interface KnowledgeBaseDTO {
  name: string;
  description: string;
}

export interface KnowledgeBaseVO {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  creatorName: string;
  deptId: number;
  deptName: string;
  status: number;
  documentCount: number;
  createTime: string;
  updateTime: string;
  categoryCount: number;
  tagCount: number;
  userPermissions: KnowledgeBasePermissionVO[];
  rolePermissions: KnowledgeBasePermissionVO[];
}

export interface KnowledgeBasePermissionVO {
  id: number;
  kbId: number;
  userId: number;
  userName: string;
  roleId: number;
  roleName: string;
  permissionType: number;
  permissionTypeName: string;
  createTime: string;
  updateTime: string;
}

export interface KnowledgeBaseAssignDTO {
  userIds: number[];
  roleIds: number[];
  permissionType: number;
}

export interface PageKnowledgeBaseVO {
  records: KnowledgeBaseVO[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
