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

export const getTheme = (mode: 'light' | 'dark', locale: 'zh' | 'en') => {
  return createTheme(
    {
      palette: {
        mode,
        ...(mode === 'light' ? lightPalette : darkPalette),
      },
      shape: {
        borderRadius: 10,
      },
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        h1: {
          fontSize: '3.5rem',
          fontWeight: 700,
          lineHeight: 1.2,
        },
        h2: {
          fontSize: '2.5rem',
          fontWeight: 700,
          lineHeight: 1.2,
        },
        h3: {
          fontSize: '2rem',
          fontWeight: 600,
          lineHeight: 1.2,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 600,
          lineHeight: 1.2,
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 600,
          lineHeight: 1.2,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: 1.2,
        },
        subtitle1: {
          fontSize: '1rem',
          fontWeight: 500,
          lineHeight: 1.5,
        },
        subtitle2: {
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: 1.5,
        },
        body1: {
          fontSize: '1rem',
          lineHeight: 1.5,
        },
        body2: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
        },
        button: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
      components,
      zIndex: {
        appBar: 1200,
        drawer: 1100,
      },
    },
    locale === 'zh' ? zhCN : enUS,
  );
}; 