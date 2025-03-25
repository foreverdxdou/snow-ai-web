'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { documentService } from '@/app/services/document';
import { knowledgeService } from '@/app/services/knowledge';
import { categoryService } from '@/app/services/category';
import type { Document, DocumentCreateDTO } from '@/app/types/document';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import type { KbCategory } from '@/app/types/category';
import { Pagination } from '@/app/components/common/Pagination';
import { alpha } from '@mui/material/styles';

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseVO[]>([]);
  const [categories, setCategories] = useState<KbCategory[]>([]);
  const [selectedKbId, setSelectedKbId] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<DocumentCreateDTO>({
    name: '',
    content: '',
    categoryId: 0,
    kbId: 0,
    tags: [],
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 获取文档列表
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getList({
        current: pagination.current,
        size: pagination.pageSize,
        kbId: selectedKbId || undefined,
      });
      setDocuments(response.data.data.records);
      setPagination(prev => ({ ...prev, total: response.data.data.total }));
    } catch (error) {
      console.error('获取文档列表失败:', error);
      setSnackbar({
        open: true,
        message: '获取文档列表失败',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取知识库列表
  const fetchKnowledgeBases = async () => {
    try {
      const response = await knowledgeService.getUserKnowledgeBases();
      setKnowledgeBases(response.data.data);
    } catch (error) {
      console.error('获取知识库列表失败:', error);
    }
  };

  // 获取分类列表
  const fetchCategories = async (kbId: number) => {
    try {
      const response = await categoryService.getList({
        kbId,
        current: 1,
        size: 1000,
      });
      setCategories(response.data.data.records);
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [pagination.current, pagination.pageSize, selectedKbId]);

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  // 处理知识库选择变化
  const handleKbChange = (kbId: number) => {
    setSelectedKbId(kbId);
    setFormData(prev => ({ ...prev, kbId }));
    fetchCategories(kbId);
  };

  // 打开新增/编辑对话框
  const handleOpen = (document?: Document) => {
    if (document) {
      setEditingDocument(document);
      setFormData({
        name: document.name,
        content: document.content,
        categoryId: document.categoryId,
        kbId: document.kbId,
        tags: document.tags?.map(tag => tag.name) || [],
      });
      fetchCategories(document.kbId);
    } else {
      setEditingDocument(null);
      setFormData({
        name: '',
        content: '',
        categoryId: 0,
        kbId: selectedKbId || 0,
        tags: [],
      });
    }
    setOpen(true);
  };

  // 关闭对话框
  const handleClose = () => {
    setOpen(false);
    setEditingDocument(null);
    setFormData({
      name: '',
      content: '',
      categoryId: 0,
      kbId: selectedKbId || 0,
      tags: [],
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      if (editingDocument) {
        await documentService.update(editingDocument.id, formData);
      } else {
        await documentService.create(formData);
      }
      setSnackbar({
        open: true,
        message: `${editingDocument ? '更新' : '创建'}成功`,
        severity: 'success',
      });
      handleClose();
      fetchDocuments();
    } catch (error) {
      console.error(`${editingDocument ? '更新' : '创建'}文档失败:`, error);
      setSnackbar({
        open: true,
        message: `${editingDocument ? '更新' : '创建'}失败`,
        severity: 'error',
      });
    }
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (!file || !selectedKbId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('kbId', selectedKbId.toString());

    try {
      await documentService.upload(formData);
      setSnackbar({
        open: true,
        message: '上传成功',
        severity: 'success',
      });
      setUploadOpen(false);
      setFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('上传文档失败:', error);
      setSnackbar({
        open: true,
        message: '上传失败',
        severity: 'error',
      });
    }
  };

  // 删除文档
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个文档吗？')) return;
    try {
      await documentService.delete(id);
      setSnackbar({
        open: true,
        message: '删除成功',
        severity: 'success',
      });
      fetchDocuments();
    } catch (error) {
      console.error('删除文档失败:', error);
      setSnackbar({
        open: true,
        message: '删除失败',
        severity: 'error',
      });
    }
  };

  // 更新文档状态
  const handleStatusChange = async (id: number, status: number) => {
    try {
      await documentService.updateStatus(id, status);
      setSnackbar({
        open: true,
        message: '状态更新成功',
        severity: 'success',
      });
      fetchDocuments();
    } catch (error) {
      console.error('更新状态失败:', error);
      setSnackbar({
        open: true,
        message: '更新状态失败',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 顶部操作区 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          文档管理
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
              },
              height: '44px',
            }}
          >
            上传文档
          </Button>
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
            }}
          >
            新增文档
          </Button>
        </Box>
      </Box>

      {/* 知识库选择 */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>选择知识库</InputLabel>
          <Select
            value={selectedKbId || ''}
            onChange={(e) => handleKbChange(e.target.value as number)}
            label="选择知识库"
          >
            <MenuItem value="">全部</MenuItem>
            {knowledgeBases.map((kb) => (
              <MenuItem key={kb.id} value={kb.id}>
                {kb.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 文档列表 */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width="20%">名称</TableCell>
              <TableCell width="15%">知识库</TableCell>
              <TableCell width="15%">分类</TableCell>
              <TableCell width="10%">版本</TableCell>
              <TableCell width="10%">创建人</TableCell>
              <TableCell width="10%">状态</TableCell>
              <TableCell width="20%">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.name}</TableCell>
                  <TableCell>{document.kbName}</TableCell>
                  <TableCell>{document.categoryName}</TableCell>
                  <TableCell>{document.version}</TableCell>
                  <TableCell>{document.creatorName}</TableCell>
                  <TableCell>
                    <Switch
                      checked={document.status === 1}
                      onChange={() => handleStatusChange(document.id, document.status === 1 ? 0 : 1)}
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
                    <Tooltip title="查看详情">
                      <IconButton 
                        onClick={() => router.push(`/documents/${document.id}`)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="编辑">
                      <IconButton onClick={() => handleOpen(document)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton 
                        onClick={() => handleDelete(document.id)} 
                        size="small" 
                        color="error"
                      >
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

      {/* 分页 */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
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

      {/* 新增/编辑对话框 */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDocument ? '编辑文档' : '新增文档'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>知识库</InputLabel>
              <Select
                value={formData.kbId || ''}
                onChange={(e) => {
                  const kbId = e.target.value as number;
                  setFormData({ ...formData, kbId, categoryId: 0 });
                  fetchCategories(kbId);
                }}
                label="知识库"
                disabled={!!editingDocument}
              >
                {knowledgeBases.map((kb) => (
                  <MenuItem key={kb.id} value={kb.id}>
                    {kb.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>分类</InputLabel>
              <Select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value as number })}
                label="分类"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="文档名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="文档内容"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              multiline
              rows={10}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="标签"
              value={formData.tags?.join(',')}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
              helperText="多个标签请用英文逗号分隔"
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

      {/* 上传对话框 */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>上传文档</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>选择知识库</InputLabel>
              <Select
                value={selectedKbId || ''}
                onChange={(e) => handleKbChange(e.target.value as number)}
                label="选择知识库"
              >
                {knowledgeBases.map((kb) => (
                  <MenuItem key={kb.id} value={kb.id}>
                    {kb.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha('#6C8EF2', 0.04),
                },
              }}
              component="label"
            >
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".doc,.docx,.pdf,.txt,.md"
              />
              {file ? (
                <Typography>{file.name}</Typography>
              ) : (
                <Typography color="textSecondary">
                  点击或拖拽文件到此处上传<br />
                  支持 .doc, .docx, .pdf, .txt, .md 格式
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setUploadOpen(false);
            setFile(null);
          }}>
            取消
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!file || !selectedKbId}
            sx={{
              background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5A7DE0 30%, #65D2B3 90%)',
              },
            }}
          >
            上传
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示消息 */}
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