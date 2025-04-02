'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { LlmConfig } from '@/app/types/llm';
import { llmService } from '@/app/services/llm';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/app/components/common/CommonButton';
import { CommonInput } from '@/app/components/common/CommonInput';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';

export default function LlmPage() {
  const { t } = useTranslation();
  const [configs, setConfigs] = useState<LlmConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<LlmConfig | null>(null);
  const [formData, setFormData] = useState<Partial<LlmConfig>>({
    modelName: '',
    apiUrl: '',
    apiKey: '',
    enabled: true,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await llmService.getList();
      if (response.data.code === 200) {
        setConfigs(response.data.data);
      } else {
        throw new Error(response.data.message || t('llm.fetchError'));
      }
    } catch (error) {
      console.error('获取大模型配置失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : t('llm.fetchError'),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
    return () => {
      setConfigs([]);
    };
  }, []);

  const handleOpen = (config?: LlmConfig) => {
    if (config) {
      setEditingConfig(config);
      setFormData(config);
    } else {
      setEditingConfig(null);
      setFormData({
        modelName: '',
        apiUrl: '',
        apiKey: '',
        enabled: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingConfig(null);
    setFormData({
      modelName: '',
      apiUrl: '',
      apiKey: '',
      enabled: true,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.modelName || !formData.apiUrl || !formData.apiKey) {
        setSnackbar({
          open: true,
          message: t('llm.nameRequired'),
          severity: 'error',
        });
        return;
      }

      if (editingConfig) {
        const response = await llmService.update({
          ...formData as LlmConfig,
          id: editingConfig.id,
        });
        if (response.data.code === 200) {
          setSnackbar({
            open: true,
            message: t('llm.updateSuccess'),
            severity: 'success',
          });
          handleClose();
          fetchConfigs();
        } else {
          throw new Error(response.data.message || t('llm.updateError'));
        }
      } else {
        const response = await llmService.save(formData as Omit<LlmConfig, 'id' | 'createTime' | 'updateTime'>);
        if (response.data.code === 200) {
          setSnackbar({
            open: true,
            message: t('llm.createSuccess'),
            severity: 'success',
          });
          handleClose();
          fetchConfigs();
        } else {
          throw new Error(response.data.message || t('llm.createError'));
        }
      }
    } catch (error) {
      console.error('保存大模型配置失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : (editingConfig ? t('llm.updateError') : t('llm.createError')),
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('llm.deleteConfirmMessage'))) return;
    try {
      const response = await llmService.delete(id);
      if (response.data.code === 200) {
        setSnackbar({
          open: true,
          message: t('llm.deleteSuccess'),
          severity: 'success',
        });
        fetchConfigs();
      } else {
        throw new Error(response.data.message || t('llm.deleteError'));
      }
    } catch (error) {
      console.error('删除大模型配置失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : t('llm.deleteError'),
        severity: 'error',
      });
    }
  };

  const handleStatusChange = async (config: LlmConfig) => {
    try {
      const response = await llmService.update({
        ...config,
        enabled: !config.enabled,
      });
      if (response.data.code === 200) {
        setSnackbar({
          open: true,
          message: t('llm.statusUpdateSuccess'),
          severity: 'success',
        });
        await fetchConfigs();
      } else {
        throw new Error(response.data.message || t('llm.statusUpdateError'));
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : t('llm.statusUpdateError'),
        severity: 'error',
      });
    }
  };

  return (
    <PerformanceLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>

          <Box sx={{ marginLeft: 'auto' }}>
            <Tooltip title={t('common.refresh')}>
              <CommonButton
                buttonVariant="add"
                onClick={fetchConfigs}
                sx={{ mr: 1 }}
              >
                <RefreshIcon />
              </CommonButton>
            </Tooltip>
            <CommonButton
              buttonVariant="add"
              onClick={() => handleOpen()}
            >
              {t('llm.createConfig')}
            </CommonButton>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {configs.map((config) => (
              <Grid item xs={12} sm={6} md={4} key={config.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {config.modelName}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={config.enabled}
                            onChange={() => handleStatusChange(config)}
                            color="primary"
                          />
                        }
                        label={config.enabled ? t('llm.enabled') : t('llm.disabled')}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('llm.apiUrl')}: {config.apiUrl}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('common.updateTime')}: {new Date(config.updateTime).toLocaleString()}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title={t('common.edit')}>
                      <CommonButton
                        buttonVariant="edit"
                        icon
                        onClick={() => handleOpen(config)}
                        size="small"
                      >
                      </CommonButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <CommonButton
                        buttonVariant="delete"
                        icon
                        onClick={() => handleDelete(config.id)}
                        size="small"
                        color="error"
                      >
                      </CommonButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingConfig ? t('llm.editConfig') : t('llm.createConfig')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <CommonInput
                label={t('llm.modelName')}
                value={formData.modelName}
                onChange={(value) => setFormData({ ...formData, modelName: value as string })}
                error={!formData.modelName}
                helperText={!formData.modelName ? t('llm.nameRequired') : ''}
                required
              />
              <CommonInput
                label={t('llm.apiUrl')}
                value={formData.apiUrl}
                onChange={(value) => setFormData({ ...formData, apiUrl: value as string })}
                error={!formData.apiUrl}
                helperText={!formData.apiUrl ? t('llm.apiUrlRequired') : ''}
                required
              />
              <CommonInput
                label={t('llm.apiKey')}
                value={formData.apiKey}
                onChange={(value) => setFormData({ ...formData, apiKey: value as string })}
                error={!formData.apiKey}
                helperText={!formData.apiKey ? t('llm.apiKeyRequired') : ''}
                required
                type="password"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  />
                }
                label={formData.enabled ? t('llm.enabled') : t('llm.disabled')}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <CommonButton
              buttonVariant="cancel"
              onClick={handleClose}
            >
              {t('common.cancel')}
            </CommonButton>
            <CommonButton
              buttonVariant="submit"
              onClick={handleSubmit}
              disabled={!formData.modelName || !formData.apiUrl || !formData.apiKey}
            >
              {t('common.submit')}
            </CommonButton>
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