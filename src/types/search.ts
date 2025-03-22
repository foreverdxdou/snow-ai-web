export interface SearchResult {
  id: number;
  title: string;
  content: string;
  summary: string;
  score: number;
  kbId: number;
  kbName: string;
  categoryId: number;
  categoryName: string;
  createTime: string;
}

export interface SearchParams {
  keyword: string;
  kbId?: number;
  categoryId?: number;
  tagIds?: number[];
  current?: number;
  size?: number;
} 