// 问答请求模型
export interface QaRequest {
    question: string;
    sessionId: string;
    context?: string[];
    temperature?: number;
    maxTokens?: number;
}

// 问答响应模型
export interface QaResponse {
    answer: string;
    sessionId: string;
    tokensUsed: number;
    processTime: number;
    success: boolean;
    errorMessage?: string;
}

// 对话历史记录
export interface KbChatHistory {
    id: number;
    sessionId: string;
    kbIds: string;
    userId: number;
    question: string;
    answer: string;
    tokensUsed: number;
    processTime: number;
    createTime: string;
    updateTime: string;
}

// 分页对话历史记录
export interface PageKbChatHistory {
    records: KbChatHistory[];
    total: number;
    size: number;
    current: number;
    pages: number;
} 