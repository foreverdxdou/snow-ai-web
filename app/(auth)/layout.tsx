'use client';

import React from 'react';
import { Box, Container, useTheme, Typography } from '@mui/material';
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
                    ? 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
                    : 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
                zIndex: -1,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                }
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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                position: 'relative',
            }}
        >
            <Background />
            
            {/* 主题和语言切换 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    display: 'flex',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 3,
                    background: theme => theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: theme => `1px solid ${
                        theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.3)' 
                            : 'rgba(0, 0, 0, 0.2)'
                    }`,
                    boxShadow: theme => theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.1)',
                    '& .MuiIconButton-root': {
                        color: theme => theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(0, 0, 0, 0.7)',
                        '&:hover': {
                            backgroundColor: theme => theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.05)',
                        }
                    }
                }}
            >
                <ThemeLanguageSwitch />
            </Box>

            {/* Logo 和标题区域 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4,
                    textAlign: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <Logo />
                </Box>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 1,
                    }}
                >
                    {t('auth.appName')}
                </Typography>
            </Box>

            {/* 主要内容区域 */}
            <Container maxWidth="sm">
                {children}
            </Container>
        </Box>
    );
} 