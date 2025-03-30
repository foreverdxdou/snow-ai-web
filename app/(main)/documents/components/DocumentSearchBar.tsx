import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { KbCategory } from '@/app/types/category';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import type { SearchParams } from '@/app/(main)/documents/types';
import { SearchBar } from '@/app/components/common/SearchBar';
import { CommonInput } from '@/app/components/common/CommonInput';
import { CommonSelect } from '@/app/components/common/CommonSelect';
import { CommonButton } from '@/app/components/common/CommonButton';

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
    const [searchName, setSearchName] = useState(params.title || '');

    // 处理搜索名称变化
    const handleSearchNameChange = useCallback((value: string) => {
        setSearchName(value);
        setParams({
            ...params,
            current: 1,
            title: value || undefined,
        });
    }, [params, setParams]);

    // 处理分类变化
    const handleCategoryChange = useCallback((value: string | number) => {
        setParams({
            ...params,
            current: 1,
            categoryId: value as number || undefined,
        });
    }, [params, setParams]);

    // 处理知识库变化
    const handleKbChange = useCallback((value: string | number) => {
        setParams({
            ...params,
            current: 1,
            kbId: value as number || undefined,
        });
    }, [params, setParams]);

    // 处理状态变化
    const handleStatusChange = useCallback((value: string | number) => {
        setParams({
            ...params,
            current: 1,
            status: value as number || undefined,
        });
    }, [params, setParams]);

    // 处理重置
    const handleReset = useCallback(() => {
        setSearchName('');
        setParams({
            current: 1,
            size: params.size,
            title: undefined,
            categoryId: undefined,
            kbId: undefined,
            status: undefined,
        });
    }, [params.size, setParams]);

    return (
        <SearchBar>
            <CommonInput
                placeholder={t('documents.searchByName')}
                value={searchName}
                onChange={handleSearchNameChange}
            />

            <CommonSelect
                label={t('documents.searchByCategory')}
                value={params.categoryId}
                onChange={handleCategoryChange}
                options={categories.map(cat => ({ id: cat.id, name: cat.name }))}
            />

            <CommonSelect
                label={t('documents.searchByKb')}
                value={params.kbId}
                onChange={handleKbChange}
                options={knowledgeBases.map(kb => ({ id: kb.id, name: kb.name }))}
                showDescription
            />

            <CommonSelect
                label={t('documents.searchByStatus')}
                value={params.status}
                onChange={handleStatusChange}
                options={[
                    { id: 1, name: t('documents.enabled') },
                    { id: 0, name: t('documents.disabled') }
                ]}
            />


            <CommonButton
                buttonVariant="reset"
                onClick={handleReset}
            >
                {t('documents.resetButton')}
            </CommonButton>

            <CommonButton
                buttonVariant="upload"
                onClick={onUploadClick}
            >
                {t('documents.uploadDocument')}
            </CommonButton>
        </SearchBar>
    );
}; 