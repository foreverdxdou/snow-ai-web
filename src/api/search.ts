import request from './request';
import type { SearchResult, SearchParams } from '@/types/search';

export const search = (params: SearchParams) => {
  return request.get<{
    records: SearchResult[];
    total: number;
    size: number;
    current: number;
  }>('/api/kb/search', { params });
};

// 搜索建议
export const suggest = (keyword: string) => {
  return request.get<string[]>('/api/kb/search/suggest', {
    params: { keyword }
  });
}; 