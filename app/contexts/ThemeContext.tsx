import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme } from '../theme';
import { useTranslation } from 'react-i18next';

type ThemeContextType = {
    mode: 'light' | 'dark';
    toggleTheme: () => void;
    language: 'zh' | 'en';
    toggleLanguage: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    toggleTheme: () => { },
    language: 'zh',
    toggleLanguage: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { i18n } = useTranslation();
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'zh' | 'en'>('zh');

    useEffect(() => {
        // 从localStorage获取主题设置
        const savedMode = localStorage.getItem('theme') as 'light' | 'dark';
        const savedLanguage = localStorage.getItem('language') as 'zh' | 'en';

        // 如果没有保存的主题设置，则使用系统主题
        if (!savedMode && window.matchMedia) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setMode(prefersDark ? 'dark' : 'light');
        } else {
            setMode(savedMode || 'light');
        }

        // 设置语言
        if (savedLanguage) {
            setLanguage(savedLanguage);
            i18n.changeLanguage(savedLanguage);
        }

        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [i18n]);

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('theme', newMode);
    };

    const toggleLanguage = () => {
        const newLanguage = language === 'zh' ? 'en' : 'zh';
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        i18n.changeLanguage(newLanguage);
    };

    const theme = getTheme(mode, language);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, language, toggleLanguage }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}; 