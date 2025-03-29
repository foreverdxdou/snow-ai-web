import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { Upload as UploadIcon, Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from '@/app/utils/performance';
import type { SearchParams } from '@/app/(main)/documents/types';
import type { KbCategory } from '@/app/types/category';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import { CommonButton, ResetButton } from '@/app/components/common/CommonButton';
import { CommonSelect } from '@/app/components/common/CommonSelect';
import { CommonInput } from '@/app/components/common/CommonInput';
import { SearchBar } from '@/app/components/common/SearchBar';

interface DocumentSearchBarProps {
    params: SearchParams;
    setParams: (params: SearchParams) => void;
    refresh: () => void;
    onUploadClick: () => void;
    categories: KbCategory[];
    knowledgeBases: KnowledgeBaseVO[];
}

export const DocumentSearchBar: React.FC<DocumentSearchBarProps> = ({
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
        <SearchBar>
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
                <CommonInput
                    placeholder={t('documents.searchByName')}
                    value={params.title || ''}
                    onChange={(value) => debouncedSearch({ title: value || undefined })}
                />

                <CommonSelect
                    label={t('documents.searchByCategory')}
                    value={params.categoryId}
                    options={categories.map(cat => ({ id: cat.id, name: cat.name }))}
                    onChange={(value) => handleSearch({ categoryId: value as number })}
                />

                <CommonSelect
                    label={t('documents.searchByStatus')}
                    value={params.status}
                    options={[
                        { id: 1, name: t('documents.enabled') },
                        { id: 0, name: t('documents.disabled') }
                    ]}
                    onChange={(value) => handleSearch({ status: value as number })}
                />

                <CommonSelect
                    label={t('documents.searchByKb')}
                    value={params.kbId}
                    options={knowledgeBases.map(kb => ({ 
                        id: kb.id, 
                        name: kb.name,
                        description: kb.description 
                    }))}
                    onChange={(value) => handleSearch({ kbId: value as number })}
                    showDescription
                    sx={{ width: { xs: '100%', sm: 200 } }}
                />

                <CommonButton
                    buttonVariant="search"
                    startIcon={<SearchIcon />}
                    onClick={() => handleSearch({})}
                >
                    {t('common.search')}
                </CommonButton>

                <ResetButton
                    variant="outlined"
                    onClick={handleReset}
                >
                    {t('documents.resetButton')}
                </ResetButton>
            </Box>

            {/* 上传按钮 */}
            <CommonButton
                buttonVariant="upload"
                startIcon={<UploadIcon />}
                onClick={onUploadClick}
            >
                {t('documents.uploadDocument')}
            </CommonButton>
        </SearchBar>
    );
}; 