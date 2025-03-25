export interface KbCategory {
  id: number;
  name: string;
  description: string;
  parentId: number;
  kbId: number;
  sort: number;
  creatorId: number;
  creatorName: string;
  status: number;
  createTime: string;
  updateTime: string;
  children?: KbCategory[];
  documentCount?: number;
}

export interface KbCategoryCreateDTO {
  kbId: number;
  name: string;
  description: string;
  parentId: number | null;
  sort: number;
}

export interface KbCategoryUpdateDTO {
  name: string;
  description: string;
  parentId: number | null;
  sort: number;
}

export interface PageKbCategoryVO {
  records: KbCategory[];
  total: number;
  size: number;
  current: number;
  pages: number;
} 