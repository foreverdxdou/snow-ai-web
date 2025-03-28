import { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// 创建防抖的useCallback
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    deps: any[],
    delay: number
) => {
    return useCallback(
        debounce((...args: Parameters<T>) => callback(...args), delay),
        deps
    );
};

// 创建节流的useCallback
export const useThrottledCallback = <T extends (...args: any[]) => any>(
    callback: T,
    deps: any[],
    limit: number
) => {
    return useCallback(
        throttle((...args: Parameters<T>) => callback(...args), limit),
        deps
    );
};

// 创建虚拟列表的配置
export const createVirtualListConfig = (itemHeight: number, overscan: number = 5) => {
    return {
        itemHeight,
        overscan,
        getItemSize: () => itemHeight,
    };
};

// 动态导入组件
export const dynamicImport = (importFunc: () => Promise<any>, options = {}) => {
    return dynamic(importFunc, {
        loading: () => React.createElement('div', null, 'Loading...'),
        ssr: false,
        ...options,
    });
};

// 创建记忆化的选择器
export const createMemoizedSelector = <T, R>(
    selector: (state: T) => R,
    deps: any[]
) => {
    return useMemo(() => selector, deps);
}; 