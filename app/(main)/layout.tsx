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
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  SmartToy as SmartToyIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';

const drawerWidth = 256; // 调整为标准宽度
const collapsedDrawerWidth = 68; // 稍微增加折叠时的宽度

// 动态导入 UserInfo 组件
const UserInfo = dynamic(() => import('../components/UserInfo'), {
  ssr: false,
  loading: () => null
});

// 优化菜单项组件
const MenuItem = memo(({ 
  item, 
  selected, 
  open, 
  onSelect 
}: { 
  item: any; 
  selected: boolean; 
  open: boolean; 
  onSelect: (key: string) => void;
}) => (
  <ListItem disablePadding sx={{ mb: 0.5 }}>
    <Tooltip title={!open ? item.label : ''} placement="right">
      <ListItemButton
        selected={selected}
        onClick={() => onSelect(item.key)}
        sx={{
          borderRadius: 1,
          mx: 1,
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          '&.Mui-selected': {
            bgcolor: alpha('#1976d2', 0.08),
            '&:hover': {
              bgcolor: alpha('#1976d2', 0.12),
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.main',
            },
            '& .MuiTypography-root': {
              color: 'primary.main',
              fontWeight: 600,
            },
          },
        }}
      >
        <ListItemIcon 
          sx={{ 
            minWidth: 0,
            mr: open ? 2 : 'auto',
            justifyContent: 'center',
            color: selected ? 'primary.main' : 'text.secondary',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {open && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: selected ? 600 : 400,
              color: selected ? 'primary.main' : 'text.primary',
              opacity: 1,
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </Typography>
        )}
      </ListItemButton>
    </Tooltip>
  </ListItem>
));

MenuItem.displayName = 'MenuItem';

// 优化菜单组件
const SideMenu = memo(({ 
  pathname, 
  items, 
  open, 
  onSelect 
}: { 
  pathname: string; 
  items: any[]; 
  open: boolean;
  onSelect: (key: string) => void;
}) => (
  <List sx={{ py: 1 }}>
    {items.map((item) => (
      <MenuItem
        key={item.key}
        item={item}
        selected={pathname === item.key}
        open={open}
        onSelect={onSelect}
      />
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
      key: '/category',
      icon: <FolderIcon />,
      label: '分类管理',
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="nav"
        sx={{ 
          width: open ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={true}
          sx={{
            width: open ? drawerWidth : collapsedDrawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : collapsedDrawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                width: 6,
                height: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.text.primary, 0.1),
              },
            },
          }}
        >
          {/* Logo区域 */}
          <Box sx={{ 
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: open ? 1 : 0,
                width: open ? 'auto' : 0,
                overflow: 'hidden',
                transition: theme.transitions.create(['opacity', 'width']),
              }}
            >
              Snow AI
            </Typography>
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{
                p: 1,
                transition: theme.transitions.create(['transform', 'margin']),
                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                marginRight: open ? 0 : '6px',
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>

          {/* 菜单区域 */}
          <SideMenu 
            pathname={pathname}
            items={menuItems}
            open={open}
            onSelect={handleMenuSelect}
          />
        </Drawer>
      </Box>

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* 顶部导航栏 */}
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: theme.zIndex.appBar,
            backdropFilter: 'blur(8px)',
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={() => setOpen(!open)}
                size="small"
                sx={{ display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
              }}
            >
              {menuItems.find(item => item.key === pathname)?.label || '首页'}
            </Typography>
          </Box>
          <UserInfo />
        </Box>

        {/* 页面内容区域 */}
        <Box
          component="div"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            borderRadius: 0,
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 6,
              height: 6,
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}