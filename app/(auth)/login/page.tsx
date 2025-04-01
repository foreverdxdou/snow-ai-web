'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    TextField,
    styled,
    alpha
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import { CommonButton } from '@/app/components/common/CommonButton';

// 自定义输入框样式
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
            transform: 'translateY(-1px)',
        },
        '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.4),
            backdropFilter: 'none',
        }
    },
    '& .MuiOutlinedInput-input': {
        padding: '12px 16px',
        height: '24px',
        fontSize: '1rem',
        letterSpacing: '0.01em',
        '&::placeholder': {
            fontSize: '1rem',
            color: alpha(theme.palette.text.primary, 0.4),
        }
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.divider, 0.3),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.4),
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '1.5px',
    }
}));

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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '1.1rem',
                        }}
                    >
                        {t('common.username')}
                    </Typography>
                    <StyledTextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        fullWidth
                        placeholder={t('common.username')}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '1.1rem',
                        }}
                    >
                        {t('common.password')}
                    </Typography>
                    <StyledTextField
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        fullWidth
                        placeholder={t('common.password')}
                    />
                </Box>
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
             
                <LoginForm
                    onSubmit={handleLogin}
                    loading={loading}
                    error={error}
                />
            </Paper>
        </Box>
    );
} 