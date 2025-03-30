'use client';

import React from 'react';
import {
    Menu,
    Box,
    Typography,
    Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { StyledMenuItem } from './StyledMenuItem';
import { useTranslation } from 'react-i18next';

interface UserMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    displayName: string;
    email?: string;
    onLogout: () => void;
    t: (key: string) => string;
}

export default function UserMenu({
    anchorEl,
    open,
    onClose,
    displayName,
    email,
    onLogout,
    t,
}: UserMenuProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            onClick={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        width: 220,
                        overflow: 'visible',
                        mt: 1.5,
                        backgroundColor: (theme) => 
                            alpha(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.98 : 0.95),
                        backdropFilter: 'blur(6px)',
                        borderRadius: 1.5,
                        border: 1,
                        borderColor: 'divider',
                        boxShadow: (theme) => 
                            `0px 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            borderLeft: 1,
                            borderTop: 1,
                            borderColor: 'divider',
                        },
                    },
                },
            }}
        >
            <Box sx={{ pt: 2, pb: 1.5, px: 2.5 }}>
                <Typography variant="subtitle2" noWrap>
                    {displayName}
                </Typography>
                {email && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {email}
                    </Typography>
                )}
            </Box>
            <Divider />
            <Box sx={{ py: 1 }}>
                <StyledMenuItem 
                    icon={AccountCircleIcon} 
                    text={t('common.profile')} 
                />
                <StyledMenuItem 
                    icon={LogoutIcon} 
                    text={t('common.logout')} 
                    onClick={onLogout}
                    color="error.main"
                />
            </Box>
        </Menu>
    );
} 