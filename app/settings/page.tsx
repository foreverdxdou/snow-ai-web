'use client';

import { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setUser, updateSettings } from '../store/slices/userSlice';

const { Title } = Typography;
const { Option } = Select;

export default function SettingsPage() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user.username && user.email) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        theme: user.settings.theme,
        language: user.settings.language,
      });
    }
    return () => {
      form.resetFields();
    };
  }, [user, form]);

  const onFinish = (values: any) => {
    // 更新用户信息
    dispatch(setUser({
      id: user.id || '1',
      username: values.username,
      email: values.email,
    }));

    // 更新设置
    dispatch(updateSettings({
      theme: values.theme,
      language: values.language,
    }));
  };

  return (
    <div>
      <Title level={2}>设置</Title>
      <Card>
        <Form
          form={form}
          name="settings"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="theme"
            label="主题"
            rules={[{ required: true, message: '请选择主题' }]}
          >
            <Select>
              <Option value="light">浅色</Option>
              <Option value="dark">深色</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="language"
            label="语言"
            rules={[{ required: true, message: '请选择语言' }]}
          >
            <Select>
              <Option value="zh-CN">简体中文</Option>
              <Option value="en-US">English</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 