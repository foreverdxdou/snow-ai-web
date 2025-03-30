'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { getCookie, setCookie } from 'cookies-next';
import { zhCN } from '@mui/material/locale';
import { enUS } from '@mui/material/locale';

interface ThemeContextType {
    themeMode: 'light' | 'dark';
    language: 'zh' | 'en';
    toggleTheme: () => void;
    toggleLanguage: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    themeMode: 'light',
    language: 'zh',
    toggleTheme: () => {},
    toggleLanguage: () => {},
});

// 获取初始主题
const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    
    // 优先从 localStorage 获取
    const savedTheme = localStorage.getItem('themeMode') as 'light' | 'dark';
    if (savedTheme) return savedTheme;
    
    // 其次从 cookie 获取
    const cookieTheme = getCookie('themeMode') as 'light' | 'dark';
    if (cookieTheme) return cookieTheme;
    
    // 最后检查系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
};

// 获取初始语言
const getInitialLanguage = () => {
    if (typeof window === 'undefined') return 'zh';
    
    // 优先从 localStorage 获取
    const savedLang = localStorage.getItem('language') as 'zh' | 'en';
    if (savedLang) return savedLang;
    
    // 其次从 cookie 获取
    const cookieLang = getCookie('language') as 'zh' | 'en';
    if (cookieLang) return cookieLang;
    
    return 'zh';
};

// 创建主题
const createAppTheme = (mode: 'light' | 'dark', lang: 'zh' | 'en') => {
    return createTheme({
        palette: {
            mode,
            primary: {
                main: '#007FFF',
            },
            background: {
                default: mode === 'light' ? '#fff' : '#0A1929',
                paper: mode === 'light' ? '#fff' : '#0A1929',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: mode === 'light' ? '#fff' : '#0A1929',
                        color: mode === 'light' ? '#1A2027' : '#fff',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    },
                },
            },
        },
    }, lang === 'zh' ? zhCN : enUS);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(getInitialTheme);
    const [language, setLanguage] = useState<'zh' | 'en'>(getInitialLanguage);
    const [mounted, setMounted] = useState(false);

    // 同步主题到 document
    const syncThemeToDocument = useCallback((mode: 'light' | 'dark') => {
        if (typeof window === 'undefined') return;
        
        // 设置 document 主题
        document.documentElement.setAttribute('data-theme', mode);
        document.body.style.backgroundColor = mode === 'light' ? '#fff' : '#0A1929';
        
        // 保存到 localStorage 和 cookie
        localStorage.setItem('themeMode', mode);
        setCookie('themeMode', mode, { maxAge: 365 * 24 * 60 * 60 });
    }, []);

    // 初始化主题
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        syncThemeToDocument(themeMode);
        setMounted(true);
    }, [themeMode, syncThemeToDocument]);

    // 同步语言设置
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // 保存到 localStorage 和 cookie
        localStorage.setItem('language', language);
        setCookie('language', language, { maxAge: 365 * 24 * 60 * 60 });
    }, [language]);

    const theme = createAppTheme(themeMode, language);

    const toggleTheme = useCallback(() => {
        setThemeMode(prev => {
            const newMode = prev === 'light' ? 'dark' : 'light';
            syncThemeToDocument(newMode);
            return newMode;
        });
    }, [syncThemeToDocument]);

    const toggleLanguage = useCallback(() => {
        setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
    }, []);

    // 在组件挂载前不渲染内容
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ themeMode, language, toggleTheme, toggleLanguage }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext); 