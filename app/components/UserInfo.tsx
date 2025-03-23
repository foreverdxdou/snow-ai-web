'use client';

import { useEffect, useState } from 'react';
import { Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const { Text } = Typography;

interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
}

export default function UserInfo() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/current-user', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setUserInfo(data.data);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      Cookies.remove('token');
      router.push('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  const items = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  if (loading) {
    return <Text>加载中...</Text>;
  }

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
        <Avatar 
          icon={<UserOutlined />} 
          src={userInfo?.avatar}
          style={{ backgroundColor: '#1890ff' }}
        />
        <Text style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
          {userInfo?.nickname || userInfo?.username}
        </Text>
      </Space>
    </Dropdown>
  );
} 