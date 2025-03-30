'use client';

import React from 'react';
import { MenuItem, ListItemIcon, ListItemText, alpha } from '@mui/material';

interface StyledMenuItemProps {
    icon: React.ElementType;
    text: string;
    onClick?: () => void;
    color?: string;
}

export const StyledMenuItem: React.FC<StyledMenuItemProps> = ({ 
    icon: Icon, 
    text, 
    onClick, 
    color = 'inherit' 
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