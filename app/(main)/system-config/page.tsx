"use client";

import React, { useMemo, useCallback, useState } from "react";
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
  Checkbox,
} from "@mui/material";
import {
  SystemConfig,
  SystemConfigSaveRequest,
} from "@/app/types/system-config";
import { systemConfigService } from "@/app/services/system-config";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { PerformanceTable } from "@/app/components/common/PerformanceTable";
import { usePerformanceData } from "@/app/hooks/usePerformanceData";
import { Pagination } from "@/app/components/common/Pagination";
import { formatDate } from "@/app/utils/format";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";

export default function SystemConfigPage() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingConfig, setEditingConfig] = React.useState<SystemConfig | null>(
    null
  );
  const [formData, setFormData] = React.useState<SystemConfigSaveRequest>({
    configKey: "",
    configValue: "",
    description: "",
    configType: "",
  });

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // 使用 useMemo 优化 defaultParams
  const defaultParams = useMemo(
    () => ({
      current: 1,
      size: 10,
      configKey: "",
      configType: "",
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
  } = usePerformanceData<SystemConfig>({
    fetchData: systemConfigService.getList,
    defaultParams,
    autoFetch: true,
  });

  // 使用 useCallback 优化事件处理函数
  const handleOpen = useCallback((config?: SystemConfig) => {
    if (config) {
      setEditingConfig(config);
      setFormData({
        id: config.id,
        configKey: config.configKey,
        configValue: config.configValue,
        description: config.description,
        configType: config.configType,
      });
    } else {
      setEditingConfig(null);
      setFormData({
        configKey: "",
        configValue: "",
        description: "",
        configType: "",
      });
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingConfig(null);
    setFormData({
      configKey: "",
      configValue: "",
      description: "",
      configType: "",
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (editingConfig) {
        await systemConfigService.update(editingConfig.id, formData);
        setSnackbar({
          open: true,
          message: t("systemConfig.operateSuccess"),
          severity: "success",
        });
      } else {
        await systemConfigService.add(formData);
        setSnackbar({
          open: true,
          message: t("systemConfig.operateSuccess"),
          severity: "success",
        });
      }
      handleClose();
      refresh();
    } catch (error) {
      console.error(`${editingConfig ? "更新" : "创建"}配置失败:`, error);
      setSnackbar({
        open: true,
        message: t("systemConfig.operateError"),
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
      await systemConfigService.delete(deletingId);
      setSnackbar({
        open: true,
        message: t("systemConfig.operateSuccess"),
        severity: "success",
      });
      refresh();
    } catch (error) {
      console.error("删除配置失败:", error);
      setSnackbar({
        open: true,
        message: t("systemConfig.operateError"),
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  }, [deletingId, refresh, t]);

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

  // 处理批量删除
  const handleBatchDelete = useCallback(async () => {
    try {
      await systemConfigService.batchDelete(selectedIds);
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

  // 使用 useMemo 优化表格配置
  const columns = useMemo(
    () => [
      {
        key: "selection" as keyof SystemConfig,
        title: (
          <Checkbox
            checked={configs.length > 0 && selectedIds.length === configs.length}
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < configs.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        ),
        width: 50,
        render: (_: any, record: SystemConfig) => (
          <Checkbox
            checked={selectedIds.includes(record.id)}
            onChange={(e) => handleSelect(record.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        key: "configKey" as keyof SystemConfig,
        title: t("systemConfig.configKey"),
        render: (_: any, record: SystemConfig) => record?.configKey || "-",
      },
      {
        key: "configType" as keyof SystemConfig,
        title: t("systemConfig.configType"),
        render: (_: any, record: SystemConfig) => record?.configType || "-",
      },
      {
        key: "configValue" as keyof SystemConfig,
        title: t("systemConfig.configValue"),
        render: (_: any, record: SystemConfig) => record?.configValue || "-",
      },
      {
        key: "description" as keyof SystemConfig,
        title: t("systemConfig.description"),
        render: (_: any, record: SystemConfig) => record?.description || "-",
      },
      {
        key: "createTime" as keyof SystemConfig,
        title: t("common.createTime"),
        render: (_: any, record: SystemConfig) =>
          record?.createTime ? formatDate(record.createTime) : "-",
      },
      {
        key: "updateTime" as keyof SystemConfig,
        title: t("common.updateTime"),
        render: (_: any, record: SystemConfig) =>
          record?.updateTime ? formatDate(record.updateTime) : "-",
      },
      {
        key: "id" as keyof SystemConfig,
        title: t("common.actions"),
        width: 120,
        render: (_: any, record: SystemConfig) =>
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
    [t, handleOpen, handleDelete, configs, selectedIds, handleSelectAll, handleSelect]
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <CommonInput
              label={t("systemConfig.configKey")}
              value={params.configKey || ""}
              onChange={(value) =>
                setParams({ ...params, configKey: value as string })
              }
              sx={{ width: "10%" }}
            />
            <CommonInput
              label={t("systemConfig.configType")}
              value={params.configType || ""}
              onChange={(value) =>
                setParams({ ...params, configType: value as string })
              }
              sx={{ width: "10%" }}
            />

            <CommonButton
              buttonVariant="search"
              onClick={() => {
                setParams({
                  ...params,
                  current: 1,
                  size: params.size,
                });
              }}
              sx={{
                flex: { xs: 1, sm: "0 0 auto" },
                minWidth: { sm: 50 },
              }}
            >
              {t("common.search")}
            </CommonButton>
            <CommonButton
              buttonVariant="reset"
              onClick={() => {
                setParams(defaultParams);
                refresh();
              }}
            >
              {t("common.reset")}
            </CommonButton>

            <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
              {selectedIds.length > 0 && (
                <CommonButton
                  buttonVariant="batchDelete"
                  onClick={() => setBatchDeleteDialogOpen(true)}
                >
                  {t("common.batchDelete")} ({selectedIds.length})
                </CommonButton>
              )}
              <CommonButton buttonVariant="add" onClick={() => handleOpen()}>
                {t("systemConfig.add")}
              </CommonButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
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

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingConfig ? t("systemConfig.edit") : t("systemConfig.add")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <CommonInput
                label={t("systemConfig.configKey")}
                value={formData.configKey || ""}
                onChange={(value) =>
                  setFormData({ ...formData, configKey: value as string })
                }
                fullWidth
                required
                error={!formData.configKey}
                helperText={
                  !formData.configKey
                    ? t("systemConfig.pleaseEnterConfigKey")
                    : ""
                }
              />
              <CommonInput
                label={t("systemConfig.configType")}
                value={formData.configType || ""}
                onChange={(value) =>
                  setFormData({ ...formData, configType: value as string })
                }
                fullWidth
                required
                error={!formData.configType}
                helperText={
                  !formData.configType
                    ? t("systemConfig.pleaseEnterConfigType")
                    : ""
                }
              />

              <CommonInput
                label={t("systemConfig.configValue")}
                value={formData.configValue || ""}
                onChange={(value) =>
                  setFormData({ ...formData, configValue: value as string })
                }
                fullWidth
                required
                error={!formData.configValue}
                helperText={
                  !formData.configValue
                    ? t("systemConfig.pleaseEnterConfigValue")
                    : ""
                }
              />
              <CommonInput
                label={t("systemConfig.description")}
                value={formData.description || ""}
                onChange={(value) =>
                  setFormData({ ...formData, description: value as string })
                }
                fullWidth
                multiline
                rows={3}
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
                !formData.configKey ||
                !formData.configType ||
                !formData.configValue
              }
            >
              {t("common.submit")}
            </CommonButton>
          </DialogActions>
        </Dialog>

        {/* 删除确认对话框 */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>{t("systemConfig.deleteConfirm")}</DialogTitle>
          <DialogContent>
            <Typography>{t("systemConfig.deleteConfirmMessage")}</Typography>
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

        {/* 批量删除确认对话框 */}
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
