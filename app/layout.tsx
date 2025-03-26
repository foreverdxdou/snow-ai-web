'use client';

import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { CssBaseline } from '@mui/material';
import './i18n';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh">
            <body>
                <ThemeProvider>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
