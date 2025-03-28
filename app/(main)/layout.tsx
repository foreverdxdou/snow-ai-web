'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Typography,
    useTheme,
    useMediaQuery,
    alpha,
    AppBar,
    CssBaseline,
    Toolbar,
    Container,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    MenuBook as MenuBookIcon,
    Description as DescriptionIcon,
    People as PeopleIcon,
    SmartToy as SmartToyIcon,
    Folder as FolderIcon,
    LocalOffer as LocalOfferIcon,
    ChevronLeft as ChevronLeftIcon,
    QuestionAnswer as QuestionAnswerIcon,
    SettingsOutlined,
    SettingsApplicationsOutlined,
} from '@mui/icons-material';
import { ThemeLanguageSwitch } from '@/app/components/common/ThemeLanguageSwitch';
import { useTranslation } from 'react-i18next';
import UserInfo from '@/app/components/UserInfo';

const drawerWidth = 256;
const collapsedDrawerWidth = 68;

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const menuItems = [
        {
            key: '/',
            icon: <HomeIcon />,
            label: t('menu.home'),
        },
        {
            key: '/qa',
            icon: <QuestionAnswerIcon />,
            label: t('menu.qa'),
        },
        {
            key: '/knowledge',
            icon: <MenuBookIcon />,
            label: t('menu.knowledge'),
        },
        {
            key: '/category',
            icon: <FolderIcon />,
            label: t('menu.category'),
        },
        {
            key: '/documents',
            icon: <DescriptionIcon />,
            label: t('menu.documents'),
        },
        {
            key: '/llm',
            icon: <SmartToyIcon />,
            label: t('menu.llm'),
        },
        {
            key: '/users',
            icon: <PeopleIcon />,
            label: t('menu.users'),
        },
        {
            key: '/tags',
            icon: <LocalOfferIcon />,
            label: t('menu.tags'),
        },
        {
            key: '/system-config',
            icon: <SettingsOutlined />,
            label: t('menu.systemConfig'),
            children: [
                {
                    key: '/system-config',
                    icon: <SettingsApplicationsOutlined />,
                    label: t('systemConfig.title'),
                },
            ]
        },
    ];

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Container maxWidth={false} disableGutters>
                    <Toolbar sx={{ pr: 2, pl: 2 }}>
                        <Box
                            sx={{
                                width: open ? drawerWidth : collapsedDrawerWidth,
                                display: 'flex',
                                alignItems: 'center',
                                transition: theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                minWidth: 0,
                                flex: 1,
                            }}>
                                {isMobile && (
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        edge="start"
                                        onClick={() => setOpen(!open)}
                                        sx={{ mr: 1 }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                )}
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        width: open ? 'auto' : 0,
                                        transition: theme.transitions.create(['opacity', 'width']),
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        color: 'primary.main',
                                        fontWeight: 700,
                                    }}
                                >
                                    Snow AI
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                            <Box sx={{
                                bgcolor: (theme) => theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.08) : 'background.paper',
                                borderRadius: 2,
                                p: 0.5,
                                border: '1px solid',
                                borderColor: (theme) => theme.palette.mode === 'light' ? 'transparent' : 'divider'
                            }}>
                                <ThemeLanguageSwitch />
                            </Box>
                            <UserInfo />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={open}
                sx={{
                    width: open ? drawerWidth : collapsedDrawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : collapsedDrawerWidth,
                        boxSizing: 'border-box',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        overflowX: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', flex: 1 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.key} disablePadding>
                                <ListItemButton
                                    selected={pathname === item.key}
                                    onClick={() => router.push(item.key)}
                                    sx={{
                                        minHeight: 48,
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: pathname === item.key ? 'primary.main' : 'text.secondary',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {open && (
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontWeight: pathname === item.key ? 600 : 400,
                                                    color: pathname === item.key ? 'primary.main' : 'text.primary',
                                                },
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                {!isMobile && (
                    <Box sx={{
                        p: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: open ? 'flex-end' : 'center',
                        bgcolor: 'background.paper',
                    }}>
                        <IconButton
                            onClick={() => setOpen(!open)}
                            sx={{
                                transition: theme.transitions.create(['transform', 'background-color', 'box-shadow'], {
                                    duration: theme.transitions.duration.shortest,
                                }),
                                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                                color: 'text.secondary',
                                borderRadius: '10px',
                                width: 40,
                                height: 40,
                                '&:hover': {
                                    color: 'primary.main',
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </Box>
                )}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar />
                <Container
                    maxWidth={false}
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        py: 3,
                    }}
                >
                    {children}
                </Container>
            </Box>
        </Box>
    );
}