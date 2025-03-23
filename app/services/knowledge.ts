import request from '../utils/request';
import type {
  KnowledgeBaseDTO,
  KnowledgeBaseVO,
  KnowledgeBasePermissionVO,
  PageKnowledgeBaseVO,
  Result,
} from '../types/knowledge';

const BASE_URL = '/v1/kb';

// 扩展 axios 实例，添加泛型支持
const http = {
  get: <T>(url: string, config?: any): Promise<T> => {
    return request.get(url, config);
  },
  post: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return request.post(url, data, config);
  },
  put: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return request.put(url, data, config);
  },
  delete: <T>(url: string, config?: any): Promise<T> => {
    return request.delete(url, config);
  },
};

export const knowledgeService = {
  // 获取知识库列表
  getList: (params: { current: number; size: number }) => {
    return http.get<Result<PageKnowledgeBaseVO>>(`${BASE_URL}/list`, { params });
  },

  // 获取知识库详情
  getById: (id: number) => {
    return http.get<Result<KnowledgeBaseVO>>(`${BASE_URL}/${id}`);
  },

  // 创建知识库
  create: (data: KnowledgeBaseDTO) => {
    return http.post<Result<void>>(BASE_URL, data);
  },

  // 更新知识库
  update: (id: number, data: KnowledgeBaseDTO) => {
    return http.put<Result<void>>(`${BASE_URL}/${id}`, data);
  },

  // 删除知识库
  delete: (id: number) => {
    return http.delete<Result<void>>(`${BASE_URL}/${id}`);
  },

  /**
   * 更新知识库状态
   * @param id 知识库ID
   * @param status 状态(1:启用, 0:禁用)
   */
  updateStatus: async (id: number, status: number) => {
    return http.put<Result<void>>(`${BASE_URL}/${id}/status?status=${status}`);
  },

  // 分配知识库权限
  assignPermissions: (id: number, data: { userIds: number[]; roleIds: number[] }) => {
    return http.post<Result<void>>(`${BASE_URL}/${id}/permissions`, data);
  },

  // 获取用户可访问的知识库列表
  getUserKnowledgeBases: () => {
    return http.get<Result<KnowledgeBaseVO[]>>(`${BASE_URL}/user`);
  },
}; 