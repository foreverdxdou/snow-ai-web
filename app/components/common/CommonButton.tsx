import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface CommonButtonProps extends ButtonProps {
    startColor?: string;
    endColor?: string;
    hoverStartColor?: string;
    hoverEndColor?: string;
    shadowColor?: string;
    fullWidth?: boolean;
    height?: string | number;
    paddingX?: number;
}

export const GradientButton: React.FC<CommonButtonProps> = ({
    children,
    startColor = '#6C8EF2',
    endColor = '#76E3C4',
    hoverStartColor = '#5A7DE0',
    hoverEndColor = '#65D2B3',
    shadowColor = 'rgba(108, 142, 242, .3)',
    fullWidth = false,
    height = '44px',
    paddingX = 3,
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            sx={{
                minWidth: { xs: fullWidth ? '100%' : 'auto', md: 'auto' },
                height,
                px: paddingX,
                background: `linear-gradient(45deg, ${startColor} 30%, ${endColor} 90%)`,
                '&:hover': {
                    background: `linear-gradient(45deg, ${hoverStartColor} 30%, ${hoverEndColor} 90%)`,
                },
                boxShadow: `0 3px 5px 2px ${shadowColor}`,
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
}; 

export const ResetButton: React.FC<CommonButtonProps> = ({
    children,
    startColor = '#6C8EF2',
    endColor = '#76E3C4',
    hoverStartColor = '#5A7DE0',
    hoverEndColor = '#65D2B3',
    shadowColor = 'rgba(108, 142, 242, .3)',
    fullWidth = false,
    height = '44px',
    paddingX = 3,
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            sx={{
                minWidth: { xs: '100%', sm: '120px' },
                height: '40px',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'action.hover'
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
}; 