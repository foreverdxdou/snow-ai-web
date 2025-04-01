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
        transform: 'translate(14px, 50%)',
        '&.Mui-focused': {
            color: theme.palette.primary.main,
            transform: 'translate(14px, -9px) scale(0.75)',
        },
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
        }
    },
    '& .MuiInputAdornment-root': {
        color: alpha(theme.palette.text.secondary, 0.6),
    }
}));

interface CommonInputProps extends Omit<TextFieldProps, 'onChange'> {
    value?: string | number;
    onChange?: (value: string | number) => void;
    debounceTime?: number;
    min?: number;
    max?: number;
}

export const CommonInput: React.FC<CommonInputProps> = ({
    value = '',
    onChange,
    debounceTime = 300,
    type = 'text',
    min,
    max,
    ...props
}) => {
    const [inputValue, setInputValue] = useState(value);

    // 当外部 value 变化时更新内部状态
    useEffect(() => {
        setInputValue(value);
        return () => {
            setInputValue('');
        };
    }, [value]);

    // 处理输入变化
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        
        if (type === 'number') {
            // 数字类型输入处理
            const numValue = Number(newValue);
            
            // 检查是否为有效数字
            if (isNaN(numValue) && newValue !== '') {
                return;
            }
            
            // 检查是否在最小值和最大值范围内
            if (min !== undefined && numValue < min) {
                setInputValue(min);
            } else if (max !== undefined && numValue > max) {
                setInputValue(max);
            } else {
                setInputValue(newValue);
            }
        } else {
            setInputValue(newValue);
        }
    };

    // 处理失去焦点
    const handleBlur = () => {
        if (onChange && inputValue !== value) {
            if (type === 'number') {
                const numValue = Number(inputValue);
                if (!isNaN(numValue)) {
                    // 确保数值在有效范围内
                    const finalValue = Math.min(
                        Math.max(numValue, min ?? -Infinity),
                        max ?? Infinity
                    );
                    onChange(finalValue);
                } else {
                    onChange(0);
                }
            } else {
                onChange(inputValue as string);
            }
        }
    };

    // 处理回车键
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.currentTarget.blur();
        }
        
        // 数字类型输入限制
        if (type === 'number') {
            // 允许的按键：数字、小数点、负号、退格键、删除键、方向键
            const allowedKeys = [
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                '.', '-', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'
            ];
            
            if (!allowedKeys.includes(event.key)) {
                event.preventDefault();
            }
        }
    };

    return (
        <BaseInput
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            type={type}
            inputProps={{
                ...props.inputProps,
                min,
                max,
                step: type === 'number' ? 'any' : undefined
            }}
            {...props}
        />
    );
}; 