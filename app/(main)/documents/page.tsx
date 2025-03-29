'use client';

import React, { useState, useCallback, useMemo } from 'react';
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
    Tooltip,
    Alert,
    Snackbar,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
    Download as DownloadIcon,
    Preview as PreviewIcon,
} from '@mui/icons-material';
import { documentService } from '@/app/services/document';
import type { Document, DocumentCreateDTO } from '@/app/types/document';
import { Pagination } from '@/app/components/common/Pagination';
import { useTranslation } from 'react-i18next';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { PerformanceTable } from '@/app/components/common/PerformanceTable';
import { usePerformanceData } from '@/app/hooks/usePerformanceData';
import { useDebouncedCallback } from '@/app/utils/performance';
import { categoryService } from '@/app/services/category';
import type { KbCategory } from '@/app/types/category';
import { tagService } from '@/app/services/tag';
import type { Tag } from '@/app/types/tag';
import { formatDate, formatFileSize } from '@/app/utils/format';

// 使用 React.memo 优化文档行组件
const DocumentRow = React.memo(({ 
    document, 
    onEdit, 
    onDelete,
    onPreview,
    onDownload,
    categories,
    t
}: { 
    document: Document; 
    onEdit: (document: Document) => void; 
    onDelete: (id: number) => void;
    onPreview: (id: number) => void;
    onDownload: (id: number) => void;
    categories: KbCategory[];
    t: (key: string) => string;
}) => (
    <tr>
        <td>{document.name}</td>
        <td>
            {categories.find(cat => cat.id === document.categoryId)?.name || '-'}
        </td>
        <td>
            {document.tags?.map(tag => (
                <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                />
            ))}
        </td>
        <td>{document.fileSize}</td>
        <td>{document.fileType}</td>
        <td>{new Date(document.createTime).toLocaleString()}</td>
        <td>
            <Tooltip title={t('common.preview')}>
                <IconButton onClick={() => onPreview(document.id)} size="small">
                    <PreviewIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={t('common.download')}>
                <IconButton onClick={() => onDownload(document.id)} size="small">
                    <DownloadIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={t('common.edit')}>
                <IconButton onClick={() => onEdit(document)} size="small">
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={t('common.delete')}>
                <IconButton
                    onClick={() => onDelete(document.id)}
                    size="small"
                    color="error"
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </td>
    </tr>
));

DocumentRow.displayName = 'DocumentRow';

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
    const [open, setOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [categories, setCategories] = useState<KbCategory[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    // 使用 useState 管理搜索条件
    const [searchName, setSearchName] = useState('');

    // 使用 usePerformanceData 优化数据获取
    const {
        data: documents,
        loading,
        error,
        total,
        params,
        setParams,
        refresh,
    } = usePerformanceData<Document>({
        fetchData: documentService.getList,
        defaultParams: {
            current: 1,
            size: 10,
            name: undefined,
            categoryId: undefined,
            status: undefined,
            kbId: undefined,
        } as SearchParams,
        autoFetch: true
    });

    type SetParamsType = typeof setParams;

    const [formData, setFormData] = useState<DocumentCreateDTO>({
        title: '',
        categoryId: 0,
        kbId: 0,
        content: '',
        tagIds: [],
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 使用 useCallback 优化事件处理函数
    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm(t('documents.deleteConfirm'))) {
            try {
                await documentService.delete(id);
                setSnackbar({
                    open: true,
                    message: t('documents.deleteSuccess'),
                    severity: 'success',
                });
                refresh();
            } catch (error) {
                console.error(t('documents.deleteError'), error);
                setSnackbar({
                    open: true,
                    message: t('documents.deleteError'),
                    severity: 'error',
                });
            }
        }
    }, [t, refresh]);

    const handleOpen = useCallback((document?: Document) => {
        if (document) {
            setEditingDocument(document);
            setFormData({
                title: document.title,
                categoryId: document.categoryId,
                kbId: document.kbId,
                content: document.content || '',
                tagIds: document.tags?.map(tag => tag.id.toString()) || [],
            });
        } else {
            setEditingDocument(null);
            setFormData({
                title: '',
                categoryId: 0,
                kbId: 0,
                content: '',
                tagIds: [],
            });
        }
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        setEditingDocument(null);
        setFormData({
            title: '',
            categoryId: 0,
            kbId: 0,
            content: '',
            tagIds: [],
        });
    }, []);

    // 使用 useDebouncedCallback 优化搜索触发
    const debouncedSearch = useDebouncedCallback(
        (newParams: Partial<SearchParams>) => {
            setParams((prev: SearchParams) => ({
                ...prev,
                ...newParams,
                current: 1, // 搜索条件变化时重置页码
            }));
        },
        [],
        300
    );

    const handleReset = useCallback(() => {
        setSearchName('');
        setParams((prev: SearchParams) => ({
            ...prev,
            current: 1,
            name: undefined,
            categoryId: undefined,
            status: undefined,
        }));
    }, [setParams]);

    const handleSubmit = useCallback(async () => {
        try {
            if (!formData.title) {
                setSnackbar({
                    open: true,
                    message: t('documents.nameRequired'),
                    severity: 'error',
                });
                return;
            }

            if (editingDocument) {
                await documentService.update(editingDocument.id, {
                    title: formData.title,
                    categoryId: formData.categoryId,
                    content: formData.content,
                    tags: formData.tagIds?.map(String),
                });
                setSnackbar({
                    open: true,
                    message: t('documents.updateSuccess'),
                    severity: 'success',
                });
            } else {
                await documentService.create({
                    title: formData.title,
                    categoryId: formData.categoryId,
                    kbId: formData.kbId,
                    content: formData.content,
                    tagIds: formData.tagIds?.map(String),
                });
                setSnackbar({
                    open: true,
                    message: t('documents.createSuccess'),
                    severity: 'success',
                });
            }
            handleClose();
            refresh();
        } catch (error) {
            console.error(editingDocument ? t('documents.updateError') : t('documents.createError'), error);
            setSnackbar({
                open: true,
                message: editingDocument ? t('documents.updateError') : t('documents.createError'),
                severity: 'error',
            });
        }
    }, [editingDocument, formData, t, refresh]);

    const handlePreview = useCallback((id: number) => {
        window.open(`/api/v1/kb/document/${id}/preview`, '_blank');
    }, []);

    const handleDownload = useCallback((id: number) => {
        window.open(`/api/v1/kb/document/${id}/download`, '_blank');
    }, []);

    // 使用 useCallback 优化分类和标签数据获取
    const fetchCategories = useCallback(async () => {
        try {
            const response = await categoryService.getList({
                current: 1,
                size: 1000,
            });
            setCategories(response.data.data.records);
        } catch (error) {
            console.error('获取分类列表失败:', error);
        }
    }, []);

    const fetchTags = useCallback(async () => {
        try {
            const response = await tagService.getList({
                current: 1,
                size: 1000,
            });
            setTags(response.data.data.records);
        } catch (error) {
            console.error('获取标签列表失败:', error);
        }
    }, []);

    // 使用 useEffect 获取分类和标签数据
    React.useEffect(() => {
        fetchCategories();
        fetchTags();
    }, [fetchCategories, fetchTags]);

    const handlePageChange = useCallback((page: number) => {
        setParams((prev: typeof params) => ({ ...prev, current: page }));
        refresh();
    }, [refresh]);

    const handleSizeChange = useCallback((size: number) => {
        setParams((prev: typeof params) => ({ ...prev, size }));
        refresh();
    }, [refresh]);

    const handleFormDataChange = useCallback((prev: DocumentCreateDTO, field: keyof DocumentCreateDTO, value: any) => {
        setFormData((prev: DocumentCreateDTO) => ({ ...prev, [field]: value }));
    }, []);

    // 使用 useMemo 优化表格配置
    const columns = useMemo(() => [
        {
            key: 'title' as keyof Document,
            title: t('common.name'),
            render: (_: any, record: Document) => record?.title || '-'
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
    ], [t, handleOpen, handleDelete]);

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
                {/* 顶部搜索区域 */}
                <Box 
                    sx={{
                        p: 4,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box 
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'stretch', md: 'center' },
                            gap: 2
                        }}
                    >
                        {/* 搜索条件组 */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'stretch', sm: 'center' },
                                gap: 2,
                                flex: 1
                            }}
                        >
                            <TextField
                                size="small"
                                placeholder={t('documents.searchByName')}
                                value={searchName}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchName(value);
                                    debouncedSearch({ title: value || undefined });
                                }}
                                sx={{ 
                                    width: { xs: '100%', sm: 200 },
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'background.paper',
                                        '&:hover': {
                                            '& > fieldset': {
                                                borderColor: 'primary.main',
                                            }
                                        }
                                    }
                                }}
                            />
                            <FormControl 
                                size="small" 
                                sx={{ 
                                    width: { xs: '100%', sm: 200 },
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'background.paper'
                                    }
                                }}
                            >
                                <InputLabel>{t('documents.searchByCategory')}</InputLabel>
                                <Select
                                    value={params.categoryId || ''}
                                    label={t('documents.searchByCategory')}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        debouncedSearch({
                                            categoryId: value === '' ? undefined : value as number
                                        });
                                    }}
                                >
                                    <MenuItem value="">{t('common.all')}</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl 
                                size="small" 
                                sx={{ 
                                    width: { xs: '100%', sm: 200 },
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'background.paper'
                                    }
                                }}
                            >
                                <InputLabel>{t('documents.searchByStatus')}</InputLabel>
                                <Select
                                    value={params.status === undefined ? '' : params.status}
                                    label={t('documents.searchByStatus')}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        debouncedSearch({
                                            status: value === '' ? undefined : value as number
                                        });
                                    }}
                                >
                                    <MenuItem value="">{t('documents.all')}</MenuItem>
                                    <MenuItem value={1}>{t('documents.enabled')}</MenuItem>
                                    <MenuItem value={0}>{t('documents.disabled')}</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                sx={{
                                    minWidth: { xs: '100%', sm: '120px' },
                                    height: '40px',
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '&:hover': {
                                        borderColor: 'primary.dark',
                                        bgcolor: 'action.hover'
                                    }
                                }}
                            >
                                {t('documents.resetButton')}
                            </Button>
                        </Box>
                        {/* 上传按钮 */}
                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={() => handleOpen()}
                            sx={{
                                minWidth: { xs: '100%', md: 'auto' },
                                height: '44px',
                                px: 3,
                                background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                                },
                                boxShadow: '0 3px 5px 2px rgba(108, 142, 242, .3)'
                            }}
                        >
                            {t('documents.uploadDocument')}
                        </Button>
                    </Box>
                </Box>

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
                            current={params.current}
                            pageSize={params.size}
                            total={total}
                            onChange={(page, pageSize) => {
                                setParams((prev: typeof params) => ({
                                    ...prev,
                                    current: page,
                                    size: pageSize,
                                }));
                            }}
                        />
                    </Box>
                </Box>

                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {editingDocument ? t('documents.editDocument') : t('documents.createDocument')}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                label={t('common.name')}
                                value={formData.title}
                                onChange={(e) => handleFormDataChange(formData, 'title', e.target.value)}
                                required
                                error={!formData.title}
                                helperText={!formData.title ? t('documents.nameRequired') : ''}
                            />
                            <FormControl fullWidth>
                                <InputLabel>{t('documents.category')}</InputLabel>
                                <Select
                                    value={formData.categoryId || ''}
                                    label={t('documents.category')}
                                    onChange={(e) => handleFormDataChange(formData, 'categoryId', e.target.value as number)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>{t('documents.tags')}</InputLabel>
                                <Select
                                    multiple
                                    value={formData.tagIds || []}
                                    label={t('documents.tags')}
                                    onChange={(e) => handleFormDataChange(formData, 'tagIds', (e.target.value as string[]).map(String))}
                                >
                                    {tags.map((tag) => (
                                        <MenuItem key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label={t('documents.content')}
                                value={formData.content}
                                onChange={(e) => handleFormDataChange(formData, 'content', e.target.value)}
                                multiline
                                rows={4}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{t('common.cancel')}</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={!formData.title}
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
        </PerformanceLayout>
    );
} 