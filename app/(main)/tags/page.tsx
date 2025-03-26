'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { tagService } from '@/app/services/tag';
import { knowledgeService } from '@/app/services/knowledge';
import type { Tag, TagCreateDTO } from '@/app/types/tag';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import { Pagination } from '@/app/components/common/Pagination';
import { useTranslation } from 'react-i18next';

export default function TagsPage() {
    const { t } = useTranslation();
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const [formData, setFormData] = useState<TagCreateDTO>({
        name: ''
    });

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 获取标签列表
    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await tagService.getList({
                current: pagination.current,
                size: pagination.pageSize
            });
            setTags(response.data.data.records);
            setPagination(prev => ({ ...prev, total: response.data.data.total }));
        } catch (error) {
            console.error('获取标签列表失败:', error);
            setSnackbar({
                open: true,
                message: t('tags.fetchError'),
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, [pagination.current, pagination.pageSize]);

    // 打开新增/编辑对话框
    const handleOpen = (tag?: Tag) => {
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
    };

    // 关闭对话框
    const handleClose = () => {
        setOpen(false);
        setEditingTag(null);
        setFormData({
            name: ''
        });
    };

    // 提交表单
    const handleSubmit = async () => {
        try {
            if (editingTag) {
                await tagService.update(editingTag.id, { name: formData.name });
            } else {
                await tagService.create(formData);
            }
            setSnackbar({
                open: true,
                message: editingTag ? t('tags.updateSuccess') : t('tags.createSuccess'),
                severity: 'success',
            });
            handleClose();
            fetchTags();
        } catch (error) {
            console.error(`${editingTag ? '更新' : '创建'}标签失败:`, error);
            setSnackbar({
                open: true,
                message: editingTag ? t('tags.updateError') : t('tags.createError'),
                severity: 'error',
            });
        }
    };

    // 删除标签
    const handleDelete = async (id: number) => {
        if (!window.confirm(t('tags.deleteConfirm'))) return;
        try {
            await tagService.delete(id);
            setSnackbar({
                open: true,
                message: t('tags.deleteSuccess'),
                severity: 'success',
            });
            fetchTags();
        } catch (error) {
            console.error('删除标签失败:', error);
            setSnackbar({
                open: true,
                message: t('tags.deleteError'),
                severity: 'error',
            });
        }
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
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {t('tags.title')}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                        sx={{
                            background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                            },
                            height: '44px',
                            px: 3
                        }}
                    >
                        {t('tags.createTag')}
                    </Button>
                </Box>
            </Box>

            <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                <TableContainer component={Paper}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell width="25%">{t('common.name')}</TableCell>
                                <TableCell width="15%">{t('common.creator')}</TableCell>
                                <TableCell width="15%">{t('common.createTime')}</TableCell>
                                <TableCell width="15%">{t('common.operation')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                            <CircularProgress />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : tags.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        {t('common.noData')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tags.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell>{tag.name}</TableCell>
                                        <TableCell>{tag.creatorName}</TableCell>
                                        <TableCell>{new Date(tag.createTime).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Tooltip title={t('common.edit')}>
                                                <IconButton onClick={() => handleOpen(tag)} size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t('common.delete')}>
                                                <IconButton
                                                    onClick={() => handleDelete(tag.id)}
                                                    size="small"
                                                    color="error"
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

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onChange={(page, pageSize) => {
                            setPagination(prev => ({
                                ...prev,
                                current: page,
                                pageSize: pageSize,
                            }));
                        }}
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
                    <Button onClick={handleClose}>{t('common.cancel')}</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name}
                        sx={{
                            background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                            },
                        }}
                    >
                        {t('common.submit')}
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