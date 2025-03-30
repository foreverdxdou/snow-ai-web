'use client';

import React, { useMemo, useCallback } from 'react';
import {
    Box,
    Tooltip,
    Alert,
    Snackbar,
    Stack,
    Typography,
    Chip,
} from '@mui/material';
import type { Document } from '@/app/types/document';
import { Pagination } from '@/app/components/common/Pagination';
import { useTranslation } from 'react-i18next';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { PerformanceTable } from '@/app/components/common/PerformanceTable';
import { formatDate, formatFileSize } from '@/app/utils/format';
import { CommonButton} from '@/app/components/common/CommonButton';
import { DocumentDialog } from '@/app/(main)/documents/components/DocumentDialog';
import { UploadDialog } from '@/app/(main)/documents/components/UploadDialog';
import { useDocumentActions } from '@/app/(main)/documents/hooks/useDocumentActions';
import { useDocumentData } from '@/app/(main)/documents/hooks/useDocumentData';
import { useRouter } from 'next/navigation';
import { DocumentSearchBar } from '@/app/(main)/documents/components/DocumentSearchBar';

// 定义搜索参数类型
interface SearchParams { 
    kbId?: number; 
    categoryId?: number;
    current: number; 
    size: number;
    title?: string;
    status?: number;
}

export default function DocumentsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    
    // 使用自定义 Hook 管理文档数据
    const {
        documents,
        loading,
        total,
        params,
        setParams,
        refresh,
        categories,
        knowledgeBases,
    } = useDocumentData();

    // 使用自定义 Hook 管理文档操作
    const {
        handleDelete,
        handleOpen,
        handleClose,
        handleSubmit,
        open,
        editingDocument,
        formData,
        setFormData,
        uploadOpen,
        setUploadOpen,
        snackbar,
        setSnackbar,
    } = useDocumentActions(refresh);

    // 使用 useMemo 优化表格配置
    const columns = useMemo(() => [
        {
            key: 'title' as keyof Document,
            title: t('common.name'),
            render: (_: any, record: Document) => (
                <Box 
                    sx={{ 
                        cursor: 'pointer',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={async () => {
                        try {
                            const response = await fetch(record.fileUrl || '');
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = record.title;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                        } catch (error) {
                            console.error('Download failed:', error);
                        }
                    }}
                >
                    {record?.title || '-'}
                </Box>
            )
        },
        {
            key: 'kbName' as keyof Document,
            title: t('documents.kbName'),
            render: (_: any, record: Document) => record?.kbName || '-'
        },
        {
            key: 'categoryName' as keyof Document,
            title: t('documents.category'),
            render: (_: any, record: Document) => record?.categoryName || '-'
        },
        {
            key: 'tags' as keyof Document,
            title: t('documents.tags'),
            render: (_: any, record: Document) => record?.tags?.map(tag => tag.name).join(', ') || '-'
        },
        {
            key: 'fileSize' as keyof Document,
            title: t('documents.fileSize'),
            render: (_: any, record: Document) => record?.fileSize ? formatFileSize(record.fileSize) : '-'
        },
        {
            key: 'parseStatus' as keyof Document,
            title: t('documents.parseStatus.title'),
            render: (_: any, record: Document) => {
                const getStatusColor = () => {
                    switch (record.parseStatus) {
                        case 0:
                            return 'default'; // 未解析 - 灰色
                        case 1:
                            return 'info';    // 解析中 - 蓝色
                        case 2:
                            return 'success'; // 解析成功 - 绿色
                        case 3:
                            return 'error';   // 解析失败 - 红色
                        default:
                            return 'default';
                    }
                };

                const getStatusText = () => {
                    switch (record.parseStatus) {
                        case 0:
                            return t('documents.parseStatus.unparsed');
                        case 1:
                            return t('documents.parseStatus.parsing');
                        case 2:
                            return t('documents.parseStatus.success');
                        case 3:
                            return t('documents.parseStatus.failed');
                        default:
                            return '-';
                    }
                };

                return (
                    <Chip
                        label={getStatusText()}
                        color={getStatusColor() as any}
                        size="small"
                        sx={{
                            minWidth: 90,
                            '& .MuiChip-label': {
                                px: 1,
                                fontSize: '0.875rem'
                            }
                        }}
                    />
                );
            }
        },
        {
            key: 'updateTime' as keyof Document,
            title: t('common.updateTime'),
            render: (_: any, record: Document) => record?.updateTime ? formatDate(record.updateTime) : '-'
        },
        {
            key: 'id' as keyof Document,
            title: t('common.actions'),
            render: (_: any, record: Document) => record && (
                <Stack direction="row" spacing={1}>
                    <Tooltip title={t('common.detail')}>
                        <CommonButton
                            buttonVariant="detail"
                            onClick={() => router.push(`/documents/${record.id}`)}
                        >
                        </CommonButton>
                    </Tooltip>
                    <Tooltip title={t('common.edit')}>
                        <CommonButton
                            buttonVariant="edit"
                            onClick={() => handleOpen(record)}
                        >
                        </CommonButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                        <CommonButton
                            buttonVariant="delete"
                            onClick={() => handleDelete(record.id)}
                        >
                        </CommonButton>
                    </Tooltip>
                </Stack>
            )
        }
    ], [t, handleOpen, handleDelete, router]);

    // 处理分页变化
    const handlePageChange = useCallback((page: number, pageSize: number) => {
        setParams({
            ...params,
            current: Number(page),
            size: Number(pageSize),
        });
    }, [params, setParams]);

    return (
        <PerformanceLayout>
          
               
                {/* 表格内容区域 */}
                <Box 
                    sx={{ 
                        p: 3, 
                        flex: 1, 
                        overflow: 'auto',
                        '& .MuiPaper-root': {
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                     {/* 搜索栏组件 */}
                    <DocumentSearchBar 
                        params={params as SearchParams}
                        setParams={setParams}
                        refresh={refresh}
                        onUploadClick={() => setUploadOpen(true)}
                        categories={categories}
                        knowledgeBases={knowledgeBases}
                    />

                    <PerformanceTable
                        loading={loading}
                        data={documents}
                        columns={columns}
                        emptyMessage={t('common.noData')}
                    />

                    <Box 
                        sx={{ 
                            mt: 2, 
                            display: 'flex', 
                            justifyContent: 'flex-end',
                            '& .MuiPaginationItem-root': {
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
                                    }
                                }
                            }
                        }}
                    >
                        <Pagination
                            current={Number(params.current)}
                            pageSize={Number(params.size)}
                            total={total}
                            onChange={handlePageChange}
                        />
                    </Box>
                </Box>

                {/* 文档编辑对话框 */}
                <DocumentDialog
                    open={open}
                    onClose={handleClose}
                    editingDocument={editingDocument}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                />

                {/* 文档上传对话框 */}
                <UploadDialog
                    open={uploadOpen}
                    onClose={() => setUploadOpen(false)}
                />

                {/* 提示消息 */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
        </PerformanceLayout>
    );
} 