import React, { useState, useEffect } from 'react';
import { 
    TextField, 
    TextFieldProps,
    styled,
    alpha
} from '@mui/material';

// 基础输入框样式
const BaseInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
            transform: 'translateY(-1px)',
        },
        '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.4),
            backdropFilter: 'none',
        }
    },
    '& .MuiOutlinedInput-input': {
        padding: '8px 14px',
        height: '24px',
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
        '&::placeholder': {
            fontSize: '0.875rem',
            color: alpha(theme.palette.text.primary, 0.4),
        }
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.divider, 0.3),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.4),
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '1.5px',
    },
    '& .MuiInputLabel-root': {
        color: alpha(theme.palette.text.primary, 0.6),
        fontSize: '0.875rem',
        '&.Mui-focused': {
            color: theme.palette.primary.main,
        }
    },
    '& .MuiInputAdornment-root': {
        color: alpha(theme.palette.text.secondary, 0.6),
    }
}));

interface CommonInputProps extends Omit<TextFieldProps, 'onChange'> {
    value?: string;
    onChange?: (value: string) => void;
    debounceTime?: number;
}

export const CommonInput: React.FC<CommonInputProps> = ({
    value = '',
    onChange,
    debounceTime = 300,
    ...props
}) => {
    const [inputValue, setInputValue] = useState(value);

    // 当外部 value 变化时更新内部状态
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // 处理输入变化
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    // 处理失去焦点
    const handleBlur = () => {
        if (onChange && inputValue !== value) {
            onChange(inputValue);
        }
    };

    // 处理回车键
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.currentTarget.blur();
        }
    };

    return (
        <BaseInput
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            {...props}
        />
    );
}; 