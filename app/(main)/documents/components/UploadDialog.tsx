import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close as CloseIcon } from '@mui/icons-material';
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
    if(!open) return null;
    const {
        refresh,
        tags,
        knowledgeBases,
    } = useDocumentData();

    // 使用自定义 Hook 管理文档操作
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
        setSelectedTagId(null);
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
            handleUpload();
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
                <IconButton 
                    onClick={handleClose} 
                    size="small"
                    sx={{ 
                        color: 'text.secondary',
                        '&:hover': { color: 'error.main' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    {/* 文件上传区域 */}
                    <CommonFileUpload
                        file={file}
                        maxFileSize={MAX_FILE_SIZE}
                        onFileChange={handleFileChange}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        error={isFileTooLarge}
                        errorMessage={t('documents.fileTooLarge')}
                        accept= {t('documents.accept')}
                        supportedFormats= {t('documents.supportedFormats', { accept: t('documents.accept') })}
                    />

                    {/* 知识库选择 */}
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
                            },
                            '& .MuiInputLabel-root': {
                                color: 'text.secondary',
                                '&.Mui-focused': {
                                    color: 'primary.main'
                                }
                            }
                        }}
                    >
                        <CommonSelect
                            label={t('documents.selectKb')}
                            value={selectedKbId || ''}
                            options={knowledgeBases.map((kb) => ({ id: kb.id, name: kb.name }))}
                            onChange={(value) => setSelectedKbId(value as number)}
                            sx={{
                                '& .MuiSelect-select': {
                                    py: 1.5
                                }
                            }}
                            showAll
                            allValue = {null as unknown as string | number}
                            showAllLabel = {t('documents.selectKbPlaceholder')}
                            formControlSx = {{ }}
                        />

                        <CommonSelect
                            label={t('documents.selectTag')}
                            value={selectedTagId || ''}
                            options={tags.map((tag) => ({ id: tag.id, name: tag.name }))}
                            onChange={(value) => setSelectedTagId(value as number)}
                            sx={{
                                '& .MuiSelect-select': {
                                    py: 1.5
                                }
                            }}
                            showAll
                            allValue = {null as unknown as string | number}
                            showAllLabel = {t('documents.selectKbPlaceholder')}
                            formControlSx = {{ mt:3 }}
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
                    buttonVariant="submit"
                    disabled={!file || !selectedKbId || uploadLoading || isFileTooLarge}
                >
                    {getUploadButtonText()}
                </CommonButton>
            </DialogActions>
        </Dialog>
    );
}; 