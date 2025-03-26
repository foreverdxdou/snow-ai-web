import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { KbCategory, KbCategoryCreateDTO, KbCategoryUpdateDTO, PageKbCategoryVO } from '@/app/types/category';

const BASE_URL = '/kb/category';

export const categoryService = {
  // 获取分类列表
  getList: (params: { current: number; size: number; name?: string; status?: number }) => {
    return request.get<Result<PageKbCategoryVO>>(`${BASE_URL}/list`, { params });
  },

  // 获取分类详情
  getById: (id: number) => {
    return request.get<Result<KbCategory>>(`${BASE_URL}/${id}`);
  },

  // 创建分类
  create: (data: KbCategoryCreateDTO) => {
    return request.post<Result<KbCategory>>(BASE_URL, data);
  },

  // 更新分类
  update: (id: number, data: KbCategoryUpdateDTO) => {
    return request.put<Result<KbCategory>>(`${BASE_URL}/${id}`, data);
  },

  // 删除分类
  delete: (id: number) => {
    return request.delete<Result<void>>(`${BASE_URL}/${id}`);
  },

  // 更新分类状态
  updateStatus: (id: number, status: number) => {
    return request.put<Result<void>>(`${BASE_URL}/${id}/status?status=${status}`);
  },

  // 移动分类
  moveCategory: (id: number, parentId: number | null, sort: number) => {
    return request.put<Result<void>>(`${BASE_URL}/${id}/move`, null, {
      params: { parentId, sort }
    });
  },

  // 获取知识库的分类树
  getCategoryTree: () => {
    return request.get<Result<KbCategory[]>>(`${BASE_URL}/tree`);
  },
}; 