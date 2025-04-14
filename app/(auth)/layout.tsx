'use client';

import React from 'react';
import { Box, useTheme } from '@mui/material';
import Logo from '@/app/components/Logo';
import { ThemeLanguageSwitch } from '@/app/components/common/ThemeLanguageSwitch';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)'
                    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'auto',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: theme.palette.mode === 'dark'
                        ? 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)'
                        : 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
                    zIndex: 1,
                }
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 2,
                }}
            >
                <ThemeLanguageSwitch />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '1200px',
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    minHeight: '100vh',
                    paddingTop: '120px',
                    paddingBottom: '40px',
                }}
            >
                <Logo />
                {children}
            </Box>
        </Box>
    );
} 