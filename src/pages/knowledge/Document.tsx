import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Upload, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { fetchDocuments, fetchCategories, fetchTags } from '@/store/slices/knowledge';
import * as api from '@/api/knowledge';
import type { Document, KnowledgeBase, Category, Tag } from '@/types/knowledge';
import type { RootState } from '@/types/store';
import type { UploadFile } from '@/types/upload';

const { TextArea } = Input;

const DocumentManage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedKbId, setSelectedKbId] = useState<number>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { documents, knowledgeBases, categories, tags } = useAppSelector((state: RootState) => state.knowledge);

  useEffect(() => {
    if (selectedKbId) {
      dispatch(fetchDocuments({ kbId: selectedKbId }));
      dispatch(fetchCategories(selectedKbId));
      dispatch(fetchTags({ kbId: selectedKbId }));
    }
  }, [dispatch, selectedKbId]);

  const handleCreate = () => {
    form.resetFields();
    setEditingId(null);
    setFileList([]);
    setVisible(true);
  };

  const handleEdit = (record: Document) => {
    form.setFieldsValue({
      ...record,
      tagIds: record.tags?.map(tag => tag.id)
    });
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteDocument(id);
      message.success(t('common.success'));
      if (selectedKbId) {
        dispatch(fetchDocuments({ kbId: selectedKbId }));
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

      const formData = new FormData();
      if (fileList[0]?.originFileObj) {
        formData.append('file', fileList[0].originFileObj);
      }
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      if (editingId) {
        await api.updateDocument(editingId, values);
      } else {
        await api.createDocument(formData);
      }
      setVisible(false);
      message.success(t('common.success'));
      if (selectedKbId) {
        dispatch(fetchDocuments({ kbId: selectedKbId }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('document.title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('document.category'),
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: t('document.tags'),
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: any[]) => tags?.map(tag => tag.name).join(', ')
    },
    {
      title: t('document.version'),
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: t('knowledge.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: t('knowledge.action'),
      key: 'action',
      render: (_: any, record: Document) => (
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
      title={t('menu.knowledge.document')}
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
        dataSource={documents}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? t('common.edit') : t('common.create')}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label={t('document.title')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {!editingId && (
            <Form.Item
              label={t('document.fileType')}
              required
            >
              <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>{t('common.upload')}</Button>
              </Upload>
            </Form.Item>
          )}
          <Form.Item
            name="categoryId"
            label={t('document.category')}
          >
            <Select
              allowClear
              options={categories.map((c: Category) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Form.Item
            name="tagIds"
            label={t('document.tags')}
          >
            <Select
              mode="multiple"
              allowClear
              options={tags.map((tag: Tag) => ({ label: tag.name, value: tag.id }))}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label={t('document.content')}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DocumentManage; 