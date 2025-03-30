import { useCallback } from 'react';
import { useTheme } from '@mui/material';
import { useThemeContext } from '@/app/contexts/ThemeContext';

export const useThemeMode = () => {
    const theme = useTheme();
    const { toggleTheme } = useThemeContext();

    const toggleThemeMode = useCallback(() => {
        toggleTheme();
    }, [toggleTheme]);

    return { theme, toggleThemeMode };
}; 