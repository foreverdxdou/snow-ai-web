'use client';

import React, { useMemo, useCallback, useEffect } from 'react';
import {
    Box,
    Tooltip,
    Alert,
    Snackbar,
    Stack,
    Chip,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { DocumentSearchBar } from '@/app/(main)/documents/components/DocumentSearchBar';
import { DocumentSearchParams } from '@/app/types/document';
import { alpha } from '@mui/material/styles';

// 添加标签颜色配置
const tagColors = [
    { bg: '#E3F2FD', text: '#1976D2', border: '#90CAF9' }, // 蓝色
    { bg: '#F3E5F5', text: '#7B1FA2', border: '#CE93D8' }, // 紫色
    { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' }, // 绿色
    { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' }, // 橙色
    { bg: '#FBE9E7', text: '#C62828', border: '#FF8A65' }, // 红色
    { bg: '#E0F7FA', text: '#00838F', border: '#80DEEA' }, // 青色
    { bg: '#F1F8E9', text: '#558B2F', border: '#C5E1A5' }, // 浅绿
    { bg: '#FFF8E1', text: '#F57F17', border: '#FFD54F' }, // 黄色
];

export default function DocumentsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 从 URL 获取 kbId 参数
    const kbId = searchParams.get('kbId');
    
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

    // 使用 useEffect 处理 URL 参数
    useEffect(() => {
        if (kbId) {
                setParams({
                    ...params,
                    kbId: kbId
                });
        }
        return () => {
            setParams({
                current: 1,
                size: 10,
                kbId: undefined,
                categoryId: undefined,
                title: undefined,
            });
        };
    }, [kbId, setParams]);

    // 使用自定义 Hook 管理文档操作
    const {
        handleDelete,
        handleParse,
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
        handleStatusChange,
        deleteDialogOpen,
        setDeleteDialogOpen,
        handleDeleteConfirm,
        parseDialogOpen,
        setParseDialogOpen,
        handleParseConfirm,     
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
                    <Typography variant="body1" sx={{ 
                        fontWeight: 500,
                        mb: 1,
                        background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>
                        {record?.title || '-'}
                    </Typography>
                    {record?.tags && record.tags.length > 0 && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 0.75, 
                            mt: 1,
                            '& .MuiChip-root': {
                                height: 24,
                                borderRadius: '12px',
                                '& .MuiChip-label': {
                                    px: 1.5,
                                    fontSize: '0.75rem',
                                    fontWeight: 500
                                },
                                background: (theme) => `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.1)})`,
                                color: 'primary.main',
                                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    background: (theme) => `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.light, 0.2)})`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                                }
                            }
                        }}>
                            {record.tags.map((tag, index) => {
                                const colorIndex = index % tagColors.length;
                                const color = tagColors[colorIndex];
                                return (
                                    <Chip
                                        key={index}
                                        label={tag.name}
                                        size="small"
                                        sx={{
                                            height: 24,
                                            borderRadius: '12px',
                                            '& .MuiChip-label': {
                                                px: 1.5,
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                color: color.text
                                            },
                                            background: color.bg,
                                            border: `1px solid ${color.border}`,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                background: alpha(color.bg, 0.8),
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 12px ${alpha(color.border, 0.2)}`,
                                                border: `1px solid ${alpha(color.border, 0.8)}`,
                                            }
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    )}
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
                    <Tooltip 
                        title={record.parseStatus === 3 ? (record as any).parseError || '' : ''} 
                        arrow 
                        placement="top"
                    >
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
                    </Tooltip>
                );
            }
        },
        {
            key: 'updateTime' as keyof Document,
            title: t('common.updateTime'),
            render: (_: any, record: Document) => record?.updateTime ? formatDate(record.updateTime) : '-'
        },
        {
            key: 'status' as keyof Document,
            title: t('common.status'),
            render: (_: any, record: Document) => (
                <FormControlLabel
                    control={
                        <Switch
                            checked={record.status === 1}
                            onChange={() => handleStatusChange(record)}
                            color="primary"
                        />
                    }
                    label={record.status === 1 ? t('common.enable') : t('common.disable')}
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem'
                        }
                    }}
                />
            )
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
                        />
                    </Tooltip>
                    <Tooltip title={t('documents.parse')}>
                        <CommonButton
                            buttonVariant="parse"
                            onClick={() => handleParse(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title={t('common.edit')}>
                        <CommonButton
                            buttonVariant="edit"
                            icon
                            onClick={() => handleOpen(Number(record.id))}
                        />
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                        <CommonButton
                            buttonVariant="delete"
                            icon
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Stack>
            )
        }
    ], [t, handleOpen, handleDelete, router, handleStatusChange]);

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
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        overflow: 'auto',
                        '& .MuiPaper-root': {
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                     {/* 搜索栏组件 */}
                    <DocumentSearchBar 
                        params={params as DocumentSearchParams}
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

                {/* 删除确认对话框 */}
                <Dialog 
                    open={deleteDialogOpen} 
                    onClose={() => setDeleteDialogOpen(false)}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle>{t('documents.deleteConfirm')}</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {t('documents.deleteConfirmMessage')}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <CommonButton
                            buttonVariant="cancel"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            {t('common.cancel')}
                        </CommonButton>
                        <CommonButton
                            buttonVariant="confirm"
                            onClick={handleDeleteConfirm}
                        >
                            {t('common.confirm')}
                        </CommonButton>
                    </DialogActions>
                </Dialog>

                {/* 解析确认对话框 */}
                <Dialog 
                    open={parseDialogOpen} 
                    onClose={() => setParseDialogOpen(false)}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle>{t('documents.parseConfirm')}</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {t('documents.parseConfirmMessage')}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <CommonButton
                            buttonVariant="cancel"
                            onClick={() => setParseDialogOpen(false)}
                        >
                            {t('common.cancel')}
                        </CommonButton>
                        <CommonButton
                            buttonVariant="confirm"
                            onClick={handleParseConfirm}
                        >
                            {t('common.confirm')}
                        </CommonButton>
                    </DialogActions>
                </Dialog>

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