import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebouncedCallback } from '@/app/utils/performance';
import { useRouter, useSearchParams } from 'next/navigation';

interface UsePerformanceDataOptions<T> {
    fetchData: (params: any) => Promise<{
        data: {
            data: {
                records: T[];
                total: number;
            };
        };
    }>;
    defaultParams?: Record<string, any>;
    debounceDelay?: number;
    autoFetch?: boolean;
}

interface UsePerformanceDataResult<T> {
    data: T[];
    loading: boolean;
    error: Error | null;
    total: number;
    params: Record<string, any>;
    setParams: (params: Record<string, any>) => void;
    refresh: () => Promise<void>;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
}

export function usePerformanceData<T>({
    fetchData,
    defaultParams = {},
    debounceDelay = 300,
    autoFetch = true,
}: UsePerformanceDataOptions<T>): UsePerformanceDataResult<T> {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState<Record<string, any>>(() => {
        // 从 URL 参数初始化状态
        const urlParams = Object.fromEntries(searchParams.entries());
        return {
            ...defaultParams,
            ...urlParams,
        };
    });

    // 更新 URL 参数
    const updateUrlParams = useCallback((newParams: Record<string, any>) => {
        const current = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                current.delete(key);
            } else {
                current.set(key, String(value));
            }
        });
        router.push(`?${current.toString()}`);
    }, [router, searchParams]);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchData(params);
            setData(response.data.data.records);
            setTotal(response.data.data.total);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('获取数据失败'));
        } finally {
            setLoading(false);
        }
    }, [fetchData, params]);

    // 使用防抖优化数据获取
    const debouncedFetch = useDebouncedCallback(fetch, [fetch], debounceDelay);

    // 监听参数变化自动获取数据
    useEffect(() => {
        if (autoFetch) {
            debouncedFetch();
        }
        return () => {
            setData([]);
            setTotal(0);
        };
    }, [debouncedFetch, autoFetch]);

    // 刷新数据
    const refresh = useCallback(async () => {
        await fetch();
    }, [fetch]);

    // 更新参数
    const updateParams = useCallback((newParams: Record<string, any>) => {
        setParams(prev => {
            const updatedParams = { ...prev, ...newParams };
            updateUrlParams(updatedParams);
            return updatedParams;
        });
    }, [updateUrlParams]);

    // 计算分页信息
    const pagination = useMemo(() => ({
        current: params.current || 1,
        pageSize: params.size || 10,
        total,
    }), [params.current, params.size, total]);

    return {
        data,
        loading,
        error,
        total,
        params,
        setParams: updateParams,
        refresh,
        pagination,
    };
} 