"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Button,
} from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { SearchBar } from "@/app/components/common/SearchBar";
import { roleService } from "@/app/services/role";
import { permissionService } from "@/app/services/permission";
import type { Role, RoleDTO } from "@/app/types/role";
import type { TreePermission } from "@/app/types/permission";

export default function RolePage() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent,
    ids: string[]
  ) => {
    setSelectedItems(ids);
    setFormData({
      ...formData,
      permissionIds: ids,
    });
  };

  const handleSelectClick = () => {
    setSelectedItems((oldSelected) =>
      oldSelected.length === 0
        ? [
            "grid",
            "grid-community",
            "grid-pro",
            "grid-premium",
            "pickers",
            "pickers-community",
            "pickers-pro",
            "charts",
            "charts-community",
            "tree-view",
            "tree-view-community",
          ]
        : []
    );
  };

  // 获取角色列表
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await roleService.getList({
        pageNum: page + 1,
        pageSize: rowsPerPage,
      });
      if (response.data?.code === 200 && response.data?.data) {
        setRoles(response.data.data.records);
        setTotal(response.data.data.total);
      }
    } catch (error) {
      console.error("获取角色列表失败:", error);
      setSnackbar({
        open: true,
        message: "获取角色列表失败",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

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
        message: "获取权限列表失败",
        severity: "error",
      });
    }
  }, []);

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
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

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
      fetchRoles();
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
  }, [editingRole, formData, selectedItems, handleClose, fetchRoles, t]);

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
      fetchRoles();
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
  }, [deletingId, fetchRoles, t]);

  // 处理分页
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  return (
    <PerformanceLayout>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
              label={t("common.role.name")}
              value={formData.roleName}
              onChange={(value) =>
                setFormData({ ...formData, roleName: value as string })
              }
            />
            <CommonInput
              label={t("common.role.code")}
              value={formData.roleCode}
              onChange={(value) =>
                setFormData({ ...formData, roleCode: value as string })
              }
            />
            <CommonButton
              buttonVariant="reset"
              onClick={() => {
                setFormData({
                  ...formData,
                  roleName: "",
                  roleCode: "",
                });
                fetchRoles();
              }}
            >
              {t("common.reset")}
            </CommonButton>
            <CommonButton
              buttonVariant="add"
              onClick={() => handleOpen()}
              sx={{ marginLeft: "auto" }}
            >
              {t("common.add")}
            </CommonButton>
          </SearchBar>
        </Box>

        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
          {loading ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              {t("common.loading")}
            </Typography>
          ) : roles.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              {t("common.noData")}
            </Typography>
          ) : (
            <Paper sx={{ width: "100%" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("common.role.name")}</TableCell>
                      <TableCell>{t("common.role.code")}</TableCell>
                      <TableCell>{t("common.role.description")}</TableCell>
                      <TableCell>{t("common.role.permissions")}</TableCell>
                      <TableCell>{t("common.role.createTime")}</TableCell>
                      <TableCell>{t("common.role.updateTime")}</TableCell>
                      <TableCell>{t("common.operation")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>{role.roleName}</TableCell>
                        <TableCell>{role.roleCode}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>{role.permissionNames}</TableCell>
                        <TableCell>{role.createTime}</TableCell>
                        <TableCell>{role.updateTime}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title={t("common.role.permissions")}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpen(role)}
                              >
                                <SecurityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t("common.edit")}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpen(role)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t("common.delete")}>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(role.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={t("common.rowsPerPage")}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} / ${count}`
                }
              />
            </Paper>
          )}
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingRole ? t("common.edit") : t("common.add")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <CommonInput
                label={t("common.role.name")}
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
                label={t("common.role.code")}
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
                  <Button size="small" onClick={handleSelectAll}>
                    {selectedItems.length === 0
                      ? t("common.selectAll")
                      : t("common.unselectAll")}
                  </Button>
                </Box>
                <Paper sx={{}}>
                  <SimpleTreeView
                    selectedItems={selectedItems}
                    onSelectedItemsChange={handleSelectedItemsChange}
                    multiSelect
                    checkboxSelection
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
