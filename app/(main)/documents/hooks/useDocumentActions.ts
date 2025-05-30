import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { documentService } from '@/app/services/document';
import type { Document, DocumentCreateDTO } from '@/app/types/document';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
}

export const useDocumentActions = (refresh: () => void) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [parseDialogOpen, setParseDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [parsingId, setParsingId] = useState<number | null>(null);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [selectedKbId, setSelectedKbId] = useState<number | null>(null);
    const [selectedTagId, setSelectedTagId] = useState<number[]>([]);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success',
    });

    const [formData, setFormData] = useState<DocumentCreateDTO>({
        title: '',
        kbId: 0,
        content: '',
        tagIds: [],
    });

    // 使用 useCallback 优化事件处理函数
    const handleDelete = useCallback(async (id: number) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    }, []);

    // 使用 useCallback 优化事件处理函数
    const handleParse = useCallback(async (id: number) => {
        setParsingId(id);
        setParseDialogOpen(true);
    }, []);

    const handleParseConfirm = useCallback(async () => {
        if (!parsingId) return;
        try {
            await documentService.parse(parsingId);
            setSnackbar({
                open: true,
                message: t('common.operateSuccess'),
                severity: 'success',
            });
            refresh();
        } catch (error) {
            console.error(t('common.operateError'), error);
            setSnackbar({
                open: true,
                message: t('common.operateError'),
                severity: 'error',
            });
        } finally {
            setParseDialogOpen(false);
            setParsingId(null);
        }
    }, [parsingId, t, refresh]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deletingId) return;
        try {
            await documentService.delete(deletingId);
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
        } finally {
            setDeleteDialogOpen(false);
            setDeletingId(null);
        }
    }, [deletingId, t, refresh]);

    const handleOpen = useCallback(async (id:number) => {
        const response = await documentService.getById(id);
        const document = response.data.data as Document;
        if (response.data.code === 200) {
            setEditingDocument(document);
            setFormData({
                title: document.title,
                kbId: document.kbId,
                content: document.content || '',
                tagIds: document.tags?.map(tag => tag.id.toString()) || [],
            });
        } else {
            setEditingDocument(null);
            setFormData({
                title: '',
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
            kbId: 0,
            content: '',
            tagIds: [],
        });
    }, []);

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
                    content: formData.content,
                    tagIds: formData.tagIds?.map(String),
                    kbId: formData.kbId,
                });
                setSnackbar({
                    open: true,
                    message: t('documents.updateSuccess'),
                    severity: 'success',
                });
            } else {
                await documentService.create({
                    title: formData.title,
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

    // 处理文件上传
    const handleUpload = async () => {
        if (!file) {
            setSnackbar({
                open: true,
                message: t('documents.uploadError'),
                severity: 'error',
            });
            return;
        }

        if (!selectedKbId) {
            console.log('selectedKbId');
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
        if (selectedTagId.length > 0) {
            formData.append('tagIds', selectedTagId.join(','));
        }

        try {
            await documentService.upload(formData);
            setSnackbar({
                open: true,
                message: t('documents.uploadSuccess'),
                severity: 'success',
            });
            setUploadOpen(false);
            setFile(null);
            refresh();
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

    const handleStatusChange = async (document: Document) => {
        try {
            const response = await documentService.updateStatus(document.id, document.status === 1 ? 0 : 1);
            if (response.data.code === 200) {
                setSnackbar({
                    open: true,
                    message: t('documents.statusUpdateSuccess'),
                    severity: 'success',
                });
                refresh();
            } else {
                throw new Error(response.data.message || t('documents.statusUpdateError'));
            }
        } catch (error) {
            console.error('更新状态失败:', error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : t('documents.statusUpdateError'),
                severity: 'error',
            });
        }
    };

    return {
        handleDelete,
        handleOpen,
        handleClose,
        handleSubmit,
        handlePreview,
        handleDownload,
        handleUpload,
        open,
        editingDocument,
        formData,
        setFormData,
        uploadOpen,
        setUploadOpen,
        file,
        setFile,
        uploadLoading,
        setUploadLoading,
        selectedKbId,
        setSelectedKbId,
        selectedTagId,
        setSelectedTagId,
        snackbar,
        setSnackbar,
        handleStatusChange,
        deleteDialogOpen,
        setDeleteDialogOpen,
        handleDeleteConfirm,
        parseDialogOpen,
        setParseDialogOpen,
        handleParseConfirm,
        handleParse
    };
}; 