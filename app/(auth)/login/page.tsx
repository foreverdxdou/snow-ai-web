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
    alpha,
    useTheme,
    Button,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Visibility, VisibilityOff, Login } from '@mui/icons-material';
import { useAuth } from '@/app/hooks/useAuth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// 自定义输入框样式
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'transparent !important',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
        },
        '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
            transform: 'translateY(-1px)',
        },
        '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.4),
        },
        '& fieldset': {
            borderColor: alpha(theme.palette.divider, 0.3),
        },
        '&:hover fieldset': {
            borderColor: alpha(theme.palette.primary.main, 0.4),
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1.5px',
        },
        '& input': {
            backgroundColor: 'transparent !important',
            '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                WebkitTextFillColor: theme.palette.text.primary,
                transition: 'background-color 5000s ease-in-out 0s !important',
            },
            '&:-webkit-autofill:hover': {
                WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
            },
            '&:-webkit-autofill:focus': {
                WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
            },
            '&:-webkit-autofill:active': {
                WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
            }
        }
    },
    '& .MuiOutlinedInput-input': {
        padding: '12px 16px',
        height: '24px',
        fontSize: '1rem',
        letterSpacing: '0.01em',
        backgroundColor: 'transparent !important',
        '&::placeholder': {
            fontSize: '1rem',
            color: alpha(theme.palette.text.primary, 0.4),
        }
    }
}));

// 使用 React.memo 优化表单组件
const LoginForm = React.memo(({
    onSubmit,
    loading,
    error,
    isSuccess,
}: {
    onSubmit: (username: string, password: string) => void;
    loading: boolean;
    error: string | null;
    isSuccess: boolean;
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(username, password);
    }, [username, password, onSubmit]);

    if (isSuccess) {
        return (
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: '32px',
            }}>
                <CheckCircleIcon 
                    sx={{ 
                        fontSize: 64,
                        color: 'success.main',
                        animation: 'fadeIn 0.5s ease-in-out'
                    }} 
                />
                <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700, fontSize: '2rem' }}>
                    {t('auth.loginSuccessTitle')}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {t('auth.loginSuccessDesc')}
                </Typography>
            </Box>
        );
    }

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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        fullWidth
                        placeholder={t('common.password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    sx={{ 
                        mt: 2,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                    }}
                    startIcon={loading ? <CircularProgress size={24} /> : <Login />}
                >
                     {t('common.login')}
                </Button>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {t('login.noAccount')}
                    </Typography>
                    <Button
                        variant="text"
                        onClick={() => router.push('/register')}
                        sx={{
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        {t('login.register')}
                    </Button>
                </Box>
            </Box>
        </form>
    );
});

LoginForm.displayName = 'LoginForm';

export default function LoginPage() {
    const { t } = useTranslation();
    const theme = useTheme();
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // 使用 useCallback 优化登录处理函数
    const handleLogin = useCallback(async (username: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            await login(username, password);
            setIsSuccess(true);
            // 延迟跳转，让用户看到成功提示
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (err: any) {
            // 处理错误响应
            setError(err.message || t('auth.loginFailed.default'));
            console.error('登录失败err:', err.message);
        } finally {
            setLoading(false);
        }
    }, [login, router, t]);

    return (
        <Box sx={{ width: '400px', height: 'auto' }}>
            <Paper 
                elevation={0}
                sx={{ 
                    p: 4,
                    borderRadius: 3,
                    width: '100%',
                    minHeight: '450px',
                    position: 'relative',
                    background: theme.palette.mode === 'dark' 
                        ? "background.paper"
                        : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.2)'
                        : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
            >
                <LoginForm
                    onSubmit={handleLogin}
                    loading={loading}
                    error={error}
                    isSuccess={isSuccess}
                />
            </Paper>
        </Box>
    );
} 