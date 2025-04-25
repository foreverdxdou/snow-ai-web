'use client';

import React, { useState, useCallback, useMemo } from 'react';
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
    ChevronRight as ChevronRightIcon,
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
    ViewSidebar as ViewSidebarIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import { useThemeMode } from '@/app/hooks/useThemeMode';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import BackgroundEffects from '@/app/components/common/BackgroundEffects';
import { UserInfo } from '@/app/components/UserInfo';
import { authService } from '@/app/services/auth';
import type { User } from '@/app/types/userinfo';
import Image from 'next/image';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED_WIDTH = 72;
const TOPBAR_HEIGHT = { xs: 56, sm: 64 };

interface MenuItem {
    id?: string;
    name?: string;
    icon: React.ElementType | React.ReactNode;
    text?: string;
    path?: string;
    children?: MenuItem[];
}

const MenuItemComponent = React.memo(({ 
    icon, 
    text, 
    selected, 
    onClick,
    open
}: { 
    icon: React.ElementType | React.ReactNode; 
    text?: string; 
    selected: boolean; 
    onClick: () => void;
    open: boolean;
}) => (
    <ListItemButton
        selected={selected}
        onClick={onClick}
        sx={{
            minHeight: 48,
            height: 48,
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
                mr: open ? 2 : 0,
            },
            '& .MuiListItemText-root': {
                opacity: open ? 1 : 0,
                transition: (theme) => theme.transitions.create('opacity', {
                    duration: theme.transitions.duration.enteringScreen,
                }),
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

const TopBar = React.memo(({ 
    open, 
    isMobile, 
    userInfo,
}: {
    open: boolean;
    isMobile: boolean;
    userInfo: User | null;
}) => (
    <AppBar
        position="fixed"
        elevation={0}
        sx={{
            width: 'auto',
            right: 0,
            left: 'auto',
            ml: { sm: `${open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH}px` },
            transition: (theme) => theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            backdropFilter: 'blur(6px)',
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8)
        }}
    >
        <Toolbar sx={{ 
            minHeight: TOPBAR_HEIGHT,
            px: 2,
            justifyContent: 'flex-end',
        }}>
            <UserInfo/>
        </Toolbar>
    </AppBar>
));

TopBar.displayName = 'TopBar';

interface SideBarProps {
    open: boolean;
    isMobile: boolean;
    menuItems: MenuItem[];
    currentPath: string;
    onDrawerToggle: () => void;
    onNavigate: (path: string) => void;
    router: any;
}

const SideBar = React.memo(({ 
    open,
    isMobile,
    menuItems,
    currentPath,
    onDrawerToggle,
    onNavigate,
    router,
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
                        open={open}
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
                width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
                    boxSizing: 'border-box',
                    border: 'none',
                    backgroundColor: (theme) => 
                        theme.palette.mode === 'light' 
                            ? alpha(theme.palette.background.default, 0.98)
                            : alpha(theme.palette.background.default, 0.95),
                    backdropFilter: 'blur(6px)',
                    overflowX: 'hidden',
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
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
                    justifyContent: open ? 'space-between' : 'center',
                    borderColor: 'divider',
                    position: 'relative',
                    overflow: 'visible',
                }}>
                    {open ? (
                        <>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                height: '100%',
                                flex: 1,
                                justifyContent: 'left',
                            }}>
                                <Typography 
                                    variant="h6" 
                                    component="div" 
                                    sx={{ 
                                        fontWeight: 1000,
                                        background: (theme) => 
                                            theme.palette.mode === 'light'
                                                ? 'linear-gradient(45deg, #007FFF 30%, #0059B2 90%)'
                                                : 'linear-gradient(45deg, #66B2FF 30%, #0059B2 90%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        opacity: 1,
                                        fontSize: '1.25rem',
                                        width: 'auto',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'visible',
                                        textOverflow: 'clip',
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.8,
                                        },
                                    }}
                                    onClick={() => router.push('/')}
                                >
                                    <Image
                                        src="/snow.svg"
                                        alt="Snow AI Logo"
                                        width={24}
                                        height={24}
                                        style={{
                                            filter: "brightness(0) saturate(100%) invert(40%) sepia(52%) saturate(2476%) hue-rotate(199deg) brightness(100%) contrast(101%)"
                                        }}
                                    />
                                    Snow AI
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                height: '100%',
                            }}>
                                <IconButton
                                    color="inherit"
                                    onClick={onDrawerToggle}
                                    sx={{ 
                                        width: 36,
                                        height: 36,
                                        '&:hover': {
                                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                        },
                                    }}
                                >
                                    <ViewSidebarIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={onDrawerToggle}
                            sx={{ 
                                width: 36,
                                height: 36,
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <ViewSidebarIcon sx={{ fontSize: 20, transform: 'rotate(180deg)' }} />
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
                    '& .MuiListItemButton-root': {
                        px: open ? 2 : 1.5,
                        py: 1,
                        minHeight: 48,
                        height: 48,
                        justifyContent: open ? 'flex-start' : 'center',
                        '& .MuiListItemIcon-root': {
                            minWidth: open ? 36 : 'auto',
                            mr: open ? 2 : 0,
                            justifyContent: 'center',
                        },
                        '& .MuiListItemText-root': {
                            opacity: open ? 1 : 0,
                            transition: (theme) => theme.transitions.create('opacity', {
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        },
                    },
                }}>
                    {menuItems.map(item => renderMenuItem(item))}
                </List>
            </Box>
        </Drawer>
    );
});

SideBar.displayName = 'SideBar';

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
    const { user } = useAuth();
    const [open, setOpen] = useState(!isMobile);
    const [userInfo, setUserInfo] = useState<User | null>(null);

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

    const handleDrawerToggle = useCallback(() => setOpen(prev => !prev), []);

    const handleNavigation = useCallback((path: string) => {
        router.push(path);
        if (isMobile) {
            setOpen(false);
        }
    }, [router, isMobile]);

    const pageTitle = menuItems.find(item => item.path === pathname)?.text || 'Snow AI';

    return (
        <Box sx={{ 
            position: 'relative',
            display: 'flex', 
            minHeight: '100vh',
            overflow: 'hidden',
            bgcolor: 'background.default',
        }}>
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
            }}>
                <BackgroundEffects />
            </Box>
            <Box sx={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                zIndex: 1,
            }}>
                <TopBar
                    open={open}
                    isMobile={isMobile}
                    userInfo={userInfo}
                />

                <SideBar
                    open={open}
                    isMobile={isMobile}
                    menuItems={menuItems}
                    currentPath={pathname}
                    onDrawerToggle={handleDrawerToggle}
                    onNavigate={handleNavigation}
                    router={router}
                />

                <Box
                    component="main"
                    sx={{
                        position: 'relative',
                        flexGrow: 1,
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        width: { sm: `calc(100% - ${open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH}px)` },
                        ml: { sm: `${open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH}px` },
                        transition: theme.transitions.create(['margin', 'width'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    }}
                >
                    <Box sx={{ 
                        position: 'fixed',
                        top: TOPBAR_HEIGHT,
                        left: { sm: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH },
                        right: 0,
                        bottom: 0,
                        overflow: 'auto',
                        transition: theme.transitions.create('left', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        bgcolor: 'background.default',
                        opacity: 0.95,
                    }}>
                        <PerformanceLayout>
                            {children}
                        </PerformanceLayout>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}