import React, { useEffect, useState } from 'react';
import { Modal, Tree, message } from 'antd';
import { useTranslation } from 'react-i18next';
import * as api from '@/api/system';
import type { Menu, Role } from '@/types/system';

interface MenuPermissionProps {
  visible: boolean;
  role?: Role;
  onCancel: () => void;
  onSuccess: () => void;
}

const MenuPermission: React.FC<MenuPermissionProps> = ({
  visible,
  role,
  onCancel,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [menuTree, setMenuTree] = useState<Menu[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  useEffect(() => {
    if (visible && role) {
      fetchMenuTree();
      fetchRoleMenus();
    }
  }, [visible, role]);

  const fetchMenuTree = async () => {
    try {
      const data = await api.getMenuTree();
      setMenuTree(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoleMenus = async () => {
    if (!role) return;
    try {
      const menuIds = await api.getRoleMenuIds(role.id);
      setSelectedKeys(menuIds);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOk = async () => {
    if (!role) return;
    try {
      setLoading(true);
      await api.updateRoleMenus(role.id, selectedKeys);
      message.success(t('common.success'));
      onSuccess();
      onCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buildTreeData = (menus: Menu[]) => {
    return menus.map(menu => ({
      title: menu.name,
      key: menu.id,
      children: menu.children ? buildTreeData(menu.children) : undefined
    }));
  };

  return (
    <Modal
      title={t('role.menuPermission')}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Tree
        checkable
        checkedKeys={selectedKeys}
        onCheck={(checked: any) => setSelectedKeys(checked as number[])}
        treeData={buildTreeData(menuTree)}
      />
    </Modal>
  );
};

export default MenuPermission; 