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

}));

// 下拉菜单样式
const StyledMenu = styled(MenuItem)(({ theme }) => ({

}));

interface CommonSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
    value?: string | number;
    onChange?: (value: string | number) => void;
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
    formControlSx?: SxProps<Theme>;
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
    formControlSx = { width: { xs: '100%', sm: 200 } },
    ...props
}) => {
    const { t } = useTranslation();
    const handleChange = (event: any) => {
        onChange?.(event.target.value as string | number);
    };

    return (
        <FormControl 
            size="small"
            sx={{ ...formControlSx }}
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