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
    Stack,
} from '@mui/material';
import { SystemConfig, SystemConfigQuery, SystemConfigSaveRequest } from '@/app/types/system-config';
import { systemConfigService } from '@/app/services/system-config';
import { useTranslation } from 'react-i18next';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { PerformanceTable } from '@/app/components/common/PerformanceTable';
import { usePerformanceData } from '@/app/hooks/usePerformanceData';
import { useDebouncedCallback } from '@/app/utils/performance';
import { Pagination } from '@/app/components/common/Pagination';
import { formatDate } from '@/app/utils/format';
import { CommonButton } from '@/app/components/common/CommonButton';

export default function SystemConfigPage() {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [editingConfig, setEditingConfig] = React.useState<SystemConfig | null>(null);
    const [formData, setFormData] = React.useState<SystemConfigSaveRequest>({
        configKey: '',
        configValue: '',
        description: '',
        configType: '',
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
        configKey: '',
        configType: '',
    }), []);

    // 使用 usePerformanceData 优化数据获取
    const {
        data: configs,
        loading,
        error,
        total,
        params,
        setParams,
        refresh,
    } = usePerformanceData<SystemConfig>({
        fetchData: systemConfigService.getList,
        defaultParams,
        autoFetch: true
    });

    // 使用 useCallback 优化事件处理函数
    const handleOpen = useCallback((config?: SystemConfig) => {
        if (config) {
            setEditingConfig(config);
            setFormData({
                id: config.id,
                configKey: config.configKey,
                configValue: config.configValue,
                description: config.description,
                configType: config.configType,
            });
        } else {
            setEditingConfig(null);
            setFormData({
                configKey: '',
                configValue: '',
                description: '',
                configType: '',
            });
        }
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        setEditingConfig(null);
        setFormData({
            configKey: '',
            configValue: '',
            description: '',
            configType: '',
        });
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            if (editingConfig) {
                await systemConfigService.update(editingConfig.id, formData);
                setSnackbar({
                    open: true,
                    message: t('systemConfig.operateSuccess'),
                    severity: 'success',
                });
            } else {
                await systemConfigService.add(formData);
                setSnackbar({
                    open: true,
                    message: t('systemConfig.operateSuccess'),
                    severity: 'success',
                });
            }
            handleClose();
            refresh();
        } catch (error) {
            console.error(`${editingConfig ? '更新' : '创建'}配置失败:`, error);
            setSnackbar({
                open: true,
                message: t('systemConfig.operateError'),
                severity: 'error',
            });
        }
    }, [editingConfig, formData, handleClose, refresh, t]);

    const handleDelete = useCallback(async (id: number) => {
        if (!window.confirm(t('systemConfig.deleteConfirm'))) return;
        try {
            await systemConfigService.delete(id);
            setSnackbar({
                open: true,
                message: t('systemConfig.operateSuccess'),
                severity: 'success',
            });
            refresh();
        } catch (error) {
            console.error('删除配置失败:', error);
            setSnackbar({
                open: true,
                message: t('systemConfig.operateError'),
                severity: 'error',
            });
        }
    }, [refresh, t]);

    // 使用 useDebouncedCallback 优化分页处理
    const handlePageChange = useDebouncedCallback((page: number, size: number) => {
        setParams((prev: { current: number; size: number; configKey?: string; configType?: string }) => ({
            ...prev,
            current: page,
            size: size,
        }));
    }, [], 300);

    // 使用 useMemo 优化表格配置
    const columns = useMemo(() => [
        {
            key: 'configKey' as keyof SystemConfig,
            title: t('systemConfig.configKey'),
            render: (_: any, record: SystemConfig) => record?.configKey || '-'
        },
        {
            key: 'configType' as keyof SystemConfig,
            title: t('systemConfig.configType'),
            render: (_: any, record: SystemConfig) => record?.configType || '-'
        },
        {
            key: 'configValue' as keyof SystemConfig,
            title: t('systemConfig.configValue'),
            render: (_: any, record: SystemConfig) => record?.configValue || '-'
        },
        {
            key: 'description' as keyof SystemConfig,
            title: t('systemConfig.description'),
            render: (_: any, record: SystemConfig) => record?.description || '-'
        },
        {
            key: 'createTime' as keyof SystemConfig,
            title: t('common.createTime'),
            render: (_: any, record: SystemConfig) => record?.createTime ? formatDate(record.createTime) : '-'
        },
        {
            key: 'updateTime' as keyof SystemConfig,
            title: t('common.updateTime'),
            render: (_: any, record: SystemConfig) => record?.updateTime ? formatDate(record.updateTime) : '-'
        },
        {
            key: 'id' as keyof SystemConfig,
            title: t('common.actions'),
            width: 120,
            render: (_: any, record: SystemConfig) => record && (
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
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {t('systemConfig.title')}
                        </Typography>
                        <CommonButton
                            buttonVariant="add"
                            onClick={() => handleOpen()}
                        >
                            {t('systemConfig.add')}
                        </CommonButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            size="small"
                            label={t('systemConfig.configKey')}
                            value={params.configKey || ''}
                            onChange={(e) => setParams((prev) => ({ ...prev, configKey: e.target.value }))}
                            sx={{ width: 200 }}
                        />
                        <TextField
                            size="small"
                            label={t('systemConfig.configType')}
                            value={params.configType || ''}
                            onChange={(e) => setParams((prev) => ({ ...prev, configType: e.target.value }))}
                            sx={{ width: 200 }}
                        />
                        <CommonButton
                            buttonVariant="search"
                            onClick={() => refresh()}
                        >
                            {t('systemConfig.search')}
                        </CommonButton>
                        <CommonButton
                            buttonVariant="reset"
                            onClick={() => {
                                setParams(defaultParams);
                                refresh();
                            }}
                        >
                            {t('systemConfig.reset')}
                        </CommonButton>
                    </Box>
                </Box>

                <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                    <PerformanceTable
                        loading={loading}
                        data={configs}
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
                        {editingConfig ? t('systemConfig.edit') : t('systemConfig.add')}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                            <TextField
                                label={t('systemConfig.configKey')}
                                value={formData.configKey}
                                onChange={(e) => setFormData({ ...formData, configKey: e.target.value })}
                                fullWidth
                                required
                                error={!formData.configKey}
                                helperText={!formData.configKey ? t('systemConfig.pleaseEnterConfigKey') : ''}
                            />
                            <TextField
                                label={t('systemConfig.configType')}
                                value={formData.configType}
                                onChange={(e) => setFormData({ ...formData, configType: e.target.value })}
                                fullWidth
                                required
                                error={!formData.configType}
                                helperText={!formData.configType ? t('systemConfig.pleaseEnterConfigType') : ''}
                            />
                            <TextField
                                label={t('systemConfig.configValue')}
                                value={formData.configValue}
                                onChange={(e) => setFormData({ ...formData, configValue: e.target.value })}
                                fullWidth
                                required
                                error={!formData.configValue}
                                helperText={!formData.configValue ? t('systemConfig.pleaseEnterConfigValue') : ''}
                            />
                            <TextField
                                label={t('systemConfig.description')}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                fullWidth
                                multiline
                                rows={3}
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
                            disabled={!formData.configKey || !formData.configType || !formData.configValue}
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