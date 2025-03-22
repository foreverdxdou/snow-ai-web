// 聊天消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createTime: string;
}

// 聊天会话
export interface ChatSession {
  id: string;
  title: string;
  kbId: number;
  kbName: string;
  createTime: string;
  updateTime: string;
  messages: ChatMessage[];
}

// 聊天参数
export interface ChatParams {
  kbId: number;
  question: string;
  sessionId?: string;
  streaming?: boolean;
}

// 聊天响应
export interface ChatResponse {
  answer: string;
  references: {
    id: number;
    title: string;
    content: string;
    score: number;
  }[];
} 