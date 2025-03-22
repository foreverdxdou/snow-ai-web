import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { fetchTags } from '@/store/slices/knowledge';
import * as api from '@/api/knowledge';
import type { Tag, KnowledgeBase } from '@/types/knowledge';
import type { RootState } from '@/types/store';

const TagManage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedKbId, setSelectedKbId] = useState<number>();

  const { tags, knowledgeBases } = useAppSelector((state: RootState) => state.knowledge);

  useEffect(() => {
    if (selectedKbId) {
      dispatch(fetchTags({ kbId: selectedKbId }));
    }
  }, [dispatch, selectedKbId]);

  const handleCreate = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: Tag) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteTag(id);
      message.success(t('common.success'));
      if (selectedKbId) {
        dispatch(fetchTags({ kbId: selectedKbId }));
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
        await api.updateTag(editingId, values);
      } else {
        await api.createTag(values);
      }
      setVisible(false);
      message.success(t('common.success'));
      if (selectedKbId) {
        dispatch(fetchTags({ kbId: selectedKbId }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('tag.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('tag.description'),
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
      render: (_: any, record: Tag) => (
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
      title={t('menu.knowledge.tag')}
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
      <Table
        columns={columns}
        dataSource={tags}
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
            label={t('tag.name')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('tag.description')}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TagManage; 