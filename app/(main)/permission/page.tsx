"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  Grid,
  Checkbox,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { CommonSelect } from "@/app/components/common/CommonSelect";
import { permissionService } from "@/app/services/permission";
import type {
  PermissionDTO,
  PermissionQuery,
  TreePermission,
} from "@/app/types/permission";
import { useTheme } from "@mui/material/styles";
import { SimpleTreeView } from "@mui/x-tree-view";

// 获取节点及其所有子节点的ID
const getNodeAndChildrenIds = (node: TreePermission): string[] => {
  let ids: string[] = [node.id];
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      ids = ids.concat(getNodeAndChildrenIds(child));
    });
  }
  return ids;
};

// 获取所有节点ID（包括子节点）
const getAllNodeIds = (nodes: TreePermission[]): string[] => {
  let ids: string[] = [];
  nodes.forEach((node) => {
    ids.push(node.id);
    if (node.children && node.children.length > 0) {
      ids = ids.concat(getAllNodeIds(node.children));
    }
  });
  return ids;
};

// 树形选择组件
const TreeSelect = ({
  value,
  onChange,
  options,
  label,
  currentId,
}: {
  value: string;
  onChange: (value: string) => void;
  options: TreePermission[];
  label: string;
  currentId?: string;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // 获取节点的所有子节点ID
  const getAllChildrenIds = (node: TreePermission): string[] => {
    let ids: string[] = [];
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        ids.push(child.id);
        ids = ids.concat(getAllChildrenIds(child));
      });
    }
    return ids;
  };

  // 检查节点是否可以被选择为父菜单
  const isSelectable = (node: TreePermission): boolean => {
    // 如果当前节点是根节点（parentId为0），则不允许选择其任何子节点
    if (currentId === "0") {
      return false;
    }

    // 如果当前节点是正在编辑的节点，则不允许选择
    if (node.id === currentId) {
      return false;
    }

    // 如果当前节点是正在编辑节点的子节点，则不允许选择
    if (currentId) {
      const findNode = (nodes: TreePermission[]): TreePermission | null => {
        for (const n of nodes) {
          if (n.id === currentId) return n;
          if (n.children && n.children.length > 0) {
            const found = findNode(n.children);
            if (found) return found;
          }
        }
        return null;
      };

      const currentNode = findNode(options);
      if (currentNode) {
        const childrenIds = getAllChildrenIds(currentNode);
        if (childrenIds.includes(node.id)) {
          return false;
        }
      }
    }

    return true;
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  const renderTreeItem = (node: TreePermission, level: number = 0) => {
    const selectable = isSelectable(node);
    return (
      <Box key={node.id}>
        <MenuItem
          onClick={() => handleSelect(node.id)}
          disabled={!selectable}
          sx={{
            pl: level * 2 + 2,
            backgroundColor:
              value === node.id ? "action.selected" : "transparent",
            "&:hover": {
              backgroundColor: selectable ? "action.hover" : "transparent",
            },
            opacity: selectable ? 1 : 0.5,
          }}
        >
          <Typography variant="body2">{node.name}</Typography>
        </MenuItem>
        {node.children && node.children.length > 0 && (
          <Box sx={{ pl: 2 }}>
            {node.children.map((child) => renderTreeItem(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  const selectedName = useMemo(() => {
    const findNode = (nodes: TreePermission[]): string | undefined => {
      for (const node of nodes) {
        if (node.id === value) return node.name;
        if (node.children && node.children.length > 0) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findNode(options) || t("common.permission.select");
  }, [value, options, t]);

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <OutlinedInput
          ref={anchorRef}
          value={selectedName}
          onClick={() => setOpen(true)}
          endAdornment={
            <InputAdornment position="end">
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </InputAdornment>
          }
          label={label}
          readOnly
        />
      </FormControl>
      <Menu
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: anchorRef.current?.clientWidth,
          },
        }}
      >
        {options.map((node) => renderTreeItem(node))}
      </Menu>
    </Box>
  );
};

export default function PermissionPage() {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<TreePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingPermission, setEditingPermission] =
    useState<TreePermission | null>(null);
  const [params, setParams] = useState<PermissionQuery>({
    type: undefined,
    status: undefined,
    name: undefined,
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

  const [treeOptions, setTreeOptions] = useState<TreePermission[]>([]);

  const theme = useTheme();

  // 获取权限树
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await permissionService.getTreeForControl(params);
      if (response.data?.data) {
        setPermissions(response.data?.data);
      }
    } catch (error) {
      console.error("获取权限列表失败:", error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  // 获取树形选择数据
  const fetchTreeOptions = useCallback(async () => {
    try {
      const response = await permissionService.getTreeForControl();
      if (response.data?.data) {
        setTreeOptions(response.data.data);
      }
    } catch (error) {
      console.error("获取树形选择数据失败:", error);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
    fetchTreeOptions();
  }, [fetchPermissions, fetchTreeOptions]);

  // 处理打开对话框
  const handleOpen = useCallback(
    (permission?: TreePermission, parent?: string) => {
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
    },
    []
  );

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
      fetchTreeOptions();
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
  }, [
    editingPermission,
    formData,
    handleClose,
    fetchPermissions,
    fetchTreeOptions,
    t,
  ]);

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
    setSelectedIds((prev) => {
      if (checked) {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
      } else {
        return prev.filter((item) => item !== id);
      }
      return prev;
    });
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

    const handleStatusChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
      node: TreePermission
    ): Promise<void> => {
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
        fetchPermissions();
      } catch (error) {
        console.error("更新状态失败:", error);
      }
    };

    const handleSelect = (id: string, checked: boolean) => {
      setSelectedIds((prev) => {
        if (checked) {
          if (!prev.includes(id)) {
            return [...prev, id];
          }
        } else {
          return prev.filter((item) => item !== id);
        }
        return prev;
      });
    };

    const renderTreeItem = (node: TreePermission) => {
      const renderIcon = () => {
        if (!node.children || node.children.length === 0) return null;
        return expandedItems.includes(node.id) ? (
          <ExpandLessIcon
            sx={{ fontSize: 20, mr: 1, color: theme.palette.primary.main }}
          />
        ) : (
          <ExpandMoreIcon
            sx={{ fontSize: 20, mr: 1, color: theme.palette.primary.main }}
          />
        );
      };

      return (
        <TreeItem
          key={node.id}
          itemId={node.id}
          slots={{
            icon: () => null,
          }}
          sx={{
            "& .MuiTreeItem-content": {
              paddingLeft: "0 !important",
              "& .MuiTreeItem-iconContainer": {
                display: "none",
              },
            },
            "& .MuiTreeItem-group": {
              marginLeft: 0,
              paddingLeft: 0,
            },
            width: "100%",
          }}
          label={
            <Grid container spacing={2} alignItems="center">
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  paddingLeft: 0,
                }}
              >
                <Checkbox
                  checked={selectedIds.includes(node.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    const checked = e.target.checked;
                    const allIds = getNodeAndChildrenIds(node);
                    allIds.forEach((id) => {
                      handleSelect(id, checked);
                    });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  indeterminate={
                    node.children &&
                    node.children.length > 0 &&
                    node.children.some((child) =>
                      selectedIds.includes(child.id)
                    ) &&
                    !node.children.every((child) =>
                      selectedIds.includes(child.id)
                    )
                  }
                  sx={{ padding: 0 }}
                />
              </Grid>
              <Grid item xs={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {renderIcon()}
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
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(e, node);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      color="primary"
                    />
                  }
                  label={
                    node.status === 1 ? t("common.enable") : t("common.disable")
                  }
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
                        handleOpen(undefined, node.id);
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
                        handleOpen(node);
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
                        handleDelete(node.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </CommonButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          }
        >
          {node.children?.map((child) => renderTreeItem(child))}
        </TreeItem>
      );
    };

    return (
      <Paper sx={{ width: "100%" }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: "divider",
          width: "100%",
          minWidth: "100%",
          overflowX: "auto"
        }}>
          <Grid container spacing={2} alignItems="center" sx={{ minWidth: "100%" }}>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", justifyContent: "center", paddingLeft: 0 }}
            >
              <Checkbox
                checked={
                  selectedIds.length === getAllNodeIds(permissions).length
                }
                indeterminate={
                  selectedIds.length > 0 &&
                  selectedIds.length < getAllNodeIds(permissions).length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                sx={{ padding: 0 }}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" fontWeight="bold">
                {t("common.permission.columnName")}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" fontWeight="bold">
                {t("common.permission.columnComponent")}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" fontWeight="bold">
                {t("common.permission.columnPath")}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" fontWeight="bold">
                {t("common.permission.columnCode")}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="h6" fontWeight="bold">
                {t("common.permission.columnSort")}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="h6" fontWeight="bold">
                {t("common.permission.columnStatus")}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="h6" fontWeight="bold">
                {t("common.actions")}
              </Typography>
            </Grid>
          </Grid>
        
        <SimpleTreeView
          defaultExpandedItems={permissions.map((node) => node.id)}
          expandedItems={expandedItems}
          onExpandedItemsChange={(event, expandedItems) => {
            setExpandedItems(expandedItems);
          }}
          onItemClick={(event, itemId) => {
            // 处理点击事件
          }}
          sx={{ marginTop: 2 }}
        >
          {permissions.map((node) => renderTreeItem(node))}
        </SimpleTreeView>
        </Box>
      </Paper>
    );
  };

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
              label={t("common.permission.name")}
              value={params.name || ""}
              onChange={(value) =>
                setParams({ ...params, name: value as string })
              }
              sx={{ width: "10%" }}
            />
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
                fetchPermissions();
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
                  type: undefined,
                  status: undefined,
                  name: undefined,
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
                {t("common.add")}
              </CommonButton>
              <CommonButton
                buttonVariant="add"
                size="small"
                onClick={handleExpandAll}
                startIcon={
                  expandedItems.length === 0 ? (
                    <ExpandMoreIcon />
                  ) : (
                    <ExpandLessIcon />
                  )
                }
              >
                {expandedItems.length === 0
                  ? t("common.expandAll")
                  : t("common.collapseAll")}
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
              <TreeSelect
                value={formData.parentId}
                onChange={(value) =>
                  setFormData({ ...formData, parentId: value })
                }
                options={treeOptions}
                label={t("common.permission.parent")}
                currentId={editingPermission?.id}
              />
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
