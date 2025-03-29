'use client';

import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { SystemConfig, SystemConfigQuery, SystemConfigSaveRequest } from '@/app/types/system-config';
import { systemConfigService } from '@/app/services/system-config';
import { Pagination } from '@/app/components/common/Pagination';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { useDebouncedCallback } from '@/app/utils/performance';
import { useVirtualizer } from '@tanstack/react-virtual';

// 使用 React.memo 优化表格行组件
const ConfigRow = React.memo(({ 
    row, 
    onEdit, 
    onDelete 
}: { 
    row: SystemConfig; 
    onEdit: (record: SystemConfig) => void; 
    onDelete: (id: number) => void;
}) => (
    <TableRow>
        <TableCell>{row.configKey}</TableCell>
        <TableCell>{row.configType}</TableCell>
        <TableCell>{row.configValue}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{new Date(row.createTime).toLocaleString()}</TableCell>
        <TableCell>{new Date(row.updateTime).toLocaleString()}</TableCell>
        <TableCell align="right">
            <Tooltip title="编辑">
                <IconButton
                    size="small"
                    onClick={() => onEdit(row)}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="删除">
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(row.id)}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </TableCell>
    </TableRow>
));

ConfigRow.displayName = 'ConfigRow';

export default function SystemConfigPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SystemConfig[]>([]);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [editingRecord, setEditingRecord] = useState<SystemConfig | null>(null);
    const [searchForm, setSearchForm] = useState<SystemConfigQuery>({
        pageNum: 1,
        pageSize: 10,
        configKey: '',
        configType: '',
    });
    const [formData, setFormData] = useState<SystemConfigSaveRequest>({
        configKey: '',
        configValue: '',
        description: '',
        configType: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 使用 useCallback 优化函数
    const fetchData = useCallback(async (params: SystemConfigQuery) => {
        try {
            setLoading(true);
            const res = await systemConfigService.getList(params);
            setData(res.data?.data.records || []);
            setTotal(res.data?.data.total || 0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData({
            ...searchForm,
            pageNum: current,
            pageSize: pageSize,
        });
    }, [current, pageSize, fetchData, searchForm]);

    // 使用防抖优化搜索
    const handleSearch = useDebouncedCallback(() => {
        setCurrent(1);
        fetchData({
            ...searchForm,
            pageNum: 1,
        });
    }, [searchForm, fetchData], 300);

    const handleReset = useCallback(() => {
        setSearchForm({
            pageNum: 1,
            pageSize: pageSize,
            configKey: '',
            configType: '',
        });
        setCurrent(1);
        fetchData({
            pageNum: 1,
            pageSize: pageSize,
        });
    }, [pageSize, fetchData]);

    const handleAdd = useCallback(() => {
        setDialogTitle(t('systemConfig.add'));
        setEditingRecord(null);
        setFormData({
            configKey: '',
            configValue: '',
            description: '',
            configType: '',
        });
        setDialogOpen(true);
    }, [t]);

    const handleEdit = useCallback((record: SystemConfig) => {
        setDialogTitle(t('systemConfig.edit'));
        setEditingRecord(record);
        setFormData({
            id: record.id,
            configKey: record.configKey,
            configValue: record.configValue,
            description: record.description,
            configType: record.configType,
        });
        setDialogOpen(true);
    }, [t]);

    const handleDelete = useCallback(async (id: number) => {
        if (!window.confirm(t('systemConfig.deleteConfirm'))) return;
        try {
            await systemConfigService.delete(id);
            setSnackbar({
                open: true,
                message: t('systemConfig.operateSuccess'),
                severity: 'success',
            });
            fetchData({
                ...searchForm,
                pageNum: current,
                pageSize: pageSize,
            });
        } catch (error) {
            console.error('Delete failed:', error);
            setSnackbar({
                open: true,
                message: t('systemConfig.operateError'),
                severity: 'error',
            });
        }
    }, [t, searchForm, current, pageSize, fetchData]);

    const handleDialogClose = useCallback(() => {
        setDialogOpen(false);
        setEditingRecord(null);
    }, []);

    const handleDialogSubmit = useCallback(async () => {
        try {
            if (editingRecord) {
                await systemConfigService.update(editingRecord.id, formData);
            } else {
                await systemConfigService.add(formData);
            }
            setSnackbar({
                open: true,
                message: t('systemConfig.operateSuccess'),
                severity: 'success',
            });
            setDialogOpen(false);
            fetchData({
                ...searchForm,
                pageNum: current,
                pageSize: pageSize,
            });
        } catch (error) {
            console.error('Save failed:', error);
            setSnackbar({
                open: true,
                message: t('systemConfig.operateError'),
                severity: 'error',
            });
        }
    }, [editingRecord, formData, t, searchForm, current, pageSize, fetchData]);

    const handlePageChange = useCallback((page: number, size: number) => {
        setCurrent(page);
        setPageSize(size);
    }, []);

    // 使用 useMemo 优化计算属性
    const tableHeight = useMemo(() => {
        return Math.min(600, window.innerHeight - 300);
    }, []);

    // 使用虚拟滚动优化长列表
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => document.querySelector('.MuiTableBody-root'),
        estimateSize: () => 53, // 估计每行高度
        overscan: 5,
    });

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
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAdd}
                            sx={{
                                background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                                },
                                height: '44px',
                                px: 3
                            }}
                        >
                            {t('systemConfig.add')}
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            size="small"
                            label={t('systemConfig.configKey')}
                            value={searchForm.configKey || ''}
                            onChange={(e) => setSearchForm({ ...searchForm, configKey: e.target.value })}
                            sx={{ width: 200 }}
                        />
                        <TextField
                            size="small"
                            label={t('systemConfig.configType')}
                            value={searchForm.configType || ''}
                            onChange={(e) => setSearchForm({ ...searchForm, configType: e.target.value })}
                            sx={{ width: 200 }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            sx={{
                                background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                                },
                            }}
                        >
                            {t('systemConfig.search')}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={handleReset}
                        >
                            {t('systemConfig.reset')}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                    <TableContainer component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="15%">{t('systemConfig.configKey')}</TableCell>
                                    <TableCell width="15%">{t('systemConfig.configType')}</TableCell>
                                    <TableCell width="20%">{t('systemConfig.configValue')}</TableCell>
                                    <TableCell width="15%">{t('systemConfig.description')}</TableCell>
                                    <TableCell width="15%">{t('systemConfig.createTime')}</TableCell>
                                    <TableCell width="15%">{t('systemConfig.updateTime')}</TableCell>
                                    <TableCell width="5%" align="right">{t('common.actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                <CircularProgress />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            {t('common.noData')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rowVirtualizer.getVirtualItems().map((virtualItem) => (
                                        <ConfigRow
                                            key={data[virtualItem.index].id}
                                            row={data[virtualItem.index]}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Pagination
                            total={total}
                            current={current}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                        />
                    </Box>
                </Box>

                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>{dialogTitle}</DialogTitle>
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
                        <Button onClick={handleDialogClose}>{t('common.cancel')}</Button>
                        <Button
                            onClick={handleDialogSubmit}
                            variant="contained"
                            disabled={!formData.configKey || !formData.configType || !formData.configValue}
                            sx={{
                                background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                                },
                            }}
                        >
                            {t('common.save')}
                        </Button>
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