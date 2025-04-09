'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    LinearProgress,
    InputAdornment,
    IconButton,
    Alert,
    Snackbar
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import type { User } from '@/app/types/userinfo';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import {
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { userService } from '@/app/services/user';
import { useTheme } from '@mui/material/styles';

// 密码强度检查函数
const checkPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (hasLowerCase) score++;
    if (hasUpperCase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChar) score++;
    if (isLongEnough) score++;

    if (score <= 2) return { score, label: 'weak', color: '#f44336' };
    if (score <= 3) return { score, label: 'medium', color: '#ff9800' };
    return { score, label: 'strong', color: '#4caf50' };
};

interface UserInfoProps {
    userInfo: User | null;
}

export const UserInfo: React.FC<UserInfoProps> = ({
    userInfo,
}) => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [mounted, setMounted] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string }>({ score: 0, label: '', color: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        };
    }, []);

    const displayName = mounted ? (userInfo?.nickname || user?.username || '') : '';
    const avatarText = mounted ? displayName[0]?.toUpperCase() || '' : '';

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();
        router.push('/profile');
    };

    const handleLogout = async (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();
        try {
            await logout();
            setSnackbarMessage(t('common.user.logoutSuccess'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            router.push('/login');
        } catch (error) {
            console.error('退出登录失败:', error);
            setSnackbarMessage(t('common.user.logoutError'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleChangePasswordClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();
        setChangePasswordOpen(true);
    };

    const handleCloseChangePassword = () => {
        setChangePasswordOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength({ score: 0, label: '', color: '' });
        setError(null);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        setPasswordStrength(checkPasswordStrength(value));
    };

    const handleChangePassword = async () => {
        if (!oldPassword) {
            setError(t('common.user.oldPasswordRequired'));
            return;
        }
        if (!newPassword) {
            setError(t('common.user.newPasswordRequired'));
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(t('common.user.passwordNotMatch'));
            return;
        }
        const strength = checkPasswordStrength(newPassword);
        if (strength.score < 3) {
            setError(t('common.user.passwordTooWeak'));
            return;
        }
        if (!user?.id) {
            setError(t('common.user.changePasswordError'));
            return;
        }
        setLoading(true);
        setError('');
        try {
            await userService.changePassword(user.id, oldPassword, newPassword);
            setChangePasswordOpen(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordStrength({ score: 0, label: '', color: '' });
            setShowOldPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            setError('');
            showSnackbar(t('common.user.changePasswordSuccess'), 'success');
        } catch (err) {
            console.error('修改密码失败:', err);
            setError(t('common.user.changePasswordError'));
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                cursor: 'pointer',
                py: 0.75,
                px: 1.5,
                borderRadius: 1.5,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: (theme) => 
                        theme.palette.mode === 'light'
                            ? alpha(theme.palette.primary.main, 0.08)
                            : alpha(theme.palette.primary.main, 0.15),
                },
            }} 
            onClick={handleMenuClick}
        >
            <Avatar 
                sx={{ 
                    width: 32, 
                    height: 32,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)'
                        : 'linear-gradient(135deg, #66B2FF 0%, #007FFF 100%)',
                    color: (theme) => theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : '#fff',
                }}
            >
                {avatarText}
            </Avatar>
            {mounted && (
                <Typography 
                    variant="body2" 
                    noWrap
                    sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        maxWidth: 120,
                        letterSpacing: '0.15px',
                    }}
                >
                    {displayName}
                </Typography>
            )}
            </Box>

            {mounted && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={(event) => event.stopPropagation()}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                width: 220,
                                overflow: 'visible',
                                mt: 1.5,
                                backgroundColor: (theme) => 
                                    alpha(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.98 : 0.95),
                                backdropFilter: 'blur(6px)',
                                borderRadius: 1.5,
                                border: 1,
                                borderColor: 'divider',
                                boxShadow: (theme) => 
                                    `0px 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                    borderLeft: 1,
                                    borderTop: 1,
                                    borderColor: 'divider',
                                },
                            },
                        },
                    }}
                >
                    <Box sx={{ pt: 2, pb: 1.5, px: 2.5 }}>
                        <Typography variant="subtitle2" noWrap>
                            {displayName}
                        </Typography>
                        {userInfo?.email && (
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {userInfo.email}
                            </Typography>
                        )}
                    </Box>
                    <Divider />
                    <Box sx={{ py: 1 }}>
                        <MenuItem 
                            onClick={handleProfile}
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircleIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                                primary={t('common.profile')}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }}
                            />
                        </MenuItem>
                        <MenuItem 
                            onClick={handleChangePasswordClick}
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <ListItemIcon>
                                <LockIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                                primary={t('common.user.changePassword')}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }}
                            />
                        </MenuItem>
                        <MenuItem 
                            onClick={handleLogout}
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                color: 'error.main',
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                                },
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText 
                                primary={t('common.logout')}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }}
                            />
                        </MenuItem>
                    </Box>
                </Menu>
            )}

            {/* 修改密码对话框 */}
            <Dialog 
                open={changePasswordOpen} 
                onClose={loading ? undefined : handleCloseChangePassword}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{t('common.user.changePassword')}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 1 }}>
                                {error}
                            </Alert>
                        )}
                        <TextField
                            label={t('common.user.oldPassword')}
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            fullWidth
                            disabled={loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            edge="end"
                                        >
                                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label={t('common.user.newPassword')}
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            fullWidth
                            disabled={loading}
                            helperText={t('common.user.passwordRequirements')}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {newPassword && (
                            <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {t('common.user.passwordStrength')}: {t(`common.user.${passwordStrength.label === 'weak' ? 'weak' : passwordStrength.label === 'medium' ? 'medium' : 'strong'}`)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {passwordStrength.score}/5
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={(passwordStrength.score / 5) * 100}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: alpha('#e0e0e0', 0.5),
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: passwordStrength.color,
                                        }
                                    }}
                                />
                            </Box>
                        )}
                        <TextField
                            label={t('common.user.confirmPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            disabled={loading}
                            error={confirmPassword !== '' && newPassword !== confirmPassword}
                            helperText={confirmPassword !== '' && newPassword !== confirmPassword ? t('common.user.passwordNotMatch') : ''}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCloseChangePassword} 
                        disabled={loading}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button 
                        onClick={handleChangePassword} 
                        variant="contained" 
                        disabled={loading}
                    >
                        {t('common.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 提示消息 */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbarSeverity} 
                    sx={{ 
                        width: '100%',
                        backgroundColor: snackbarSeverity === 'success' ? 'success.light' : 'error.light',
                        color: snackbarSeverity === 'success' ? 'green' : 'red',
                        '& .MuiAlert-icon': {
                            color: snackbarSeverity === 'success' ? 'green' : 'red'
                        }
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};