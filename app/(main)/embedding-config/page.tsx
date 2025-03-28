'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
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
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { EmbeddingConfig, EmbeddingConfigQuery, EmbeddingConfigSaveRequest } from '@/app/types/embedding-config';
import { embeddingConfigService } from '@/app/services/embedding-config';
import { Pagination } from '@/app/components/common/Pagination';

export default function EmbeddingConfigPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<EmbeddingConfig[]>([]);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [editingRecord, setEditingRecord] = useState<EmbeddingConfig | null>(null);
    const [searchForm, setSearchForm] = useState<EmbeddingConfigQuery>({
        pageNum: 1,
        pageSize: 10,
        name: '',
        modelType: '',
    });
    const [formData, setFormData] = useState<EmbeddingConfigSaveRequest>({
        name: '',
        modelType: '',
        apiKey: '',
        baseUrl: '',
        dimensions: 1536,
        enabled: 1,
        remark: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const fetchData = async (params: EmbeddingConfigQuery) => {
        try {
            setLoading(true);
            const res = await embeddingConfigService.getList(params);
            setData(res.data?.data.records || []);
            setTotal(res.data?.data.total || 0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData({
            ...searchForm,
            pageNum: current,
            pageSize: pageSize,
        });
    }, [current, pageSize]);

    const handleSearch = () => {
        setCurrent(1);
        fetchData({
            ...searchForm,
            pageNum: 1,
        });
    };

    const handleReset = () => {
        setSearchForm({
            pageNum: 1,
            pageSize: pageSize,
            name: '',
            modelType: '',
        });
        setCurrent(1);
        fetchData({
            pageNum: 1,
            pageSize: pageSize,
        });
    };

    const handleAdd = () => {
        setDialogTitle(t('embeddingConfig.add'));
        setEditingRecord(null);
        setFormData({
            name: '',
            modelType: '',
            apiKey: '',
            baseUrl: '',
            dimensions: 1536,
            enabled: 1,
            remark: '',
        });
        setDialogOpen(true);
    };

    const handleEdit = (record: EmbeddingConfig) => {
        setDialogTitle(t('embeddingConfig.edit'));
        setEditingRecord(record);
        setFormData({
            id: record.id,
            name: record.name,
            modelType: record.modelType,
            apiKey: record.apiKey,
            baseUrl: record.baseUrl,
            dimensions: record.dimensions,
            enabled: record.enabled,
            remark: record.remark,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('embeddingConfig.deleteConfirm'))) return;
        try {
            await embeddingConfigService.delete(id);
            setSnackbar({
                open: true,
                message: t('embeddingConfig.operateSuccess'),
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
                message: t('embeddingConfig.operateError'),
                severity: 'error',
            });
        }
    };

    const handleToggleEnabled = async (id: number, currentEnabled: number) => {
        try {
            await embeddingConfigService.toggleEnabled(id, currentEnabled === 1 ? 0 : 1);
            setSnackbar({
                open: true,
                message: t('embeddingConfig.operateSuccess'),
                severity: 'success',
            });
            fetchData({
                ...searchForm,
                pageNum: current,
                pageSize: pageSize,
            });
        } catch (error) {
            console.error('Toggle enabled failed:', error);
            setSnackbar({
                open: true,
                message: t('embeddingConfig.operateError'),
                severity: 'error',
            });
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingRecord(null);
    };

    const handleDialogSubmit = async () => {
        try {
            if (editingRecord) {
                await embeddingConfigService.update(editingRecord.id, formData);
            } else {
                await embeddingConfigService.add(formData);
            }
            setSnackbar({
                open: true,
                message: t('embeddingConfig.operateSuccess'),
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
                message: t('embeddingConfig.operateError'),
                severity: 'error',
            });
        }
    };

    const handlePageChange = (page: number, size: number) => {
        setCurrent(page);
        setPageSize(size);
    };

    return (
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
                        {t('embeddingConfig.title')}
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
                        {t('embeddingConfig.add')}
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        size="small"
                        label={t('embeddingConfig.name')}
                        value={searchForm.name || ''}
                        onChange={(e) => setSearchForm({ ...searchForm, name: e.target.value })}
                        sx={{ width: 200 }}
                    />
                    <TextField
                        size="small"
                        label={t('embeddingConfig.modelType')}
                        value={searchForm.modelType || ''}
                        onChange={(e) => setSearchForm({ ...searchForm, modelType: e.target.value })}
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
                        {t('embeddingConfig.search')}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleReset}
                    >
                        {t('embeddingConfig.reset')}
                    </Button>
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                <TableContainer component={Paper}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell width="15%">{t('embeddingConfig.name')}</TableCell>
                                <TableCell width="15%">{t('embeddingConfig.modelType')}</TableCell>
                                <TableCell width="15%">{t('embeddingConfig.baseUrl')}</TableCell>
                                <TableCell width="10%">{t('embeddingConfig.dimensions')}</TableCell>
                                <TableCell width="10%">{t('embeddingConfig.enabled')}</TableCell>
                                <TableCell width="15%">{t('embeddingConfig.createTime')}</TableCell>
                                <TableCell width="15%">{t('embeddingConfig.updateTime')}</TableCell>
                                <TableCell width="5%" align="right">{t('common.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                            <CircularProgress />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        {t('common.noData')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.modelType}</TableCell>
                                        <TableCell>{row.baseUrl}</TableCell>
                                        <TableCell>{row.dimensions}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={row.enabled === 1}
                                                onChange={() => handleToggleEnabled(row.id, row.enabled)}
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(row.createTime).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(row.updateTime).toLocaleString()}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={t('embeddingConfig.edit')}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEdit(row)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t('embeddingConfig.delete')}>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(row.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
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
                            label={t('embeddingConfig.name')}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                            error={!formData.name}
                            helperText={!formData.name ? t('embeddingConfig.pleaseEnterName') : ''}
                        />
                        <TextField
                            label={t('embeddingConfig.modelType')}
                            value={formData.modelType}
                            onChange={(e) => setFormData({ ...formData, modelType: e.target.value })}
                            fullWidth
                            required
                            error={!formData.modelType}
                            helperText={!formData.modelType ? t('embeddingConfig.pleaseEnterModelType') : ''}
                        />
                        <TextField
                            label={t('embeddingConfig.apiKey')}
                            value={formData.apiKey}
                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                            fullWidth
                            required
                            error={!formData.apiKey}
                            helperText={!formData.apiKey ? t('embeddingConfig.pleaseEnterApiKey') : ''}
                        />
                        <TextField
                            label={t('embeddingConfig.baseUrl')}
                            value={formData.baseUrl}
                            onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                            fullWidth
                            required
                            error={!formData.baseUrl}
                            helperText={!formData.baseUrl ? t('embeddingConfig.pleaseEnterBaseUrl') : ''}
                        />
                        <TextField
                            label={t('embeddingConfig.dimensions')}
                            value={formData.dimensions}
                            onChange={(e) => setFormData({ ...formData, dimensions: Number(e.target.value) })}
                            fullWidth
                            required
                            type="number"
                            error={!formData.dimensions}
                            helperText={!formData.dimensions ? t('embeddingConfig.pleaseEnterDimensions') : ''}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.enabled === 1}
                                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked ? 1 : 0 })}
                                />
                            }
                            label={t('embeddingConfig.enabled')}
                        />
                        <TextField
                            label={t('embeddingConfig.remark')}
                            value={formData.remark}
                            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
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
                        disabled={!formData.name || !formData.modelType || !formData.apiKey || !formData.baseUrl || !formData.dimensions}
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
    );
} 