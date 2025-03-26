import request from '@/app/utils/request';
import type {
  KnowledgeBaseDTO,
  KnowledgeBaseVO,
  KnowledgeBasePermissionVO,
  PageKnowledgeBaseVO,
} from '@/app/types/knowledge';
import type { Result } from '@/app/types/result';

const BASE_URL = '/kb';


export const knowledgeService = {
  // 获取知识库列表
  getList: (params: { current: number; size: number; categoryId?: number }) => {
    return request.get<Result<PageKnowledgeBaseVO>>(`${BASE_URL}/list`, { params });
  },

  // 获取知识库详情
  getById: (id: number) => {
    return request.get<Result<KnowledgeBaseVO>>(`${BASE_URL}/${id}`);
  },

  // 创建知识库
  create: (data: KnowledgeBaseDTO) => {
    return request.post<Result<void>>(BASE_URL, data);
  },

  // 更新知识库
  update: (id: number, data: KnowledgeBaseDTO) => {
    return request.put<Result<void>>(`${BASE_URL}/${id}`, data);
  },

  // 删除知识库
  delete: (id: number) => {
    return request.delete<Result<void>>(`${BASE_URL}/${id}`);
  },

  /**
   * 更新知识库状态
   * @param id 知识库ID
   * @param status 状态(1:启用, 0:禁用)
   */
  updateStatus: (id: number, status: number) => {
    return request.put<Result<void>>(`${BASE_URL}/${id}/status?status=${status}`);
  },

  // 分配知识库权限
  assignPermissions: (id: number, data: { userIds: number[]; roleIds: number[] }) => {
    return request.post<Result<void>>(`${BASE_URL}/${id}/permissions`, data);
  },

  // 获取用户可访问的知识库列表
  getUserKnowledgeBases: () => {
    return request.get<Result<KnowledgeBaseVO[]>>(`${BASE_URL}/user/list`);
  },
}; 