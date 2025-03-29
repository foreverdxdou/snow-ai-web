import React from 'react';
import { Box } from '@mui/material';

interface SearchBarProps {
    children: React.ReactNode;
    sx?: React.CSSProperties;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    children,
    sx
}) => {
    return (
        <Box>
            <Box 
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 2,
                    ...sx
                }}
            >
                {children}
            </Box>
        </Box>
    );
}; 