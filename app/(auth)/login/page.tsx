'use client';

import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/app/services/auth';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

interface LoginForm {
    username: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    // 预加载首页
    useEffect(() => {
        router.prefetch('/');
    }, [router]);

    const onFinish = async (values: LoginForm) => {
        try {
            setLoading(true);
            const response = await authService.login(values.username, values.password);
            console.log(response);
            const data = response.data;
            if (data.code === 200) {
                Cookies.set('token', data.data.token);
                Cookies.set('username', values.username);
                message.success(t('auth.loginSuccess'));
                // 使用 replace 而不是 push
                router.replace('/');
            } else {
                message.error(data.message || t('auth.loginFailed'));
            }
        } catch (error: any) {
            message.error(error.message || t('auth.loginFailed'));
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
                rules={[{ required: true, message: t('auth.usernameRequired') }]}
            >
                <Input
                    prefix={<UserOutlined style={{ color: '#9CA3AF' }} />}
                    placeholder={t('common.username')}
                    style={inputStyle}
                    className="custom-input"
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: t('auth.passwordRequired') }]}
            >
                <Input.Password
                    prefix={<LockOutlined style={{ color: '#9CA3AF' }} />}
                    placeholder={t('common.password')}
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
                    {t('auth.loginButton')}
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
                    {t('auth.registerNow')}
                </Link>
            </div>
        </Form>
    );
} 