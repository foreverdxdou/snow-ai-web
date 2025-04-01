import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { authService } from '@/app/services/auth';
import type { User } from '@/app/types/userinfo';
import type { Result } from '@/app/types/result';

interface LoginResponse {
    token: string;
}

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('token'));
    const [user, setUser] = useState<User | null>(() => {
        const userStr = Cookies.get('user');
        return userStr ? JSON.parse(userStr) : null;
    });

    const login = useCallback(async (username: string, password: string) => {
        const response = await authService.login(username, password);
        const { data } = response.data as Result<LoginResponse>;
        if (data.token) {
            Cookies.set('token', data.token);
            // 获取用户信息
            const userResponse = await authService.getCurrentUser();
            const { data: userData } = userResponse.data as Result<User>;
            Cookies.set('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
        } else {
            throw new Error('登录失败：未获取到token');
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout().then(() => {
            Cookies.remove('token');
            Cookies.remove('user');
            setUser(null);
            setIsAuthenticated(false);
        });
    }, []);

    return { isAuthenticated, user, login, logout };
}; 