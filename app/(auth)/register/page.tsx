"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  alpha,
  useTheme,
  Button,
  LinearProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAdd } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { authService } from "@/app/services/auth";
import { CommonInput } from "@/app/components/common/CommonInput";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";



// 密码强度检查函数
const checkPasswordStrength = (
  password: string
): { score: number; label: string; color: string } => {
  let score = 0;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  if (hasLowerCase) score++;
  if (hasUpperCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChar) score++;
  if (isLongEnough) score++;

  if (score <= 2) return { score, label: "弱", color: "#f44336" };
  if (score <= 3) return { score, label: "中", color: "#ff9800" };
  return { score, label: "强", color: "#4caf50" };
};

interface RegisterForm {
  username: string;
  password: string;
  nickname: string;
  email: string;
  phone: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  nickname?: string;
  email?: string;
  phone?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({ score: 0, label: "", color: "" });
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    password: "",
    nickname: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange =
    (field: keyof RegisterForm) =>
    (value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // 清除对应字段的错误
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      if (field === "password") {
        setPasswordStrength(checkPasswordStrength(value as string));
      }
    };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // 用户名验证
    if (!formData.username.trim()) {
      errors.username = t("register.usernameRequired");
      isValid = false;
    }

    // 密码验证
    if (!formData.password) {
      errors.password = t("register.passwordRequired");
      isValid = false;
    } else if (passwordStrength.score < 3) {
      errors.password = t("register.passwordTooWeak");
      isValid = false;
    }

    // 昵称验证
    if (!formData.nickname.trim()) {
      errors.nickname = t("register.nicknameRequired");
      isValid = false;
    }

    // 邮箱验证
    if (!formData.email.trim()) {
      errors.email = t("register.emailRequired");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("register.emailInvalid");
      isValid = false;
    }

    // 手机号验证
    if (!formData.phone.trim()) {
      errors.phone = t("register.phoneRequired");
      isValid = false;
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      errors.phone = t("register.phoneInvalid");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        setLoading(true);
        setError(null);
        await authService.register(formData);
        setIsSuccess(true);
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (err) {
        setError(t("register.error"));
        console.error("注册失败:", err);
      } finally {
        setLoading(false);
      }
    },
    [formData, router, t, passwordStrength.score]
  );

  if (isSuccess) {
    return (
      <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            border:
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              py: 4,
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: "success.main",
                animation: "fadeIn 0.5s ease-in-out",
              }}
            />
            <Typography
              variant="h5"
              sx={{ color: "success.main", fontWeight: 600 }}
            >
              {t("auth.registerSuccessTitle")}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {t("auth.registerSuccessDesc")}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "400px", height: "450px" }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? "background.paper"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <CommonInput
              value={formData.username}
              onChange={handleChange("username")}
              required
              disabled={loading}
              fullWidth
              label={t("common.username")}
              error={!!formErrors.username}
              helperText={formErrors.username}
              autoComplete="off"
            />
            <CommonInput
              value={formData.password}
              onChange={handleChange("password")}
              required
              disabled={loading}
              fullWidth
              label={t("common.password")}
              helperText={
                formErrors.password || t("register.passwordRequirements")
              }
              error={!!formErrors.password}
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formData.password && (
              <Box sx={{ mt: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t("register.passwordStrength")}: {passwordStrength.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {passwordStrength.score}/5
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength.score / 5) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette.grey[300], 0.5),
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: passwordStrength.color,
                    },
                  }}
                />
              </Box>
            )}
            <CommonInput
              value={formData.nickname}
              onChange={handleChange("nickname")}
              required
              disabled={loading}
              fullWidth
              label={t("common.nickname")}
              error={!!formErrors.nickname}
              helperText={formErrors.nickname}
              autoComplete="off"
            />
            <CommonInput
              value={formData.email}
              onChange={handleChange("email")}
              required
              disabled={loading}
              fullWidth
              label={t("common.email")}
              error={!!formErrors.email}
              helperText={formErrors.email}
              autoComplete="off"
              type="email"
            />
            <CommonInput
              value={formData.phone}
              onChange={handleChange("phone")}
              required
              disabled={loading}
              fullWidth
              label={t("common.phone")}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              autoComplete="off"
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
            >
              {t("common.register")}
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t("register.hasAccount")}
              </Typography>
              <Button
                variant="text"
                onClick={() => router.push("/login")}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                {t("register.login")}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
