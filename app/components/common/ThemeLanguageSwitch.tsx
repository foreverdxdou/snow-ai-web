import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode, TranslateRounded } from '@mui/icons-material';
import { useThemeContext } from '@/app/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export const ThemeLanguageSwitch: React.FC = () => {
    const { mode, toggleTheme, language, toggleLanguage } = useThemeContext();
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-2">
            <Tooltip title={mode === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}>
                <IconButton
                    onClick={toggleTheme}
                    color="inherit"
                    sx={{
                        color: (theme) => mode === 'dark' ? 'primary.light' : 'primary.main',
                    }}
                >
                    {mode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>
            </Tooltip>
            <Tooltip title={language === 'zh' ? 'Switch to English' : '切换到中文'}>
                <IconButton
                    onClick={toggleLanguage}
                    color="inherit"
                    sx={{
                        color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
                    }}
                >
                    <TranslateRounded />
                </IconButton>
            </Tooltip>
        </div>
    );
}; 