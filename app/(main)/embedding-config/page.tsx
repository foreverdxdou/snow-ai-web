"use client";

import React, { useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  Snackbar,
  Stack,
  FormControlLabel,
  Switch,
  Checkbox,
} from "@mui/material";
import type {
  EmbeddingConfig,
  EmbeddingConfigSaveRequest,
} from "@/app/types/embedding-config";
import { embeddingConfigService } from "@/app/services/embedding-config";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { PerformanceTable } from "@/app/components/common/PerformanceTable";
import { usePerformanceData } from "@/app/hooks/usePerformanceData";
import { Pagination } from "@/app/components/common/Pagination";
import { formatDate } from "@/app/utils/format";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { CommonSelect } from "@/app/components/common/CommonSelect";

export default function EmbeddingConfigPage() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [editingConfig, setEditingConfig] =
    React.useState<EmbeddingConfig | null>(null);
  const [formData, setFormData] = React.useState<EmbeddingConfigSaveRequest>({
    name: "",
    remark: "",
    modelType: "",
    dimensions: 2048,
    status: 0,
    baseUrl: "",
    apiKey: "",
  });

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] =
    React.useState(false);

  // 使用 useMemo 优化 defaultParams
  const defaultParams = useMemo(
    () => ({
      current: 1,
      size: 10,
      name: "",
      status: undefined,
    }),
    []
  );

  // 使用 usePerformanceData 优化数据获取
  const {
    data: configs,
    loading,
    total,
    params,
    setParams,
    refresh,
  } = usePerformanceData<EmbeddingConfig>({
    fetchData: embeddingConfigService.getList,
    defaultParams,
    autoFetch: true,
  });

  // 使用 useCallback 优化事件处理函数
  const handleOpen = useCallback((config?: EmbeddingConfig) => {
    if (config) {
      setEditingConfig(config);
      setFormData({
        id: config.id,
        name: config.name,
        remark: config.remark,
        modelType: config.modelType,
        dimensions: config.dimensions,
        status: config.status,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
      });
    } else {
      setEditingConfig(null);
      setFormData({
        name: "",
        remark: "",
        modelType: "",
        dimensions: 2048,
        status: 0,
        baseUrl: "",
        apiKey: "",
      });
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingConfig(null);
    setFormData({
      name: "",
      remark: "",
      modelType: "",
      dimensions: 2048,
      status: 0,
      baseUrl: "",
      apiKey: "",
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (editingConfig) {
        await embeddingConfigService.update(editingConfig.id, formData);
        setSnackbar({
          open: true,
          message: t("embeddingConfig.updateSuccess"),
          severity: "success",
        });
      } else {
        await embeddingConfigService.add(formData);
        setSnackbar({
          open: true,
          message: t("embeddingConfig.createSuccess"),
          severity: "success",
        });
      }
      handleClose();
      refresh();
    } catch (error) {
      console.error(`${editingConfig ? "更新" : "创建"}配置失败:`, error);
      setSnackbar({
        open: true,
        message: t("embeddingConfig.saveError"),
        severity: "error",
      });
    }
  }, [editingConfig, formData, handleClose, refresh, t]);

  const handleDelete = useCallback((id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingId) return;
    try {
      await embeddingConfigService.delete(deletingId);
      setSnackbar({
        open: true,
        message: t("embeddingConfig.deleteSuccess"),
        severity: "success",
      });
      refresh();
    } catch (error) {
      console.error("删除配置失败:", error);
      setSnackbar({
        open: true,
        message: t("embeddingConfig.deleteError"),
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  }, [deletingId, refresh, t]);

  const handleStatusChange = useCallback(
    async (config: EmbeddingConfig) => {
      try {
        await embeddingConfigService.toggleEnabled(
          config.id,
          config.status === 1 ? 0 : 1
        );
        setSnackbar({
          open: true,
          message: t("embeddingConfig.statusUpdateSuccess"),
          severity: "success",
        });
        refresh();
      } catch (error) {
        console.error("更新状态失败:", error);
        setSnackbar({
          open: true,
          message: t("embeddingConfig.statusUpdateError"),
          severity: "error",
        });
      }
    },
    [t, refresh]
  );

  // 使用 useDebouncedCallback 优化分页处理
  const handlePageChange = useCallback(
    (page: number, size: number) => {
      setParams({
        ...params,
        current: page,
        size: size,
      });
    },
    [params, setParams]
  );

  // 添加批量删除处理函数
  const handleBatchDelete = useCallback(async () => {
    try {
      await embeddingConfigService.batchDelete(selectedIds);
      setSnackbar({
        open: true,
        message: t("common.batchDeleteSuccess"),
        severity: "success",
      });
      setSelectedIds([]);
      refresh();
    } catch (error) {
      console.error("批量删除失败:", error);
      setSnackbar({
        open: true,
        message: t("common.batchDeleteError"),
        severity: "error",
      });
    }
  }, [selectedIds, refresh, t]);

  // 处理全选
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(configs.map((item) => item.id));
      } else {
        setSelectedIds([]);
      }
    },
    [configs]
  );

  // 处理单个选择
  const handleSelect = useCallback((id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  }, []);

  // 使用 useMemo 优化表格配置
  const columns = useMemo(
    () => [
      {
        key: "selection" as keyof EmbeddingConfig,
        title: (
          <Checkbox
            checked={
              configs.length > 0 && selectedIds.length === configs.length
            }
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < configs.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        ),
        width: 50,
        render: (_: any, record: EmbeddingConfig) => (
          <Checkbox
            checked={selectedIds.includes(record.id)}
            onChange={(e) => handleSelect(record.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        key: "name" as keyof EmbeddingConfig,
        title: t("common.name"),
        render: (_: any, record: EmbeddingConfig) => record?.name || "-",
      },
      {
        key: "baseUrl" as keyof EmbeddingConfig,
        title: t("embeddingConfig.baseUrl"),
        render: (_: any, record: EmbeddingConfig) => record?.baseUrl || "-",
      },
      {
        key: "modelType" as keyof EmbeddingConfig,
        title: t("embeddingConfig.modelType"),
        render: (_: any, record: EmbeddingConfig) => record?.modelType || "-",
      },
      {
        key: "dimensions" as keyof EmbeddingConfig,
        title: t("embeddingConfig.dimensions"),
        render: (_: any, record: EmbeddingConfig) => record?.dimensions || "-",
      },
      {
        key: "status" as keyof EmbeddingConfig,
        title: t("common.status"),
        render: (_: any, record: EmbeddingConfig) => (
          <FormControlLabel
            control={
              <Switch
                checked={record.status === 1}
                onChange={() => handleStatusChange(record)}
                color="primary"
              />
            }
            label={
              record.status === 1 ? t("common.enable") : t("common.disable")
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
              },
            }}
          />
        ),
      },
      {
        key: "updateTime" as keyof EmbeddingConfig,
        title: t("common.updateTime"),
        render: (_: any, record: EmbeddingConfig) =>
          record?.updateTime ? formatDate(record.updateTime) : "-",
      },
      {
        key: "remark" as keyof EmbeddingConfig,
        title: t("common.remark"),
        render: (_: any, record: EmbeddingConfig) => record?.remark || "-",
      },
      {
        key: "id" as keyof EmbeddingConfig,
        title: t("common.actions"),
        width: 120,
        render: (_: any, record: EmbeddingConfig) =>
          record && (
            <Stack direction="row" spacing={1}>
              <Tooltip title={t("common.edit")}>
                <CommonButton
                  buttonVariant="edit"
                  icon
                  onClick={() => handleOpen(record)}
                />
              </Tooltip>
              <Tooltip title={t("common.delete")}>
                <CommonButton
                  buttonVariant="delete"
                  icon
                  onClick={() => handleDelete(record.id)}
                />
              </Tooltip>
            </Stack>
          ),
      },
    ],
    [
      t,
      handleOpen,
      handleDelete,
      handleStatusChange,
      configs,
      selectedIds,
      handleSelectAll,
      handleSelect,
    ]
  );

  return (
    <PerformanceLayout>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          borderColor: "divider",
          bgcolor: "background.paper",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 3,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
              <CommonInput
                label={t("common.name")}
                value={params.name || ""}
                onChange={(value) =>
                  setParams({ ...params, name: value as string })
                }
                sx={{ width: "10%" }}
              />
              <CommonSelect
                label={t("common.status")}
                value={params.status}
                onChange={(value) =>
                  setParams({ ...params, status: value as number })
                }
                options={[
                  { id: 1, name: t("common.enable") },
                  { id: 0, name: t("common.disable") },
                ]}
              />
              <CommonButton
                buttonVariant="search"
                onClick={() => setParams({ ...params, current: 1 })}
              >
                {t("common.search")}
              </CommonButton>
              <CommonButton
                buttonVariant="reset"
                onClick={() => setParams(defaultParams)}
              >
                {t("common.reset")}
              </CommonButton>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              {selectedIds.length > 0 && (
                <CommonButton
                  buttonVariant="batchDelete"
                  onClick={() => setBatchDeleteDialogOpen(true)}
                >
                  {t("common.batchDelete")} ({selectedIds.length})
                </CommonButton>
              )}
              <CommonButton buttonVariant="add" onClick={() => handleOpen()}>
                {t("embeddingConfig.add")}
              </CommonButton>
            </Box>
          </Box>

          <PerformanceTable
            loading={loading}
            data={configs}
            columns={columns}
            emptyMessage={t("common.noData")}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Pagination
              total={total}
              current={Number(params.current)}
              pageSize={Number(params.size)}
              onChange={handlePageChange}
            />
          </Box>
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingConfig
              ? t("embeddingConfig.edit")
              : t("embeddingConfig.add")}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <CommonInput
                  label={t("common.name")}
                  value={formData.name}
                  onChange={(value) =>
                    setFormData({ ...formData, name: value as string })
                  }
                  required
                  error={!formData.name}
                  helperText={
                    !formData.name ? t("embeddingConfig.nameRequired") : ""
                  }
                />
                <CommonInput
                  label={t("embeddingConfig.baseUrl")}
                  value={formData.baseUrl}
                  onChange={(value) =>
                    setFormData({ ...formData, baseUrl: value as string })
                  }
                  required
                  error={!formData.baseUrl}
                  helperText={
                    !formData.baseUrl
                      ? t("embeddingConfig.baseUrlRequired")
                      : ""
                  }
                />
                <CommonInput
                  label={t("embeddingConfig.apiKey")}
                  value={formData.apiKey}
                  onChange={(value) =>
                    setFormData({ ...formData, apiKey: value as string })
                  }
                  required
                  error={!formData.apiKey}
                  helperText={
                    !formData.apiKey ? t("embeddingConfig.apiKeyRequired") : ""
                  }
                />
                <CommonInput
                  label={t("embeddingConfig.modelType")}
                  value={formData.modelType}
                  onChange={(value) =>
                    setFormData({ ...formData, modelType: value as string })
                  }
                  required
                  error={!formData.modelType}
                  helperText={
                    !formData.modelType
                      ? t("embeddingConfig.modelRequired")
                      : ""
                  }
                />
                <CommonInput
                  type="number"
                  label={t("embeddingConfig.dimensions")}
                  value={formData.dimensions || 2048}
                  onChange={(value) =>
                    setFormData({ ...formData, dimensions: Number(value) })
                  }
                  required
                  error={!formData.dimensions || formData.dimensions <= 0}
                  helperText={
                    !formData.dimensions || formData.dimensions <= 0
                      ? t("embeddingConfig.dimensionRequired")
                      : ""
                  }
                />
                <CommonInput
                  label={t("common.remark")}
                  value={formData.remark}
                  onChange={(value) =>
                    setFormData({ ...formData, remark: value as string })
                  }
                  multiline
                  rows={3}
                />
                <CommonSelect
                  label={t("common.status")}
                  value={formData.status || 0}
                  onChange={(value) =>
                    setFormData({ ...formData, status: Number(value) })
                  }
                  options={[
                    { id: 1, name: t("common.enable") },
                    { id: 0, name: t("common.disable") },
                  ]}
                />
              </Stack>
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
                !formData.name ||
                !formData.modelType ||
                !formData.baseUrl ||
                !formData.apiKey ||
                formData.dimensions <= 0
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
          <DialogTitle>{t("embeddingConfig.deleteConfirm")}</DialogTitle>
          <DialogContent>
            <Typography>{t("embeddingConfig.deleteConfirmMessage")}</Typography>
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

        <Dialog
          open={batchDeleteDialogOpen}
          onClose={() => setBatchDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>{t("common.batchDeleteConfirm")}</DialogTitle>
          <DialogContent>
            <Typography>{t("common.batchDeleteConfirmMessage")}</Typography>
          </DialogContent>
          <DialogActions>
            <CommonButton
              buttonVariant="cancel"
              onClick={() => setBatchDeleteDialogOpen(false)}
            >
              {t("common.cancel")}
            </CommonButton>
            <CommonButton
              buttonVariant="confirm"
              onClick={() => {
                handleBatchDelete();
                setBatchDeleteDialogOpen(false);
              }}
            >
              {t("common.confirm")}
            </CommonButton>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
