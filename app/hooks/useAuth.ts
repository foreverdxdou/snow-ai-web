import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { authService } from "@/app/services/auth";
import type { User } from "@/app/types/userinfo";
import type { Result } from "@/app/types/result";
import { useTranslation } from "react-i18next";
interface LoginResponse {
  token: string;
}

export const useAuth = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!Cookies.get("token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const userStr = Cookies.get("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response.status === 200) {
      if (response.data.code === 401) {
        return Promise.reject(new Error(response.data.message || t("auth.loginFailed.401")));
      }
      const { data } = response.data as Result<LoginResponse>;
      if (data.token) {
        Cookies.set("token", data.token);
        // 获取用户信息
        const userResponse = await authService.getCurrentUser();
        const { data: userData } = userResponse.data as Result<User>;
        Cookies.set("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        return Promise.reject(new Error(response.data.message || t("auth.loginFailed.401")));
      }
    } else if (response.status === 401) {
      return Promise.reject(new Error(t("auth.loginFailed.401")));
    } else {
      return Promise.reject(new Error(t("auth.loginFailed.default")));
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout().then(() => {
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(null);
      setIsAuthenticated(false);
    });
  }, []);

  return { isAuthenticated, user, login, logout };
};
