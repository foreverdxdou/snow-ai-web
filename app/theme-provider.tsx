'use client';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890FF',
          borderRadius: 8,
          fontSize: 14,
          colorText: '#1F2937',
          colorTextSecondary: '#6B7280',
          controlHeight: 44,
        },
        components: {
          Button: {
            controlHeight: 44,
            fontSize: 16,
            borderRadius: 8,
          },
          Input: {
            controlHeight: 44,
            borderRadius: 8,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
} 