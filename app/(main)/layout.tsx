'use client';

import { useState, memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

// 动态导入 UserInfo 组件
const UserInfo = dynamic(() => import('../components/UserInfo'), {
  ssr: false,
  loading: () => null
});

// 使用 memo 包装菜单组件
const SideMenu = memo(({ pathname, items, onSelect }: { pathname: string; items: any[]; onSelect: (key: string) => void }) => (
  <List sx={{ px: 1 }}>
    {items.map((item) => (
      <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          selected={pathname === item.key}
          onClick={() => onSelect(item.key)}
          sx={{
            borderRadius: 2,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: alpha('#6C8EF2', 0.08),
              transform: 'translateX(4px)',
            },
            '&.Mui-selected': {
              backgroundColor: alpha('#6C8EF2', 0.12),
              '&:hover': {
                backgroundColor: alpha('#6C8EF2', 0.16),
              },
              '& .MuiListItemIcon-root': {
                color: '#6C8EF2',
                transform: 'scale(1.1)',
              },
              '& .MuiListItemText-primary': {
                color: '#6C8EF2',
                fontWeight: 600,
              },
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: 48,
            transition: 'all 0.2s ease-in-out',
            color: 'text.secondary',
          }}>
            {item.icon}
          </ListItemIcon>
          <Typography
            sx={{
              fontSize: '0.95rem',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {item.label}
          </Typography>
        </ListItemButton>
      </ListItem>
    ))}
  </List>
));

SideMenu.displayName = 'SideMenu';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    {
      key: '/',
      icon: <HomeIcon />,
      label: '首页',
    },
    {
      key: '/knowledge',
      icon: <MenuBookIcon />,
      label: '知识库',
    },
    {
      key: '/documents',
      icon: <DescriptionIcon />,
      label: '文档管理',
    },
    {
      key: '/llm',
      icon: <SmartToyIcon />,
      label: '大模型配置',
    },
    {
      key: '/users',
      icon: <PeopleIcon />,
      label: '用户管理',
    },
  ];

  const handleMenuSelect = (key: string) => {
    router.push(key);
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
          position: 'fixed',
          height: '100vh',
          zIndex: 1200
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
            disableScrollLock: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: theme.transitions.create(['width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha('#000', 0.1),
                borderRadius: '3px',
              },
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha('#6C8EF2', 0.04),
            height: 64
          }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #6C8EF2 30%, #76E3C4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}
            >
              Snow AI
            </Typography>
            <IconButton 
              onClick={handleDrawerToggle}
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'rotate(180deg)',
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 1 }}>
            <SideMenu 
              pathname={pathname} 
              items={menuItems} 
              onSelect={handleMenuSelect}
            />
          </Box>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          minHeight: '100vh',
          bgcolor: alpha('#f5f5f5', 0.5),
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          right: 0,
          left: { sm: `${drawerWidth}px` },
          zIndex: 1100,
          backdropFilter: 'blur(8px)',
          bgcolor: alpha('#fff', 0.8),
          height: 64,
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {menuItems.find(item => item.key === pathname)?.label || '首页'}
            </Typography>
          </Box>
          <UserInfo />
        </Box>
          <Box sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            height: '100%',
            boxShadow: 0,
              transition: theme.transitions.create(['left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
            '&:hover': {
              boxShadow: 3,
            },
        
          }}>
            {children}
          </Box>
      </Box>
    </Box>
  );
}