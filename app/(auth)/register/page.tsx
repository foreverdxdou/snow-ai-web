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
    Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { authService } from '@/app/services/auth';

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

interface RegisterForm {
    username: string;
    password: string;
    nickname: string;
    email: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<RegisterForm>({
        username: '',
        password: '',
        nickname: '',
        email: ''
    });

    const handleChange = (field: keyof RegisterForm) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await authService.register(formData);
            router.push('/login');
        } catch (err) {
            setError(t('register.error'));
            console.error('注册失败:', err);
        } finally {
            setLoading(false);
        }
    }, [formData, router, t]);

    return (
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            <Paper 
                elevation={0}
                sx={{ 
                    p: 4,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.95)'
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
                                value={formData.username}
                                onChange={handleChange('username')}
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
                                value={formData.password}
                                onChange={handleChange('password')}
                                required
                                disabled={loading}
                                fullWidth
                                placeholder={t('common.password')}
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
                                {t('common.nickname')}
                            </Typography>
                            <StyledTextField
                                value={formData.nickname}
                                onChange={handleChange('nickname')}
                                required
                                disabled={loading}
                                fullWidth
                                placeholder={t('common.nickname')}
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
                                {t('common.email')}
                            </Typography>
                            <StyledTextField
                                type="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                required
                                disabled={loading}
                                fullWidth
                                placeholder={t('common.email')}
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
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                '&:hover': {
                                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : t('common.register')}
                        </Button>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {t('register.hasAccount')}
                            </Typography>
                            <Button
                                variant="text"
                                onClick={() => router.push('/login')}
                                sx={{
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        textDecoration: 'underline',
                                    }
                                }}
                            >
                                {t('register.login')}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
} 