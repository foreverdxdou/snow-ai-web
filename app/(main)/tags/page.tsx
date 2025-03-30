'use client';

import React, { useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tooltip,
    Alert,
    Snackbar,
    CircularProgress,
    Stack,
} from '@mui/material';
import { tagService } from '@/app/services/tag';
import type { Tag, TagCreateDTO } from '@/app/types/tag';
import { useTranslation } from 'react-i18next';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { PerformanceTable } from '@/app/components/common/PerformanceTable';
import { usePerformanceData } from '@/app/hooks/usePerformanceData';
import { useDebouncedCallback } from '@/app/utils/performance';
import { Pagination } from '@/app/components/common/Pagination';
import { formatDate } from '@/app/utils/format';
import { CommonButton } from '@/app/components/common/CommonButton';

export default function TagsPage() {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [editingTag, setEditingTag] = React.useState<Tag | null>(null);
    const [formData, setFormData] = React.useState<TagCreateDTO>({
        name: ''
    });

    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 使用 useMemo 优化 defaultParams
    const defaultParams = useMemo(() => ({
        current: 1,
        size: 10,
    }), []);

    // 使用 usePerformanceData 优化数据获取
    const {
        data: tags,
        loading,
        error,
        total,
        params,
        setParams,
        refresh,
    } = usePerformanceData<Tag>({
        fetchData: tagService.getList,
        defaultParams,
        autoFetch: true
    });

    // 使用 useCallback 优化事件处理函数
    const handleOpen = useCallback((tag?: Tag) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({
                name: tag.name
            });
        } else {
            setEditingTag(null);
            setFormData({
                name: ''
            });
        }
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        setEditingTag(null);
        setFormData({
            name: ''
        });
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            if (editingTag) {
                await tagService.update(editingTag.id, formData);
                setSnackbar({
                    open: true,
                    message: t('tags.updateSuccess'),
                    severity: 'success',
                });
            } else {
                await tagService.create(formData);
                setSnackbar({
                    open: true,
                    message: t('tags.createSuccess'),
                    severity: 'success',
                });
            }
            handleClose();
            refresh();
        } catch (error) {
            console.error(`${editingTag ? '更新' : '创建'}标签失败:`, error);
            setSnackbar({
                open: true,
                message: editingTag ? t('tags.updateError') : t('tags.createError'),
                severity: 'error',
            });
        }
    }, [editingTag, formData, handleClose, refresh, t]);

    const handleDelete = useCallback(async (id: number) => {
        if (!window.confirm(t('tags.deleteConfirm'))) return;
        try {
            await tagService.delete(id);
            setSnackbar({
                open: true,
                message: t('tags.deleteSuccess'),
                severity: 'success',
            });
            refresh();
        } catch (error) {
            console.error('删除标签失败:', error);
            setSnackbar({
                open: true,
                message: t('tags.deleteError'),
                severity: 'error',
            });
        }
    }, [refresh, t]);

    // 使用 useDebouncedCallback 优化分页处理
    const handlePageChange = useDebouncedCallback((page: number, size: number) => {
        setParams((prev: { current: number; size: number }) => ({
            ...prev,
            current: page,
            size: size,
        }));
    }, [], 300);

    // 使用 useMemo 优化表格配置
    const columns = useMemo(() => [
        {
            key: 'name' as keyof Tag,
            title: t('common.name'),
            render: (_: any, record: Tag) => record?.name || '-'
        },
        {
            key: 'creatorName' as keyof Tag,
            title: t('common.creator'),
            render: (_: any, record: Tag) => record?.creatorName || '-'
        },
        {
            key: 'createTime' as keyof Tag,
            title: t('common.createTime'),
            render: (_: any, record: Tag) => record?.createTime ? formatDate(record.createTime) : '-'
        },
        {
            key: 'updateTime' as keyof Tag,
            title: t('common.updateTime'),
            render: (_: any, record: Tag) => record?.updateTime ? formatDate(record.updateTime) : '-'
        },
        {
            key: 'id' as keyof Tag,
            title: t('common.actions'),
            width: 120,
            render: (_: any, record: Tag) => record && (
                <Stack direction="row" spacing={1}>
                    <Tooltip title={t('common.edit')}>
                        <CommonButton
                            buttonVariant="edit"
                            onClick={() => handleOpen(record)}
                        />
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                        <CommonButton
                            buttonVariant="delete"
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Stack>
            )
        }
    ], [t, handleOpen, handleDelete]);

    return (
        <PerformanceLayout>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    p: 3,

                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}>
          
                        <CommonButton
                            buttonVariant="add"
                            onClick={() => handleOpen()}
                            sx={{
                                marginLeft: 'auto',
                            }}
                        >
                            {t('tags.createTag')}
                        </CommonButton>
                    </Box>
                    <PerformanceTable
                        loading={loading}
                        data={tags}
                        columns={columns}
                        emptyMessage={t('common.noData')}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Pagination
                            total={total}
                            current={params.current}
                            pageSize={params.size}
                            onChange={handlePageChange}
                        />
                    </Box>
                </Box>

              

                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingTag ? t('tags.editTag') : t('tags.createTag')}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label={t('common.name')}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                error={!formData.name}
                                helperText={!formData.name ? t('tags.nameRequired') : ''}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <CommonButton
                            buttonVariant="cancel"
                            onClick={handleClose}
                        >
                            {t('common.cancel')}
                        </CommonButton>
                        <CommonButton
                            buttonVariant="submit"
                            onClick={handleSubmit}
                            disabled={!formData.name}
                        >
                            {t('common.save')}
                        </CommonButton>
                    </DialogActions>
                </Dialog>

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