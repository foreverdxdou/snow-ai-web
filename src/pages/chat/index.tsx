import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Input, Button, Select, message, Spin } from 'antd';
import { SendOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/store';
import type { RootState } from '@/types/store';
import type { ChatSession, ChatMessage } from '@/types/chat';
import * as api from '@/api/chat';
import { MessageList } from './components/MessageList';
import { ReferenceList } from './components/ReferenceList';

const { Sider, Content } = Layout;

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession>();
  const [selectedKbId, setSelectedKbId] = useState<number>();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { knowledgeBases } = useAppSelector((state: RootState) => state.knowledge);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const fetchSessions = async () => {
    try {
      const data = await api.getChatSessions();
      setSessions(data);
      if (data.length > 0) {
        setCurrentSession(data[0]);
        setSelectedKbId(data[0].kbId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateSession = async () => {
    if (!selectedKbId) {
      message.warning(t('chat.selectKb'));
      return;
    }
    try {
      const session = await api.createChatSession(selectedKbId);
      setSessions([session, ...sessions]);
      setCurrentSession(session);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await api.deleteChatSession(sessionId);
      const newSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(newSessions);
      if (currentSession?.id === sessionId) {
        setCurrentSession(newSessions[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setSelectedKbId(session.kbId);
    }
  };

  const handleSend = async () => {
    if (!question.trim()) return;
    if (!selectedKbId) {
      message.warning(t('chat.selectKb'));
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      createTime: new Date().toISOString()
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      createTime: new Date().toISOString()
    };

    // 更新会话消息
    const newMessages = [...(currentSession?.messages || []), userMessage, assistantMessage];
    setCurrentSession(prev => prev ? { ...prev, messages: newMessages } : undefined);
    setQuestion('');

    try {
      setLoading(true);
      setStreaming(true);

      // 发送流式请求
      const response = await api.sendMessageStream({
        kbId: selectedKbId,
        question: userMessage.content,
        sessionId: currentSession?.id,
        streaming: true
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              // 更新助手消息内容
              setCurrentSession(prev => {
                if (!prev) return prev;
                const messages = [...prev.messages];
                const lastMessage = messages[messages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content += data.content;
                }
                return { ...prev, messages };
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      message.error(t('common.error'));
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout className="h-screen">
      <Sider width={300} className="bg-white">
        <div className="p-4">
          <Select
            placeholder={t('knowledge.name')}
            style={{ width: '100%' }}
            value={selectedKbId}
            onChange={setSelectedKbId}
            options={knowledgeBases.map(kb => ({ label: kb.name, value: kb.id }))}
          />
          <Button
            type="primary"
            block
            className="mt-4"
            onClick={handleCreateSession}
          >
            {t('chat.newSession')}
          </Button>
        </div>
        <Menu
          selectedKeys={[currentSession?.id || '']}
          items={sessions.map(session => ({
            key: session.id,
            label: session.title || t('chat.untitled'),
            icon: <DeleteOutlined onClick={() => handleDeleteSession(session.id)} />,
            onClick: () => handleSelectSession(session.id)
          }))}
        />
      </Sider>
      <Content className="bg-gray-100 p-6">
        <div className="bg-white rounded-lg h-full flex flex-col">
          <div className="flex-1 overflow-auto p-6">
            <MessageList messages={currentSession?.messages || []} />
            <div ref={messageEndRef} />
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-4">
              <Input.TextArea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder={t('chat.inputPlaceholder')}
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={e => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={loading}
                disabled={streaming}
              >
                {t('chat.send')}
              </Button>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ChatPage; 