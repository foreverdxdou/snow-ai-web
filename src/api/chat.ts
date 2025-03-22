import request from './request';
import type { ChatSession, ChatParams, ChatResponse } from '@/types/chat';

// 获取聊天会话列表
export const getChatSessions = () => {
  return request.get<ChatSession[]>('/api/chat/sessions');
};

// 创建聊天会话
export const createChatSession = (kbId: number) => {
  return request.post<ChatSession>('/api/chat/sessions', { kbId });
};

// 删除聊天会话
export const deleteChatSession = (sessionId: string) => {
  return request.delete(`/api/chat/sessions/${sessionId}`);
};

// 获取聊天记录
export const getChatMessages = (sessionId: string) => {
  return request.get<ChatSession>(`/api/chat/sessions/${sessionId}/messages`);
};

// 发送消息(普通)
export const sendMessage = (params: ChatParams) => {
  return request.post<ChatResponse>('/api/chat/completions', params);
};

// 发送消息(流式)
export const sendMessageStream = (params: ChatParams) => {
  return fetch('/api/chat/completions/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(params)
  });
}; 