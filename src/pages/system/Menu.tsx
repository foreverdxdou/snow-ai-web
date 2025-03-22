import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, TreeSelect, InputNumber, Radio, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import * as api from '@/api/system';
import type { Menu } from '@/types/system';
import { IconSelect } from './components/IconSelect';

const MenuManage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await api.getMenuTree();
      setMenus(data);
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

  const handleEdit = (record: Menu) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteMenu(id);
      message.success(t('common.success'));
      fetchMenus();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (editingId) {
        await api.updateMenu(editingId, values);
      } else {
        await api.createMenu(values);
      }
      setVisible(false);
      message.success(t('common.success'));
      fetchMenus();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('menu.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('menu.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        switch (type) {
          case 1:
            return t('menu.type.directory');
          case 2:
            return t('menu.type.menu');
          case 3:
            return t('menu.type.button');
          default:
            return '-';
        }
      }
    },
    {
      title: t('menu.permission'),
      dataIndex: 'permission',
      key: 'permission',
    },
    {
      title: t('menu.path'),
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: t('menu.component'),
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: t('menu.sort'),
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: any, record: Menu) => (
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
      title={t('menu.system.menu')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('common.create')}
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={menus}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? t('common.edit') : t('common.create')}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t('menu.name')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label={t('menu.type')}
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value={1}>{t('menu.type.directory')}</Radio>
              <Radio value={2}>{t('menu.type.menu')}</Radio>
              <Radio value={3}>{t('menu.type.button')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="parentId"
            label={t('menu.parent')}
          >
            <TreeSelect
              allowClear
              treeData={menus.map(menu => ({
                title: menu.name,
                value: menu.id,
                children: menu.children?.map(child => ({
                  title: child.name,
                  value: child.id,
                }))
              }))}
            />
          </Form.Item>
          <Form.Item
            name="permission"
            label={t('menu.permission')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="path"
            label={t('menu.path')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="icon"
            label={t('menu.icon')}
          >
            <IconSelect />
          </Form.Item>
          <Form.Item
            name="component"
            label={t('menu.component')}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sort"
            label={t('menu.sort')}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MenuManage; 