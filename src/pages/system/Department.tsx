import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, TreeSelect, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import * as api from '@/api/system';
import type { Department } from '@/types/system';

const DepartmentManage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await api.getDepartmentTree();
      setDepartments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: Department) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteDepartment(id);
      message.success(t('common.success'));
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (editingId) {
        await api.updateDepartment(editingId, values);
      } else {
        await api.createDepartment(values);
      }
      setVisible(false);
      message.success(t('common.success'));
      fetchDepartments();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('department.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('department.leader'),
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: t('department.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('department.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('department.sort'),
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: any, record: Department) => (
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
      title={t('menu.system.department')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('common.create')}
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={departments}
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
            label={t('department.name')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parentId"
            label={t('department.parent')}
          >
            <TreeSelect
              allowClear
              treeData={departments.map((dept: Department) => ({
                title: dept.name,
                value: dept.id,
                children: dept.children?.map((child: Department) => ({
                  title: child.name,
                  value: child.id,
                }))
              }))}
            />
          </Form.Item>
          <Form.Item
            name="leader"
            label={t('department.leader')}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t('department.phone')}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label={t('department.email')}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sort"
            label={t('department.sort')}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DepartmentManage; 