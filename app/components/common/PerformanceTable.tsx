import React, { useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
} from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';

interface PerformanceTableProps<T> {
    data: T[];
    columns: {
        key: string;
        header: string;
        render: (item: T) => React.ReactNode;
    }[];
    loading?: boolean;
    emptyMessage?: string;
    rowHeight?: number;
    overscan?: number;
}

export function PerformanceTable<T extends { id: number | string }>({
    data,
    columns,
    loading = false,
    emptyMessage = '暂无数据',
    rowHeight = 53,
    overscan = 5,
}: PerformanceTableProps<T>) {
    const tableHeight = useMemo(() => {
        return Math.min(600, window.innerHeight - 300);
    }, []);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => document.querySelector('.MuiTableBody-root'),
        estimateSize: () => rowHeight,
        overscan,
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (data.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                {emptyMessage}
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ height: tableHeight }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.key}>{column.header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const item = data[virtualItem.index];
                        return (
                            <TableRow
                                key={item.id}
                                style={{
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {column.render(item)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
} 