'use client';

import React from 'react';
import { Box, styled, alpha } from '@mui/material';

const SearchBarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
    }
}));

interface SearchBarProps {
    children: React.ReactNode;
}

export const SearchBar: React.FC<SearchBarProps> = ({ children }) => {
    return (
        <SearchBarContainer>
            {children}
        </SearchBarContainer>
    );
}; 