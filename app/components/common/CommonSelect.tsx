import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    styled,
    alpha,
    SxProps,
    Theme
} from '@mui/material';
import type { SelectProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Option {
    id: number | string;
    name: string;
    description?: string;
}

// 基础选择器样式
const BaseSelect = styled(Select)(({ theme }) => ({
    borderRadius: '8px',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: 'all 0.3s ease',
    height: '40px',
    '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
    },
    '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    '&.Mui-disabled': {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.5),
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.divider, 0.5),
        transition: 'border-color 0.3s ease',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiSelect-select': {
        padding: '8px 14px',
        height: '24px',
        color: alpha(theme.palette.text.primary, 0.9),
        '&:focus': {
            backgroundColor: 'transparent',
        }
    },
    '& .MuiSelect-icon': {
        color: alpha(theme.palette.text.secondary, 0.7),
        transition: 'transform 0.3s ease',
    },
    '&.Mui-focused .MuiSelect-icon': {
        transform: 'rotate(180deg)',
        color: theme.palette.primary.main,
    }
}));

// 下拉菜单样式
const StyledMenu = styled(MenuItem)(({ theme }) => ({
    padding: '6px 14px',
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
    minHeight: '32px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
        }
    }
}));

interface CommonSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
    value?: string | number | string[];
    onChange?: (value: string | number | string[]) => void;
    options: Array<{
        id: string | number;
        name: string;
        description?: string;
    }>;
    label?: string;
    showDescription?: boolean;
    showAll?: boolean;
    allValue?: string | number;
    showAllLabel?: string | number;
}

export const CommonSelect: React.FC<CommonSelectProps> = ({
    value,
    onChange,
    options,
    label,
    showDescription = false,
    showAll = true,
    allValue = '',
    showAllLabel = '',
    ...props
}) => {
    const { t } = useTranslation();
    const handleChange = (event: any) => {
        onChange?.(event.target.value as string | number);
    };

    return (
        <FormControl 
            size="small"
        >
            <InputLabel>{label}</InputLabel>
            <BaseSelect
                value={value || ''}
                label={label}
                onChange={handleChange}
                {...props}
            >
                {showAll && (
                    <StyledMenu value={allValue}>
                        {showAllLabel || t('common.all')}
                    </StyledMenu>
                )}
                {options.map((option) => (
                    <StyledMenu 
                        key={option.id} 
                        value={option.id}
                    >
                        {showDescription ? (
                            <Box>
                                <Typography variant="body1">{option.name}</Typography>
                                {option.description && (
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                            mt: 0.5, 
                                            '& .MuiSelect-select': {
                                                py: 1.5
                                            } 
                                        }}
                                    >
                                        {option.description}
                                    </Typography>
                                )}
                            </Box>
                        ) : (
                            option.name
                        )}
                    </StyledMenu>
                ))}
            </BaseSelect>
        </FormControl>
    );
}; 