import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  TagsOutlined,
  FolderOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/knowledge',
      icon: <BookOutlined />,
      label: t('知识库管理'),
      children: [
        {
          key: '/knowledge/list',
          label: t('知识库列表')
        },
        {
          key: '/knowledge/category',
          icon: <FolderOutlined />,
          label: t('分类管理')
        },
        {
          key: '/knowledge/document',
          icon: <FileTextOutlined />,
          label: t('文档管理')
        },
        {
          key: '/knowledge/tag',
          icon: <TagsOutlined />,
          label: t('标签管理')
        }
      ]
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: t('系统设置'),
      children: [
        {
          key: '/system/menu',
          label: t('菜单管理')
        }
      ]
    }
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-4 flex justify-between items-center">
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content className="m-6">
          <div className="bg-white p-6 min-h-[360px]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout; 