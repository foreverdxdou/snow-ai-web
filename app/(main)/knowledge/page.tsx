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
  Grid,
  CircularProgress,
  FormControlLabel,
  Divider,
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
import { useThemeMode } from "@/app/hooks/useThemeMode";
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
  }) => (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
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
        subheader={knowledge.description || t("knowledge.noDescription")}
        action={
          <Box>
            <Tooltip title={t("common.edit")}>
              <CommonButton
                buttonVariant="edit"
                icon
                onClick={() => onEdit(knowledge)}
              ></CommonButton>
            </Tooltip>
            <Tooltip title={t("common.delete")}>
              <CommonButton
                buttonVariant="delete"
                icon
                onClick={() => onDelete(knowledge.id)}
                color="error"
              ></CommonButton>
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
      </CardContent>
      <CardActions>
        <FormControlLabel
          control={
            <Switch
              checked={knowledge.status === 1}
              onChange={(e) =>
                onStatusChange(knowledge.id, e.target.checked ? 1 : 0)
              }
            />
          }
          label={
            knowledge.status === 1 ? t("common.enable") : t("common.disable")
          }
        />
      </CardActions>
    </Card>
  )
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
    selectedId: string | null;
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm(t("knowledge.deleteConfirm"))) return;
      try {
        await knowledgeService.delete(id);
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
      }
    },
    [refresh, t]
  );

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
      setSelectedCategory(id.toString());
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
          <Paper sx={{ width: 200, p: 2, overflow: "auto" }}>
            <Typography variant="h6" gutterBottom>
              {t("knowledge.categoryTree")}
            </Typography>
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
            <Grid container spacing={3}>
              {loading ? (
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                  </Box>
                </Grid>
              ) : knowledgeList.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    {t("common.noData")}
                  </Box>
                </Grid>
              ) : (
                knowledgeList.map((knowledge) => (
                  <Grid item xs={12} sm={6} md={4} key={knowledge.id}>
                    <KnowledgeCard
                      knowledge={knowledge}
                      onEdit={handleOpen}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      t={t}
                    />
                  </Grid>
                ))
              )}
            </Grid>

          </Box>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Pagination
                total={total}
                current={params.current}
                pageSize={params.size}
                onChange={handlePageChange}
                pageSizeOptions={['12', '20', '50', '100']}
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
