'use client';

import { useEffect, useState } from 'react';
import { Avatar, Box, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { AccountCircle as AccountCircleIcon, Logout as LogoutOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth';
import { User } from '@/app/types/userinfo';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

export default function UserInfo() {
    const router = useRouter();
    const { t } = useTranslation();
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await authService.getCurrentUser();
            const data = await response.data;
            if (data.code === 200) {
                setUserInfo(data.data);
                // 保存用户名到 Cookie
                Cookies.set('username', data.data.username);
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            Cookies.remove('token');
            Cookies.remove('username');
            router.replace('/login');
        } catch (error) {
            console.error('退出登录失败:', error);
        }
    };

    if (loading) {
        return <CircularProgress size={24} />;
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.dark',
                        fontSize: '1rem'
                    }}
                    src={userInfo?.avatar}
                >
                    {(userInfo?.nickname || userInfo?.username || '').charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem sx={{ minWidth: 120 }}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                        {userInfo?.nickname || userInfo?.username}
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('common.logout')}</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
} 