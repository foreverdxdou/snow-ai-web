'use client';

import React, { useMemo } from 'react';
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Alert,
    Snackbar,
    Stack,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import type { Document } from '@/app/types/document';
import { Pagination } from '@/app/components/common/Pagination';
import { useTranslation } from 'react-i18next';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { PerformanceTable } from '@/app/components/common/PerformanceTable';
import { formatDate, formatFileSize } from '@/app/utils/format';
import { SearchBar } from '@/app/(main)/documents/components/SearchBar';
import { DocumentDialog } from '@/app/(main)/documents/components/DocumentDialog';
import { UploadDialog } from '@/app/(main)/documents/components/UploadDialog';
import { useDocumentActions } from '@/app/(main)/documents/hooks/useDocumentActions';
import { useDocumentData } from '@/app/(main)/documents/hooks/useDocumentData';
import { useRouter } from 'next/navigation';

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
        error,
        total,
        params,
        setParams,
        refresh,
        categories,
        tags,
        knowledgeBases,
    } = useDocumentData();

    // 使用自定义 Hook 管理文档操作
    const {
        handleDelete,
        handleOpen,
        handleClose,
        handleSubmit,
        handleDownload,
        handleUpload,
        open,
        editingDocument,
        formData,
        setFormData,
        uploadOpen,
        setUploadOpen,
        file,
        setFile,
        uploadLoading,
        selectedKbId,
        setSelectedKbId,
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
            key: 'fileType' as keyof Document,
            title: t('documents.fileType'),
            render: (_: any, record: Document) => record?.fileType || '-'
        },
        {
            key: 'createTime' as keyof Document,
            title: t('common.createTime'),
            render: (_: any, record: Document) => record?.createTime ? formatDate(record.createTime) : '-'
        },
        {
            key: 'updateTime' as keyof Document,
            title: t('common.updateTime'),
            render: (_: any, record: Document) => record?.updateTime ? formatDate(record.updateTime) : '-'
        },
        {
            key: 'id' as keyof Document,
            title: t('common.actions'),
            width: 120,
            render: (_: any, record: Document) => record && (
                <Stack direction="row" spacing={1}>
                    <Tooltip title={t('common.detail')}>
                        <IconButton 
                            size="small" 
                            onClick={() => router.push(`/documents/${record.id}`)}
                            color="primary"
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.edit')}>
                        <IconButton 
                            size="small" 
                            onClick={() => handleOpen(record)}
                            color="primary"
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                        <IconButton 
                            size="small" 
                            onClick={() => handleDelete(record.id)}
                            color="error"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )
        }
    ], [t, handleOpen, handleDelete, router]);

    return (
        <PerformanceLayout>
            <Box 
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: 'background.default'
                }}
            >
                {/* 搜索栏组件 */}
                <SearchBar 
                    params={params as SearchParams}
                    setParams={setParams}
                    refresh={refresh}
                    onUploadClick={() => setUploadOpen(true)}
                    categories={categories}
                    knowledgeBases={knowledgeBases}
                />

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
                            current={parseInt(String(params.current))}
                            pageSize={parseInt(String(params.size))}
                            total={total}
                            onChange={(page, pageSize) => {
                                setParams((prev: SearchParams) => ({
                                    ...prev,
                                    current: parseInt(String(page)),
                                    size: parseInt(String(pageSize)),
                                }));
                            }}
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
                    categories={categories}
                    tags={tags}
                />

                {/* 文档上传对话框 */}
                <UploadDialog
                    open={uploadOpen}
                    onClose={() => setUploadOpen(false)}
                    file={file}
                    setFile={setFile}
                    uploadLoading={uploadLoading}
                    selectedKbId={selectedKbId}
                    setSelectedKbId={setSelectedKbId}
                    onUpload={handleUpload}
                    knowledgeBases={knowledgeBases}
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
            </Box>
        </PerformanceLayout>
    );
} 