import { createBrowserRouter, Navigate } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import Login from '../pages/Login';
import KnowledgeList from '../pages/knowledge/List';
import CategoryManage from '../pages/knowledge/Category';
import DocumentManage from '../pages/knowledge/Document';
import TagManage from '../pages/knowledge/Tag';
import MenuManage from '../pages/system/Menu';
import AuthRoute from '../components/AuthRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/app',
    element: (
      <AuthRoute>
        <BasicLayout />
      </AuthRoute>
    ),
    children: [
      {
        path: '',  // 默认路由
        element: <Navigate to="kb/list" replace />
      },
      {
        path: 'kb/list',
        element: <KnowledgeList />
      },
      {
        path: 'kb/category',
        element: <CategoryManage />
      },
      {
        path: 'kb/document',
        element: <DocumentManage />
      },
      {
        path: 'kb/tag',
        element: <TagManage />
      },
      {
        path: 'system/menu',
        element: <MenuManage />
      }
    ]
  },
  // 捕获所有未匹配的路径
  {
    path: '*',
    element: <Navigate to="/app" replace />
  },
  // 兼容旧路径
  {
    path: '/knowledge/*',
    element: <Navigate to="/app/kb" replace />
  }
]);

export default router; 