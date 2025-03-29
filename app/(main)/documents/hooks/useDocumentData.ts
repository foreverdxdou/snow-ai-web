import { useState, useCallback, useEffect } from 'react';
import { usePerformanceData } from '@/app/hooks/usePerformanceData';
import { documentService } from '@/app/services/document';
import { categoryService } from '@/app/services/category';
import { tagService } from '@/app/services/tag';
import { knowledgeService } from '@/app/services/knowledge';
import type { Document } from '@/app/types/document';
import type { KbCategory } from '@/app/types/category';
import type { Tag } from '@/app/types/tag';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import type { SearchParams } from '@/app/(main)/documents/types';

export const useDocumentData = () => {
    const [categories, setCategories] = useState<KbCategory[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseVO[]>([]);

    // 使用 usePerformanceData 优化数据获取
    const {
        data: documents,
        loading,
        error,
        total,
        params,
        setParams,
        refresh,
    } = usePerformanceData<Document>({
        fetchData: documentService.getList,
        defaultParams: {
            current: 1,
            size: 10,
            title: undefined,
            categoryId: undefined,
            status: undefined,
            kbId: undefined,
        } as SearchParams,
        autoFetch: true
    });

    // 使用 useCallback 优化分类和标签数据获取
    const fetchCategories = useCallback(async () => {
        try {
            const response = await categoryService.getList({
                current: 1,
                size: 1000,
            });
            setCategories(response.data.data.records);
        } catch (error) {
            console.error('获取分类列表失败:', error);
        }
    }, []);

    const fetchKnowledgeBases = useCallback(async () => {
        try {
            const response = await knowledgeService.getList({
                current: 1,
                size: 1000,
            });
            setKnowledgeBases(response.data.data.records);
        } catch (error) {
            console.error('获取知识库列表失败:', error);
        }
    }, []);

    const fetchTags = useCallback(async () => {
        try {
            const response = await tagService.getList({
                current: 1,
                size: 1000,
            });
            setTags(response.data.data.records);
        } catch (error) {
            console.error('获取标签列表失败:', error);
        }
    }, []);

    // 使用 useEffect 获取分类、标签和知识库数据
    useEffect(() => {
        fetchCategories();
        fetchTags();
        fetchKnowledgeBases();
    }, [fetchCategories, fetchTags, fetchKnowledgeBases]);

    return {
        documents,
        loading,
        error,
        total,
        params,
        setParams,
        refresh,
        categories,
        tags,
        knowledgeBases,
    };
}; 