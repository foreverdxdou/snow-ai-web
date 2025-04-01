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
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nickname: user.nickname || '',
                email: user.email || '',
            });
        }
    }, [user]);

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
            // TODO: 调用更新用户信息的 API
            // await userService.updateProfile(formData);
            setSuccess(t('profile.updateSuccess'));
        } catch (err) {
            setError(t('profile.updateError'));
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