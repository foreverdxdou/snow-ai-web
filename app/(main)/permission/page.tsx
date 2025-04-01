'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Stack,
    IconButton,
    Tooltip,
    Paper,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Grid,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Folder as FolderIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { CommonButton } from '@/app/components/common/CommonButton';
import { CommonInput } from '@/app/components/common/CommonInput';
import { CommonSelect } from '@/app/components/common/CommonSelect';
import { SearchBar } from '@/app/components/common/SearchBar';
import { permissionService } from '@/app/services/permission';
import type { Permission, PermissionDTO } from '@/app/types/permission';

// 转换函数
const convertToTree = (items: Permission[]): Permission[] => {
    const map = new Map<string, Permission>();
    const roots: Permission[] = [];

    // 创建映射
    items.forEach(item => {
        map.set(item.id, { ...item, children: [] });
    });

    // 构建树
    items.forEach(item => {
        const node = map.get(item.id)!;
        if (item.parentId === '0') {
            roots.push(node);
        } else {
            const parent = map.get(item.parentId);
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
        }
    });

    // 对每个节点的子节点进行排序
    const sortChildren = (nodes: Permission[]) => {
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                node.children.sort((a, b) => a.sort - b.sort);
                sortChildren(node.children);
            }
        });
    };

    // 对根节点进行排序
    roots.sort((a, b) => a.sort - b.sort);
    sortChildren(roots);

    return roots;
};

// 渲染树节点组件
const TreeNode = ({ node, level = 0, onAdd, onEdit, onDelete }: {
    node: Permission;
    level?: number;
    onAdd: (parentId: string) => void;
    onEdit: (permission: Permission) => void;
    onDelete: (id: string) => void;
}) => {
    const [open, setOpen] = useState(true);
    const { t } = useTranslation();

    return (
        <>
            <ListItem
                sx={{
                    pl: level * 2,
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                <ListItemButton
                    onClick={() => setOpen(!open)}
                    sx={{ 
                        minHeight: 48,
                        width: '100%',
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={1}>
                            <ListItemIcon>
                                <FolderIcon />
                            </ListItemIcon>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2">{node.name}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2">{node.component}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2">{node.path}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2">{node.permissionCode}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="body2">{node.sort}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="body2">{node.status === 1 ? '启用' : '禁用'}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            {node.children && node.children.length > 0 && (
                                open ? <ExpandLessIcon /> : <ExpandMoreIcon />
                            )}
                        </Grid>
                    </Grid>
                </ListItemButton>
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title={t('common.add')}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdd(node.id);
                            }}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.edit')}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(node);
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(node.id);
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </ListItem>
            {node.children && node.children.length > 0 && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {node.children.map((child) => (
                            <TreeNode
                                key={child.id}
                                node={child}
                                level={level + 1}
                                onAdd={onAdd}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

export default function PermissionPage() {
    const { t } = useTranslation();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [formData, setFormData] = useState<PermissionDTO>({
        parentId: '0',
        name: '',
        type: 1,
        permissionCode: '',
        path: '',
        component: '',
        icon: '',
        sort: 0,
        status: 1,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 获取权限树
    const fetchPermissions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await permissionService.getTree();
            if (response.data?.data) {
                const treeData = convertToTree(response.data.data);
                setPermissions(treeData);
            }
        } catch (error) {
            console.error('获取权限列表失败:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    // 处理打开对话框
    const handleOpen = useCallback((permission?: Permission, parent?: string) => {
        if (permission) {
            setEditingPermission(permission);
            setFormData({
                id: permission.id,
                parentId: permission.parentId,
                name: permission.name,
                type: permission.type,
                permissionCode: permission.permissionCode,
                path: permission.path,
                component: permission.component,
                icon: permission.icon,
                sort: permission.sort,
                status: permission.status,
            });
        } else {
            setEditingPermission(null);
            setFormData({
                parentId: parent || '0',
                name: '',
                type: 1,
                permissionCode: '',
                path: '',
                component: '',
                icon: '',
                sort: 0,
                status: 1,
            });
        }
        setOpen(true);
    }, []);

    // 处理关闭对话框
    const handleClose = useCallback(() => {
        setOpen(false);
        setEditingPermission(null);
        setFormData({
            parentId: '0',
            name: '',
            type: 1,
            permissionCode: '',
            path: '',
            component: '',
            icon: '',
            sort: 0,
            status: 1,
        });
    }, []);

    // 处理提交
    const handleSubmit = useCallback(async () => {
        try {
            if (editingPermission) {
                    await permissionService.update(editingPermission.id, formData);
                setSnackbar({
                    open: true,
                    message: t('common.permission.updateSuccess'),
                    severity: 'success',
                });
            } else {
                await permissionService.add(formData);
                setSnackbar({
                    open: true,
                    message: t('common.permission.createSuccess'),
                    severity: 'success',
                });
            }
            handleClose();
            fetchPermissions();
        } catch (error) {
            console.error(`${editingPermission ? '更新' : '创建'}权限失败:`, error);
            setSnackbar({
                open: true,
                message: t(`common.permission.${editingPermission ? 'updateError' : 'createError'}`),
                severity: 'error',
            });
        }
    }, [editingPermission, formData, handleClose, fetchPermissions, t]);

    // 处理删除
    const handleDelete = useCallback((id: string) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    }, []);

    // 处理删除确认
    const handleDeleteConfirm = useCallback(async () => {
        if (!deletingId) return;
        try {
            await permissionService.delete(deletingId);
            setSnackbar({
                open: true,
                message: t('common.permission.deleteSuccess'),
                severity: 'success',
            });
            fetchPermissions();
        } catch (error) {
            console.error('删除权限失败:', error);
            setSnackbar({
                open: true,
                message: t('common.permission.deleteError'),
                severity: 'error',
            });
        } finally {
            setDeleteDialogOpen(false);
            setDeletingId(null);
        }
    }, [deletingId, fetchPermissions, t]);

    return (
        <PerformanceLayout>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        p: 3,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}
                >
                    <SearchBar>
                        <CommonSelect
                            label={t('common.permission.type')}
                            value={formData.type}
                            onChange={(value) => setFormData({ ...formData, type: value as number })}
                            options={[
                                { id: 1, name: t('common.permission.typeMenu') },
                                { id: 2, name: t('common.permission.typeButton') },
                            ]}
                            sx={{ minWidth: 200 }}
                        />
                        <CommonSelect
                            label={t('common.permission.status')}
                            value={formData.status}
                            onChange={(value) => setFormData({ ...formData, status: value as number })}
                            options={[
                                { id: 1, name: t('common.permission.statusEnabled') },
                                { id: 0, name: t('common.permission.statusDisabled') },
                            ]}
                            sx={{ minWidth: 200 }}
                        />
                        <CommonButton
                            buttonVariant="reset"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    type: 1,
                                    status: 1,
                                });
                                fetchPermissions();
                            }}
                        >
                            {t('common.reset')}
                        </CommonButton>
                        <CommonButton
                            buttonVariant="add"
                            onClick={() => handleOpen()}
                            sx={{ marginLeft: 'auto' }}
                        >
                            {t('common.add')}
                        </CommonButton>
                    </SearchBar>
                </Box>

                <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            {t('common.loading')}
                        </Typography>
                    ) : permissions.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            {t('common.noData')}
                        </Typography>
                    ) : (
                        <Paper sx={{ width: '100%' }}>
                            <List>
                                {permissions.map((node) => (
                                    <TreeNode
                                        key={node.id}
                                        node={node}
                                        onAdd={(parentId) => handleOpen(undefined, parentId)}
                                        onEdit={handleOpen}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>

                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingPermission ? t('common.edit') : t('common.add')}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                            <CommonInput
                                label={t('common.permission.name')}
                                value={formData.name}
                                onChange={(value) =>
                                    setFormData({ ...formData, name: value as string })
                                }
                                fullWidth
                                required
                                error={!formData.name}
                                helperText={
                                    !formData.name ? t('common.permission.nameRequired') : ''
                                }
                            />
                            <CommonSelect
                                label={t('common.permission.type')}
                                value={formData.type}
                                onChange={(value) =>
                                    setFormData({ ...formData, type: value as number })
                                }
                                options={[
                                    { id: 1, name: t('common.permission.typeMenu') },
                                    { id: 2, name: t('common.permission.typeButton') },
                                ]}
                            />
                            <CommonInput
                                label={t('common.permission.code')}
                                value={formData.permissionCode}
                                onChange={(value) =>
                                    setFormData({ ...formData, permissionCode: value as string })
                                }
                                fullWidth
                                required
                                error={!formData.permissionCode}
                                helperText={
                                    !formData.permissionCode
                                        ? t('common.permission.codeRequired')
                                        : ''
                                }
                            />
                            <CommonInput
                                label={t('common.permission.path')}
                                value={formData.path}
                                onChange={(value) =>
                                    setFormData({ ...formData, path: value as string })
                                }
                                fullWidth
                            />
                            <CommonInput
                                label={t('common.permission.component')}
                                value={formData.component}
                                onChange={(value) =>
                                    setFormData({ ...formData, component: value as string })
                                }
                                fullWidth
                            />
                            <CommonInput
                                label={t('common.permission.icon')}
                                value={formData.icon}
                                onChange={(value) =>
                                    setFormData({ ...formData, icon: value as string })
                                }
                                fullWidth
                            />
                            <CommonInput
                                label={t('common.permission.sort')}
                                value={formData.sort}
                                onChange={(value) =>
                                    setFormData({ ...formData, sort: value as number })
                                }
                                type="number"
                                fullWidth
                            />
                            <CommonSelect
                                label={t('common.permission.status')}
                                value={formData.status}
                                onChange={(value) =>
                                    setFormData({ ...formData, status: value as number })
                                }
                                options={[
                                    { id: 1, name: t('common.permission.statusEnabled') },
                                    { id: 0, name: t('common.permission.statusDisabled') },
                                ]}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <CommonButton buttonVariant="cancel" onClick={handleClose}>
                            {t('common.cancel')}
                        </CommonButton>
                        <CommonButton
                            buttonVariant="submit"
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.permissionCode}
                        >
                            {t('common.save')}
                        </CommonButton>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle>{t('common.permission.deleteConfirm')}</DialogTitle>
                    <DialogContent>
                        <Typography>{t('common.permission.deleteConfirmMessage')}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <CommonButton
                            buttonVariant="cancel"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            {t('common.cancel')}
                        </CommonButton>
                        <CommonButton buttonVariant="confirm" onClick={handleDeleteConfirm}>
                            {t('common.confirm')}
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