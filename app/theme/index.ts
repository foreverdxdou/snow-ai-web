import { createTheme, alpha, Theme, ThemeOptions } from '@mui/material/styles';
import { zhCN, enUS } from '@mui/material/locale';

// 亮色主题调色板
const lightPalette = {
  primary: {
    main: '#007FFF',
    light: '#66B2FF',
    dark: '#0059B2',
    contrastText: '#fff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#fff',
  },
  background: {
    default: '#fff',
    paper: '#fff',
  },
  text: {
    primary: '#1A2027',
    secondary: '#3E5060',
  },
  divider: 'rgba(194, 224, 255, 0.08)',
};

// 暗色主题调色板
const darkPalette = {
  primary: {
    main: '#66B2FF',
    light: '#99CCF3',
    dark: '#0059B2',
    contrastText: '#fff',
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
    contrastText: '#fff',
  },
  background: {
    default: '#001E3C',
    paper: '#0A1929',
  },
  text: {
    primary: '#fff',
    secondary: '#B2BAC2',
  },
  divider: 'rgba(194, 224, 255, 0.12)',
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