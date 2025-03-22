import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, InputNumber, message, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { fetchCategories } from '@/store/slices/knowledge';
import * as api from '@/api/knowledge';
import type { Category, KnowledgeBase } from '@/types/knowledge';
import type { RootState } from '@/types/store';

const CategoryManage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedKbId, setSelectedKbId] = useState<number>();

  const { categories, knowledgeBases } = useAppSelector((state: RootState) => state.knowledge);

  useEffect(() => {
    if (selectedKbId) {
      dispatch(fetchCategories(selectedKbId));
    }
  }, [dispatch, selectedKbId]);

  const handleCreate = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: Category) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteCategory(id);
      message.success(t('common.success'));
      if (selectedKbId) {
        dispatch(fetchCategories(selectedKbId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      values.kbId = selectedKbId;
      
      if (editingId) {
        await api.updateCategory(editingId, values);
      } else {
        await api.createCategory(values);
      }
      setVisible(false);
      message.success(t('common.success'));
      if (selectedKbId) {
        dispatch(fetchCategories(selectedKbId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('category.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('category.parent'),
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: number) => {
        const parent = categories.find(c => c.id === parentId);
        return parent?.name || '-';
      }
    },
    {
      title: t('category.sort'),
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: t('category.documentCount'),
      dataIndex: 'documentCount',
      key: 'documentCount',
    },
    {
      title: t('knowledge.action'),
      key: 'action',
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('common.edit')}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  // 将扁平数据转换为树形结构
  const buildTree = (items: Category[]) => {
    const map = new Map<number, Category>();
    const tree: Category[] = [];

    items.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });

    items.forEach(item => {
      if (item.parentId && map.has(item.parentId)) {
        const parent = map.get(item.parentId);
        parent?.children?.push(map.get(item.id)!);
      } else {
        tree.push(map.get(item.id)!);
      }
    });

    return tree;
  };

  return (
    <Card
      title={t('menu.knowledge.category')}
      extra={
        <Space>
          <Select
            placeholder={t('knowledge.name')}
            style={{ width: 200 }}
            onChange={setSelectedKbId}
            options={knowledgeBases.map((kb: KnowledgeBase) => ({ label: kb.name, value: kb.id }))}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} disabled={!selectedKbId}>
            {t('common.create')}
          </Button>
        </Space>
      }
    >
      {/* 树形展示分类 */}
      <Tree
        className="mb-4"
        treeData={buildTree(categories).map(item => ({
          key: item.id,
          title: item.name,
          children: item.children?.map(child => ({
            key: child.id,
            title: child.name,
          }))
        }))}
      />

      {/* 表格展示分类 */}
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? t('common.edit') : t('common.create')}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t('category.name')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parentId"
            label={t('category.parent')}
          >
            <Select
              allowClear
              options={categories.map(c => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Form.Item
            name="sort"
            label={t('category.sort')}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryManage; 