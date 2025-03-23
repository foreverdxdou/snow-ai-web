'use client';

import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 预加载首页
  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.code === 200) {
        Cookies.set('token', data.data.token, { expires: 7 });
        message.success('登录成功');
        // 使用 replace 而不是 push
        router.replace('/');
      } else {
        message.error(data.message || '登录失败');
      }
    } catch (error) {
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    height: '44px',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    boxShadow: 'none',
    ':hover': {
      borderColor: '#1890FF',
      boxShadow: 'none'
    },
    ':focus': {
      borderColor: '#1890FF',
      boxShadow: 'none'
    }
  };

  return (
    <Form
      name="login"
      onFinish={onFinish}
      size="large"
      layout="vertical"
      style={{ width: '100%' }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input 
          prefix={<UserOutlined style={{ color: '#9CA3AF' }} />}
          placeholder="用户名" 
          style={inputStyle}
          className="custom-input"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#9CA3AF' }} />}
          placeholder="密码"
          style={inputStyle}
          className="custom-input"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: '12px' }}>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          style={{ 
            width: '100%', 
            height: '44px', 
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          登录
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <Link 
          href="/register" 
          style={{
            color: '#1890FF',
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          还没有账号？立即注册
        </Link>
      </div>
    </Form>
  );
} 