import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Document, DocumentCreateDTO } from '@/app/types/document';
import { useDocumentData } from '@/app/(main)/documents/hooks/useDocumentData';
import { CommonButton } from '@/app/components/common/CommonButton';

interface DocumentDialogProps {
    open: boolean;
    onClose: () => void;
    editingDocument: Document | null;
    formData: DocumentCreateDTO;
    setFormData: (data: DocumentCreateDTO) => void;
    onSubmit: () => void;
}

export const DocumentDialog: React.FC<DocumentDialogProps> = ({
    open,
    onClose,
    editingDocument,
    formData,
    setFormData,
    onSubmit
}) => {
    if(!open) return null;
    const {
        categories,
        tags,
    } = useDocumentData();
    const { t } = useTranslation();

    const handleFormDataChange = (field: keyof DocumentCreateDTO, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {editingDocument ? t('documents.editDocument') : t('documents.createDocument')}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label={t('common.name')}
                        value={formData.title}
                        onChange={(e) => handleFormDataChange('title', e.target.value)}
                        required
                        error={!formData.title}
                        helperText={!formData.title ? t('documents.nameRequired') : ''}
                    />
                    <FormControl fullWidth>
                        <InputLabel>{t('documents.category')}</InputLabel>
                        <Select
                            value={formData.categoryId || ''}
                            label={t('documents.category')}
                            onChange={(e) => handleFormDataChange('categoryId', e.target.value as number)}
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
                            onChange={(e) => handleFormDataChange('tagIds', (e.target.value as string[]).map(String))}
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
                        onChange={(e) => handleFormDataChange('content', e.target.value)}
                        multiline
                        rows={4}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <CommonButton buttonVariant="cancel" onClick={onClose}>{t('common.cancel')}</CommonButton>

                <CommonButton
                    onClick={onSubmit}
                    buttonVariant="submit"
                    disabled={!formData.title}
                >
                    {t('common.submit')}
                </CommonButton>
            </DialogActions>
        </Dialog>
    );
}; 