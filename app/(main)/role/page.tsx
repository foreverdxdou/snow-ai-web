"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Stack,
  Paper,
} from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { SearchBar } from "@/app/components/common/SearchBar";
import { Pagination } from "@/app/components/common/Pagination";
import { PerformanceTable } from "@/app/components/common/PerformanceTable";
import { roleService } from "@/app/services/role";
import { permissionService } from "@/app/services/permission";
import type { Role, RoleDTO } from "@/app/types/role";
import type { TreePermission } from "@/app/types/permission";
import { usePerformanceData } from "@/app/hooks/usePerformanceData";
import { useDebouncedCallback } from "@/app/utils/performance";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function RolePage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleDTO>({
    roleName: "",
    roleCode: "",
    description: "",
    permissionIds: [],
    status: 1,
  });
  const [permissions, setPermissions] = useState<TreePermission[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const theme = useTheme();

  // 使用 useMemo 优化 defaultParams
  const defaultParams = useMemo(
    () => ({
      current: 1,
      size: 10,
      roleName: "",
      roleCode: "",
    }),
    []
  );

  // 使用 usePerformanceData 优化数据获取
  const {
    data: roles,
    loading,
    total,
    params,
    setParams,
    refresh,
  } = usePerformanceData<Role>({
    fetchData: roleService.getList,
    defaultParams,
    autoFetch: true,
  });

  // 获取权限树
  const fetchPermissions = useCallback(async () => {
    try {
      const response = await permissionService.getTreeForControl();
      if (response.data?.code === 200 && response.data?.data) {
        setPermissions(response.data.data);
      }
    } catch (error) {
      console.error("获取权限列表失败:", error);
      setSnackbar({
        open: true,
        message: t("common.permission.fetchError"),
        severity: "error",
      });
    }
  }, [t]);

  // 获取角色权限
  const fetchRolePermissions = useCallback(async (roleId: number) => {
    try {
      const response = await roleService.getPermissions(roleId);
      if (response.data?.code === 200 && response.data?.data) {
        setSelectedItems(response.data.data);
      }
    } catch (error) {
      console.error("获取角色权限失败:", error);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // 处理打开对话框
  const handleOpen = useCallback(
    async (role?: Role) => {
      if (role) {
        setEditingRole(role);
        setFormData({
          id: role.id,
          roleName: role.roleName,
          roleCode: role.roleCode,
          description: role.description,
          permissionIds: [],
          status: role.status,
        });
        await fetchRolePermissions(role.id);
      } else {
        setEditingRole(null);
        setFormData({
          roleName: "",
          roleCode: "",
          description: "",
          permissionIds: [],
          status: 1,
        });
        setSelectedItems([]);
      }
      setOpen(true);
    },
    [fetchRolePermissions]
  );

  // 处理关闭对话框
  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingRole(null);
    setFormData({
      roleName: "",
      roleCode: "",
      description: "",
      permissionIds: [],
      status: 1,
    });
  }, []);

  // 处理全选/取消全选
  const handleSelectAll = useCallback(() => {
    setSelectedItems((prev) =>
      prev.length === 0 ? getAllItemIds(permissions) : []
    );
  }, [permissions]);

  const getAllItemIds = (nodes: TreePermission[]): string[] => {
    return nodes.reduce<string[]>((acc, node) => {
      acc.push(node.itemId);
      if (node.children && node.children.length > 0) {
        acc.push(...getAllItemIds(node.children));
      }
      return acc;
    }, []);
  };

  // 获取所有子节点的ID
  const getAllChildrenIds = (nodes: TreePermission[]): string[] => {
    return nodes.reduce<string[]>((acc, node) => {
      acc.push(node.itemId);
      if (node.children && node.children.length > 0) {
        acc.push(...getAllChildrenIds(node.children));
      }
      return acc;
    }, []);
  };

  // 处理展开/收起全部
  const handleExpandAll = () => {
    if (expandedItems.length === 0) {
      // 展开全部
      const allIds = getAllChildrenIds(permissions);
      setExpandedItems(allIds);
    } else {
      // 收起全部
      setExpandedItems([]);
    }
  };

  // 渲染权限树节点
  const renderPermissionTree = useCallback((nodes: TreePermission[]) => {
    return nodes.map((node) => (
      <TreeItem key={node.itemId} itemId={node.itemId} label={node.name}>
        {node.children &&
          node.children.length > 0 &&
          renderPermissionTree(node.children)}
      </TreeItem>
    ));
  }, []);

  // 处理权限选择变化
  const handleSelectedItemsChange = useCallback(
    (event: React.SyntheticEvent, ids: string[]) => {
      setSelectedItems(ids);
      setFormData({
        ...formData,
        permissionIds: ids,
      });
    },
    [formData]
  );

  const handleExpandedItemsChange = (
    event: React.SyntheticEvent,
    itemIds: string[],
  ) => {
    setExpandedItems(itemIds);
  };

  // 处理提交
  const handleSubmit = useCallback(async () => {
    try {
      const submitData = {
        ...formData,
        permissionIds: selectedItems,
      };
      if (editingRole) {
        await roleService.update(editingRole.id, submitData);
        setSnackbar({
          open: true,
          message: t("common.role.updateSuccess"),
          severity: "success",
        });
      } else {
        await roleService.add(submitData);
        setSnackbar({
          open: true,
          message: t("common.role.createSuccess"),
          severity: "success",
        });
      }
      handleClose();
      refresh();
    } catch (error) {
      console.error(`${editingRole ? "更新" : "创建"}角色失败:`, error);
      setSnackbar({
        open: true,
        message: t(
          `common.role.${editingRole ? "updateError" : "createError"}`
        ),
        severity: "error",
      });
    }
  }, [editingRole, formData, selectedItems, handleClose, refresh, t]);

  // 处理删除
  const handleDelete = useCallback((id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  }, []);

  // 处理删除确认
  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingId) return;
    try {
      await roleService.delete(deletingId);
      setSnackbar({
        open: true,
        message: t("common.role.deleteSuccess"),
        severity: "success",
      });
      refresh();
    } catch (error) {
      console.error("删除角色失败:", error);
      setSnackbar({
        open: true,
        message: t("common.role.deleteError"),
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

  // 表格列定义
  const columns = useMemo(
    () => [
      {
        key: "roleName" as keyof Role,
        title: t("common.role.roleName"),
        width: 200,
      },
      {
        key: "roleCode" as keyof Role,
        title: t("common.role.roleCode"),
        width: 150,
      },
      {
        key: "description" as keyof Role,
        title: t("common.role.description"),
        width: 200,
      },
      {
        key: "permissionNames" as keyof Role,
        title: t("common.role.permissions"),
        width: 300,
      },
      {
        key: "createTime" as keyof Role,
        title: t("common.createTime"),
        width: 180,
      },
      {
        key: "updateTime" as keyof Role,
        title: t("common.updateTime"),
        width: 180,
      },
      {
        key: "actions" as keyof Role,
        title: t("common.operation"),
        width: 150,
        render: (_: any, record: Role) => (
          <Stack direction="row" spacing={0.5}>
            <CommonButton
              buttonVariant="edit"
              icon
              onClick={() => handleOpen(record)}
            />
            <CommonButton
              buttonVariant="delete"
              icon
              onClick={() => handleDelete(record.id)}
            />
          </Stack>
        ),
      },
    ],
    [t, handleOpen, handleDelete]
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
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <SearchBar>
            <CommonInput
              label={t("common.role.roleName")}
              value={params.roleName || ""}
              onChange={(value) =>
                setParams({ ...params, roleName: value as string })
              }
              sx={{ width: "10%" }}
            />
            <CommonInput
              label={t("common.role.roleCode")}
              value={params.roleCode || ""}
              onChange={(value) =>
                setParams({ ...params, roleCode: value as string })
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
            <CommonButton
              buttonVariant="add"
              onClick={() => handleOpen()}
              sx={{ marginLeft: "auto" }}
            >
              {t("common.role.add")}
            </CommonButton>
          </SearchBar>
        </Box>

        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
          <PerformanceTable
            data={roles}
            columns={columns}
            loading={loading}
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
            {editingRole ? t("common.role.edit") : t("common.role.add")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <CommonInput
                label={t("common.role.roleName")}
                value={formData.roleName}
                onChange={(value) =>
                  setFormData({ ...formData, roleName: value as string })
                }
                fullWidth
                required
                error={!formData.roleName}
                helperText={
                  !formData.roleName ? t("common.role.nameRequired") : ""
                }
              />
              <CommonInput
                label={t("common.role.roleCode")}
                value={formData.roleCode}
                onChange={(value) =>
                  setFormData({ ...formData, roleCode: value as string })
                }
                fullWidth
                required
                error={!formData.roleCode}
                helperText={
                  !formData.roleCode ? t("common.role.codeRequired") : ""
                }
              />
              <CommonInput
                label={t("common.role.description")}
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value as string })
                }
                fullWidth
                multiline
                rows={3}
              />
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    {t("common.role.permissions")}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <CommonButton
                      buttonVariant="selectAll"
                      size="small"
                      onClick={handleSelectAll}
                      selected={selectedItems.length > 0}
                    >
                      {t("common.selectAll")}
                    </CommonButton>
                    <CommonButton
                      buttonVariant="add"
                      size="small"
                      onClick={handleExpandAll}
                      startIcon={expandedItems.length === 0 ? <ExpandMore /> : <ExpandLess />}
                    >
                      {expandedItems.length === 0 ? t("common.expandAll") : t("common.collapseAll")}
                    </CommonButton>
                  </Stack>
                </Box>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  overflow: 'auto',
                  background: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.8)
                    : alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                  '& .MuiTreeItem-root': {
                    borderRadius: 1,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      }
                    }
                  },
                  '& .MuiTreeItem-content': {
                    padding: '4px 8px',
                    borderRadius: 1,
                  },
                  '& .MuiCheckbox-root': {
                    padding: '4px',
                    color: alpha(theme.palette.primary.main, 0.5),
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                    }
                  }
                }}>
                  <SimpleTreeView
                    selectedItems={selectedItems}
                    onSelectedItemsChange={handleSelectedItemsChange}
                    multiSelect
                    checkboxSelection
                    expandedItems={expandedItems}
                    onExpandedItemsChange={handleExpandedItemsChange}
                  >
                    {renderPermissionTree(permissions)}
                  </SimpleTreeView>
                </Paper>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <CommonButton buttonVariant="cancel" onClick={handleClose}>
              {t("common.cancel")}
            </CommonButton>
            <CommonButton
              buttonVariant="submit"
              onClick={handleSubmit}
              disabled={!formData.roleName || !formData.roleCode}
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
          <DialogTitle>{t("common.role.deleteConfirm")}</DialogTitle>
          <DialogContent>
            <Typography>{t("common.role.deleteConfirmMessage")}</Typography>
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
