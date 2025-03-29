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
  status: number;
  parseStatus: number;
  version: number;
  createTime: string;
  updateTime: string;
  fileSize?: number;
  fileType?: string;
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