"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Switch,
  Tooltip,
  CircularProgress,
  FormControlLabel,
  Divider,
  Grid,
  IconButton,
  TextField,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as MenuBookIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  DragIndicator as DragIndicatorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { knowledgeService } from "@/app/services/knowledge";
import type { KnowledgeBaseVO, KnowledgeBaseDTO } from "@/app/types/knowledge";
import { Pagination } from "@/app/components/common/Pagination";
import { categoryService } from "@/app/services/category";
import type { KbCategory } from "@/app/types/category";
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { usePerformanceData } from "@/app/hooks/usePerformanceData";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { SimpleTreeView } from '@mui/x-tree-view';
import type { TreeViewProps } from '@mui/x-tree-view/TreeView';

interface TreeItemData {
  id: string;
  label: string;
  children?: TreeItemData[];
}

// 使用 React.memo 优化知识库卡片组件
const KnowledgeCard = React.memo(
  ({
    knowledge,
    onEdit,
    onDelete,
    onStatusChange,
    t,
  }: {
    knowledge: KnowledgeBaseVO;
    onEdit: (knowledge: KnowledgeBaseVO) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: number) => void;
    t: (key: string) => string;
  }) => {
    const router = useRouter();

    const handleCardClick = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".MuiCardHeader-action")) {
        return;
      }
      router.push(`/documents?kbId=${knowledge.id}`);
    };

    // 生成模拟数据
    const stats = {
      totalDocuments: Math.floor(Math.random() * 1000) + 100,
      totalSize: (Math.random() * 1000).toFixed(2) + ' MB',
      lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      documentTypes: ['PDF', 'Word', 'Excel', 'Markdown'].slice(0, Math.floor(Math.random() * 4) + 1),
      tags: ['AI', '机器学习', '深度学习', '自然语言处理', '计算机视觉'].slice(0, Math.floor(Math.random() * 3) + 1)
    };

    return (
      <Card
        onClick={handleCardClick}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <MenuBookIcon />
            </Avatar>
          }
          title={knowledge.name}
          action={
            <Box>
              <Tooltip title={t("common.edit")}>
                <CommonButton
                  buttonVariant="edit"
                  icon
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(knowledge);
                  }}
                />
              </Tooltip>
              <Tooltip title={t("common.delete")}>
                <CommonButton
                  buttonVariant="delete"
                  icon
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(knowledge.id);
                  }}
                  color="error"
                />
              </Tooltip>
            </Box>
          }
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("knowledge.documentCount")}: {stats.totalDocuments}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("knowledge.totalSize")}: {stats.totalSize}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("knowledge.lastUpdate")}: {stats.lastUpdate}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("knowledge.documentTypes")}:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {stats.documentTypes.map((type, index) => (
                <Chip
                  key={index}
                  label={type}
                  size="small"
                  sx={{ 
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("knowledge.tags")}:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {stats.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{ 
                    bgcolor: 'secondary.light',
                    color: 'secondary.contrastText',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          <Box sx={{ marginLeft: "auto" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={knowledge.status === 1}
                  onChange={(e) => {
                    e.stopPropagation();
                    onStatusChange(knowledge.id, e.target.checked ? 1 : 0);
                  }}
                />
              }
              label={
                knowledge.status === 1
                  ? t("common.enable")
                  : t("common.disable")
              }
            />
          </Box>
        </CardActions>
      </Card>
    );
  }
);

KnowledgeCard.displayName = "KnowledgeCard";

// 修改 CustomTreeItem 组件
const CustomTreeItem = React.memo(({ 
  item, 
  onEdit, 
  onAddChild 
}: { 
  item: TreeItemData; 
  onEdit: (id: number, name: string) => void;
  onAddChild: (parentId: number, name: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [editName, setEditName] = useState(item?.label || '');
  const [newChildName, setNewChildName] = useState('');

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(item?.label || '');
    setIsEditing(true);
  }, [item?.label]);

  const handleAddChild = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setNewChildName('');
    setIsAddingChild(true);
  }, []);

  const handleSave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item?.id) return;
    if (isEditing) {
      onEdit(Number(item.id), editName);
    } else if (isAddingChild) {
      onAddChild(Number(item.id), newChildName);
    }
    setIsEditing(false);
    setIsAddingChild(false);
    setEditName(item?.label || '');
    setNewChildName('');
  }, [item?.id, item?.label, isEditing, isAddingChild, editName, newChildName, onEdit, onAddChild]);

  const handleCancel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setIsAddingChild(false);
    setEditName(item?.label || '');
    setNewChildName('');
  }, [item?.label]);

  const handleEditNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setEditName(e.target.value);
  }, []);

  const handleNewChildNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setNewChildName(e.target.value);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSave(e as any);
    }
  }, [handleSave]);

  if (!item) return null;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      width: '100%',
      minHeight: '32px',
      '& .MuiIconButton-root': {
        padding: '4px',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
      }
    }}>
      {isEditing ? (
        <TextField
          size="small"
          value={editName}
          onChange={handleEditNameChange}
          autoFocus
          onKeyPress={handleKeyPress}
          onClick={(e) => e.stopPropagation()}
          sx={{ flex: 1 }}
        />
      ) : (
        <>
          <Typography sx={{ flex: 1, fontSize: '14px' }}>{item.label}</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleAddChild}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </>
      )}
      {(isEditing || isAddingChild) && (
        <Dialog open={true} onClose={handleCancel}>
          <DialogTitle>
            {isEditing ? '编辑分类' : '新增子分类'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              value={isEditing ? editName : newChildName}
              onChange={isEditing ? handleEditNameChange : handleNewChildNameChange}
              label="分类名称"
              onClick={(e) => e.stopPropagation()}
            />
          </DialogContent>
          <DialogActions>
            <CommonButton buttonVariant="cancel" onClick={handleCancel}>
              取消
            </CommonButton>
            <CommonButton buttonVariant="submit" onClick={handleSave}>
              确定
            </CommonButton>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
});

CustomTreeItem.displayName = 'CustomTreeItem';

// 修改数据转换函数
const convertToTreeItem = (item: any): TreeItemData => {
  const result = {
    id: String(item.id || ''),
    label: item.name || '',
    children: item.children?.length ? item.children.map(convertToTreeItem) : []
  };
  return result;
};

// 修改 CategoryTree 组件
const CategoryTree = React.memo(
  ({
    items,
    onSelect,
    selectedId,
    onEdit,
    onAddChild,
  }: {
    items: TreeItemData[];
    onSelect: (id: number | undefined) => void;
    selectedId: number | null;
    onEdit: (id: number, name: string) => void;
    onAddChild: (parentId: number, name: string) => void;
  }) => {
    const renderTree = (node: TreeItemData) => (
      <TreeItem
        key={node.id}
        itemId={node.id}
        data-node-id={node.id}
        label={
          <CustomTreeItem
            item={node}
            onEdit={onEdit}
            onAddChild={onAddChild}
          />
        }
      >
        {Array.isArray(node.children)
          ? node.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );

    return (
      <SimpleTreeView
        slots={{
          collapseIcon: ExpandMoreIcon,
          expandIcon: ChevronRightIcon,
        }}
        selectedItems={selectedId ? selectedId.toString() : ''}
        multiSelect={false}
        onSelectedItemsChange={(event: React.SyntheticEvent, itemIds: string | null) => {
          if (!itemIds) {
            onSelect(undefined);
          } else {
            onSelect(Number(itemIds));
          }
        }}
        sx={{ 
          height: '100%',
          flexGrow: 1,
          maxWidth: '100%',
          overflowY: 'auto',
          minHeight: '400px',
          maxHeight: '800px',
          '& .MuiTreeItem-content': {
            padding: '4px 8px',
          },
          '& .MuiTreeItem-group': {
            marginLeft: '16px',
          }
        }}
      >
        {items.map((node) => renderTree(node))}
      </SimpleTreeView>
    );
  }
);

export default function KnowledgePage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingKnowledge, setEditingKnowledge] =
    useState<KnowledgeBaseVO | null>(null);
  const [formData, setFormData] = useState<KnowledgeBaseDTO>({
    name: "",
    description: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryTree, setCategoryTree] = useState<TreeItemData[]>([]);

  // 使用 usePerformanceData 优化数据获取
  const {
    data: knowledgeList,
    loading,
    total,
    params,
    setParams,
    refresh,
  } = usePerformanceData<KnowledgeBaseVO>({
    fetchData: knowledgeService.getList,
    defaultParams: {
      current: 1,
      size: 12,
      categoryId: undefined,
    },
    autoFetch: true,
  });

  // 使用 useCallback 优化事件处理函数
  const handleDelete = useCallback(async (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await knowledgeService.delete(deleteId);
      setSnackbar({
        open: true,
        message: t("knowledge.deleteSuccess"),
        severity: "success",
      });
      refresh();
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("knowledge.deleteError"),
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  }, [deleteId, refresh, t]);

  const handleStatusChange = useCallback(
    async (id: number, status: number) => {
      try {
        await knowledgeService.updateStatus(id, status);
        setSnackbar({
          open: true,
          message: t("knowledge.statusUpdateSuccess"),
          severity: "success",
        });
        refresh();
      } catch (error) {
        setSnackbar({
          open: true,
          message: t("knowledge.statusUpdateError"),
          severity: "error",
        });
      }
    },
    [refresh, t]
  );

  const handleOpen = useCallback((knowledge?: KnowledgeBaseVO) => {
    if (knowledge) {
      setEditingKnowledge(knowledge);
      setFormData({
        name: knowledge.name,
        description: knowledge.description,
      });
    } else {
      setEditingKnowledge(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingKnowledge(null);
    setFormData({
      name: "",
      description: "",
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (!formData.name) {
        setSnackbar({
          open: true,
          message: t("knowledge.nameRequired"),
          severity: "error",
        });
        return;
      }

      if (editingKnowledge) {
        await knowledgeService.update(editingKnowledge.id, formData);
        setSnackbar({
          open: true,
          message: t("knowledge.updateSuccess"),
          severity: "success",
        });
      } else {
        await knowledgeService.create(formData);
        setSnackbar({
          open: true,
          message: t("knowledge.createSuccess"),
          severity: "success",
        });
      }
      handleClose();
      refresh();
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("knowledge.saveError"),
        severity: "error",
      });
    }
  }, [editingKnowledge, formData, handleClose, refresh, t]);

  // 使用 useCallback 优化分类树数据获取
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getCategoryTree();
      const categories = response.data.data;
      const treeData = categories.map(convertToTreeItem);
      setCategoryTree(treeData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("category.fetchError"),
        severity: "error",
      });
    }
  }, [t]);

  // 使用 useEffect 获取分类树数据
  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 修改 handleCategorySelect 函数
  const handleCategorySelect = useCallback(
    (id: number | undefined) => {
      // 如果点击的是当前选中的分类，则取消选中
      if (id === selectedCategory) {
        setSelectedCategory(null);
        setParams({
          current: params.current,
          size: params.size,
          categoryId: undefined
        });
      } else {
        // 否则选中新的分类
        setSelectedCategory(id || null);
        setParams({
          current: params.current,
          size: params.size,
          categoryId: id
        });
      }
    },
    [selectedCategory, params.current, params.size, setParams]
  );

  // 使用 useCallback 优化分页处理
  const handlePageChange = useCallback((page: number, size: number) => {
    setParams({
        ...params,
        current: page,
        size: size,
    });
}, [params, setParams]);

  // 处理编辑分类
  const handleEditCategory = useCallback(async (id: number, name: string) => {
    try {
      await categoryService.update(id, { 
        name,
        description: '',
        parentId: null,
        sort: 0,
        status: 1
      });
      setSnackbar({
        open: true,
        message: t("category.updateSuccess"),
        severity: "success",
      });
      fetchCategories(); // 刷新分类树
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("category.updateError"),
        severity: "error",
      });
    }
  }, [fetchCategories, t]);

  // 处理新增子分类
  const handleAddChildCategory = useCallback(async (parentId: number, name: string) => {
    try {
      await categoryService.create({ 
        name,
        description: '',
        parentId,
        sort: 0,
        status: 1
      });
      setSnackbar({
        open: true,
        message: t("category.createSuccess"),
        severity: "success",
      });
      fetchCategories(); // 刷新分类树
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("category.createError"),
        severity: "error",
      });
    }
  }, [fetchCategories, t]);

  return (
    <PerformanceLayout>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title={t("common.refresh")}>
                <CommonButton buttonVariant="add" onClick={refresh}>
                  <RefreshIcon />
                </CommonButton>
              </Tooltip>
              <CommonButton buttonVariant="add" onClick={() => handleOpen()}>
                {t("knowledge.createKnowledge")}
              </CommonButton>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", gap: 3, p: 3, flex: 1, overflow: "hidden" }}
        >
          <Paper sx={{ 
            width: 300, 
            p: 2, 
            overflow: "auto", 
            minWidth: 300,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CategoryTree
              items={categoryTree}
              onSelect={handleCategorySelect}
              selectedId={selectedCategory}
              onEdit={handleEditCategory}
              onAddChild={handleAddChildCategory}
            />
          </Paper>

          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {loading && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    p: 3,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              {!loading && knowledgeList.length === 0 && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    p: 3,
                  }}
                >
                  {t("common.noData")}
                </Box>
              )}
              {!loading &&
                knowledgeList.length > 0 &&
                knowledgeList.map((knowledge) => (
                  <Box
                    key={knowledge.id}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 12px)",
                        md: "calc(25% - 18px)",
                      },
                    }}
                  >
                    <KnowledgeCard
                      knowledge={knowledge}
                      onEdit={handleOpen}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      t={t}
                    />
                  </Box>
                ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              total={total}
              current={Number(params.current)}
              pageSize={Number(params.size)}
              onChange={handlePageChange}
              pageSizeOptions={["12", "20", "50", "100"]}
            />
          </Box>
          </Box>
      
        </Box>
    

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingKnowledge
              ? t("knowledge.editKnowledge")
              : t("knowledge.createKnowledge")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <CommonInput
                label={t("common.name")}
                value={formData.name}
                onChange={(value) =>
                  setFormData({ ...formData, name: value as string })
                }
                error={!formData.name}
                helperText={!formData.name ? t("knowledge.nameRequired") : ""}
                required
              />
              <CommonInput
                label={t("common.description")}
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value as string })
                }
                multiline
                rows={4}
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
          <DialogTitle>{t("knowledge.deleteKnowledge")}</DialogTitle>
          <DialogContent>
            <Typography>{t("knowledge.deleteConfirm")}</Typography>
          </DialogContent>
          <DialogActions>
            <CommonButton
              buttonVariant="cancel"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteId(null);
              }}
            >
              {t("common.cancel")}
            </CommonButton>
            <CommonButton buttonVariant="confirm" onClick={handleConfirmDelete}>
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
