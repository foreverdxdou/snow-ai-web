'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Grid,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import type { User } from '@/app/types/userinfo';
import { userService } from '@/app/services/user';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { alpha } from '@mui/material/styles';

export default function ProfilePage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({
        nickname: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!user?.id) return;
            try {
                const response = await userService.getById(user.id);
                if (response.data.code === 200) {
                    setFormData({
                        nickname: response.data.data.nickname || '',
                        email: response.data.data.email || '',
                        phone: response.data.data.phone || '',
                    });
                }
            } catch (err) {
                console.error('获取用户详情失败:', err);
            }
        };
        fetchUserDetails();
    }, [user?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (!user?.id) {
                throw new Error('用户未登录');
            }
            await userService.updateInfo(user.id, {
                nickname: formData.nickname || '',
                email: formData.email,
                phone: formData.phone
            });
            setSuccess(t('common.operateSuccess'));
            
            // 延迟一秒后刷新页面，让用户看到成功提示
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            setError(t('common.operateError'));
            console.error('更新个人资料失败:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PerformanceLayout>
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: (theme) => 
                            alpha(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.98 : 0.95),
                        backdropFilter: 'blur(6px)',
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Stack spacing={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mx: 'auto',
                                    mb: 2,
                                    fontSize: '2.5rem',
                                    fontWeight: 600,
                                    background: (theme) => theme.palette.mode === 'dark'
                                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)'
                                        : 'linear-gradient(135deg, #66B2FF 0%, #007FFF 100%)',
                                    color: (theme) => theme.palette.mode === 'dark'
                                        ? theme.palette.background.default
                                        : '#fff',
                                }}
                            >
                                {user?.nickname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || ''}
                            </Avatar>
                            <Typography variant="h5" gutterBottom>
                                {t('profile.title')}
                            </Typography>
                            <Typography color="text.secondary">
                                {t('profile.basicInfo')}
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {success}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={t('profile.username')}
                                        value={user?.username || ''}
                                        disabled
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="nickname"
                                        label={t('profile.nickname')}
                                        value={formData.nickname}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        label={t('profile.email')}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        type="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="phone"
                                        label={t('common.user.phone')}
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={loading}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            t('profile.updateProfile')
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Stack>
                </Paper>
            </Box>
        </PerformanceLayout>
    );
} 