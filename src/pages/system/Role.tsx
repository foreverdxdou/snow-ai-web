import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, InputNumber, Radio, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import * as api from '@/api/system';
import type { Role } from '@/types/system';
import MenuPermission from './components/MenuPermission';

const RoleManage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>();

  useEffect(() => {
    fetchRoles();
  }, [current]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await api.getRoleList({
        current,
        size: 10
      });
      setRoles(data.records);
      setTotal(data.total);
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

  const handleEdit = (record: Role) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteRole(id);
      message.success(t('common.success'));
      fetchRoles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (editingId) {
        await api.updateRole(editingId, values);
      } else {
        await api.createRole(values);
      }
      setVisible(false);
      message.success(t('common.success'));
      fetchRoles();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPermission = (record: Role) => {
    setSelectedRole(record);
    setMenuVisible(true);
  };

  const columns = [
    {
      title: t('role.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('role.code'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('role.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        switch (type) {
          case 1:
            return t('role.type.system');
          case 2:
            return t('role.type.custom');
          default:
            return '-';
        }
      }
    },
    {
      title: t('role.sort'),
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: t('role.remark'),
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.type === 1}
          >
            {t('common.edit')}
          </Button>
          <Button
            type="link"
            icon={<SettingOutlined />}
            onClick={() => handleMenuPermission(record)}
          >
            {t('role.menuPermission')}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={record.type === 1}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={t('menu.system.role')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('common.create')}
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={{
          current,
          pageSize: 10,
          total,
          onChange: (page) => setCurrent(page)
        }}
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
            label={t('role.name')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label={t('role.code')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label={t('role.type')}
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value={2}>{t('role.type.custom')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="sort"
            label={t('role.sort')}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="remark"
            label={t('role.remark')}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* 菜单权限配置 */}
      <MenuPermission
        visible={menuVisible}
        role={selectedRole}
        onCancel={() => setMenuVisible(false)}
        onSuccess={fetchRoles}
      />
    </Card>
  );
};

export default RoleManage; 