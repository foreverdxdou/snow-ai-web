import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Select, message, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/store';
import type { RootState } from '@/types/store';
import type { Permission } from '@/types/permission';
import * as api from '@/api/permission';

const { TabPane } = Tabs;

const PermissionManage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedKbId, setSelectedKbId] = useState<number>();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const { knowledgeBases } = useAppSelector((state: RootState) => state.knowledge);

  useEffect(() => {
    if (selectedKbId) {
      fetchPermissions();
    }
  }, [selectedKbId]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchPermissions = async () => {
    if (!selectedKbId) return;
    try {
      setLoading(true);
      const data = await api.getPermissions(selectedKbId);
      setPermissions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssign = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleSubmit = async () => {
    if (!selectedKbId) return;
    try {
      setLoading(true);
      const values = await form.validateFields();
      await api.assignPermissions(selectedKbId, values);
      setVisible(false);
      message.success(t('common.success'));
      fetchPermissions();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('permission.name'),
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string, record: Permission) => text || record.roleName,
    },
    {
      title: t('permission.type'),
      dataIndex: 'permissionType',
      key: 'permissionType',
      render: (type: number) => {
        switch (type) {
          case 1:
            return t('permission.type.readonly');
          case 2:
            return t('permission.type.readwrite');
          case 3:
            return t('permission.type.admin');
          default:
            return '-';
        }
      },
    },
    {
      title: t('common.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  return (
    <Card
      title={t('menu.permission')}
      extra={
        <Space>
          <Select
            placeholder={t('knowledge.name')}
            style={{ width: 200 }}
            onChange={setSelectedKbId}
            options={knowledgeBases.map(kb => ({ label: kb.name, value: kb.id }))}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAssign} disabled={!selectedKbId}>
            {t('permission.assign')}
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={permissions}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={t('permission.assign')}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Tabs defaultActiveKey="user">
            <TabPane tab={t('permission.user')} key="user">
              <Form.Item
                name="userIds"
                label={t('permission.selectUser')}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  options={users.map(user => ({ label: user.nickname, value: user.id }))}
                />
              </Form.Item>
            </TabPane>
            <TabPane tab={t('permission.role')} key="role">
              <Form.Item
                name="roleIds"
                label={t('permission.selectRole')}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  options={roles.map(role => ({ label: role.name, value: role.id }))}
                />
              </Form.Item>
            </TabPane>
          </Tabs>
          <Form.Item
            name="permissionType"
            label={t('permission.type')}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={1}>{t('permission.type.readonly')}</Select.Option>
              <Select.Option value={2}>{t('permission.type.readwrite')}</Select.Option>
              <Select.Option value={3}>{t('permission.type.admin')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PermissionManage; 