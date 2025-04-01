'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, alpha, Divider } from '@mui/material';
import { Logout as LogoutIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import type { User } from '@/app/types/userinfo';
import dynamic from 'next/dynamic';

// 动态导入 Menu 组件，避免服务端渲染
const UserMenu = dynamic(() => import('./UserMenu'), { 
    ssr: false,
    loading: () => null 
});

interface UserInfoProps {
    userInfo: User | null;
    anchorEl: HTMLElement | null;
    onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
    onMenuClose: () => void;
    onLogout: () => void;
}

const StyledMenuItem = ({ icon: Icon, text, onClick, color = 'inherit' }: {
    icon: React.ElementType;
    text: string;
    onClick?: () => void;
    color?: string;
}) => (
    <MenuItem 
        onClick={onClick}
        sx={{
            py: 1,
            px: 2.5,
            color,
            '&:hover': {
                backgroundColor: (theme) => 
                    alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.15),
            },
        }}
    >
        <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
            <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
            primary={text}
            primaryTypographyProps={{
                variant: 'body2',
                fontWeight: 500,
            }}
        />
    </MenuItem>
);

export const UserInfo: React.FC<UserInfoProps> = ({
    userInfo,
    anchorEl,
    onMenuClick,
    onMenuClose,
    onLogout,
}) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        };
    }, []);

    const displayName = mounted ? (userInfo?.nickname || user?.username || '') : '';
    const avatarText = mounted ? displayName[0]?.toUpperCase() || '' : '';

    return (
        <Box sx={{ 
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
        }} onClick={onMenuClick}>
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
                    onClose={onMenuClose}
                    displayName={displayName}
                    email={userInfo?.email}
                    onLogout={onLogout}
                    t={t}
                />
            )}
        </Box>
    );
}; 