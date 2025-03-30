import { useState, useCallback } from 'react';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

export function useSnackbar() {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info'
    });

    const showSnackbar = useCallback((message: string, severity: SnackbarState['severity'] = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    return { snackbar, setSnackbar, showSnackbar };
} 