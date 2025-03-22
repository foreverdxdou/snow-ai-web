import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as userApi from '../api/user';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    try {
      console.log('Login request:', values);
      const res = await userApi.login(values);
      console.log('Login response:', res);
      if (res.code === 200) {
        localStorage.setItem('token', res.data.token);
        message.success('登录成功');
        navigate('/app/kb/list');
      } else {
        message.error(res.message || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('登录失败，请重试');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="登录" style={{ width: 400 }}>
        <Form
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 