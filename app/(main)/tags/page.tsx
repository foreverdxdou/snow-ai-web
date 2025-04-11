"use client";

import React, { useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Checkbox,
} from "@mui/material";
import { tagService } from "@/app/services/tag";
import type { Tag, TagCreateDTO } from "@/app/types/tag";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { PerformanceTable } from "@/app/components/common/PerformanceTable";
import { usePerformanceData } from "@/app/hooks/usePerformanceData";
import { Pagination } from "@/app/components/common/Pagination";
import { formatDate } from "@/app/utils/format";
import { CommonButton } from "@/app/components/common/CommonButton";

export default function TagsPage() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null);
  const [formData, setFormData] = React.useState<TagCreateDTO>({
    name: "",
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
    }),
    []
  );

  // 使用 usePerformanceData 优化数据获取
  const {
    data: tags,
    loading,
    total,
    params,
    setParams,
    refresh,
  } = usePerformanceData<Tag>({
    fetchData: tagService.getList,
    defaultParams,
    autoFetch: true,
  });

  // 使用 useCallback 优化事件处理函数
  const handleOpen = useCallback((tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
      });
    } else {
      setEditingTag(null);
      setFormData({
        name: "",
      });
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingTag(null);
    setFormData({
      name: "",
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (editingTag) {
        await tagService.update(editingTag.id, formData);
        setSnackbar({
          open: true,
          message: t("tags.updateSuccess"),
          severity: "success",
        });
      } else {
        await tagService.create(formData);
        setSnackbar({
          open: true,
          message: t("tags.createSuccess"),
          severity: "success",
        });
      }
      handleClose();
      refresh();
    } catch (error) {
      console.error(`${editingTag ? "更新" : "创建"}标签失败:`, error);
      setSnackbar({
        open: true,
        message: editingTag ? t("tags.updateError") : t("tags.createError"),
        severity: "error",
      });
    }
  }, [editingTag, formData, handleClose, refresh, t]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm(t("tags.deleteConfirm"))) return;
      try {
        await tagService.delete(id);
        setSnackbar({
          open: true,
          message: t("tags.deleteSuccess"),
          severity: "success",
        });
        refresh();
      } catch (error) {
        console.error("删除标签失败:", error);
        setSnackbar({
          open: true,
          message: t("tags.deleteError"),
          severity: "error",
        });
      }
    },
    [refresh, t]
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
      await tagService.batchDelete(selectedIds);
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
        setSelectedIds(tags.map((item) => item.id));
      } else {
        setSelectedIds([]);
      }
    },
    [tags]
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
        key: "selection" as keyof Tag,
        title: (
          <Checkbox
            checked={tags.length > 0 && selectedIds.length === tags.length}
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < tags.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        ),
        width: 50,
        render: (_: any, record: Tag) => (
          <Checkbox
            checked={selectedIds.includes(record.id)}
            onChange={(e) => handleSelect(record.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        key: "name" as keyof Tag,
        title: t("common.name"),
        render: (_: any, record: Tag) => record?.name || "-",
      },
      {
        key: "createTime" as keyof Tag,
        title: t("common.createTime"),
        render: (_: any, record: Tag) =>
          record?.createTime ? formatDate(record.createTime) : "-",
      },
      {
        key: "updateTime" as keyof Tag,
        title: t("common.updateTime"),
        render: (_: any, record: Tag) =>
          record?.updateTime ? formatDate(record.updateTime) : "-",
      },
      {
        key: "id" as keyof Tag,
        title: t("common.actions"),
        width: 120,
        render: (_: any, record: Tag) =>
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
      tags,
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
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              {selectedIds.length > 0 && (
                <CommonButton
                  buttonVariant="batchDelete"
                  onClick={() => setBatchDeleteDialogOpen(true)}
                >
                  {t("common.batchDelete")} ({selectedIds.length})
                </CommonButton>
              )}
              <CommonButton buttonVariant="add" onClick={() => handleOpen()}>
                {t("tags.createTag")}
              </CommonButton>
            </Box>
          </Box>
          <PerformanceTable
            loading={loading}
            data={tags}
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
            {editingTag ? t("tags.editTag") : t("tags.createTag")}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label={t("common.name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                error={!formData.name}
                helperText={!formData.name ? t("tags.nameRequired") : ""}
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
              disabled={!formData.name}
            >
              {t("common.submit")}
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
