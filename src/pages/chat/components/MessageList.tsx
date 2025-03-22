import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import type { ChatMessage } from '@/types/chat';
import { Markdown } from './Markdown';

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-6">
      {messages.map(message => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex gap-4 max-w-[70%] ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <Avatar
              icon={message.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
              className={message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'}
            />
            <div
              className={`rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <Markdown content={message.content} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 