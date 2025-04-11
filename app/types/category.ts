export interface KbCategory {
  id: string;
  name: string;
  description: string;
  parentId: string;
  sort: number;
  creatorId: string;
  creatorName: string;
  status: number;
  createTime: string;
  updateTime: string;
  children?: KbCategory[];
  documentCount?: number;
}

export interface KbCategoryCreateDTO {
  name: string;
  description: string;
  parentId: string | null;
  sort: number | null;
  status: number;
}

export interface KbCategoryUpdateDTO {
  name: string;
  description: string;
  parentId: string | null;
  sort: number;
}

export interface PageKbCategoryVO {
  records: KbCategory[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    parentId: string;
    status: number;
    createTime?: string;
    updateTime?: string;
    sort: number;
}

export interface CategoryQuery {
    current: number;
    size: number;
    name?: string;
    status?: number;
}

export interface CategorySaveRequest {
    id?: number;
    name: string;
    description?: string;
    parentId: number;
    status: number;
} 