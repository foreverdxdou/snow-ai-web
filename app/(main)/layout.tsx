'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    useMediaQuery,
    Stack,
    alpha,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Home as HomeIcon,
    QuestionAnswer as QuestionAnswerIcon,
    LibraryBooks as LibraryBooksIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    Memory as MemoryIcon,
    ConfirmationNumber as ConfirmationNumberIcon,
    People as PeopleIcon,
    LocalOffer as LocalOfferIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Tune as TuneIcon,
    Security as SecurityIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    ManageAccounts as ManageAccountsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import { useThemeMode } from '@/app/hooks/useThemeMode';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { ThemeLanguageSwitch } from '@/app/components/common/ThemeLanguageSwitch';
import { UserInfo } from '@/app/components/UserInfo';
import { authService } from '@/app/services/auth';
import type { User } from '@/app/types/userinfo';

// 常量和类型定义
const DRAWER_WIDTH = 260;
const TOPBAR_HEIGHT = { xs: 56, sm: 64 };

interface MenuItem {
    id?: string;
    name?: string;
    icon: React.ElementType | React.ReactNode;
    text?: string;
    path?: string;
    children?: MenuItem[];
}

// 菜单项组件
const MenuItemComponent = React.memo(({ 
    icon, 
    text, 
    selected, 
    onClick 
}: { 
    icon: React.ElementType | React.ReactNode; 
    text?: string; 
    selected: boolean; 
    onClick: () => void;
}) => (
    <ListItemButton
        selected={selected}
        onClick={onClick}
        sx={{
            minHeight: 48,
            mx: 1,
            my: 0.5,
            px: 2,
            borderRadius: 1,
            '&.Mui-selected': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
                '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.18),
                },
            },
            '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            },
            '& .MuiListItemIcon-root': {
                color: selected ? 'primary.main' : 'text.secondary',
                minWidth: 36,
            },
        }}
    >
        <ListItemIcon>
            {React.isValidElement(icon) ? icon : React.createElement(icon as React.ElementType, { fontSize: 'small' })}
        </ListItemIcon>
        {text && (
            <ListItemText 
                primary={text} 
                primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: selected ? 600 : 400,
                }}
            />
        )}
    </ListItemButton>
));

MenuItemComponent.displayName = 'MenuItemComponent';

// 顶部导航栏组件
const TopBar = React.memo(({ 
    open, 
    isMobile, 
    title,
    userInfo,
    onDrawerToggle,
}: {
    open: boolean;
    isMobile: boolean;
    title: string;
    userInfo: User | null;
    onDrawerToggle: () => void;
}) => (
    <AppBar
        position="fixed"
        elevation={0}
        sx={{
            width: { sm: `calc(100% - ${open ? DRAWER_WIDTH : 0}px)` },
            ml: { sm: `${open ? DRAWER_WIDTH : 0}px` },
            transition: (theme) => theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            backdropFilter: 'blur(6px)',
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
            borderBottom: 1,
            borderColor: 'divider',
        }}
    >
        <Toolbar sx={{ minHeight: TOPBAR_HEIGHT }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ 
                        mr: 2, 
                        display: { sm: 'none' },
                        '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        },
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography 
                    variant="h6" 
                    noWrap 
                    component="div"
                    sx={{ 
                        color: 'text.primary',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Stack 
                direction="row" 
                spacing={2} 
                alignItems="center"
                sx={{ 
                    '& > *': {
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                        },
                    },
                }}
            >
                <ThemeLanguageSwitch />
                <UserInfo
                    userInfo={userInfo}
                />
            </Stack>
        </Toolbar>
    </AppBar>
));

TopBar.displayName = 'TopBar';

// 侧边栏组件
interface SideBarProps {
    open: boolean;
    isMobile: boolean;
    menuItems: MenuItem[];
    currentPath: string;
    onDrawerToggle: () => void;
    onNavigate: (path: string) => void;
}

const SideBar = React.memo(({ 
    open,
    isMobile,
    menuItems,
    currentPath,
    onDrawerToggle,
    onNavigate,
}: SideBarProps) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const handleToggle = (itemId: string) => {
        setExpandedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const renderMenuItem = (item: MenuItem) => {
        const hasChildren = Boolean(item.children?.length);
        const isExpanded = expandedItems.includes(item.id || '');
        const isSelected = currentPath === item.path;

        return (
            <React.Fragment key={item.id || item.path}>
                <ListItem disablePadding>
                    <MenuItemComponent
                        icon={item.icon}
                        text={item.text || item.name}
                        selected={isSelected}
                        onClick={() => {
                            if (hasChildren) {
                                handleToggle(item.id || '');
                            } else if (item.path) {
                                onNavigate(item.path);
                            }
                        }}
                    />
                </ListItem>
                {hasChildren && isExpanded && item.children && (
                    <List sx={{ pl: 2 }}>
                        {item.children.map(child => renderMenuItem(child))}
                    </List>
                )}
            </React.Fragment>
        );
    };

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={open}
            onClose={onDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    border: 'none',
                    backgroundColor: (theme) => 
                        theme.palette.mode === 'light' 
                            ? alpha(theme.palette.background.default, 0.98)
                            : alpha(theme.palette.background.default, 0.95),
                    backdropFilter: 'blur(6px)',
                },
            }}
        >
            <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
            }}>
                <Box sx={{ 
                    minHeight: TOPBAR_HEIGHT,
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderColor: 'divider',
                }}>
                    <Typography 
                        variant="h6" 
                        noWrap 
                        component="div" 
                        sx={{ 
                            flexGrow: 1,
                            fontWeight: 700,
                            background: (theme) => 
                                theme.palette.mode === 'light'
                                    ? 'linear-gradient(45deg, #007FFF 30%, #0059B2 90%)'
                                    : 'linear-gradient(45deg, #66B2FF 30%, #0059B2 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Snow AI
                    </Typography>
                    {isMobile && (
                        <IconButton 
                            onClick={onDrawerToggle}
                            sx={{
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    )}
                </Box>

                <List sx={{ 
                    flex: 1, 
                    px: 1.5, 
                    py: 2,
                    '& > *:not(:last-child)': {
                        mb: 0.5,
                    },
                }}>
                    {menuItems.map(item => renderMenuItem(item))}
                </List>
            </Box>
        </Drawer>
    );
});

SideBar.displayName = 'SideBar';

// 主布局组件
export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useThemeMode();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(!isMobile);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    // 菜单项配置
    const menuItems = useMemo(() => [
        { icon: HomeIcon, text: t('menu.home'), path: '/' },
        { icon: QuestionAnswerIcon, text: t('menu.qa'), path: '/qa' },
        { icon: LibraryBooksIcon, text: t('menu.knowledge'), path: '/knowledge' },
        { icon: DescriptionIcon, text: t('menu.documents'), path: '/documents' },
        { icon: CategoryIcon, text: t('menu.category'), path: '/category' },
        { icon: MemoryIcon, text: t('menu.llm'), path: '/llm' },
        { icon: TuneIcon, text: t('menu.embeddingConfig'), path: '/embedding-config' },
        { icon: LocalOfferIcon, text: t('menu.tags'), path: '/tags' },
        {
            id: 'system',
            name: t('menu.system.title'),
            icon: <AdminPanelSettingsIcon />,
            children: [
                {
                    id: 'system-config',
                    name: t('menu.system.config'),
                    path: '/system-config',
                    icon: <SettingsIcon />,
                },
                {
                    id: 'user',
                    name: t('menu.system.user'),
                    path: '/user',
                    icon: <PeopleIcon />,
                },
                {
                    id: 'role',
                    name: t('menu.system.role'),
                    path: '/role',
                    icon: <ManageAccountsIcon />,
                },
                {
                    id: 'permission',
                    name: t('menu.system.permission'),
                    path: '/permission',
                    icon: <SecurityIcon />,
                }
            ],
        }
    ], [t]);

    // 事件处理函数
    const handleDrawerToggle = useCallback(() => setOpen(prev => !prev), []);

    const handleNavigation = useCallback((path: string) => {
        router.push(path);
        if (isMobile) {
            setOpen(false);
        }
    }, [router, isMobile]);

    // 获取用户信息
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (typeof window === 'undefined') return;
            try {
                const response = await authService.getCurrentUser();
                if (response.data?.data) {
                    setUserInfo(response.data.data);
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
            }
        };

        if (user) {
            fetchUserInfo();
        }
        return () => {
            setUserInfo(null);
        };
    }, [user]);

    const pageTitle = menuItems.find(item => item.path === pathname)?.text || 'Snow AI';

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <TopBar
                open={open}
                isMobile={isMobile}
                title={pageTitle}
                userInfo={userInfo}
                onDrawerToggle={handleDrawerToggle}
            />

            <SideBar
                open={open}
                isMobile={isMobile}
                menuItems={menuItems}
                currentPath={pathname}
                onDrawerToggle={handleDrawerToggle}
                onNavigate={handleNavigation}
            />

            <Box
                component="main"
                sx={{
                    position: 'relative',
                    flexGrow: 1,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    width: { sm: `calc(100% - ${open ? DRAWER_WIDTH : 0}px)` },
                    ml: { sm: `${open ? DRAWER_WIDTH : 0}px` },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Box sx={{ 
                    position: 'fixed',
                    top: TOPBAR_HEIGHT,
                    left: { sm: open ? DRAWER_WIDTH : 0 },
                    right: 0,
                    bottom: 0,
                    overflow: 'auto',
                    transition: theme.transitions.create('left', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    bgcolor: 'background.default',
                }}>
                    <PerformanceLayout>
                        {children}
                    </PerformanceLayout>
                </Box>
            </Box>
        </Box>
    );
}