import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { 
  Document, 
  DocumentCreateDTO, 
  DocumentUpdateDTO, 
  DocumentVersion,
  DocumentTag,
  DocumentSearchParams,
  PageDocumentVO 
} from '@/app/types/document';

const BASE_URL = '/kb/document';

export const documentService = {
  // 获取文档列表
  getList: (params: DocumentSearchParams)  => {
    return request.get<Result<PageDocumentVO>>(`${BASE_URL}/page`, { params });
  },

  // 获取文档详情
  getById: (id: number) => {
    return request.get<Result<Document>>(`${BASE_URL}/${id}`);
  },

  // 创建文档
  create: (data: DocumentCreateDTO) => {
    return request.post<Result<Document>>(BASE_URL, data);
  },

  // 更新文档
  update: (id: number, data: DocumentUpdateDTO) => {
    return request.put<Result<Document>>(`${BASE_URL}/${id}`, data);
  },

  // 删除文档
  delete: (id: number) => {
    return request.delete<Result<void>>(`${BASE_URL}/${id}`);
  },

  // 批量删除文档
  batchDelete: (ids: number[]) => {
    return request.delete<Result<void>>(`${BASE_URL}/batch`, { data: { ids } });
  },

  // 解析文档
  parse: (id: number) => {
    return request.post<Result<void>>(`${BASE_URL}/${id}/parse`);
  },

  // 更新文档状态
  updateStatus: (id: number, status: number) => {
    return request.put<Result<void>>(`${BASE_URL}/${id}/status?status=${status}`);
  },

  // 上传文档
  upload: (formData: FormData) => {
    return request.post<Result<Document>>(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取文档版本历史
  getVersions: (id: number) => {
    return request.get<Result<DocumentVersion[]>>(`${BASE_URL}/${id}/versions`);
  },

  // 回滚到指定版本
  rollback: (id: number, version: number) => {
    return request.put<Result<void>>(`${BASE_URL}/${id}/rollback/${version}`);
  },

  // 获取文档标签
  getTags: (id: number) => {
    return request.get<Result<DocumentTag[]>>(`${BASE_URL}/${id}/tags`);
  },
}; 