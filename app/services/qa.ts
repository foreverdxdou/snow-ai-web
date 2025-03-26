import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { QaRequest, QaResponse, PageKbChatHistory } from '@/app/types/qa';

const BASE_URL = '/kb/qa';

export const qaService = {
    // 通用问答
    generalChat: (data: QaRequest) => {
        return request.post<Result<QaResponse>>(`${BASE_URL}/general`, data);
    },

    // 通用流式问答
    generalChatStream: (data: QaRequest) => {
        return request.post<Result<any>>(`${BASE_URL}/general/stream`, data);
    },

    // 知识库问答
    chat: (kbIds: number[], data: QaRequest) => {
        return request.post<Result<QaResponse>>(`${BASE_URL}/chat?kbIds=${kbIds.join(',')}`, data);
    },

    // 知识库流式问答
    chatStream: (kbIds: number[], data: QaRequest) => {
        return request.post<Result<any>>(`${BASE_URL}/chat/stream?kbIds=${kbIds.join(',')}`, data);
    },

    // 获取对话历史
    getChatHistory: (sessionId: string) => {
        return request.get<Result<PageKbChatHistory>>(`${BASE_URL}/history`, {
            params: { sessionId }
        });
    },

    // 清除对话历史
    clearChatHistory: (sessionId: string) => {
        return request.delete<Result<void>>(`${BASE_URL}/history/${sessionId}`);
    },
}; 