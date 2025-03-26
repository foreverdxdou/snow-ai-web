'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { List, Space, Spin, Empty, Modal, Switch } from 'antd';
import { Card, CardContent, CardActions, CardHeader, Avatar, IconButton, Box, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Paper } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, MenuBook as MenuBookIcon, Add as AddIcon } from '@mui/icons-material';
import { knowledgeService } from '@/app/services/knowledge';
import type { KnowledgeBaseVO, PageKnowledgeBaseVO, KnowledgeBaseDTO } from '@/app/types/knowledge';
import { handleResponse } from '@/app/utils/request';
import { Pagination } from '@/app/components/common/Pagination';
import { categoryService } from '@/app/services/category';
import type { KbCategory } from '@/app/types/category';
import { UseTreeItem2ContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import * as React from 'react';
import {
    ExpandMore as ExpandMoreIcon,
    ChevronRight as ChevronRightIcon,
    DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import {
    TreeItem2,
    TreeItem2Props,
    TreeItem2SlotProps,
} from '@mui/x-tree-view/TreeItem2';
import { alpha, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

type TreeItemType = {
    id: string;
    label: string;
    disabled?: boolean;
    editable?: boolean;
};

export const CategoryTreeItems: TreeViewBaseItem<TreeItemType>[] = [];

export default function KnowledgePage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeBaseVO | null>(null);
    const [knowledgeList, setKnowledgeList] = useState<KnowledgeBaseVO[]>([]);
    const [formData, setFormData] = useState<KnowledgeBaseDTO>({
        name: '',
        description: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0,
    });
    const [categories, setCategories] = useState<KbCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [CategoryTreeItems, setCategoryTreeItems] = useState<TreeViewBaseItem<TreeItemType>[]>([]);
    const [treeCategories, setTreeCategories] = useState<KbCategory[]>([]);

    const CustomContent = styled('div')(({ theme }) => ({
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.shape.borderRadius,
        width: '100%',
        border: '1px solid',
        display: 'flex',
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
        },
        variants: [
            {
                props: ({ status }: UseTreeItem2ContentSlotOwnProps) => status.disabled,
                style: {
                    opacity: 0.5,
                    backgroundColor: theme.palette.action.disabledBackground,
                },
            },
            {
                props: ({ status }: UseTreeItem2ContentSlotOwnProps) => status.selected,
                style: {
                    backgroundColor: alpha(theme.palette.primary.main, 0.4),
                },
            },
        ],
    }));

    const CategoryTreeItem = React.forwardRef(function CategoryTreeItem(
        props: TreeItem2Props,
        ref: React.Ref<HTMLLIElement>,
    ) {
        return (
            <TreeItem2
                {...props}
                ref={ref}
                slotProps={
                    {
                        content: CustomContent,
                    } as TreeItem2SlotProps
                }
            />
        );
    });


    const fetchKnowledgeList = async () => {
        try {
            setLoading(true);
            const response = await knowledgeService.getList({
                current: pagination.current,
                size: pagination.pageSize,
                categoryId: selectedCategoryId || undefined,
            });
            const { records, total } = handleResponse<PageKnowledgeBaseVO>(response.data, false);
            setKnowledgeList(records);
            setPagination(prev => ({ ...prev, total }));
        } catch (error) {
            console.error('获取知识库列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKnowledgeList();
    }, [pagination.current, pagination.pageSize, selectedCategoryId]);

    const fetchCategories = async () => {
        try {
            const treeResponse = await categoryService.getCategoryTree();
            setTreeCategories(treeResponse.data.data);
            setCategoryTreeItems(treeResponse.data.data.map(item => ({
                id: item.id.toString(),
                label: item.name,
                children: item.children?.map(child => ({
                    id: child.id.toString(),
                    label: child.name,
                })),
            })));
        } catch (error) {
            console.error('获取分类树失败:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: t('common.confirm'),
            content: t('knowledge.deleteConfirm'),
            onOk: async () => {
                try {
                    const response = await knowledgeService.delete(id);
                    handleResponse(response.data);
                    fetchKnowledgeList();
                } catch (error) {
                    console.error(t('knowledge.deleteError'), error);
                }
            },
        });
    };

    const handleStatusChange = async (id: number, status: number) => {
        try {
            const response = await knowledgeService.updateStatus(id, status);
            handleResponse(response.data);
            fetchKnowledgeList();
        } catch (error) {
            console.error('更新知识库状态失败:', error);
        }
    };

    const handleOpen = (knowledge?: KnowledgeBaseVO) => {
        if (knowledge) {
            setEditingKnowledge(knowledge);
            setFormData({
                name: knowledge.name,
                description: knowledge.description,
            });
        } else {
            setEditingKnowledge(null);
            setFormData({
                name: '',
                description: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingKnowledge(null);
        setFormData({
            name: '',
            description: '',
        });
    };

    const handleSubmit = async () => {
        try {
            if (editingKnowledge) {
                const response = await knowledgeService.update(editingKnowledge.id, formData);
                handleResponse(response.data);
            } else {
                const response = await knowledgeService.create(formData);
                handleResponse(response.data);
            }
            setSnackbar({
                open: true,
                message: `${editingKnowledge ? '更新' : '创建'}成功`,
                severity: 'success',
            });
            handleClose();
            fetchKnowledgeList();
        } catch (error) {
            console.error(`${editingKnowledge ? '更新' : '创建'}知识库失败:`, error);
            setSnackbar({
                open: true,
                message: `${editingKnowledge ? '更新' : '创建'}失败`,
                severity: 'error',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <Paper
                sx={{
                    width: 280,
                    mr: 3,
                    p: 2,
                    overflow: 'hidden',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    {t('knowledge.categoryTree')}
                </Typography>
                <RichTreeView
                    aria-label="分类树"
                    items={CategoryTreeItems}
                    slots={{
                        expandIcon: ChevronRightIcon,
                        collapseIcon: ExpandMoreIcon,
                        item: CategoryTreeItem,
                    }}
                    multiSelect={false}
                    selectedItems={selectedCategoryId?.toString() || ''}
                    onSelectedItemsChange={(_: React.SyntheticEvent, nodeIds: string | null) => {
                        if (nodeIds) {
                            setSelectedCategoryId(parseInt(nodeIds));
                            fetchKnowledgeList();
                        }
                    }}
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        '& .MuiTreeItem-content': {
                            padding: '4px 8px',
                        }
                    }}
                />
            </Paper>

            <Box sx={{ flex: 1 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {t('knowledge.title')}
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
                        {t('knowledge.createKnowledge')}
                    </Button>
                </Box>

                {knowledgeList.length === 0 ? (
                    <Empty
                        description={t('common.noData')}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        className="mt-8"
                    />
                ) : (
                    <div className="flex flex-col">
                        <List
                            grid={{
                                gutter: 24,
                                xs: 1,
                                sm: 2,
                                md: 2,
                                lg: 3,
                                xl: 3,
                                xxl: 4
                            }}
                            dataSource={knowledgeList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            position: 'relative',
                                            transition: 'all 0.3s',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                boxShadow: 6,
                                                transform: 'translateY(-4px)',
                                                borderColor: 'primary.main',
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                zIndex: 1000,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                bgcolor: 'background.paper',
                                                p: 1,
                                                borderRadius: 1,
                                                boxShadow: 1
                                            }}
                                        >
                                            <Switch
                                                checked={item.status === 1}
                                                onChange={(checked) => handleStatusChange(item.id, checked ? 1 : 0)}
                                                className="!bg-gray-200"
                                                checkedChildren="启用"
                                                unCheckedChildren="禁用"
                                            />
                                        </Box>
                                        <CardHeader
                                            sx={{
                                                pb: 1,
                                                '& .MuiCardHeader-avatar': {
                                                    bgcolor: 'primary.light',
                                                    p: 1,
                                                    borderRadius: 2,
                                                    '& .MuiAvatar-root': {
                                                        width: 48,
                                                        height: 48,
                                                        bgcolor: 'primary.main',
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 28,
                                                            color: 'white'
                                                        }
                                                    }
                                                }
                                            }}
                                            avatar={
                                                <Avatar>
                                                    <MenuBookIcon />
                                                </Avatar>
                                            }
                                            title={
                                                <Box
                                                    component="h3"
                                                    sx={{
                                                        maxWidth: 200,
                                                        fontWeight: 600,
                                                        fontSize: '1.1rem',
                                                        color: 'text.primary',
                                                        m: 0,
                                                        '&:hover': {
                                                            color: 'primary.main',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                >
                                                    {item.name}
                                                </Box>
                                            }
                                        />
                                        <CardContent sx={{ pt: 1 }}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    color: 'text.secondary',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <span>👤</span>
                                                        <span>{item.creatorName}</span>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <span>📄</span>
                                                            <span>{item.documentCount}</span>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <span>📁</span>
                                                            <span>{item.categoryCount}</span>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <span>🏷️</span>
                                                            <span>{item.tagCount}</span>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        bgcolor: 'background.paper',
                                                        opacity: 0,
                                                        visibility: 'hidden',
                                                        transition: 'all 0.3s',
                                                        p: 3,
                                                        borderRadius: 2,
                                                        boxShadow: 3,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                        '&:hover': {
                                                            opacity: 1,
                                                            visibility: 'visible',
                                                        }
                                                    }}
                                                >
                                                    <Box
                                                        component="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: 'primary.main',
                                                            mb: 1
                                                        }}
                                                    >
                                                        描述
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            color: 'text.secondary',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 4,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            lineHeight: 1.6
                                                        }}
                                                    >
                                                        {item.description || '暂无描述'}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <CardActions
                                            sx={{
                                                justifyContent: 'flex-end',
                                                px: 2,
                                                py: 1,
                                                borderTop: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => handleOpen(item)}
                                                color="primary"
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: 'primary.light',
                                                        color: 'primary.main'
                                                    }
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(item.id)}
                                                color="error"
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: 'error.light',
                                                        color: 'error.main'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </List.Item>
                            )}
                        />

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
                            pageSizeOptions={['12', '20', '50', '100']}
                        />


                    </div>
                )}
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingKnowledge ? t('knowledge.editKnowledge') : t('knowledge.createKnowledge')}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label={t('knowledge.name')}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t('knowledge.description')}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('common.cancel')}</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
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