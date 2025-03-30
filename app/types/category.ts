export interface KbCategory {
  id: number;
  name: string;
  description: string;
  parentId: number;
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
  name: string;
  description: string;
  parentId: number | null;
  sort: number | null;
  status: number;
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

export interface Category {
    id: number;
    name: string;
    description?: string;
    parentId: number;
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