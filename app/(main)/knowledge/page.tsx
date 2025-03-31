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
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { usePerformanceData } from "@/app/hooks/usePerformanceData";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";

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
      // 如果点击的是操作按钮区域，则不进行跳转
      if ((e.target as HTMLElement).closest(".MuiCardHeader-action")) {
        return;
      }
      router.push(`/documents?kbId=${knowledge.id}`);
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
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t("knowledge.documentCount")}: {knowledge.documentCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("knowledge.categoryCount")}: {knowledge.categoryCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("knowledge.tagCount")}: {knowledge.tagCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("knowledge.description")}:{" "}
            {knowledge.description || t("knowledge.noDescription")}
          </Typography>
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

// 使用 React.memo 优化分类树组件
const CategoryTree = React.memo(
  ({
    items,
    onSelect,
    selectedId,
  }: {
    items: TreeViewBaseItem[];
    onSelect: (id: number) => void;
    selectedId: number | null;
  }) => (
    <RichTreeView
      items={items}
      slots={{
        expandIcon: ExpandMoreIcon,
        collapseIcon: ChevronRightIcon,
        endIcon: DragIndicatorIcon,
      }}
      onSelect={(event: React.SyntheticEvent<HTMLUListElement>) => {
        const nodeId = (event.target as HTMLElement).getAttribute("data-id");
        console.log(nodeId);
        if (nodeId) {
          onSelect(Number(nodeId));
        }
      }}
    />
  )
);

CategoryTree.displayName = "CategoryTree";

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
  const [categoryTree, setCategoryTree] = useState<TreeViewBaseItem[]>([]);

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
      categoryId: selectedCategory ? Number(selectedCategory) : undefined,
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
      console.error("删除知识库失败:", error);
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
        console.error("更新知识库状态失败:", error);
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
      console.error("保存知识库失败:", error);
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
      setCategoryTree(
        categories.map((item) => ({
          id: item.id.toString(),
          label: item.name,
          children: item.children?.map((child) => ({
            id: child.id.toString(),
            label: child.name,
          })),
        }))
      );
    } catch (error) {
      console.error("获取分类树失败:", error);
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

  // 使用 useCallback 优化分类选择处理
  const handleCategorySelect = useCallback(
    (id: number) => {
      setSelectedCategory(id);
      setParams(
        (prev: { current: number; size: number; categoryId?: number }) => ({
          ...prev,
          categoryId: id,
        })
      );
    },
    [setParams]
  );

  // 使用 useCallback 优化分页处理
  const handlePageChange = useCallback(
    (page: number) => {
      setParams(
        (prev: { current: number; size: number; categoryId?: number }) => ({
          ...prev,
          current: page,
        })
      );
    },
    [setParams]
  );

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
          <Paper sx={{ width: 'auto', p: 2, overflow: "auto" }}>
            <CategoryTree
              items={categoryTree}
              onSelect={handleCategorySelect}
              selectedId={selectedCategory}
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
                        md: "calc(33.33% - 16px)",
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
          </Box>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              total={total}
              current={params.current}
              pageSize={params.size}
              onChange={handlePageChange}
              pageSizeOptions={["12", "20", "50", "100"]}
            />
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
