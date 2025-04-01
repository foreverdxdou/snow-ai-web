'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import { CommonButton } from '@/app/components/common/CommonButton';
import { CommonInput } from '@/app/components/common/CommonInput';
import { ThemeLanguageSwitch } from '@/app/components/common/ThemeLanguageSwitch';

// 使用 React.memo 优化表单组件
const LoginForm = React.memo(({
    onSubmit,
    loading,
    error,
}: {
    onSubmit: (username: string, password: string) => void;
    loading: boolean;
    error: string | null;
}) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(username, password);
    }, [username, password, onSubmit]);

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <CommonInput
                    label={t('common.username')}
                    value={username}
                    onChange={(value) => setUsername(value as string)}
                    required
                    disabled={loading}
                    fullWidth
                />
                <CommonInput
                    label={t('common.password')}
                    type="password"
                    value={password}
                    onChange={(value) => setPassword(value as string)}
                    required
                    disabled={loading}
                    fullWidth
                />
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                <CommonButton
                    buttonVariant="login"
                    type="submit"
                    disabled={loading}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : t('common.login')}
                </CommonButton>
            </Box>
        </form>
    );
});

LoginForm.displayName = 'LoginForm';

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 使用 useCallback 优化登录处理函数
    const handleLogin = useCallback(async (username: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            await login(username, password);
            router.push('/');
        } catch (err) {
            setError(t('login.error'));
            console.error('登录失败:', err);
        } finally {
            setLoading(false);
        }
    }, [login, router, t]);

    return (
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            <Paper 
                elevation={0}
                sx={{ 
                    p: 4,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main',
                            mb: 2,
                        }}
                    >
                        {t('login.title')}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{
                            color: 'text.secondary',
                            opacity: 0.8,
                        }}
                    >
                        {t('login.description')}
                    </Typography>
                </Box>
                <LoginForm
                    onSubmit={handleLogin}
                    loading={loading}
                    error={error}
                />
            </Paper>
        </Box>
    );
} 