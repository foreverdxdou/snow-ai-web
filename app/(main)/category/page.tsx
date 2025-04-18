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
  FormControlLabel,
  Switch,
  Checkbox,
} from "@mui/material";
import { Category, KbCategoryCreateDTO } from "@/app/types/category";
import { categoryService } from "@/app/services/category";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { PerformanceTable } from "@/app/components/common/PerformanceTable";
import { usePerformanceData } from "@/app/hooks/usePerformanceData";
import { Pagination } from "@/app/components/common/Pagination";
import { formatDate } from "@/app/utils/format";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { CommonSelect } from "@/app/components/common/CommonSelect";

export default function CategoryPage() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(
    null
  );
  const [formData, setFormData] = React.useState<KbCategoryCreateDTO>({
    name: "",
    description: "",
    parentId: "",
    status: 1,
    sort: 0,
  });

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);

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
    data: categories,
    loading,
    total,
    params,
    setParams,
    refresh,
  } = usePerformanceData<Category>({
    fetchData: categoryService.getList,
    defaultParams,
    autoFetch: true,
  });

  // 使用 useCallback 优化事件处理函数
  const handleOpen = useCallback((category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        parentId: category.parentId || "",
        status: category.status,
        sort: category.sort || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        parentId: "",
        status: 1,
        sort: 0,
      });
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      parentId: "",
      status: 1,
      sort: 0,
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        setSnackbar({
          open: true,
          message: t("category.updateSuccess"),
          severity: "success",
        });
      } else {
        await categoryService.create(formData);
        setSnackbar({
          open: true,
          message: t("category.createSuccess"),
          severity: "success",
        });
      }
      handleClose();
      refresh();
    } catch (error) {
      console.error(`${editingCategory ? "更新" : "创建"}分类失败:`, error);
      setSnackbar({
        open: true,
        message: t("category.operateError"),
        severity: "error",
      });
    }
  }, [editingCategory, formData, handleClose, refresh, t]);

  const handleDelete = useCallback((id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingId) return;
    try {
      await categoryService.delete(deletingId);
      setSnackbar({
        open: true,
        message: t("category.deleteSuccess"),
        severity: "success",
      });
      refresh();
    } catch (error) {
      console.error("删除分类失败:", error);
      setSnackbar({
        open: true,
        message: t("category.operateError"),
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  }, [deletingId, refresh, t]);

  // 使用 useCallback 优化分页处理
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

  const handleStatusChange = useCallback(
    async (category: Category) => {
      try {
        await categoryService.updateStatus(
          category.id,
          category.status === 1 ? 0 : 1
        );
        setSnackbar({
          open: true,
          message: t("category.statusUpdateSuccess"),
          severity: "success",
        });
        refresh();
      } catch (error) {
        console.error("更新状态失败:", error);
        setSnackbar({
          open: true,
          message: t("category.statusUpdateError"),
          severity: "error",
        });
      }
    },
    [refresh, t]
  );

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // 添加批量删除处理函数
  const handleBatchDelete = useCallback(async () => {
    try {
      await categoryService.batchDelete(selectedIds);
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
        setSelectedIds(categories.map((item) => item.id));
      } else {
        setSelectedIds([]);
      }
    },
    [categories]
  );

  // 处理单个选择
  const handleSelect = useCallback((id: string, checked: boolean) => {
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
        key: "selection" as keyof Category,
        title: (
          <Checkbox
            checked={
              categories.length > 0 && selectedIds.length === categories.length
            }
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < categories.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        ),
        width: 50,
        render: (_: any, record: Category) => (
          <Checkbox
            checked={selectedIds.includes(record.id)}
            onChange={(e) => handleSelect(record.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        key: "name" as keyof Category,
        title: t("common.name"),
        render: (_: any, record: Category) => record?.name || "-",
      },
      {
        key: "description" as keyof Category,
        title: t("common.description"),
        render: (_: any, record: Category) => record?.description || "-",
      },
      {
        key: "parentId" as keyof Category,
        title: t("category.parentCategory"),
        render: (_: any, record: Category) => {
          const parent = categories?.find((c) => c.id === record.parentId);
          return parent?.name || t("category.root");
        },
      },
      {
        key: "status" as keyof Category,
        title: t("common.status"),
        render: (_: any, record: Category) => (
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
        key: "createTime" as keyof Category,
        title: t("common.createTime"),
        render: (_: any, record: Category) =>
          record?.createTime ? formatDate(record.createTime) : "-",
      },
      {
        key: "updateTime" as keyof Category,
        title: t("common.updateTime"),
        render: (_: any, record: Category) =>
          record?.updateTime ? formatDate(record.updateTime) : "-",
      },
      {
        key: "id" as keyof Category,
        title: t("common.actions"),
        width: 120,
        render: (_: any, record: Category) =>
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
      categories,
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
        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <CommonInput
              label={t("category.searchByName")}
              value={params.name || ""}
              onChange={(value) =>
                setParams({ ...params, name: value as string })
              }
              sx={{ width: "10%" }}
            />
            <CommonSelect
              label={t("category.searchByStatus")}
              value={params.status}
              onChange={(value) =>
                setParams({ ...params, status: value as number })
              }
              options={[
                { id: 1, name: t("category.enabled") },
                { id: 0, name: t("category.disabled") },
              ]}
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
                setParams({
                  ...defaultParams,
                  current: 1,
                  size: 10,
                });
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
                {t("category.createCategory")}
              </CommonButton>
            </Box>
          </Box>
          <PerformanceTable
            loading={loading}
            data={categories}
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
            {editingCategory
              ? t("category.editCategory")
              : t("category.createCategory")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <CommonInput
                label={t("common.name")}
                value={formData.name || ""}
                onChange={(value) =>
                  setFormData({ ...formData, name: value as string })
                }
                fullWidth
                required
                error={!formData.name}
                helperText={!formData.name ? t("category.nameRequired") : ""}
              />
              <CommonInput
                label={t("common.description")}
                value={formData.description || ""}
                onChange={(value) =>
                  setFormData({ ...formData, description: value as string })
                }
                fullWidth
                multiline
                rows={3}
              />
              <CommonSelect
                label={t("category.selectParentCategory")}
                value={formData.parentId || (null as unknown as string)}
                onChange={(value) =>
                  setFormData({ ...formData, parentId: value as string })
                }
                options={categories?.map((c) => ({ id: c.id, name: c.name }))}
              />
              <CommonInput
                label={t("common.sort")}
                value={formData.sort?.toString() || ""}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    sort: Number(value) || (null as unknown as number),
                  })
                }
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

        {/* 删除确认对话框 */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>{t("category.deleteConfirm")}</DialogTitle>
          <DialogContent>
            <Typography>{t("category.deleteConfirmMessage")}</Typography>
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
