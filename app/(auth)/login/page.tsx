'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { useDebouncedCallback } from '@/app/utils/performance';

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
            <TextField
                fullWidth
                label={t('common.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                disabled={loading}
            />
            <TextField
                fullWidth
                label={t('common.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={loading}
            />
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
            <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 3 }}
            >
                {loading ? <CircularProgress size={24} /> : t('common.login')}
            </Button>
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

    // 使用 useMemo 优化卡片样式
    const cardStyle = useMemo(() => ({
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        p: 3,
    }), []);

    return (
        <PerformanceLayout>
            <Box sx={cardStyle}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h1" gutterBottom align="center">
                            {t('common.login')}
                        </Typography>
                        <LoginForm
                            onSubmit={handleLogin}
                            loading={loading}
                            error={error}
                        />
                    </CardContent>
                </Card>
            </Box>
        </PerformanceLayout>
    );
} 