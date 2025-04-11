import { createTheme, alpha, Theme, ThemeOptions } from '@mui/material/styles';
import { zhCN, enUS } from '@mui/material/locale';

// 主题颜色常量
const themeColors = {
  light: {
    primary: '#007FFF',
    primaryLight: '#66B2FF',
    primaryDark: '#0059B2',
    secondary: '#9c27b0',
    secondaryLight: '#ba68c8',
    secondaryDark: '#7b1fa2',
    background: '#fff',
    paperBackground: '#fff',
    textPrimary: '#1A2027',
    textSecondary: '#3E5060',
    divider: 'rgba(194, 224, 255, 0.08)',
    antdPrimary: '#1890FF',
    error: '#ef4444',
    errorHover: '#dc2626',
    success: '#3b82f6',
    successHover: '#2563eb',
    warning: '#ff9800',
    warningLight: '#ffb74d',
    warningDark: '#f57c00',
    info: '#0288d1',
    infoLight: '#03a9f4',
    infoDark: '#01579b',
    action: {
      hover: 'rgba(0, 127, 255, 0.08)',
      selected: 'rgba(0, 127, 255, 0.12)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
    backdrop: {
      background: 'rgba(255, 255, 255, 0.9)',
      blur: 'blur(6px)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.12)',
      main: 'rgba(0, 0, 0, 0.23)',
      dark: 'rgba(0, 0, 0, 0.87)',
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.05)',
      main: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(0, 0, 0, 0.2)',
    }
  },
  dark: {
    primary: '#66B2FF',
    primaryLight: '#99CCF3',
    primaryDark: '#0059B2',
    secondary: '#ce93d8',
    secondaryLight: '#f3e5f5',
    secondaryDark: '#ab47bc',
    background: '#0A1929',
    paperBackground: '#0A1929',
    textPrimary: '#fff',
    textSecondary: '#B2BAC2',
    divider: 'rgba(194, 224, 255, 0.12)',
    antdPrimary: '#1890FF',
    error: '#ef4444',
    errorHover: '#dc2626',
    success: '#3b82f6',
    successHover: '#2563eb',
    warning: '#ffa726',
    warningLight: '#ffb74d',
    warningDark: '#f57c00',
    info: '#29b6f6',
    infoLight: '#4fc3f7',
    infoDark: '#0288d1',
    action: {
      hover: 'rgba(102, 178, 255, 0.12)',
      selected: 'rgba(102, 178, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
    backdrop: {
      background: 'rgba(10, 25, 41, 0.95)',
      blur: 'blur(6px)',
    },
    border: {
      light: 'rgba(255, 255, 255, 0.12)',
      main: 'rgba(255, 255, 255, 0.23)',
      dark: 'rgba(255, 255, 255, 0.87)',
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.2)',
      main: 'rgba(0, 0, 0, 0.3)',
      dark: 'rgba(0, 0, 0, 0.4)',
    }
  }
};

// 亮色主题调色板
const lightPalette = {
  primary: {
    main: themeColors.light.primary,
    light: themeColors.light.primaryLight,
    dark: themeColors.light.primaryDark,
    contrastText: '#fff',
  },
  secondary: {
    main: themeColors.light.secondary,
    light: themeColors.light.secondaryLight,
    dark: themeColors.light.secondaryDark,
    contrastText: '#fff',
  },
  background: {
    default: themeColors.light.background,
    paper: themeColors.light.paperBackground,
  },
  text: {
    primary: themeColors.light.textPrimary,
    secondary: themeColors.light.textSecondary,
  },
  divider: themeColors.light.divider,
  error: {
    main: themeColors.light.error,
    dark: themeColors.light.errorHover,
    light: alpha(themeColors.light.error, 0.5),
    contrastText: '#fff',
  },
  success: {
    main: themeColors.light.success,
    dark: themeColors.light.successHover,
    light: alpha(themeColors.light.success, 0.5),
    contrastText: '#fff',
  },
  warning: {
    main: themeColors.light.warning,
    light: themeColors.light.warningLight,
    dark: themeColors.light.warningDark,
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    main: themeColors.light.info,
    light: themeColors.light.infoLight,
    dark: themeColors.light.infoDark,
    contrastText: '#fff',
  },
  action: {
    hover: themeColors.light.action.hover,
    selected: themeColors.light.action.selected,
    disabled: themeColors.light.action.disabled,
    disabledBackground: themeColors.light.action.disabledBackground,
  },
};

// 暗色主题调色板
const darkPalette = {
  primary: {
    main: themeColors.dark.primary,
    light: themeColors.dark.primaryLight,
    dark: themeColors.dark.primaryDark,
    contrastText: '#fff',
  },
  secondary: {
    main: themeColors.dark.secondary,
    light: themeColors.dark.secondaryLight,
    dark: themeColors.dark.secondaryDark,
    contrastText: '#fff',
  },
  background: {
    default: themeColors.dark.background,
    paper: themeColors.dark.paperBackground,
  },
  text: {
    primary: themeColors.dark.textPrimary,
    secondary: themeColors.dark.textSecondary,
  },
  divider: themeColors.dark.divider,
  error: {
    main: themeColors.dark.error,
    dark: themeColors.dark.errorHover,
    light: alpha(themeColors.dark.error, 0.5),
    contrastText: '#fff',
  },
  success: {
    main: themeColors.dark.success,
    dark: themeColors.dark.successHover,
    light: alpha(themeColors.dark.success, 0.5),
    contrastText: '#fff',
  },
  warning: {
    main: themeColors.dark.warning,
    light: themeColors.dark.warningLight,
    dark: themeColors.dark.warningDark,
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    main: themeColors.dark.info,
    light: themeColors.dark.infoLight,
    dark: themeColors.dark.infoDark,
    contrastText: '#fff',
  },
  action: {
    hover: themeColors.dark.action.hover,
    selected: themeColors.dark.action.selected,
    disabled: themeColors.dark.action.disabled,
    disabledBackground: themeColors.dark.action.disabledBackground,
  },
};

// 共享组件样式
const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '3px',
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '10px',
        fontWeight: 600,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: '10px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        border: '1px solid',
        borderColor: 'divider',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        border: 'none',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid',
        borderColor: 'divider',
      },
      head: {
        fontWeight: 600,
        whiteSpace: 'nowrap',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:last-child td': {
          borderBottom: 0,
        },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        margin: '4px 8px',
        '&.Mui-selected': {
          backgroundColor: ({ theme }: { theme: Theme }) => alpha(theme.palette.primary.main, 0.1),
          '&:hover': {
            backgroundColor: ({ theme }: { theme: Theme }) => alpha(theme.palette.primary.main, 0.15),
          },
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 40,
      },
    },
  },
};


// 创建主题配置
export const getTheme = (mode: 'light' | 'dark', locale: 'zh' | 'en') => {
  // 主色调
  const mainBlue = '#2A5CAA';
  const darkGray = '#2D2D2D';
  
  // 辅助色 - 数据可视化色谱
  const dataVizColors = [
    '#6366F1', // 紫蓝色
    '#10B981', // 绿色
    '#F59E0B', // 琥珀色
    '#EC4899', // 粉色
    '#8B5CF6', // 紫色
    '#3B82F6'  // 蓝色
  ];
  
  // 状态色
  const successColor = '#10B981'; // 翡翠绿
  const warningColor = '#F59E0B'; // 琥珀色
  const errorColor = '#EF4444';   // 珊瑚红
  
  // 渐变色
  const gradientPrimary = 'linear-gradient(90deg, #2A5CAA 0%, #8B5CF6 100%)';
  
  // 根据模式调整颜色
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mainBlue,
        dark: '#1E4785',
        light: '#4878C6',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#8B5CF6',
        dark: '#7039F2',
        light: '#A78BFA',
        contrastText: '#FFFFFF',
      },
      error: {
        main: errorColor,
        dark: '#DC2626',
        light: '#F87171',
      },
      warning: {
        main: warningColor,
        dark: '#D97706',
        light: '#FBBF24',
      },
      success: {
        main: successColor,
        dark: '#059669',
        light: '#34D399',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#F8F9FA',
        paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#F3F4F6' : darkGray,
        secondary: mode === 'dark' ? '#9CA3AF' : '#6B7280',
        disabled: mode === 'dark' ? '#4B5563' : '#9CA3AF',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',

    },
    typography: {
      fontFamily: '"Inter", "HarmonyOS Sans", "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
      h1: {
        fontSize: '2rem', // 32px
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h2: {
        fontSize: '1.5rem', // 24px
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.005em',
      },
      h3: {
        fontSize: '1.25rem', // 20px
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.125rem', // 18px
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1rem', // 16px
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '0.875rem', // 14px
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem', // 16px
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem', // 14px
        lineHeight: 1.5,
      },
      caption: {
        fontSize: '0.75rem', // 12px
        lineHeight: 1.5,
      },

    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8, // 基础间距单位为8px
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: mode === 'dark' ? '#4B5563 transparent' : '#9CA3AF transparent',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'dark' ? '#4B5563' : '#9CA3AF',
              borderRadius: '4px',
            },
          },
          // 确保代码块使用 JetBrains Mono 字体
          'code, pre': {
            fontFamily: '"JetBrains Mono", monospace',
          },
          // 自定义渐变文本的通用样式
          '.gradient-text': {
            background: gradientPrimary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            padding: '6px 16px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
          containedPrimary: {
            background: mainBlue,
            '&:hover': {
              backgroundColor: '#1E4785',
            },
          },
          containedSecondary: {
            background: '#8B5CF6',
            '&:hover': {
              backgroundColor: '#7039F2',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            background: mode === 'dark' ? '#1A1A1A' : mainBlue,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'dark' 
              ? '0px 4px 8px rgba(0, 0, 0, 0.4)' 
              : '0px 4px 8px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            fontWeight: 500,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              backgroundColor: mode === 'dark' ? '#2A2A2A' : '#F3F4F6',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: '3px',
            borderRadius: '3px 3px 0 0',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            '&.Mui-selected': {
              fontWeight: 600,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '1.25rem',
            fontWeight: 600,
          },
        },
      },
    },
  });
};