import React from 'react';
import { useTheme } from '@mui/material';

const Logo: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 定义渐变 */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ 
                        stopColor: isDark ? 'rgba(255, 255, 255, 0.9)' : '#66B2FF',
                        stopOpacity: 1 
                    }} />
                    <stop offset="100%" style={{ 
                        stopColor: isDark ? 'rgba(255, 255, 255, 0.7)' : '#007FFF',
                        stopOpacity: 1 
                    }} />
                </linearGradient>
            </defs>
            
            {/* Snow 文字 */}
            <text
                x="65"
                y="100"
                fontSize="40"
                fontWeight="bold"
                fill="url(#logoGradient)"
                fontFamily="Arial, sans-serif"
            >
                Snow AI
            </text>
        </svg>
    );
};

export default Logo; 