'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { categoryService } from '@/app/services/category';
import type { KbCategory } from '@/app/types/category';
import { Pagination } from '@/app/components/common/Pagination';
import { alpha } from '@mui/material/styles';

export default function CategoryPage() {
  const [categories, setCategories] = useState<KbCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<KbCategory | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: null as number | null,
    sort: 0,
    kbId: 1,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<KbCategory | null>(null);
  const [parentCategories, setParentCategories] = useState<KbCategory[]>([]);
  const [menuPosition, setMenuPosition] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getList({
        kbId: formData.kbId,
        current: pagination.current,
        size: pagination.pageSize,
      });
      setCategories(response.data.data.records);
      setPagination(prev => ({ ...prev, total: response.data.data.total }));
    } catch (error) {
      console.error('获取分类列表失败:', error);
      setSnackbar({
        open: true,
        message: '获取分类列表失败',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const response = await categoryService.getList({
        kbId: formData.kbId,
        current: 1,
        size: 1000,
      });
      setParentCategories(response.data.data.records);
    } catch (error) {
      console.error('获取父分类列表失败:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchParentCategories();
  }, [pagination.current, pagination.pageSize]);

  const handleOpen = async (category?: KbCategory, parentCategory?: KbCategory) => {
    await fetchParentCategories();
    
    if (category) {
      setEditingCategory(category);
      setFormData({
        ...formData,
        name: category.name,
        description: category.description || '',
        parentId: category.parentId || null,
        sort: category.sort,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        ...formData,
        name: '',
        description: '',
        parentId: parentCategory ? parentCategory.id : null,
        sort: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({
      ...formData,
      name: '',
      description: '',
      parentId: null,
      sort: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      setSnackbar({
        open: true,
        message: `${editingCategory ? '更新' : '创建'}成功`,
        severity: 'success',
      });
      handleClose();
      fetchCategories();
    } catch (error) {
      console.error(`${editingCategory ? '更新' : '创建'}分类失败:`, error);
      setSnackbar({
        open: true,
        message: `${editingCategory ? '更新' : '创建'}失败`,
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个分类吗？')) return;
    try {
      await categoryService.delete(id);
      setSnackbar({
        open: true,
        message: '删除成功',
        severity: 'success',
      });
      fetchCategories();
    } catch (error) {
      console.error('删除分类失败:', error);
      setSnackbar({
        open: true,
        message: '删除失败',
        severity: 'error',
      });
    }
  };

  const handleStatusChange = async (id: number, status: number) => {
    try {
      await categoryService.updateStatus(id, status);
      setSnackbar({
        open: true,
        message: '状态更新成功',
        severity: 'success',
      });
      fetchCategories();
    } catch (error) {
      console.error('更新状态失败:', error);
      setSnackbar({
        open: true,
        message: '更新状态失败',
        severity: 'error',
      });
    }
  };

  const handleContextMenu = (event: React.MouseEvent, category: KbCategory) => {
    event.preventDefault();
    setMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
    setSelectedCategory(category);
  };

  const handleCloseMenu = () => {
    setMenuPosition(null);
    setSelectedCategory(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          分类管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
            },
            height: '44px',
            px: 3
          }}
        >
          新增分类
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width="15%">名称</TableCell>
              <TableCell width="20%">描述</TableCell>
              <TableCell width="15%">父分类</TableCell>
              <TableCell width="10%">创建人</TableCell>
              <TableCell width="10%">文档数</TableCell>
              <TableCell width="10%">排序</TableCell>
              <TableCell width="10%">状态</TableCell>
              <TableCell width="10%">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow 
                  key={category.id}
                  onContextMenu={(e) => handleContextMenu(e, category)}
                  sx={{ cursor: 'context-menu' }}
                >
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {parentCategories.find(p => p.id === category.parentId)?.name || '-'}
                  </TableCell>
                  <TableCell>{category.creatorName}</TableCell>
                  <TableCell>{category.documentCount}</TableCell>
                  <TableCell>{category.sort}</TableCell>
                  <TableCell>
                    <Switch
                      checked={category.status === 1}
                      onChange={() => handleStatusChange(category.id, category.status === 1 ? 0 : 1)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#6C8EF2',
                          '&:hover': {
                            backgroundColor: alpha('#6C8EF2', 0.08),
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#6C8EF2',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="编辑">
                      <IconButton onClick={() => handleOpen(category)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton onClick={() => handleDelete(category.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ 
        mt: 2,
        display: 'flex', 
        justifyContent: 'flex-end',
        bgcolor: 'background.paper',
        p: 1,
        borderRadius: 1
      }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => {
            setPagination(prev => ({
              ...prev,
              current: page,
              pageSize: pageSize,
            }));
          }}
        />
      </Box>

      <Menu
        open={menuPosition !== null}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition !== null
            ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => {
          handleCloseMenu();
          if (selectedCategory) {
            handleOpen(undefined, selectedCategory);
          }
        }}>
          <AddIcon sx={{ mr: 1 }} fontSize="small" />
          新增子分类
        </MenuItem>
      </Menu>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? '编辑分类' : '新增分类'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="分类名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>父分类</InputLabel>
              <Select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value as number | null })}
                label="父分类"
              >
                <MenuItem value="">无</MenuItem>
                {parentCategories.map((category) => (
                  <MenuItem 
                    key={category.id} 
                    value={category.id}
                    disabled={editingCategory?.id === category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="排序号"
              type="number"
              value={formData.sort}
              onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
              },
            }}
          >
            确定
          </Button>
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 