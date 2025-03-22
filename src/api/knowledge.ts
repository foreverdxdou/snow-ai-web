import request from './request';
import { KnowledgeBase, Category, Document, Tag } from '@/types/knowledge';

// 知识库管理
export const getKnowledgeBaseList = (params: any) => {
  return request.get('/api/kb/list', { params });
};

export const createKnowledgeBase = (data: Partial<KnowledgeBase>) => {
  return request.post('/api/kb', data);
};

export const updateKnowledgeBase = (id: number, data: Partial<KnowledgeBase>) => {
  return request.put(`/api/kb/${id}`, data);
};

export const deleteKnowledgeBase = (id: number) => {
  return request.delete(`/api/kb/${id}`);
};

// 分类管理
export const getCategoryTree = (kbId: number) => {
  return request.get(`/api/kb/category/tree/${kbId}`);
};

export const createCategory = (data: Partial<Category>) => {
  return request.post('/api/kb/category', data);
};

export const updateCategory = (id: number, data: Partial<Category>) => {
  return request.put(`/api/kb/category/${id}`, data);
};

export const deleteCategory = (id: number) => {
  return request.delete(`/api/kb/category/${id}`);
};

// 文档管理
export const getDocumentList = (params: any) => {
  return request.get('/api/kb/document/page', { params });
};

export const getDocumentDetail = (id: number) => {
  return request.get(`/api/kb/document/${id}`);
};

export const createDocument = (data: FormData) => {
  return request.post('/api/kb/document/upload', data);
};

export const updateDocument = (id: number, data: Partial<Document>) => {
  return request.put(`/api/kb/document/${id}`, data);
};

export const deleteDocument = (id: number) => {
  return request.delete(`/api/kb/document/${id}`);
};

// 标签管理
export const getTagList = (params: any) => {
  return request.get('/api/kb/tag/page', { params });
};

export const createTag = (data: Partial<Tag>) => {
  return request.post('/api/kb/tag', data);
};

export const updateTag = (id: number, data: Partial<Tag>) => {
  return request.put(`/api/kb/tag/${id}`, data);
};

export const deleteTag = (id: number) => {
  return request.delete(`/api/kb/tag/${id}`);
}; 