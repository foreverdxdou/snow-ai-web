export interface Document {
  id: number;
  name: string;
  content: string;
  categoryId: number;
  categoryName: string;
  kbId: number;
  kbName: string;
  creatorId: number;
  creatorName: string;
  status: number;
  version: number;
  createTime: string;
  updateTime: string;
  tags?: DocumentTag[];
}

export interface DocumentCreateDTO {
  name: string;
  content: string;
  categoryId: number;
  kbId: number;
  tags?: string[];
}

export interface DocumentUpdateDTO {
  name: string;
  content: string;
  categoryId: number;
  tags?: string[];
}

export interface DocumentVersion {
  id: number;
  documentId: number;
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