import React from 'react';
import { useTheme } from '@mui/material';

const Logo: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const primaryColor = isDark ? '#ffffff' : '#1976d2';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Snow 文字 */}
            <text
                x="65"
                y="100"
                fontSize="40"
                fontWeight="bold"
                fill={primaryColor}
                fillOpacity="0.9"
                fontFamily="Arial, sans-serif"
            >
                Snow AI
            </text>
        </svg>
    );
};

export default Logo; 