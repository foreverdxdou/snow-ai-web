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
    Switch,
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
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Menu,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { categoryService } from '@/app/services/category';
import type { KbCategory } from '@/app/types/category';
import { Pagination } from '@/app/components/common/Pagination';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export default function CategoryPage() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<KbCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<KbCategory | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: null as number | null,
        sort: 0,
        kbId: 1,
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<KbCategory | null>(null);
    const [parentCategories, setParentCategories] = useState<KbCategory[]>([]);
    const [menuPosition, setMenuPosition] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getList({
                current: pagination.current,
                size: pagination.pageSize,
            });
            setCategories(response.data.data.records);
            setPagination(prev => ({ ...prev, total: response.data.data.total }));
        } catch (error) {
            console.error('获取分类列表失败:', error);
            setSnackbar({
                open: true,
                message: t('category.fetchError'),
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchParentCategories = async () => {
        try {
            const response = await categoryService.getList({
                current: 1,
                size: 1000,
            });
            setParentCategories(response.data.data.records);
        } catch (error) {
            console.error('获取父分类列表失败:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchParentCategories();
    }, [pagination.current, pagination.pageSize]);

    const handleOpen = async (category?: KbCategory, parentCategory?: KbCategory) => {
        await fetchParentCategories();

        if (category) {
            setEditingCategory(category);
            setFormData({
                ...formData,
                name: category.name,
                description: category.description || '',
                parentId: category.parentId || null,
                sort: category.sort,
            });
        } else {
            setEditingCategory(null);
            setFormData({
                ...formData,
                name: '',
                description: '',
                parentId: parentCategory ? parentCategory.id : null,
                sort: 0,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCategory(null);
        setFormData({
            ...formData,
            name: '',
            description: '',
            parentId: null,
            sort: 0,
        });
    };

    const handleSubmit = async () => {
        try {
            if (editingCategory) {
                await categoryService.update(editingCategory.id, formData);
            } else {
                await categoryService.create(formData);
            }
            setSnackbar({
                open: true,
                message: editingCategory ? t('category.updateSuccess') : t('category.createSuccess'),
                severity: 'success',
            });
            handleClose();
            fetchCategories();
        } catch (error) {
            console.error(`${editingCategory ? '更新' : '创建'}分类失败:`, error);
            setSnackbar({
                open: true,
                message: editingCategory ? t('category.updateError') : t('category.createError'),
                severity: 'error',
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('category.deleteConfirm'))) return;
        try {
            await categoryService.delete(id);
            setSnackbar({
                open: true,
                message: t('category.deleteSuccess'),
                severity: 'success',
            });
            fetchCategories();
        } catch (error) {
            console.error('删除分类失败:', error);
            setSnackbar({
                open: true,
                message: t('category.deleteError'),
                severity: 'error',
            });
        }
    };

    const handleStatusChange = async (id: number, status: number) => {
        try {
            await categoryService.updateStatus(id, status);
            setSnackbar({
                open: true,
                message: t('category.statusUpdateSuccess'),
                severity: 'success',
            });
            fetchCategories();
        } catch (error) {
            console.error('更新状态失败:', error);
            setSnackbar({
                open: true,
                message: t('category.statusUpdateError'),
                severity: 'error',
            });
        }
    };

    const handleContextMenu = (event: React.MouseEvent, category: KbCategory) => {
        event.preventDefault();
        setMenuPosition({
            mouseX: event.clientX,
            mouseY: event.clientY,
        });
        setSelectedCategory(category);
    };

    const handleCloseMenu = () => {
        setMenuPosition(null);
        setSelectedCategory(null);
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
                        {t('category.title')}
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
                        {t('category.createCategory')}
                    </Button>
                </Box>
            </Box>

            <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('common.name')}</TableCell>
                                        <TableCell>{t('common.description')}</TableCell>
                                        <TableCell>{t('category.parentCategory')}</TableCell>
                                        <TableCell>{t('common.status')}</TableCell>
                                        <TableCell>{t('common.operation')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow
                                            key={category.id}
                                            onContextMenu={(e) => handleContextMenu(e, category)}
                                            sx={{
                                                cursor: 'context-menu',
                                                '&:hover': {
                                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                                                },
                                            }}
                                        >
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.description || '-'}</TableCell>
                                            <TableCell>
                                                {parentCategories.find(p => p.id === category.parentId)?.name || t('category.root')}
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={category.status === 1}
                                                    onChange={(e) => handleStatusChange(category.id, e.target.checked ? 1 : 0)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={t('common.edit')}>
                                                    <IconButton
                                                        onClick={() => handleOpen(category)}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={t('common.delete')}>
                                                    <IconButton
                                                        onClick={() => handleDelete(category.id)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
                    </>
                )}
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingCategory ? t('category.editCategory') : t('category.createCategory')}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label={t('common.name')}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                            error={!formData.name}
                            helperText={!formData.name ? t('category.nameRequired') : ''}
                        />
                        <TextField
                            fullWidth
                            label={t('common.description')}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>{t('category.parentCategory')}</InputLabel>
                            <Select
                                value={formData.parentId || ''}
                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value as number })}
                                label={t('category.parentCategory')}
                            >
                                <MenuItem value="">{t('category.root')}</MenuItem>
                                {parentCategories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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

            <Menu
                open={!!menuPosition}
                onClose={handleCloseMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    menuPosition
                        ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={() => {
                    if (selectedCategory) {
                        handleOpen(undefined, selectedCategory);
                    }
                    handleCloseMenu();
                }}>
                    {t('category.addSubCategory')}
                </MenuItem>
            </Menu>

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