'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Upload as UploadIcon,
    Close as CloseIcon,
    InsertDriveFile as InsertDriveFileIcon,
} from '@mui/icons-material';
import { documentService } from '@/app/services/document';
import { knowledgeService } from '@/app/services/knowledge';
import { categoryService } from '@/app/services/category';
import type { Document, DocumentCreateDTO } from '@/app/types/document';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import type { KbCategory } from '@/app/types/category';
import { Pagination } from '@/app/components/common/Pagination';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback, useThrottledCallback } from '@/app/utils/performance';
import { useVirtualizer } from '@tanstack/react-virtual';

interface DocumentRowProps {
    document: Document;
    onEdit: (document: Document) => void;
    onDelete: (id: number) => void;
    onPreview: (id: number) => void;
    categories: KbCategory[];
    t: (key: string) => string;
}

// 使用React.memo优化表格行组件
const DocumentRow = React.memo(({ document, onEdit, onDelete, onPreview, categories, t }: DocumentRowProps) => (
    <TableRow>
        <TableCell>{document.title}</TableCell>
        <TableCell>{document.kbName}</TableCell>
        <TableCell>
            {categories.find((c: KbCategory) => c.id === document.categoryId)?.name || '-'}
        </TableCell>
        <TableCell>
            {document.tags?.map(tag => tag.name).join(', ') || '-'}
        </TableCell>
        <TableCell>
            {(() => {
                switch (document.parseStatus) {
                    case 0:
                        return (
                            <Chip
                                label={t('documents.parseStatus.unparsed') || '未解析'}
                                size="small"
                                color="default"
                                variant="outlined"
                            />
                        );
                    case 1:
                        return (
                            <Chip
                                label={t('documents.parseStatus.parsing') || '解析中'}
                                size="small"
                                color="info"
                                variant="outlined"
                            />
                        );
                    case 2:
                        return (
                            <Chip
                                label={t('documents.parseStatus.success') || '解析成功'}
                                size="small"
                                color="success"
                                variant="outlined"
                            />
                        );
                    case 3:
                        return (
                            <Chip
                                label={t('documents.parseStatus.failed') || '解析失败'}
                                size="small"
                                color="error"
                                variant="outlined"
                            />
                        );
                    default:
                        return (
                            <Chip
                                label={t('documents.parseStatus.unparsed') || '未解析'}
                                size="small"
                                color="default"
                                variant="outlined"
                            />
                        );
                }
            })()}
        </TableCell>
        <TableCell>{document.creatorName}</TableCell>
        <TableCell>
            {new Date(document.createTime).toLocaleString()}
        </TableCell>
        <TableCell>
            <Tooltip title={t('common.preview')}>
                <IconButton
                    onClick={() => onPreview(document.id)}
                    size="small"
                >
                    <VisibilityIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={t('common.edit')}>
                <IconButton
                    onClick={() => onEdit(document)}
                    size="small"
                >
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
        </TableCell>
    </TableRow>
));

DocumentRow.displayName = 'DocumentRow';

export default function DocumentsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseVO[]>([]);
    const [categories, setCategories] = useState<KbCategory[]>([]);
    const [selectedKbId, setSelectedKbId] = useState<number | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    const [formData, setFormData] = useState<DocumentCreateDTO>({
        title: '',
        content: '',
        categoryId: 0,
        kbId: 0,
        tags: [],
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

    // 使用useCallback优化函数
    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await documentService.getList({
                current: pagination.current,
                size: pagination.pageSize,
                kbId: selectedKbId || undefined,
            });
            setDocuments(response.data.data.records);
            setPagination(prev => ({ ...prev, total: response.data.data.total }));
        } catch (error) {
            console.error('获取文档列表失败:', error);
            setSnackbar({
                open: true,
                message: t('documents.fetchError'),
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, selectedKbId, t]);

    const fetchKnowledgeBases = useCallback(async () => {
        try {
            const response = await knowledgeService.getUserKnowledgeBases();
            setKnowledgeBases(response.data.data);
        } catch (error) {
            console.error('获取知识库列表失败:', error);
        }
    }, []);

    const fetchCategories = useCallback(async (kbId: number) => {
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

    // 使用useEffect优化副作用
    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    useEffect(() => {
        fetchKnowledgeBases();
    }, [fetchKnowledgeBases]);

    // 使用防抖优化搜索
    const handleKbChange = useDebouncedCallback((kbId: number) => {
        setSelectedKbId(kbId);
        setFormData(prev => ({ ...prev, kbId }));
        fetchCategories(kbId);
    }, [fetchCategories], 300);

    // 使用useCallback优化事件处理函数
    const handleOpen = useCallback((document?: Document) => {
        if (document) {
            setEditingDocument(document);
            setFormData({
                title: document.title,
                content: document.content,
                categoryId: document.categoryId,
                kbId: document.kbId,
                tags: document.tags?.map(tag => tag.name) || [],
            });
            fetchCategories(document.kbId);
        } else {
            setEditingDocument(null);
            setFormData({
                title: '',
                content: '',
                categoryId: 0,
                kbId: selectedKbId || 0,
                tags: [],
            });
        }
        setOpen(true);
    }, [selectedKbId, fetchCategories]);

    const handleClose = useCallback(() => {
        setOpen(false);
        setEditingDocument(null);
        setFormData({
            title: '',
            content: '',
            categoryId: 0,
            kbId: selectedKbId || 0,
            tags: [],
        });
    }, [selectedKbId]);

    const handleSubmit = useCallback(async () => {
        try {
            if (editingDocument) {
                await documentService.update(editingDocument.id, formData);
            } else {
                await documentService.create(formData);
            }
            setSnackbar({
                open: true,
                message: editingDocument ? t('documents.updateSuccess') : t('documents.createSuccess'),
                severity: 'success',
            });
            handleClose();
            fetchDocuments();
        } catch (error) {
            console.error('保存文档失败:', error);
            setSnackbar({
                open: true,
                message: t('documents.saveError'),
                severity: 'error',
            });
        }
    }, [editingDocument, formData, handleClose, fetchDocuments, t]);

    // 使用useMemo优化计算属性
    const tableHeight = useMemo(() => {
        return Math.min(600, window.innerHeight - 300);
    }, []);

    // 使用虚拟滚动优化长列表
    const rowVirtualizer = useVirtualizer({
        count: documents.length,
        getScrollElement: () => document.querySelector('.MuiTableBody-root'),
        estimateSize: () => 53, // 估计每行高度
        overscan: 5,
    });

    // 处理文件上传
    const handleUpload = async () => {
        console.log('开始上传文件:', file?.name);
        console.log('选择的知识库ID:', selectedKbId);

        if (!file) {
            console.error('未选择文件');
            setSnackbar({
                open: true,
                message: t('documents.uploadError'),
                severity: 'error',
            });
            return;
        }

        if (!selectedKbId) {
            console.error('未选择知识库');
            setSnackbar({
                open: true,
                message: t('documents.selectKbFirst'),
                severity: 'error',
            });
            return;
        }

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('kbId', selectedKbId.toString());

        try {
            console.log('发送上传请求...');
            const response = await documentService.upload(formData);
            console.log('上传响应:', response);

            setSnackbar({
                open: true,
                message: t('documents.uploadSuccess'),
                severity: 'success',
            });
            setUploadOpen(false);
            setFile(null);
            fetchDocuments();
        } catch (error) {
            console.error('上传文档失败:', error);
            setSnackbar({
                open: true,
                message: t('documents.uploadError'),
                severity: 'error',
            });
        } finally {
            setUploadLoading(false);
        }
    };

    // 删除文档
    const handleDelete = async (id: number) => {
        if (!window.confirm(t('documents.deleteConfirm'))) return;
        try {
            await documentService.delete(id);
            setSnackbar({
                open: true,
                message: t('documents.deleteSuccess'),
                severity: 'success',
            });
            fetchDocuments();
        } catch (error) {
            console.error('删除文档失败:', error);
            setSnackbar({
                open: true,
                message: t('documents.deleteError'),
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
                        {t('documents.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={async () => {
                                setUploadOpen(true);
                                await fetchKnowledgeBases();
                            }}
                            sx={{
                                background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                                },
                                height: '44px',
                                px: 3
                            }}
                        >
                            {t('documents.uploadDocument')}
                        </Button>
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
                            {t('documents.createDocument')}
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>{t('knowledge.title')}</InputLabel>
                        <Select
                            value={selectedKbId || ''}
                            onChange={(e) => handleKbChange(e.target.value as number)}
                            label={t('knowledge.title')}
                        >
                            <MenuItem value="">{t('common.all')}</MenuItem>
                            {knowledgeBases.map((kb) => (
                                <MenuItem key={kb.id} value={kb.id}>
                                    {kb.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <TableContainer component={Paper}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('common.name')}</TableCell>
                                <TableCell>{t('knowledge.title')}</TableCell>
                                <TableCell>{t('documents.category')}</TableCell>
                                <TableCell>{t('documents.tags')}</TableCell>
                                <TableCell>{t('documents.parseStatus.title')}</TableCell>
                                <TableCell>{t('common.creator')}</TableCell>
                                <TableCell>{t('common.createTime')}</TableCell>
                                <TableCell>{t('common.operation')}</TableCell>
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
                            ) : documents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        {t('common.noData')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rowVirtualizer.getVirtualItems().map((virtualItem: { index: number }) => (
                                    <DocumentRow
                                        key={documents[virtualItem.index].id}
                                        document={documents[virtualItem.index]}
                                        onEdit={(document: Document) => handleOpen(document)}
                                        onDelete={(id: number) => handleDelete(id)}
                                        onPreview={(id: number) => router.push(`/documents/${id}`)}
                                        categories={categories}
                                        t={t}
                                    />
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

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingDocument ? t('documents.editDocument') : t('documents.createDocument')}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label={t('common.name')}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                            error={!formData.title}
                            helperText={!formData.title ? t('documents.nameRequired') : ''}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>{t('documents.category')}</InputLabel>
                            <Select
                                value={formData.categoryId || ''}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value as number })}
                                label={t('documents.category')}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label={t('documents.content')}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            multiline
                            rows={8}
                            sx={{ mb: 2 }}
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

            <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('documents.uploadDocument')}</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            pt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <FormControl fullWidth>
                            <InputLabel>{t('knowledge.title')}</InputLabel>
                            <Select
                                value={selectedKbId || ''}
                                onChange={(e) => setSelectedKbId(e.target.value as number)}
                                label={t('knowledge.title')}
                                disabled={uploadLoading}
                            >
                                <MenuItem value="">
                                    <em>{t('documents.selectKbFirst')}</em>
                                </MenuItem>
                                {knowledgeBases.map((kb) => (
                                    <MenuItem key={kb.id} value={kb.id}>
                                        {kb.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box
                            sx={{
                                width: '100%',
                                height: '200px',
                                border: '2px dashed',
                                borderColor: 'primary.main',
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                bgcolor: alpha('#6C8EF2', 0.05),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: alpha('#6C8EF2', 0.1),
                                    borderColor: 'primary.dark',
                                }
                            }}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept=".txt,.md,.pdf,.doc,.docx"
                                style={{ display: 'none' }}
                            />
                            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" color="primary">
                                {file ? file.name : t('documents.dragAndDrop')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {t('documents.supportedFormats')}
                            </Typography>
                        </Box>
                        {file && (
                            <Box
                                sx={{
                                    width: '100%',
                                    p: 2,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InsertDriveFileIcon color="primary" />
                                    <Box>
                                        <Typography variant="body2" noWrap>
                                            {file.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => setFile(null)}
                                    disabled={uploadLoading}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        onClick={() => {
                            setUploadOpen(false);
                            setFile(null);
                        }}
                        disabled={uploadLoading}
                        sx={{ minWidth: 100 }}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            console.log('点击上传按钮');
                            handleUpload();
                        }}
                        variant="contained"
                        disabled={!file || !selectedKbId || uploadLoading}
                        sx={{
                            minWidth: 120,
                            position: 'relative',
                            background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                            },
                            '&.Mui-disabled': {
                                background: 'rgba(0, 0, 0, 0.12)',
                            }
                        }}
                    >
                        {uploadLoading ? (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'white',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <UploadIcon fontSize="small" />
                                {t('common.upload')}
                            </Box>
                        )}
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