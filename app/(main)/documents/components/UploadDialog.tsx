import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Box,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/app/components/common/CommonButton';
import { CommonSelect } from '@/app/components/common/CommonSelect';
import { CommonFileUpload } from '@/app/components/common/CommonFileUpload';
import { useDocumentActions } from '@/app/(main)/documents/hooks/useDocumentActions';
import { useDocumentData } from '@/app/(main)/documents/hooks/useDocumentData';

interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const UploadDialog: React.FC<UploadDialogProps> = ({
    open,
    onClose,
}) => {
    const {
        refresh,
        tags,
        knowledgeBases,
    } = useDocumentData();

    const {
        file,
        setFile,
        uploadLoading,
        setUploadLoading,
        selectedKbId,
        setSelectedKbId,
        selectedTagId,
        setSelectedTagId,
        handleUpload,
    } = useDocumentActions(refresh);

    const { t } = useTranslation();
    const [isFileTooLarge, setIsFileTooLarge] = useState(false);

    const handleClose = () => {
        setFile(null);
        setIsFileTooLarge(false);
        setSelectedKbId(null);
        setSelectedTagId([]);
        onClose();
    };

    const handleFileChange = (file: File) => {
        setFile(file);
        setIsFileTooLarge(file.size > MAX_FILE_SIZE);
    };

    const handleDragOver = (e: React.DragEvent<Element>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<Element>) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    };

    const clickUpload = async () => {
        if (!file || !selectedKbId) {
            return;
        }
        setUploadLoading(true);
        try {
            await handleUpload();
            handleClose();
        } finally {
            setUploadLoading(false);
        }
    };

    const getUploadButtonText = () => {
        if (uploadLoading) return t('documents.uploading');
        if (isFileTooLarge) return t('documents.fileTooLarge');
        return t('common.upload');
    };

    return (
        <Dialog 
            open={open}
            onClose={handleClose}
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1
            }}>
                <Typography variant="h6" component="span">
                    {t('documents.uploadDocument')}
                </Typography>
                <CommonButton
                    buttonVariant="close"
                    onClick={handleClose}
                    size="small"
                />
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <CommonFileUpload
                        file={file}
                        maxFileSize={MAX_FILE_SIZE}
                        onFileChange={handleFileChange}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        error={isFileTooLarge}
                        errorMessage={t('documents.fileTooLarge')}
                        accept={t('documents.accept')}
                        supportedFormats={t('documents.supportedFormats', { accept: t('documents.accept') })}
                    />

                    <FormControl 
                        fullWidth 
                        sx={{ 
                            mt: 3,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper',
                                '&:hover': {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main'
                                    }
                                }
                            }
                        }}
                    >
                        <CommonSelect
                            label={t('documents.selectKb')}
                            value={selectedKbId || ''}
                            options={knowledgeBases.map((kb) => ({ id: kb.id, name: kb.name }))}
                            onChange={(value) => setSelectedKbId(value as number)}
                        />
                    </FormControl>

                    <FormControl 
                        fullWidth 
                        sx={{ 
                            mt: 3,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper',
                                '&:hover': {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main'
                                    }
                                }
                            }
                        }}
                    >
                        <CommonSelect
                            fullWidth
                            multiple
                            label={t('documents.selectTag')}
                            value={selectedTagId || []}
                            options={tags.map((tag) => ({ id: tag.id, name: tag.name }))}
                            onChange={(value) => setSelectedTagId(value as number[])}
                        />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <CommonButton 
                    onClick={handleClose}
                    buttonVariant="cancel"
                >
                    {t('common.cancel')}
                </CommonButton>
                <CommonButton
                    onClick={clickUpload}
                    buttonVariant="upload"
                    disabled={!file || !selectedKbId || uploadLoading || isFileTooLarge}
                >
                    {getUploadButtonText()}
                </CommonButton>
            </DialogActions>
        </Dialog>
    );
}; 