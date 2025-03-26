import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { Tag, TagCreateDTO, TagUpdateDTO, PageTagVO } from '@/app/types/tag';

const BASE_URL = '/kb/tag';

export const tagService = {
  // 获取标签列表
  getList: (params: { 
    current: number; 
    size: number;
    name?: string;
  }) => {
    return request.get<Result<PageTagVO>>(`${BASE_URL}/page`, { params });
  },

  // 创建标签
  create: (data: TagCreateDTO) => {
    return request.post<Result<Tag>>(BASE_URL, data);
  },

  // 更新标签
  update: (id: number, data: TagUpdateDTO) => {
    return request.put<Result<Tag>>(`${BASE_URL}/${id}`, data);
  },

  // 删除标签
  delete: (id: number) => {
    return request.delete<Result<void>>(`${BASE_URL}/${id}`);
  },
}; 