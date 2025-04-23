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
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
            borderBottom: 1,
            borderColor: 'divider',
        }}
    >
        <Toolbar sx={{ 
            minHeight: TOPBAR_HEIGHT,
            px: 2,
            justifyContent: 'flex-end',
        }}>
            <UserInfo
                userInfo={userInfo}
            />
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
                                justifyContent: 'center',
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
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        overflow: 'visible',
                                        textOverflow: 'clip',
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img src="data:image/png;base64,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"  style={{ width: '24px', height: '24px' }} />
                                     Snow AI
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                height: '100%',
                                position: 'absolute',
                                right: 0,
                            }}>
                                <IconButton
                                    color="inherit"
                                    onClick={onDrawerToggle}
                                    sx={{ 
                                        '&:hover': {
                                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                        },
                                    }}
                                >
                                    <ViewSidebarIcon />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={onDrawerToggle}
                            sx={{ 
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <ViewSidebarIcon sx={{ transform: 'rotate(180deg)' }} />
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