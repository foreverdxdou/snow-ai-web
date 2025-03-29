import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
    Typography,
    Paper,
    IconButton,
    Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import { CloudUpload as CloudUploadIcon, Close as CloseIcon, Warning as WarningIcon } from '@mui/icons-material';
import { formatFileSize } from '@/app/utils/format';

interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
    file: File | null;
    setFile: (file: File | null) => void;
    uploadLoading: boolean;
    selectedKbId: number | null;
    setSelectedKbId: (id: number | null) => void;
    onUpload: () => void;
    knowledgeBases: KnowledgeBaseVO[];
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const UploadDialog: React.FC<UploadDialogProps> = ({
    open,
    onClose,
    file,
    setFile,
    uploadLoading,
    selectedKbId,
    setSelectedKbId,
    onUpload,
    knowledgeBases,
}) => {
    const { t } = useTranslation();

    const handleClose = () => {
        setFile(null);
        setSelectedKbId(null);
        onClose();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                setFile(null);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            if (droppedFile.size > MAX_FILE_SIZE) {
                setFile(null);
                return;
            }
            setFile(droppedFile);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const isFileTooLarge = file?.size ? file.size > MAX_FILE_SIZE : false;

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
                    {/* 文件大小限制提示 */}
                    <Alert 
                        severity="info" 
                        sx={{ mb: 2 }}
                        icon={<WarningIcon />}
                    >
                        {t('documents.maxFileSize', { size: formatFileSize(MAX_FILE_SIZE) })}
                    </Alert>

                    {/* 文件上传区域 */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            textAlign: 'center',
                            border: '2px dashed',
                            borderColor: file ? (isFileTooLarge ? 'error.main' : 'primary.main') : 'divider',
                            bgcolor: file ? (isFileTooLarge ? 'error.lighter' : 'primary.lighter') : 'background.paper',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: isFileTooLarge ? 'error.main' : 'primary.main',
                                bgcolor: isFileTooLarge ? 'error.lighter' : 'primary.lighter',
                            }
                        }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".txt,.md,.pdf,.doc,.docx"
                        />
                        <CloudUploadIcon 
                            sx={{ 
                                fontSize: 48, 
                                color: file ? (isFileTooLarge ? 'error.main' : 'primary.main') : 'text.secondary',
                                mb: 1
                            }} 
                        />
                        <Typography 
                            variant="body1" 
                            color={isFileTooLarge ? 'error.main' : 'text.secondary'} 
                            gutterBottom
                        >
                            {file ? (
                                <Box>
                                    <Typography component="span" color="inherit">
                                        {file.name}
                                    </Typography>
                                    <Typography 
                                        component="span" 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ display: 'block', mt: 0.5 }}
                                    >
                                        {formatFileSize(file.size)}
                                    </Typography>
                                </Box>
                            ) : t('documents.dragAndDrop')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('documents.supportedFormats')}
                        </Typography>
                    </Paper>

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
                        <InputLabel>{t('documents.selectKb')}</InputLabel>
                        <Select
                            value={selectedKbId || ''}
                            label={t('documents.selectKb')}
                            onChange={(e) => setSelectedKbId(e.target.value as number)}
                            sx={{
                                '& .MuiSelect-select': {
                                    py: 1.5
                                }
                            }}
                        >
                            <MenuItem value="">
                            {t('documents.selectKbPlaceholder')}
                            </MenuItem>
                            {knowledgeBases.map((kb) => (
                                <MenuItem key={kb.id} value={kb.id}>
                                    <Box sx={{ py: 0.5 }}>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: 500,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {kb.name}
                                        </Typography>
              
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button 
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        minWidth: 100,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.dark',
                            bgcolor: 'action.hover'
                        }
                    }}
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={onUpload}
                    variant="contained"
                    disabled={!file || uploadLoading || isFileTooLarge}
                    startIcon={uploadLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
                    sx={{
                        minWidth: 120,
                        background: isFileTooLarge 
                            ? 'error.main'
                            : 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                        '&:hover': {
                            background: isFileTooLarge 
                                ? 'error.dark'
                                : 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
                        },
                        '&.Mui-disabled': {
                            background: 'action.disabledBackground',
                        }
                    }}
                >
                    {uploadLoading 
                        ? t('documents.uploading') 
                        : isFileTooLarge 
                            ? t('documents.fileTooLarge') 
                            : t('common.upload')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 