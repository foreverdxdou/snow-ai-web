import React, { useCallback } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from '@/app/utils/performance';
import type { SearchParams } from '@/app/(main)/documents/types';
import type { KbCategory } from '@/app/types/category';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import { GradientButton, ResetButton } from '@/app/components/common/CommonButton';

interface SearchBarProps {
    params: SearchParams;
    setParams: (params: SearchParams) => void;
    refresh: () => void;
    onUploadClick: () => void;
    categories: KbCategory[];
    knowledgeBases: KnowledgeBaseVO[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
    params,
    setParams,
    refresh,
    onUploadClick,
    categories,
    knowledgeBases,
}) => {
    const { t } = useTranslation();

    // 使用 useCallback 优化搜索处理
    const handleSearch = useCallback((newParams: Partial<SearchParams>) => {
        setParams({
            ...params,
            ...newParams,
            current: 1, // 搜索条件变化时重置页码
        });
        refresh();
    }, [setParams, params, refresh]);

    // 使用 useDebouncedCallback 优化搜索触发
    const debouncedSearch = useDebouncedCallback(
        (newParams: Partial<SearchParams>) => {
            handleSearch(newParams);
        },
        [handleSearch],
        300
    );

    const handleReset = useCallback(() => {
        handleSearch({
            current: 1,
            title: undefined,
            categoryId: undefined,
            status: undefined,
            kbId: undefined,
        });
    }, [handleSearch]);

    return (
        <Box>
            <Box 
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 2
                }}
            >
                {/* 搜索条件组 */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 2,
                        flex: 1
                    }}
                >
                    <TextField
                        size="small"
                        placeholder={t('documents.searchByName')}
                        value={params.title || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            debouncedSearch({ title: value || undefined });
                        }}
                        sx={{ 
                            width: { xs: '100%', sm: 200 },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper',
                                '&:hover': {
                                    '& > fieldset': {
                                        borderColor: 'primary.main',
                                    }
                                }
                            }
                        }}
                    />
                    <FormControl 
                        size="small" 
                        sx={{ 
                            width: { xs: '100%', sm: 200 },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper'
                            }
                        }}
                    >
                        <InputLabel>{t('documents.searchByCategory')}</InputLabel>
                        <Select
                            value={params.categoryId || ''}
                            label={t('documents.searchByCategory')}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleSearch({
                                    categoryId: value === '' ? undefined : Number(value)
                                });
                            }}
                        >
                            <MenuItem value="">{t('common.all')}</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl 
                        size="small" 
                        sx={{ 
                            width: { xs: '100%', sm: 200 },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper'
                            }
                        }}
                    >
                        <InputLabel>{t('documents.searchByStatus')}</InputLabel>
                        <Select
                            value={params.status === undefined ? '' : params.status}
                            label={t('documents.searchByStatus')}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleSearch({
                                    status: value === '' ? undefined : Number(value)
                                });
                            }}
                        >
                            <MenuItem value="">{t('documents.all')}</MenuItem>
                            <MenuItem value={1}>{t('documents.enabled')}</MenuItem>
                            <MenuItem value={0}>{t('documents.disabled')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl 
                        size="small" 
                        sx={{ 
                            width: { xs: '100%', sm: 200 },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper'
                            }
                        }}
                    >
                        <InputLabel>{t('documents.searchByKb')}</InputLabel>
                        <Select
                            value={params.kbId || ''}
                            label={t('documents.searchByKb')}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleSearch({
                                    kbId: value === '' ? undefined : Number(value)
                                });
                            }}
                        >
                            <MenuItem value="">{t('common.all')}</MenuItem>
                            {knowledgeBases.map((kb) => (
                                <MenuItem key={kb.id} value={kb.id}>
                                    {kb.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <ResetButton
                        variant="outlined"
                        onClick={handleReset}
                        fullWidth
                    >
                        {t('documents.resetButton')}
                    </ResetButton>
                </Box>
                {/* 上传按钮 */}
                <GradientButton
                    startIcon={<UploadIcon />}
                    onClick={onUploadClick}
                    fullWidth
                >
                     {t('documents.uploadDocument')}
                </GradientButton>
            </Box>
        </Box>
    );
}; 