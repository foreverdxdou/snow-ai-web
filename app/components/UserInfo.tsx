'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import type { User } from '@/app/types/userinfo';
import dynamic from 'next/dynamic';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

// 动态导入 Menu 组件，避免服务端渲染
const UserMenu = dynamic(() => import('./UserMenu'), { 
    ssr: false,
    loading: () => null 
});

interface UserInfoProps {
    userInfo: User | null;
}

export const UserInfo: React.FC<UserInfoProps> = ({
    userInfo,
}) => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        };
    }, []);

    const displayName = mounted ? (userInfo?.nickname || user?.username || '') : '';
    const avatarText = mounted ? displayName[0]?.toUpperCase() || '' : '';

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('退出登录失败:', error);
        }
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                cursor: 'pointer',
                py: 0.75,
                px: 1.5,
                borderRadius: 1.5,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: (theme) => 
                        theme.palette.mode === 'light'
                            ? alpha(theme.palette.primary.main, 0.08)
                            : alpha(theme.palette.primary.main, 0.15),
                },
            }} 
            onClick={handleMenuClick}
        >
            <Avatar 
                sx={{ 
                    width: 32, 
                    height: 32,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)'
                        : 'linear-gradient(135deg, #66B2FF 0%, #007FFF 100%)',
                    color: (theme) => theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : '#fff',
                }}
            >
                {avatarText}
            </Avatar>
            {mounted && (
                <Typography 
                    variant="body2" 
                    noWrap
                    sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        maxWidth: 120,
                        letterSpacing: '0.15px',
                    }}
                >
                    {displayName}
                </Typography>
            )}

            {mounted && (
                <UserMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    displayName={displayName}
                    email={userInfo?.email}
                    onLogout={handleLogout}
                    t={t}
                />
            )}
        </Box>
    );
};