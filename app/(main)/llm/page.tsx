'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { LlmConfig } from '../../types/llm';
import { llmService } from '../../services/llm';
import { handleResponse } from '../../utils/response';

export default function LlmPage() {
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
      if (response.code === 200) {
        setConfigs(response.data);
      } else {
        throw new Error(response.message || '获取配置失败');
      }
    } catch (error) {
      console.error('获取大模型配置失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '获取配置失败',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
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
      if (editingConfig) {
        const response = await llmService.update({
          ...formData as LlmConfig,
          id: editingConfig.id,
        });
        if (response.code === 200) {
          setSnackbar({
            open: true,
            message: '更新成功',
            severity: 'success',
          });
          handleClose();
          fetchConfigs();
        } else {
          throw new Error(response.message || '更新失败');
        }
      } else {
        const response = await llmService.save(formData as Omit<LlmConfig, 'id' | 'createTime' | 'updateTime'>);
        if (response.code === 200) {
          setSnackbar({
            open: true,
            message: '添加成功',
            severity: 'success',
          });
          handleClose();
          fetchConfigs();
        } else {
          throw new Error(response.message || '添加失败');
        }
      }
    } catch (error) {
      console.error('保存大模型配置失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '操作失败',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个配置吗？')) return;
    try {
      const response = await llmService.delete(id);
      if (response.code === 200) {
        setSnackbar({
          open: true,
          message: '删除成功',
          severity: 'success',
        });
        fetchConfigs();
      } else {
        throw new Error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除大模型配置失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '删除失败',
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
      if (response.code === 200) {
        setSnackbar({
          open: true,
          message: '状态更新成功',
          severity: 'success',
        });
        await fetchConfigs();
      } else {
        throw new Error(response.message || '更新状态失败');
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '更新状态失败',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          大模型配置
        </Typography>
        <Box>
          <Tooltip title="刷新">
            <IconButton onClick={fetchConfigs} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{
              background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
              },
            }}
          >
            新增配置
          </Button>
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
                      label={config.enabled ? '启用' : '禁用'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    API地址: {config.apiUrl}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    API密钥: {config.apiKey.substring(0, 8)}...
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    更新时间: {new Date(config.updateTime).toLocaleString()}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip title="编辑">
                    <IconButton onClick={() => handleOpen(config)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="删除">
                    <IconButton onClick={() => handleDelete(config.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingConfig ? '编辑大模型配置' : '新增大模型配置'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="模型名称"
              value={formData.modelName}
              onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="API地址"
              value={formData.apiUrl}
              onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="API密钥"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              type="password"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                />
              }
              label="启用"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
              },
            }}
          >
            确定
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