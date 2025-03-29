import React, { createContext, useContext, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme } from '../theme';
import { useTranslation } from 'react-i18next';

interface ThemeContextType {
    mode: 'light' | 'dark';
    language: 'zh' | 'en';
    toggleTheme: () => void;
    toggleLanguage: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { i18n } = useTranslation();
    const [mode, setMode] = useState<'light' | 'dark'>(() => 
        (Cookies.get('theme') as 'light' | 'dark') || 'light'
    );
    const [language, setLanguage] = useState<'zh' | 'en'>(() => 
        (Cookies.get('language') as 'zh' | 'en') || 'zh'
    );

    const toggleTheme = useCallback(() => {
        setMode(prev => {
            const newMode = prev === 'light' ? 'dark' : 'light';
            Cookies.set('theme', newMode);
            return newMode;
        });
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage(prev => {
            const newLang = prev === 'zh' ? 'en' : 'zh';
            Cookies.set('language', newLang);
            return newLang;
        });
    }, []);

    const theme = getTheme(mode, language);

    return (
        <ThemeContext.Provider value={{ mode, language, toggleTheme, toggleLanguage }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}; 