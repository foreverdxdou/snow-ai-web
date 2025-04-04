import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode, TranslateRounded } from '@mui/icons-material';
import { useThemeContext } from '@/app/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import i18n from '@/app/i18n';

export const ThemeLanguageSwitch: React.FC = () => {
    const { themeMode, toggleTheme, language, toggleLanguage } = useThemeContext();
    const { t } = useTranslation();

    const handleLanguageChange = () => {
        const newLang = language === 'zh' ? 'en' : 'zh';
        i18n.changeLanguage(newLang);
        toggleLanguage();
    };

    return (
        <div className="flex items-center gap-2">
            <Tooltip title={themeMode === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}>
                <IconButton
                    onClick={toggleTheme}
                    color="inherit"
                    sx={{
                        color: (theme) => themeMode === 'dark' 
                            ? theme.palette.text.primary
                            : theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: (theme) => themeMode === 'dark'
                                ? theme.palette.action.hover
                                : theme.palette.primary.light,
                        },
                    }}
                >
                    {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>
            </Tooltip>
            <Tooltip title={language === 'zh' ? 'Switch to English' : '切换到中文'}>
                <IconButton
                    onClick={handleLanguageChange}
                    color="inherit"
                    sx={{
                        color: (theme) => themeMode === 'dark'
                            ? theme.palette.text.primary
                            : theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: (theme) => themeMode === 'dark'
                                ? theme.palette.action.hover
                                : theme.palette.primary.light,
                        },
                    }}
                >
                    <TranslateRounded />
                </IconButton>
            </Tooltip>
        </div>
    );
}; 