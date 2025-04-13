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
  Tooltip,
  Paper,
  Collapse,
  List,
  ListItem,
  Grid,
  Checkbox,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { CommonSelect } from "@/app/components/common/CommonSelect";
import { permissionService } from "@/app/services/permission";
import type {
  Permission,
  PermissionDTO,
  PermissionQuery,
} from "@/app/types/permission";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

// 转换函数
const convertToTree = (items: Permission[]): Permission[] => {
  const map = new Map<string, Permission>();
  const roots: Permission[] = [];

  // 创建映射
  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  // 构建树
  items.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId === "0") {
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    }
  });

  // 对每个节点的子节点进行排序
  const sortChildren = (nodes: Permission[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        node.children.sort((a, b) => a.sort - b.sort);
        sortChildren(node.children);
      }
    });
  };

  // 对根节点进行排序
  roots.sort((a, b) => a.sort - b.sort);
  sortChildren(roots);

  return roots;
};

// 获取节点及其所有子节点的ID
const getNodeAndChildrenIds = (node: Permission): string[] => {
  let ids: string[] = [node.id];
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      ids = ids.concat(getNodeAndChildrenIds(child));
    });
  }
  return ids;
};

// 渲染树节点组件
const TreeNode = ({
  node,
  level = 0,
  onAdd,
  onEdit,
  onDelete,
  selectedIds,
  onSelect,
  onRefresh,
}: {
  node: Permission;
  level?: number;
  onAdd: (parentId: string) => void;
  onEdit: (permission: Permission) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onRefresh: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();
  const theme = useTheme();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const checked = e.target.checked;
    const allIds = getNodeAndChildrenIds(node);
    if (checked) {
      onSelect(node.id, true);
      allIds.forEach((id) => {
        if (id !== node.id) {
          onSelect(id, true);
        }
      });
    } else {
      onSelect(node.id, false);
      allIds.forEach((id) => {
        if (id !== node.id) {
          onSelect(id, false);
        }
      });
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>, node: Permission): Promise<void> => {
    e.stopPropagation();
    try {
      const status = node.status === 1 ? 0 : 1;
      await permissionService.update(node.id, {
        id: node.id,
        status: status,
        parentId: node.parentId,
        name: node.name,
        type: node.type,
        permissionCode: node.permissionCode,
        path: node.path,
        component: node.component,
        icon: node.icon,
        sort: node.sort,
      });
      onRefresh();
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.hasChildren !== 0) {
      setOpen(!open);
    }
  };

  return (
    <>
      <ListItem
        onClick={handleNodeClick}
        sx={{
          pl: level * 2 + 2,
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            left: level * 2 + 1,
            top: 0,
            bottom: 0,
            width: 1,
            opacity: 0.5,
          },
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
            <Checkbox
              checked={selectedIds.includes(node.id)}
              onChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
            />
          </Grid>
          <Grid item xs={2}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {node.hasChildren === 0 ? (
                <MenuIcon
                  sx={{
                    fontSize: 20,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                />
              ) : open ? (
                <ExpandMoreIcon
                  sx={{
                    fontSize: 20,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                />
              ) : (
                <ExpandLessIcon
                  sx={{
                    fontSize: 20,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                />
              )}
              <Typography variant="body2">{node.name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2">{node.component}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2">{node.path}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2">{node.permissionCode}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">{node.sort}</Typography>
          </Grid>
          <Grid item xs={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={node.status === 1}
                  onChange={(e) => handleStatusChange(e, node)}
                  color="primary"
                />
              }
              label={node.status === 1 ? t("common.enable") : t("common.disable")}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                },
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <Stack direction="row" spacing={0.5}>
              <Tooltip title={t("common.add")}>
                <CommonButton
                  buttonVariant="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(node.id);
                  }}
                >
                  <AddIcon />
                </CommonButton>
              </Tooltip>
              <Tooltip title={t("common.edit")}>
                <CommonButton
                  buttonVariant="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(node);
                  }}
                >
                  <EditIcon />
                </CommonButton>
              </Tooltip>
              <Tooltip title={t("common.delete")}>
                <CommonButton
                  buttonVariant="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </CommonButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </ListItem>
      {node.children && node.children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete}
                selectedIds={selectedIds}
                onSelect={onSelect}
                onRefresh={onRefresh}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// 获取所有节点ID（包括子节点）
const getAllNodeIds = (nodes: Permission[]): string[] => {
  let ids: string[] = [];
  nodes.forEach((node) => {
    ids.push(node.id);
    if (node.children && node.children.length > 0) {
      ids = ids.concat(getAllNodeIds(node.children));
    }
  });
  return ids;
};

export default function PermissionPage() {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [params, setParams] = useState<PermissionQuery>({
    type: undefined,
    status: undefined,
  });
  const [formData, setFormData] = useState<PermissionDTO>({
    parentId: "0",
    name: "",
    type: 1,
    permissionCode: "",
    path: "",
    component: "",
    icon: "",
    sort: 0,
    status: 1,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // 获取权限树
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await permissionService.getTree(params);
      if (response.data?.data) {
        const treeData = convertToTree(response.data.data);
        setPermissions(treeData);
      }
    } catch (error) {
      console.error("获取权限列表失败:", error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // 处理打开对话框
  const handleOpen = useCallback((permission?: Permission, parent?: string) => {
    if (permission) {
      setEditingPermission(permission);
      setFormData({
        id: permission.id,
        parentId: permission.parentId,
        name: permission.name,
        type: permission.type,
        permissionCode: permission.permissionCode,
        path: permission.path,
        component: permission.component,
        icon: permission.icon,
        sort: permission.sort,
        status: permission.status,
      });
    } else {
      setEditingPermission(null);
      setFormData({
        parentId: parent || "0",
        name: "",
        type: 1,
        permissionCode: "",
        path: "",
        component: "",
        icon: "",
        sort: 0,
        status: 1,
      });
    }
    setOpen(true);
  }, []);

  // 处理关闭对话框
  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingPermission(null);
    setFormData({
      parentId: "0",
      name: "",
      type: 1,
      permissionCode: "",
      path: "",
      component: "",
      icon: "",
      sort: 0,
      status: 1,
    });
  }, []);

  // 处理提交
  const handleSubmit = useCallback(async () => {
    try {
      if (editingPermission) {
        await permissionService.update(editingPermission.id, formData);
        setSnackbar({
          open: true,
          message: t("common.permission.updateSuccess"),
          severity: "success",
        });
      } else {
        await permissionService.add(formData);
        setSnackbar({
          open: true,
          message: t("common.permission.createSuccess"),
          severity: "success",
        });
      }
      handleClose();
      fetchPermissions();
    } catch (error) {
      console.error(`${editingPermission ? "更新" : "创建"}权限失败:`, error);
      setSnackbar({
        open: true,
        message: t(
          `common.permission.${
            editingPermission ? "updateError" : "createError"
          }`
        ),
        severity: "error",
      });
    }
  }, [editingPermission, formData, handleClose, fetchPermissions, t]);

  // 处理删除
  const handleDelete = useCallback((id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  }, []);

  // 处理删除确认
  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingId) return;
    try {
      await permissionService.delete(deletingId);
      setSnackbar({
        open: true,
        message: t("common.permission.deleteSuccess"),
        severity: "success",
      });
      fetchPermissions();
    } catch (error) {
      console.error("删除权限失败:", error);
      setSnackbar({
        open: true,
        message: t("common.permission.deleteError"),
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  }, [deletingId, fetchPermissions, t]);

  // 处理全选
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allIds = getAllNodeIds(permissions);
        setSelectedIds(allIds);
      } else {
        setSelectedIds([]);
      }
    },
    [permissions]
  );

  // 处理单个选择
  const handleSelect = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  }, []);

  // 处理批量删除
  const handleBatchDelete = useCallback(async () => {
    try {
      await permissionService.batchDelete(selectedIds);
      setSnackbar({
        open: true,
        message: t("common.batchDeleteSuccess"),
        severity: "success",
      });
      setSelectedIds([]);
      fetchPermissions();
    } catch (error) {
      console.error("批量删除失败:", error);
      setSnackbar({
        open: true,
        message: t("common.batchDeleteError"),
        severity: "error",
      });
    }
  }, [selectedIds, fetchPermissions, t]);

  const renderContent = () => {
    if (loading) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          {t("common.loading")}
        </Typography>
      );
    }
    if (permissions.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {t("common.noData")}
        </Typography>
      );
    }
    return (
      <Paper sx={{ width: "100%" }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid
              item
              xs={1}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Checkbox
                checked={selectedIds.length === permissions.length}
                indeterminate={
                  selectedIds.length > 0 &&
                  selectedIds.length < permissions.length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("common.permission.columnName")}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("common.permission.columnComponent")}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("common.permission.columnPath")}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("common.permission.columnCode")}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("common.permission.columnSort")}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("common.permission.columnStatus")}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("common.actions")}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <List>
          {permissions.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              onAdd={(parentId) => handleOpen(undefined, parentId)}
              onEdit={handleOpen}
              onDelete={handleDelete}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onRefresh={fetchPermissions}
            />
          ))}
        </List>
      </Paper>
    );
  };

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
            <CommonSelect
              label={t("common.permission.type")}
              value={params.type}
              onChange={(value) =>
                setParams({ ...params, type: value as number })
              }
              options={[
                { id: 1, name: t("common.permission.typeMenu") },
                { id: 2, name: t("common.permission.typeButton") },
              ]}
              sx={{ width: "10%" }}
            />
            <CommonSelect
              label={t("common.permission.status")}
              value={params.status}
              onChange={(value) =>
                setParams({ ...params, status: value as number })
              }
              options={[
                { id: 1, name: t("common.permission.statusEnabled") },
                { id: 0, name: t("common.permission.statusDisabled") },
              ]}
              sx={{ width: "10%" }}
            />
            <CommonButton
              buttonVariant="search"
              onClick={() => {
                setParams({
                  ...params,
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
                setParams({
                  ...params,
                  type: undefined,
                  status: undefined,
                });
                fetchPermissions();
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
                {t("common.add")}
              </CommonButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>{renderContent()}</Box>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingPermission ? t("common.edit") : t("common.add")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <CommonInput
                label={t("common.permission.name")}
                value={formData.name}
                onChange={(value) =>
                  setFormData({ ...formData, name: value as string })
                }
                fullWidth
                required
                error={!formData.name}
                helperText={
                  !formData.name ? t("common.permission.nameRequired") : ""
                }
              />
              <CommonSelect
                label={t("common.permission.type")}
                value={formData.type}
                onChange={(value) =>
                  setFormData({ ...formData, type: value as number })
                }
                options={[
                  { id: 1, name: t("common.permission.typeMenu") },
                  { id: 2, name: t("common.permission.typeButton") },
                ]}
              />
              <CommonInput
                label={t("common.permission.code")}
                value={formData.permissionCode}
                onChange={(value) =>
                  setFormData({ ...formData, permissionCode: value as string })
                }
                fullWidth
                required
                error={!formData.permissionCode}
                helperText={
                  !formData.permissionCode
                    ? t("common.permission.codeRequired")
                    : ""
                }
              />
              <CommonInput
                label={t("common.permission.path")}
                value={formData.path}
                onChange={(value) =>
                  setFormData({ ...formData, path: value as string })
                }
                fullWidth
              />
              <CommonInput
                label={t("common.permission.component")}
                value={formData.component}
                onChange={(value) =>
                  setFormData({ ...formData, component: value as string })
                }
                fullWidth
              />
              <CommonInput
                label={t("common.permission.icon")}
                value={formData.icon}
                onChange={(value) =>
                  setFormData({ ...formData, icon: value as string })
                }
                fullWidth
              />
              <CommonInput
                label={t("common.permission.sort")}
                value={formData.sort || 0}
                min={0}
                onChange={(value) =>
                  setFormData({ ...formData, sort: value as number })
                }
                type="number"
                fullWidth
              />
              <CommonSelect
                label={t("common.permission.status")}
                value={formData.status}
                onChange={(value) =>
                  setFormData({ ...formData, status: value as number })
                }
                options={[
                  { id: 1, name: t("common.permission.statusEnabled") },
                  { id: 0, name: t("common.permission.statusDisabled") },
                ]}
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
              disabled={!formData.name || !formData.permissionCode}
            >
              {t("common.save")}
            </CommonButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>{t("common.permission.deleteConfirm")}</DialogTitle>
          <DialogContent>
            <Typography>
              {t("common.permission.deleteConfirmMessage")}
            </Typography>
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
