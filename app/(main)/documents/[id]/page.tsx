'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  History as HistoryIcon,Restore as RestoreIcon
} from '@mui/icons-material';
import { documentService } from '@/app/services/document';
import type { Document, DocumentVersion, DocumentTag } from '@/app/types/document';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/app/components/common/CommonButton';
import { formatDate } from '@/app/utils/format';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { PerformanceTable } from '@/app/components/common/PerformanceTable';

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [document, setDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [tags, setTags] = useState<DocumentTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 获取文档详情
  const fetchDocument = async () => {
    try {
      const response = await documentService.getById(parseInt(params.id));
      setDocument(response.data.data);
    } catch (error) {
      console.error('获取文档详情失败:', error);
      setSnackbar({
        open: true,
        message: t('documents.detail.fetchError'),
        severity: 'error',
      });
    }
  };

  // 获取版本历史
  const fetchVersions = async () => {
    try {
      const response = await documentService.getVersions(parseInt(params.id));
      setVersions(response.data.data);
    } catch (error) {
      console.error('获取版本历史失败:', error);
      setSnackbar({
        open: true,
        message: t('documents.detail.fetchError'),
        severity: 'error',
      });
    }
  };

  // 获取文档标签
  const fetchTags = async () => {
    try {
      const response = await documentService.getTags(parseInt(params.id));
      setTags(response.data.data);
    } catch (error) {
      console.error('获取文档标签失败:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDocument(),
        fetchVersions(),
        fetchTags(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  // 回滚版本
  const handleRollback = async (version: number) => {
    console.log(version);
    try {
      await documentService.rollback(parseInt(params.id), version);
      setSnackbar({
        open: true,
        message: t('documents.detail.rollbackSuccess'),
        severity: 'success',
      });
      setHistoryOpen(false);
      fetchDocument();
      fetchVersions();
    } catch (error) {
      console.error('回滚版本失败:', error);
      setSnackbar({
        open: true,
        message: t('documents.detail.rollbackError'),
        severity: 'error',
      });
    }
  };

  // 版本历史表格列配置
  const versionColumns = [
    {
      key: 'title' as keyof DocumentVersion,
      title: t('common.name'),
      render: (_: any, record: DocumentVersion) => (
          <Box 
              sx={{ 
                  cursor: 'pointer',
                  color: 'primary.main',
                  '&:hover': { textDecoration: 'underline' }
              }}
              onClick={async () => {
                  try {
                      const response = await fetch(record.fileUrl || '');
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = window.document.createElement('a');
                      link.href = url;
                      link.download = record.title;
                      window.document.body.appendChild(link);
                      link.click();
                      window.document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                  } catch (error) {
                      console.error('Download failed:', error);
                  }
              }}
          >
              {record?.title || '-'}
          </Box>
      )
  },
    {
      key: 'version' as keyof DocumentVersion,
      title: t('documents.detail.versionNumber'),
      render: (value: number) => `v${value}`,
    },
    {
      key: 'creatorName' as keyof DocumentVersion,
      title: t('documents.detail.modifier'),
    },
    {
      key: 'createTime' as keyof DocumentVersion,
      title: t('documents.detail.modifyTime'),
      render: (value: string) => formatDate(value),
    },
    {
      key: 'action' as keyof DocumentVersion,
      title: t('documents.detail.action'),
      render: (_: any, record: DocumentVersion) => record && (
        <Stack direction="row" spacing={1}>
            <Tooltip title={t('documents.detail.rollback')}>
                <CommonButton
                  buttonVariant="rollback"
                  startIcon={<RestoreIcon />}
                  onClick={() => handleRollback(record.version)}
                >
                  {t('documents.detail.rollback')}
                </CommonButton>
            </Tooltip>
        </Stack>
    )

    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!document) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('documents.detail.notFound')}</Typography>
      </Box>
    );
  }

  return (
    <PerformanceLayout>
      <Box sx={{ p: 3 }}>
        {/* 顶部操作区 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CommonButton
              buttonVariant="back"
              icon
              onClick={() => router.back()}
            />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {document.title}
            </Typography>
          </Box>
          <CommonButton
            buttonVariant="add"
            startIcon={<HistoryIcon />}
            onClick={() => {
              setHistoryOpen(true);
              fetchVersions();
            }}
          >
            {t('documents.detail.versionHistory')}
          </CommonButton>
        </Box>

        {/* 文档信息 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('documents.detail.kb')}：{document.kbName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('documents.detail.category')}：{document.categoryName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('documents.detail.creator')}：{document.creatorName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('documents.detail.version')}：{document.version}
            </Typography>
          </Box>
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {tags.map(tag => (
                <Chip 
                  key={tag.id} 
                  label={tag.name}
                  size="small"
                  sx={{
                    bgcolor: alpha('#6C8EF2', 0.1),
                    color: '#6C8EF2',
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* 文档内容 */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            {t('documents.detail.content')}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {document.content}
          </Typography>
        </Paper>

        {/* 版本历史对话框 */}
        <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('documents.detail.versionHistory')}</DialogTitle>
          <DialogContent>
            <PerformanceTable
              data={versions}
              columns={versionColumns}
              loading={loading}
              emptyMessage={t('documents.detail.notFound')}
            />
          </DialogContent>
          <DialogActions>
            <CommonButton
              buttonVariant="cancel"
              onClick={() => setHistoryOpen(false)}
            >
              {t('documents.detail.close')}
            </CommonButton>
          </DialogActions>
        </Dialog>

        {/* 提示消息 */}
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