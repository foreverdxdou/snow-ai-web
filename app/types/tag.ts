export interface Tag {
  id: number;
  name: string;
  creatorId: number;
  creatorName: string;
  createTime: string;
  updateTime: string;
}

export interface TagCreateDTO {
  name: string;
}

export interface TagUpdateDTO {
  name: string;
}

export interface PageTagVO {
  records: Tag[];
  total: number;
  size: number;
  current: number;
  pages: number;
} 