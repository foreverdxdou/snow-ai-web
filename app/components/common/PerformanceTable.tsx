'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
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
        key: keyof T;
        title: string;
        width?: number;
        render?: (value: any, record: T) => React.ReactNode;
    }[];
    loading?: boolean;
    emptyMessage?: string;
    rowHeight?: number;
    overscan?: number;
    sx?: any;
}

export function PerformanceTable<T>({
    data,
    columns,
    loading = false,
    emptyMessage = '暂无数据',
    rowHeight = 48,
    overscan = 10,
    sx,
}: PerformanceTableProps<T>) {
    const [tableHeight, setTableHeight] = useState(600);

    useEffect(() => {
        // 在客户端计算表格高度
        const calculateHeight = () => {
            if (typeof window !== 'undefined') {
                setTableHeight(Math.min(600, window.innerHeight - 300));
            }
        };

        calculateHeight();
        window.addEventListener('resize', calculateHeight);
        return () => window.removeEventListener('resize', calculateHeight);
    }, []);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => document.getElementById('table-container'),
        estimateSize: () => rowHeight,
        overscan,
    });

    const paddingTop = rowVirtualizer.getVirtualItems()[0]?.start || 0;
    const paddingBottom = rowVirtualizer.getTotalSize() - (paddingTop + rowVirtualizer.getVirtualItems().length * rowHeight);

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
        <Paper 
            id="table-container" 
            sx={{ 
                height: tableHeight, 
                overflow: 'auto',
                position: 'relative',
                ...sx,
            }}
        >
            <Table stickyHeader sx={{ borderCollapse: 'separate' }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell 
                                key={String(column.key)}
                                sx={{ 
                                    width: column.width,
                                    backgroundColor: 'background.paper',
                                }}
                            >
                                {column.title}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paddingTop > 0 && (
                        <TableRow>
                            <TableCell style={{ height: paddingTop }} colSpan={columns.length} />
                        </TableRow>
                    )}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = data[virtualRow.index];
                        return (
                            <TableRow key={virtualRow.index}>
                                {columns.map((column) => (
                                    <TableCell key={String(column.key)}>
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key]?.toString()}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                    {paddingBottom > 0 && (
                        <TableRow>
                            <TableCell style={{ height: paddingBottom }} colSpan={columns.length} />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
} 