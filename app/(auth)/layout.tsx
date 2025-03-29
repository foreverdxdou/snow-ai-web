'use client';

import React, { useMemo } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { ThemeLanguageSwitch } from '../components/common/ThemeLanguageSwitch';

// 使用 React.memo 优化背景组件
const Background = React.memo(() => {
    const theme = useTheme();
    
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)'
                    : 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                zIndex: -1,
            }}
        />
    );
});

Background.displayName = 'Background';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useTranslation();

    // 使用 useMemo 优化容器样式
    const containerStyle = useMemo(() => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
    }), []);

    return (
        <PerformanceLayout>
            <Background />
            <Container maxWidth="sm" sx={containerStyle}>
                {/* 主题和语言切换 */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 10,
                }}>
                    <ThemeLanguageSwitch />
                </div>

                {/* 登录卡片 */}
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    margin: '0 16px',
                    position: 'relative',
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        padding: '32px',
                    }}>
                        {/* Logo 和标题区域 */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: '32px',
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Logo />
                            </div>
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                marginBottom: '8px',
                            }}>{t('auth.loginTitle')}</h1>
                            <p style={{
                                color: '#6b7280',
                                margin: 0,
                            }}>{t('auth.loginDescription')}</p>
                        </div>

                        {/* 表单内容 */}
                        {children}
                    </div>
                </div>
            </Container>
        </PerformanceLayout>
    );
} 