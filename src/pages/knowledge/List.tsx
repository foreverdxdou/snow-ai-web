import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { fetchKnowledgeBases } from '@/store/slices/knowledge';
import * as api from '@/api/knowledge';
import type { KnowledgeBase } from '@/types/knowledge';

const KnowledgeList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const { knowledgeBases } = useAppSelector(state => state.knowledge);

  useEffect(() => {
    dispatch(fetchKnowledgeBases({}));
  }, [dispatch]);

  const handleCreate = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: KnowledgeBase) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteKnowledgeBase(id);
      message.success(t('common.success'));
      dispatch(fetchKnowledgeBases({}));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (editingId) {
        await api.updateKnowledgeBase(editingId, values);
      } else {
        await api.createKnowledgeBase(values);
      }
      setVisible(false);
      message.success(t('common.success'));
      dispatch(fetchKnowledgeBases({}));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('knowledge.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('knowledge.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('knowledge.creator'),
      dataIndex: 'creatorName',
      key: 'creatorName',
    },
    {
      title: t('knowledge.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: t('knowledge.action'),
      key: 'action',
      render: (_: any, record: KnowledgeBase) => (
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

  return (
    <Card
      title={t('menu.knowledge.list')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('common.create')}
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={knowledgeBases}
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
            label={t('knowledge.name')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label={t('knowledge.description')}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KnowledgeList; 