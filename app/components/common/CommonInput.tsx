import React, { useState, useEffect } from 'react';
import { 
    TextField, 
    TextFieldProps,
    styled,
    alpha,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// 基础输入框样式
const BaseInput = styled(TextField)(({ theme }) => ({
    minWidth: '120px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
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
        borderColor: alpha(theme.palette.divider, 0.5),
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
    isPassword?: boolean;
}

export const CommonInput: React.FC<CommonInputProps> = ({
    value,
    onChange,
    debounceTime = 300,
    min,
    max,
    isPassword = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    // 当外部 value 变化时更新内部状态
    useEffect(() => {
        setLocalValue(value);
        return () => {
            setLocalValue('');
        };
    }, [value]);

    // 处理输入变化
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setLocalValue(newValue);
        onChange?.(newValue);
    };

    // 处理失去焦点
    const handleBlur = () => {
        if (onChange && localValue !== value) {
            if (typeof value === 'number') {
                const numValue = Number(localValue);
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
                onChange(localValue as string);
            }
        }
    };

    // 处理回车键
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.currentTarget.blur();
        }
        
        // 数字类型输入限制
        if (typeof value === 'number') {
            // 允许的按键：数字、小数点、负号、退格键、删除键、方向键
            const allowedKeys = [
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                '.', '-', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                'ArrowUp', 'ArrowDown'
            ];
            
            if (!allowedKeys.includes(event.key)) {
                event.preventDefault();
            }
            
            // 处理上下键
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                const currentValue = Number(localValue) || 0;
                const newValue = Math.min(currentValue + 1, max ?? Infinity);
                setLocalValue(newValue.toString());
                onChange?.(newValue);
            }
            
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const currentValue = Number(localValue) || 0;
                const newValue = Math.max(currentValue - 1, min ?? -Infinity);
                setLocalValue(newValue.toString());
                onChange?.(newValue);
            }
        }
    };

    return (
        <BaseInput
            {...props}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            type={isPassword && !showPassword ? 'password' : 'text'}
            inputProps={{
                ...props.inputProps,
                autoComplete: 'new-password',
                autoFill: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: 'false',
                'data-lpignore': 'true',
                'data-form-type': 'other',
                min,
                max,
                step: typeof value === 'number' ? 'any' : undefined
            }}
            InputProps={{
                ...props.InputProps,
                endAdornment: isPassword ? (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ) : props.InputProps?.endAdornment,
            }}
        />
    );
}; 