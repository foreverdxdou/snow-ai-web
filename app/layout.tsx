'use client';

import './globals.css';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { CssBaseline } from '@mui/material';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/app/i18n';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh">
            <body>
                <I18nextProvider i18n={i18n}>
                    <ThemeProvider>
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </I18nextProvider>
            </body>
        </html>
    );
}
