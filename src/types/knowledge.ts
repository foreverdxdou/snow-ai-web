export interface KnowledgeState {
  knowledgeBases: KnowledgeBase[];
  categories: Category[];
  documents: Document[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

// 知识库
export interface KnowledgeBase {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  creatorName: string;
  deptId: number;
  deptName: string;
  status: number;
  documentCount: number;
  categoryCount: number;
  tagCount: number;
  createTime: string;
  updateTime: string;
}

// 分类
export interface Category {
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
  children?: Category[];
  documentCount?: number;
}

// 文档
export interface Document {
  id: number;
  title: string;
  content: string;
  summary: string;
  keywords: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  categoryId: number;
  categoryName: string;
  kbId: number;
  kbName: string;
  creatorId: number;
  creatorName: string;
  version: number;
  status: number;
  tags: Tag[];
  createTime: string;
  updateTime: string;
}

// 标签
export interface Tag {
  id: number;
  name: string;
  description: string;
  kbId: number;
  kbName: string;
  creatorId: number;
  creatorName: string;
  status: number;
  createTime: string;
  updateTime: string;
} 