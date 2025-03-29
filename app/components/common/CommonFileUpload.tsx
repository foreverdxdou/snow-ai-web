import React from 'react';
import {
    Alert,
    Paper,
    Typography,
    Box,
    styled,
    alpha
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// 上传区域样式
const UploadArea = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    border: '2px dashed',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
    }
}));

interface CommonFileUploadProps {
    file: File | null;
    maxFileSize?: number;
    accept?: string;
    onFileChange: (file: File) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    error?: boolean;
    errorMessage?: string;
    supportedFormats?: string;
}

export const CommonFileUpload: React.FC<CommonFileUploadProps> = ({
    file,
    maxFileSize = 20 * 1024 * 1024, // 默认20MB
    accept = '.txt,.md,.pdf,.doc,.docx',
    onFileChange,
    onDragOver,
    onDrop,
    error = false,
    errorMessage,
    supportedFormats = ''
}) => {
    const { t } = useTranslation();
    const isFileTooLarge = file ? file.size > maxFileSize : false;

    // 格式化文件大小
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    // 处理文件选择
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            onFileChange(selectedFile);
        }
    };

    // 处理拖拽
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver?.(e);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            onFileChange(droppedFile);
        }
        onDrop?.(e);
    };

    return (
        <Box>
            {/* 文件大小限制提示 */}
            <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                icon={<WarningIcon />}
            >
                {t('documents.maxFileSize', { size: formatFileSize(maxFileSize) })}
            </Alert>

            {/* 文件上传区域 */}
            <UploadArea
                variant="outlined"
                sx={{
                    borderColor: file ? (isFileTooLarge || error ? 'error.main' : 'primary.main') : 'divider',
                    bgcolor: file ? (isFileTooLarge || error ? 'error.lighter' : 'primary.lighter') : 'background.paper',
                    '&:hover': {
                        borderColor: isFileTooLarge || error ? 'error.main' : 'primary.main',
                        bgcolor: isFileTooLarge || error ? 'error.lighter' : 'primary.lighter',
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
                    accept={accept}
                />
                <CloudUploadIcon 
                    sx={{ 
                        fontSize: 48, 
                        color: file ? (isFileTooLarge || error ? 'error.main' : 'primary.main') : 'text.secondary',
                        mb: 1
                    }} 
                />
                <Typography 
                    variant="body1" 
                    color={isFileTooLarge || error ? 'error.main' : 'text.secondary'} 
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
                    ) : t('common.dragAndDrop')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {supportedFormats || t('documents.supportedFormats')}
                </Typography>
            </UploadArea>
        </Box>
    );
}; 