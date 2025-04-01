'use client';

import React from 'react';
import { Box, useTheme } from '@mui/material';
import Logo from '@/app/components/Logo';

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
                overflow: 'hidden',
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
                    zIndex: 2,
                }}
            >
               <Logo />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1200px', px: 2 }}>
                {children}
            </Box>
        </Box>
    );
} 