"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import { LlmConfig, ModelType } from "@/app/types/llm";
import { llmService } from "@/app/services/llm";
import { useTranslation } from "react-i18next";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { CommonSelect } from "@/app/components/common/CommonSelect";

const MODEL_TYPE_OPTIONS = [
  { id: "GENERAL" },
  { id: "REASONING" },
  // { id: 'EMBEDDING' },
] as const;

// 添加卡片颜色配置
const cardColors = [
    { 
        light: { bg: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', border: '#dee2e6' },
        dark: { bg: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', border: '#3a3a3a' }
    }, // 高级灰
    { 
        light: { bg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', border: '#90caf9' },
        dark: { bg: 'linear-gradient(135deg, #0a1a2a, #0d2a3a)', border: '#1a3a4a' }
    }, // 深邃蓝
    { 
        light: { bg: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', border: '#ce93d8' },
        dark: { bg: 'linear-gradient(135deg, #1a0a2a, #2a1a3a)', border: '#3a2a4a' }
    }, // 典雅紫
    { 
        light: { bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', border: '#a5d6a7' },
        dark: { bg: 'linear-gradient(135deg, #0a1a0a, #1a2a1a)', border: '#2a3a2a' }
    }, // 沉稳绿
    { 
        light: { bg: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', border: '#ffb74d' },
        dark: { bg: 'linear-gradient(135deg, #2a1a0a, #3a2a1a)', border: '#4a3a2a' }
    }, // 温暖橙
    { 
        light: { bg: 'linear-gradient(135deg, #fbe9e7, #ffccbc)', border: '#ff8a65' },
        dark: { bg: 'linear-gradient(135deg, #2a0a0a, #3a1a1a)', border: '#4a2a2a' }
    }, // 热情红
    { 
        light: { bg: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)', border: '#80deea' },
        dark: { bg: 'linear-gradient(135deg, #0a2a2a, #1a3a3a)', border: '#2a4a4a' }
    }, // 清新青
    { 
        light: { bg: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', border: '#dee2e6' },
        dark: { bg: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', border: '#3a3a3a' }
    }, // 高级灰
];

export default function LlmPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [configs, setConfigs] = useState<LlmConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<LlmConfig | null>(null);
  const [formData, setFormData] = useState<Partial<LlmConfig>>({
    modelName: "",
    modelCode: "",
    modelProvider: "",
    modelType: "GENERAL",
    apiUrl: "",
    apiKey: "",
    enabled: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await llmService.getList();
      if (response.data.code === 200) {
        setConfigs(response.data.data);
      } else {
        throw new Error(response.data.message || t("llm.fetchError"));
      }
    } catch (error) {
      console.error("获取大模型配置失败:", error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : t("llm.fetchError"),
        severity: "error",
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
        modelName: "",
        modelCode: "",
        modelProvider: "",
        modelType: "GENERAL",
        apiUrl: "",
        apiKey: "",
        enabled: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingConfig(null);
    setFormData({
      modelName: "",
      modelCode: "",
      modelProvider: "",
      modelType: "GENERAL",
      apiUrl: "",
      apiKey: "",
      enabled: true,
    });
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.modelName ||
        !formData.apiUrl ||
        !formData.apiKey ||
        !formData.modelCode ||
        !formData.modelProvider
      ) {
        setSnackbar({
          open: true,
          message: t("llm.nameRequired"),
          severity: "error",
        });
        return;
      }

      if (editingConfig) {
        const response = await llmService.update({
          ...(formData as LlmConfig),
          id: editingConfig.id,
        });
        if (response.data.code === 200) {
          setSnackbar({
            open: true,
            message: t("llm.updateSuccess"),
            severity: "success",
          });
          handleClose();
          fetchConfigs();
        } else {
          throw new Error(response.data.message || t("llm.updateError"));
        }
      } else {
        const response = await llmService.save(
          formData as Omit<LlmConfig, "id" | "createTime" | "updateTime">
        );
        if (response.data.code === 200) {
          setSnackbar({
            open: true,
            message: t("llm.createSuccess"),
            severity: "success",
          });
          handleClose();
          fetchConfigs();
        } else {
          throw new Error(response.data.message || t("llm.createError"));
        }
      }
    } catch (error) {
      console.error("保存大模型配置失败:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : editingConfig
            ? t("llm.updateError")
            : t("llm.createError"),
        severity: "error",
      });
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      const response = await llmService.delete(deletingId);
      if (response.data.code === 200) {
        setSnackbar({
          open: true,
          message: t("llm.deleteSuccess"),
          severity: "success",
        });
        fetchConfigs();
      } else {
        throw new Error(response.data.message || t("llm.deleteError"));
      }
    } catch (error) {
      console.error("删除大模型配置失败:", error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : t("llm.deleteError"),
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
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
          message: t("llm.statusUpdateSuccess"),
          severity: "success",
        });
        await fetchConfigs();
      } else {
        throw new Error(response.data.message || t("llm.statusUpdateError"));
      }
    } catch (error) {
      console.error("更新状态失败:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : t("llm.statusUpdateError"),
        severity: "error",
      });
    }
  };

  return (
    <PerformanceLayout>
      <Box
        sx={{
          p: 3,
          borderColor: "divider",
          bgcolor: "background.paper",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ marginLeft: "auto" }}>
            <CommonButton buttonVariant="add" onClick={() => handleOpen()}>
              {t("llm.createConfig")}
            </CommonButton>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {configs.map((config, index) => {
                const colorIndex = index % cardColors.length;
                const color = cardColors[colorIndex][isDarkMode ? 'dark' : 'light'];
                return (
                    <Grid item xs={12} sm={6} md={4} key={config.id}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                transition: "all 0.3s ease-in-out",
                                background: color.bg,
                                border: `1px solid ${color.border}`,
                                position: 'relative',
                                overflow: 'hidden',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: isDarkMode 
                                        ? 'linear-gradient(45deg, transparent, rgba(255,255,255,0.03))'
                                        : 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1))',
                                    zIndex: 1,
                                },
                                '&:hover': {
                                    transform: "translateY(-4px)",
                                    boxShadow: (theme) => `0 8px 24px ${alpha(color.border, 0.15)}`,
                                    '&:before': {
                                        background: isDarkMode 
                                            ? 'linear-gradient(45deg, transparent, rgba(255,255,255,0.05))'
                                            : 'linear-gradient(45deg, transparent, rgba(255,255,255,0.15))',
                                    }
                                },
                            }}
                        >
                            <CardContent sx={{ 
                                flexGrow: 1,
                                position: 'relative',
                                zIndex: 2,
                            }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        mb: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{ 
                                            fontWeight: 600,
                                            background: isDarkMode
                                                ? 'linear-gradient(45deg, #e0e0e0, #b0b0b0)'
                                                : 'linear-gradient(45deg, #1a237e, #283593)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
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
                                        label={
                                            config.enabled ? t("llm.enabled") : t("llm.disabled")
                                        }
                                    />
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{ 
                                        mb: 1,
                                        fontWeight: 500,
                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.9)'
                                    }}
                                >
                                    {t("llm.modelType")}: {t(`llm.types.${config.modelType}`)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ 
                                        mb: 1,
                                        fontWeight: 500,
                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.9)'
                                    }}
                                >
                                    {t("llm.apiUrl")}: {config.apiUrl}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{
                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.8)',
                                        fontWeight: 500
                                    }}
                                >
                                    {t("common.updateTime")}:{" "}
                                    {new Date(config.updateTime).toLocaleString()}
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    p: 2,
                                    pt: 0,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    position: 'relative',
                                    zIndex: 2,
                                }}
                            >
                                <Tooltip title={t("common.edit")}>
                                    <CommonButton
                                        buttonVariant="edit"
                                        icon
                                        onClick={() => handleOpen(config)}
                                        size="small"
                                    />
                                </Tooltip>
                                <Tooltip title={t("common.delete")}>
                                    <CommonButton
                                        buttonVariant="delete"
                                        icon
                                        onClick={() => handleDelete(config.id)}
                                        size="small"
                                        color="error"
                                    />
                                </Tooltip>
                            </Box>
                        </Card>
                    </Grid>
                );
            })}
          </Grid>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingConfig ? t("llm.editConfig") : t("llm.createConfig")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <CommonInput
                label={t("llm.modelName")}
                value={formData.modelName}
                onChange={(value) =>
                  setFormData({ ...formData, modelName: value as string })
                }
                error={!formData.modelName}
                helperText={!formData.modelName ? t("llm.nameRequired") : ""}
                required
              />
              <CommonInput
                label={t("llm.modelCode")}
                value={formData.modelCode}
                onChange={(value) =>
                  setFormData({ ...formData, modelCode: value as string })
                }
                error={!formData.modelCode}
                helperText={
                  !formData.modelCode ? t("llm.modelCodeRequired") : ""
                }
                required
              />
              <CommonSelect
                label={t("llm.modelType")}
                value={formData.modelType}
                onChange={(value) =>
                  setFormData({ ...formData, modelType: value as ModelType })
                }
                error={!formData.modelType}
                helperText={
                  !formData.modelType ? t("llm.modelTypeRequired") : ""
                }
                required
                options={MODEL_TYPE_OPTIONS.map((opt) => ({
                  id: opt.id,
                  name: t(`llm.types.${opt.id}`),
                }))}
              />
              <CommonSelect
                label={t("llm.modelProvider")}
                value={formData.modelProvider}
                onChange={(value) =>
                  setFormData({ ...formData, modelProvider: value as string })
                }
                error={!formData.modelProvider}
                helperText={
                  !formData.modelProvider ? t("llm.modelProviderRequired") : ""
                }
                required
                options={[
                  { id: "openai", name: t("llm.providers.openai") },
                  { id: "anthropic", name: t("llm.providers.anthropic") },
                  { id: "google", name: t("llm.providers.google") },
                  { id: "meta", name: t("llm.providers.meta") },
                  { id: "microsoft", name: t("llm.providers.microsoft") },
                  { id: "amazon", name: t("llm.providers.amazon") },
                  { id: "baidu", name: t("llm.providers.baidu") },
                  { id: "alibaba", name: t("llm.providers.alibaba") },
                  { id: "tencent", name: t("llm.providers.tencent") },
                  { id: "zhipu", name: t("llm.providers.zhipu") },
                  { id: "minimax", name: t("llm.providers.minimax") },
                  { id: "moonshot", name: t("llm.providers.moonshot") },
                  { id: "deepseek", name: t("llm.providers.deepseek") },
                  { id: "ollama", name: t("llm.providers.ollama") },
                  { id: "other", name: t("llm.providers.other") },
                ]}
              />
              <CommonInput
                label={t("llm.apiUrl")}
                value={formData.apiUrl}
                onChange={(value) =>
                  setFormData({ ...formData, apiUrl: value as string })
                }
                error={!formData.apiUrl}
                helperText={!formData.apiUrl ? t("llm.apiUrlRequired") : ""}
                required
                inputProps={{
                  autoComplete: "off",
                  autoFill: "off",
                }}
              />
              <CommonInput
                label={t("llm.apiKey")}
                value={formData.apiKey}
                onChange={(value) =>
                  setFormData({ ...formData, apiKey: value as string })
                }
                error={!formData.apiKey}
                helperText={!formData.apiKey ? t("llm.apiKeyRequired") : ""}
                required
                isPassword
                inputProps={{
                  autoComplete: "off",
                  autoFill: "off",
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={(e) =>
                      setFormData({ ...formData, enabled: e.target.checked })
                    }
                  />
                }
                label={formData.enabled ? t("llm.enabled") : t("llm.disabled")}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <CommonButton buttonVariant="cancel" onClick={handleClose}>
              {t("common.cancel")}
            </CommonButton>
            <CommonButton
              buttonVariant="submit"
              onClick={handleSubmit}
              disabled={
                !formData.modelName ||
                !formData.modelCode ||
                !formData.modelProvider ||
                !formData.apiUrl ||
                !formData.apiKey
              }
            >
              {t("common.submit")}
            </CommonButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>{t("llm.deleteConfirm")}</DialogTitle>
          <DialogContent>
            <Typography>{t("llm.deleteConfirmMessage")}</Typography>
          </DialogContent>
          <DialogActions>
            <CommonButton
              buttonVariant="cancel"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("common.cancel")}
            </CommonButton>
            <CommonButton buttonVariant="confirm" onClick={handleDeleteConfirm}>
              {t("common.confirm")}
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
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PerformanceLayout>
  );
}
