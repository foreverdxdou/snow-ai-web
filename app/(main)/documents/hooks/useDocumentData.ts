import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { Document } from '@/app/types/document';
import { KbCategory } from '@/app/types/category';
import { Tag } from '@/app/types/tag';
import { KnowledgeBaseVO } from '@/app/types/knowledge';
import { knowledgeService } from '@/app/services/knowledge';
import { tagService } from '@/app/services/tag';
import { categoryService } from '@/app/services/category';
import debounce from 'lodash/debounce';
import { documentService } from '@/app/services/document';

interface SearchParams {
    current: number;
    size: number;
    title?: string;
    categoryId?: number;
    kbId?: number;
    status?: number;
}

export function useDocumentData() {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState<KbCategory[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseVO[]>([]);
    const [params, setParams] = useState<SearchParams>({
        current: 1,
        size: 10,
        title: undefined,
        categoryId: undefined,
        kbId: undefined,
        status: undefined
    });

    // 获取分类列表
    const fetchCategories = useCallback(async () => {
        try {
            const response = await categoryService.getList({
                current: 1,
                size: 1000,
            });
            setCategories(response.data.data.records);
        } catch (error) {
            console.error('获取分类列表失败:', error);
            showSnackbar(t('category.fetchError'), 'error');
        }
    }, [t, showSnackbar]);

    // 获取标签列表
    const fetchTags = useCallback(async () => {
        try {
            const response = await tagService.getList({
                current: 1,
                size: 1000,
            });
            setTags(response.data.data.records);
        } catch (error) {
            console.error('获取标签列表失败:', error);
            showSnackbar(t('tags.fetchError'), 'error');
        }
    }, [t, showSnackbar]);

    // 获取知识库列表
    const fetchKnowledgeBases = useCallback(async () => {
        try {
            const response = await knowledgeService.getList({
                current: 1,
                size: 1000,
            });
            setKnowledgeBases(response.data.data.records);
        } catch (error) {
            console.error('获取知识库列表失败:', error);
            showSnackbar(t('knowledge.fetchError'), 'error');
        }
    }, [t, showSnackbar]);

    // 获取文档列表
    const fetchDocuments = useCallback(async (searchParams: SearchParams) => {
        setLoading(true);
        try {
            const response = await documentService.getList(searchParams);
            setDocuments(response.data.data.records);
            setTotal(response.data.data.total);
        } catch (error) {
            console.error('获取文档列表失败:', error);
            showSnackbar(t('documents.fetchError'), 'error');
        } finally {
            setLoading(false);
        }
    }, [t, showSnackbar]);

    // 使用 useCallback 和 debounce 优化搜索函数
    const debouncedSearch = useCallback(
        debounce((searchParams: SearchParams) => {
            fetchDocuments(searchParams);
        }, 500),
        [fetchDocuments]
    );

    // 监听搜索参数变化
    useEffect(() => {
        debouncedSearch(params);
        return () => {
            debouncedSearch.cancel();
        };
    }, [params, debouncedSearch]);

    // 初始化加载
    useEffect(() => {
        fetchCategories();
        fetchTags();
        fetchKnowledgeBases();
    }, [fetchCategories, fetchTags, fetchKnowledgeBases]);

    // 刷新数据
    const refresh = useCallback(() => {
        fetchDocuments(params);
    }, [params, fetchDocuments]);

    return {
        documents,
        loading,
        total,
        params,
        setParams,
        refresh,
        categories,
        tags,
        knowledgeBases,
    };
} 