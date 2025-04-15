'use client';

import './globals.css';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { CssBaseline } from '@mui/material';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/app/i18n';
import { CacheProvider } from '@emotion/react';
import { createEmotionCache } from '@/app/utils/createEmotionCache';

// 创建 Emotion 缓存
const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh">
            <head>
                <title>Snow AI</title>
                <meta name="description" content="Snow AI" />
            </head>
            <body>
                <CacheProvider value={clientSideEmotionCache}>
                    <I18nextProvider i18n={i18n}>
                        <ThemeProvider>
                            <CssBaseline />
                            {children}
                        </ThemeProvider>
                    </I18nextProvider>
                </CacheProvider>
            </body>
        </html>
    );
}
