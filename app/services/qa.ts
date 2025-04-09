import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { QaRequest, QaResponse, PageKbChatHistory, KbChatHistory } from '@/app/types/qa';

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

    // 获取用户对话历史列表
    getUserChatHistory: () => {
        return request.get<Result<KbChatHistory[]>>(`${BASE_URL}/history/user`);
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

    // 清除用户对话历史
    clearChatHistoryByUser: () => {
        return request.delete<Result<void>>(`${BASE_URL}/clearChatHistoryByUser`);
    },

    // 清除单个对话历史
    clearChatHistoryByRequestId: (requestId: string) => {
        return request.delete<Result<void>>(`${BASE_URL}/clearChatHistoryByRequestId/${requestId}`);
    },
}; 