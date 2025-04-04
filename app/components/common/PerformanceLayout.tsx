import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface PerformanceLayoutProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

// 默认的加载状态组件
const DefaultFallback = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
        }}
    >
        <CircularProgress />
    </Box>
);

export function PerformanceLayout({
    children,
    fallback = <DefaultFallback />,
}: PerformanceLayoutProps) {
    return (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    );
}

// 创建一个懒加载的组件包装器
export function lazyLoad<T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ReactNode
) {
    return React.lazy(() => importFunc().then(module => ({
        default: (props: React.ComponentProps<T>) => (
            <PerformanceLayout fallback={fallback}>
                <module.default {...props} />
            </PerformanceLayout>
        ),
    })));
} 