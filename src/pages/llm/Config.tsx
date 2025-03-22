import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import * as api from '@/api/llm';
import type { LlmConfig } from '@/types/llm';

const LlmConfigManage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<LlmConfig[]>([]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data = await api.getLlmConfigs();
      setConfigs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleCreate = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: LlmConfig) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteLlmConfig(id);
      message.success(t('common.success'));
      fetchConfigs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (editingId) {
        await api.updateLlmConfig({ ...values, id: editingId });
      } else {
        await api.createLlmConfig(values);
      }
      setVisible(false);
      message.success(t('common.success'));
      fetchConfigs();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('llm.modelName'),
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: t('llm.apiUrl'),
      dataIndex: 'apiUrl',
      key: 'apiUrl',
    },
    {
      title: t('llm.enabled'),
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Switch checked={enabled} disabled />
      ),
    },
    {
      title: t('common.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: any, record: LlmConfig) => (
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
      title={t('menu.llm.config')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('common.create')}
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={configs}
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
            name="modelName"
            label={t('llm.modelName')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apiUrl"
            label={t('llm.apiUrl')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apiKey"
            label={t('llm.apiKey')}
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="enabled"
            label={t('llm.enabled')}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LlmConfigManage; 