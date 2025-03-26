import React from 'react';
import {
    Box,
    Pagination as MuiPagination,
    Select,
    MenuItem,
    Typography,
    useTheme,
    FormControl,
    InputLabel,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface CommonPaginationProps {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    className?: string;
    pageSizeOptions?: string[];
}

export const Pagination: React.FC<CommonPaginationProps> = ({
    current,
    pageSize,
    total,
    onChange,
    className = '',
    pageSizeOptions = ['10', '20', '50', '100'],
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        onChange(page, pageSize);
    };

    const handlePageSizeChange = (event: any) => {
        onChange(1, Number(event.target.value));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 2,
                color: 'text.primary',
            }}
            className={className}
        >
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                {t('common.pagination.total', { total })}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="page-size-select-label">
                    {t('common.pagination.pageSize')}
                </InputLabel>
                <Select
                    labelId="page-size-select-label"
                    value={pageSize.toString()}
                    onChange={handlePageSizeChange}
                    label={t('common.pagination.pageSize')}
                >
                    {pageSizeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {t('common.pagination.itemsPerPage', { count: Number(option) })}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <MuiPagination
                page={current}
                count={Math.ceil(total / pageSize)}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="medium"
                showFirstButton
                showLastButton
                sx={{
                    '& .MuiPaginationItem-root': {
                        color: 'text.primary',
                        '&.Mui-selected': {
                            color: 'primary.contrastText',
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                        },
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                    },
                }}
            />
        </Box>
    );
}; 