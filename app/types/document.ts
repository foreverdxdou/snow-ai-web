export interface Document {
  id: number;
  title: string;
  name: string;
  content: string;
  categoryId: number;
  categoryName: string;
  kbId: number;
  kbName: string;
  creatorId: number;
  creatorName: string;
  status: number;  // 0: 禁用, 1: 启用
  parseStatus: number;
  version: number;
  createTime: string;
  updateTime: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  tags?: DocumentTag[];
}

export interface DocumentCreateDTO {
  title: string;
  content: string;
  categoryId: number;
  kbId: number;
  tagIds?: string[];
}

export interface DocumentUpdateDTO {
  title: string;
  content: string;
  categoryId: number;
  kbId: number;
  tags?: string[];
  status?: number;  // 0: 禁用, 1: 启用
}

export interface DocumentVersion {
  id: number;
  title: string;
  documentId: number;
  fileUrl: string;
  version: number;
  content: string;
  creatorId: number;
  creatorName: string;
  createTime: string;
}

export interface DocumentTag {
  id: number;
  name: string;
  documentId: number;
  createTime: string;
}

export interface PageDocumentVO {
  records: Document[];
  total: number;
  size: number;
  current: number;
  pages: number;
} 

export interface DocumentSearchParams { 
  kbId?: number | string; 
  categoryId?: number;
  current: number; 
  size: number;
  title?: string;
  status?: number;
} 