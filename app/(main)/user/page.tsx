"use client";

import React, { useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Stack,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { PerformanceLayout } from "@/app/components/common/PerformanceLayout";
import { PerformanceTable } from "@/app/components/common/PerformanceTable";
import { usePerformanceData } from "@/app/hooks/usePerformanceData";
import { useDebouncedCallback } from "@/app/utils/performance";
import { Pagination } from "@/app/components/common/Pagination";
import { formatDate } from "@/app/utils/format";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonInput } from "@/app/components/common/CommonInput";
import { CommonSelect } from "@/app/components/common/CommonSelect";
import { SearchBar } from "@/app/components/common/SearchBar";
import { userService } from "@/app/services/user";
import { roleService } from "@/app/services/role";
import type { User, UserSaveRequest } from "@/app/types/user";
import type { Role } from "@/app/types/role";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { alpha, Theme } from "@mui/material/styles";

export default function UserPage() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState<UserSaveRequest>({
    username: "",
    nickname: "",
    email: "",
    phone: "",
    password: "",
    status: 1,
    roleIds: [],
  });

  const [passwordStrength, setPasswordStrength] = React.useState({
    score: 0,
    isValid: false,
  });

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // 使用 useMemo 优化 defaultParams
  const defaultParams = useMemo(
    () => ({
      current: 1,
      size: 10,
      username: "",
      nickname: "",
      email: "",
      phone: "",
      status: undefined,
    }),
    []
  );

  // 使用 usePerformanceData 优化数据获取
  const {
    data: users,
    loading,
    total,
    params,
    setParams,
    refresh,
  } = usePerformanceData<User>({
    fetchData: userService.getList,
    defaultParams,
    autoFetch: true,
  });

  // 获取角色列表
  const fetchRoles = useCallback(async () => {
    let isMounted = true;
    console.log("fetchRoles");
    try {
      const response = await roleService.getList({ current: 1, size: 100 });
      if (isMounted && response.data?.code === 200 && response.data?.data) {
        setRoles(response.data.data.records);
      }
    } catch (error) {
      console.error("获取角色列表失败:", error);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    const cleanupFetch = fetchRoles();
    return () => {
      cleanupFetch.then(cleanup => cleanup?.());
      setRoles([]);
      setFormData({
        username: "",
        nickname: "",
        email: "",
        phone: "",
        password: "",
        status: 1,
        roleIds: [],
      });
      setEditingUser(null);
      setDeletingId(null);
      setOpen(false);
      setDeleteDialogOpen(false);
      setSnackbar({
        open: false,
        message: "",
        severity: "success",
      });
    };
  }, [fetchRoles]);

  // 使用 useCallback 优化事件处理函数
  const handleOpen = useCallback((user?: User) => {
    if (!user) {
      setEditingUser(null);
      setFormData({
        username: "",
        nickname: "",
        email: "",
        phone: "",
        password: "",
        status: 1,
        roleIds: [],
      });
    } else {
      setEditingUser(user);
      setFormData({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        status: user.status,
        roleIds: user.roleIds || [],
      });
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingUser(null);
    setFormData({
      username: "",
      nickname: "",
      email: "",
      phone: "",
      password: "",
      status: 1,
      roleIds: [],
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
        setSnackbar({
          open: true,
          message: t("common.user.updateSuccess"),
          severity: "success",
        });
      } else {
        await userService.add(formData);
        setSnackbar({
          open: true,
          message: t("common.user.createSuccess"),
          severity: "success",
        });
      }
      handleClose();
      refresh();
    } catch (error) {
      console.error(`${editingUser ? "更新" : "创建"}用户失败:`, error);
      setSnackbar({
        open: true,
        message: t(
          `common.user.${editingUser ? "updateError" : "createError"}`
        ),
        severity: "error",
      });
    }
  }, [editingUser, formData, handleClose, refresh, t]);

  const handleDelete = useCallback((id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingId) return;
    try {
      await userService.delete(deletingId);
      setSnackbar({
        open: true,
        message: t("common.user.deleteSuccess"),
        severity: "success",
      });
      refresh();
    } catch (error) {
      console.error("删除用户失败:", error);
      setSnackbar({
        open: true,
        message: t("common.user.deleteError"),
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  }, [deletingId, refresh, t]);

  // 使用 useDebouncedCallback 优化分页处理
  const handlePageChange = useCallback((page: number, size: number) => {
    setParams({
      ...params,
      current: page,
      size: size,
    });
  }, [params, setParams]);

  // 密码强度校验
  const checkPasswordStrength = useCallback((password: string) => {
    // 密码必须包含大小写字母、数字和特殊字符，且长度不少于8位
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    let score = 0;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChar) score++;
    if (isLongEnough) score++;

    const isValid = score === 5;
    setPasswordStrength({ score, isValid });
  }, []);

  // 处理密码变化
  const handlePasswordChange = useCallback((value: string | number) => {
    setFormData(prev => ({ ...prev, password: String(value) }));
    checkPasswordStrength(String(value));
  }, [checkPasswordStrength]);

  // 使用 useMemo 优化表格配置
  const columns = useMemo(
    () => [
      {
        key: "username" as keyof User,
        title: t("common.user.username"),
        width: 150,
      },
      {
        key: "nickname" as keyof User,
        title: t("common.user.nickname"),
        width: 150,
      },
      {
        key: "email" as keyof User,
        title: t("common.user.email"),
        width: 200,
      },
      {
        key: "phone" as keyof User,
        title: t("common.user.phone"),
        width: 150,
      },
      {
        key: "status" as keyof User,
        title: t("common.user.status"),
        width: 100,
        render: (_: any, record: User) => (
          <Typography
            color={record.status === 1 ? "success.main" : "error.main"}
          >
            {record.status === 1 ? t("common.enable") : t("common.disable")}
          </Typography>
        ),
      },
      {
        key: "roleNames" as keyof User,
        title: t("common.user.roles"),
        width: 200,
        render: (_: any, record: User) => record.roleNames,
      },
      {
        key: "createTime" as keyof User,
        title: t("common.createTime"),
        width: 180,
        render: (_: any, record: User) =>
          record.createTime ? formatDate(record.createTime) : "-",
      },
      {
        key: "updateTime" as keyof User,
        title: t("common.updateTime"),
        width: 180,
        render: (_: any, record: User) =>
          record.updateTime ? formatDate(record.updateTime) : "-",
      },
      {
        key: "actions" as keyof User,
        title: t("common.operation"),
        width: 200,
        render: (_: any, record: User) => (
          <Stack direction="row" spacing={1}>
            <CommonButton
              buttonVariant="edit"
              icon
              onClick={() => handleOpen(record)}
            />
            <CommonButton
              buttonVariant="delete"
              icon
              onClick={() => handleDelete(record.id)}
            />
          </Stack>
        ),
      },
    ],
    [t, handleOpen, handleDelete]
  );

  return (
    <PerformanceLayout>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 1,
            backdropFilter: "blur(8px)",
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
          }}
        >
          <SearchBar>
            <CommonInput
              label={t("common.user.username")}
              value={params.username || ""}
              onChange={(value) =>
                setParams({ ...params, username: value as string })
              }
              sx={{ minWidth: 200 }}
            />
            <CommonInput
              label={t("common.user.nickname")}
              value={params.nickname || ""}
              onChange={(value) =>
                setParams({ ...params, nickname: value as string })
              }
              sx={{ minWidth: 200 }}
            />
            <CommonInput
              label={t("common.user.email")}
              value={params.email || ""}
              onChange={(value) =>
                setParams({ ...params, email: value as string })
              }
              sx={{ minWidth: 200 }}
            />
            <CommonInput
              label={t("common.user.phone")}
              value={params.phone || ""}
              onChange={(value) =>
                setParams({ ...params, phone: value as string })
              }
              sx={{ minWidth: 200 }}
            />
            <CommonSelect
              label={t("common.user.status")}
              value={params.status}
              onChange={(value) =>
                setParams({ ...params, status: value as number })
              }
              options={[
                { id: 1, name: t("common.enable") },
                { id: 0, name: t("common.disable") },
              ]}
              showAll
              allValue={undefined}
              showAllLabel={t("common.all")}
              sx={{ minWidth: 200 }}
            />
            <CommonButton
              buttonVariant="reset"
              onClick={() => {
                setParams(defaultParams);
                refresh();
              }}
              sx={{ ml: 1 }}
            >
              {t("common.reset")}
            </CommonButton>
            <CommonButton
              buttonVariant="add"
              onClick={() => handleOpen()}
              sx={{ ml: "auto" }}
            >
              {t("common.user.add")}
            </CommonButton>
          </SearchBar>
        </Box>

        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
          <PerformanceTable
            loading={loading}
            data={users}
            columns={columns}
            emptyMessage={t("common.noData")}
            sx={{
              '& .MuiTableCell-root': {
                py: 2,
                px: 3,
                fontSize: '0.875rem',
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                fontWeight: 600,
                backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.04),
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.04),
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Pagination
              total={total}
              current={Number(params.current)}
              pageSize={Number(params.size)}
              onChange={handlePageChange}
            />
          </Box>
        </Box>

        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
          }}>
            {editingUser ? t("common.user.edit") : t("common.user.add")}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 2.5,
                '& .MuiFormControl-root': {
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                  }
                }
              }}
            >
              <CommonInput
                label={t("common.user.username")}
                value={formData.username}
                onChange={(value) =>
                  setFormData({ ...formData, username: value as string })
                }
                fullWidth
                required
                autoComplete="off"
                error={!formData.username}
                helperText={
                  !formData.username ? t("common.user.usernameRequired") : ""
                }
              />
              <CommonInput
                label={t("common.user.nickname")}
                value={formData.nickname}
                onChange={(value) =>
                  setFormData({ ...formData, nickname: value as string })
                }
                fullWidth
                required
                autoComplete="off"
                error={!formData.nickname}
                helperText={
                  !formData.nickname ? t("common.user.nicknameRequired") : ""
                }
              />
              <CommonInput
                label={t("common.user.email")}
                value={formData.email}
                onChange={(value) =>
                  setFormData({ ...formData, email: value as string })
                }
                fullWidth
                required
                autoComplete="off"
                error={!formData.email}
                helperText={
                  !formData.email ? t("common.user.emailRequired") : ""
                }
              />
              <CommonInput
                label={t("common.user.phone")}
                value={formData.phone}
                onChange={(value) =>
                  setFormData({ ...formData, phone: value as string })
                }
                fullWidth
                required
                autoComplete="off"
                error={!formData.phone}
                helperText={
                  !formData.phone ? t("common.user.phoneRequired") : ""
                }
              />
              {!editingUser && (
                <>
                  <CommonInput
                    label={t("common.user.password")}
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    autoComplete="new-password"
                    error={!formData.password || !passwordStrength.isValid}
                    helperText={
                      !formData.password 
                        ? t("common.user.passwordRequired")
                        : !passwordStrength.isValid
                        ? t("register.passwordRequirements")
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      ),
                    }}
                  />
                  {formData.password && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        {t("register.passwordStrength")}
                      </Typography>
                      <Box
                        sx={{
                          mt: 0.5,
                          height: 4,
                          borderRadius: 2,
                          bgcolor: "grey.200",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            bgcolor: passwordStrength.isValid
                              ? "success.main"
                              : passwordStrength.score >= 3
                              ? "warning.main"
                              : "error.main",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                  <CommonInput
                    label={t("common.user.confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        confirmPassword: value as string,
                      })
                    }
                    fullWidth
                    required
                    autoComplete="new-password"
                    error={
                      !formData.confirmPassword ||
                      formData.password !== formData.confirmPassword
                    }
                    helperText={
                      !formData.confirmPassword
                        ? t("common.user.confirmPasswordRequired")
                        : formData.password !== formData.confirmPassword
                        ? t("common.user.passwordNotMatch")
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      ),
                    }}
                  />
                </>
              )}
              <CommonSelect
                label={t("common.user.status")}
                value={formData.status}
                onChange={(value) =>
                  setFormData({ ...formData, status: value as number })
                }
                options={[
                  { id: 1, name: t("common.enable") },
                  { id: 0, name: t("common.disable") },
                ]}
              />
              <CommonSelect
                label={t("common.user.roles")}
                value={formData.roleIds}
                onChange={(value) =>
                  setFormData({ ...formData, roleIds: value as number[] })
                }
                options={roles?.map((role) => ({
                  id: role.id,
                  name: role.roleName,
                }))}
                multiple
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            px: 3, 
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.02),
          }}>
            <CommonButton buttonVariant="cancel" onClick={handleClose}>
              {t("common.cancel")}
            </CommonButton>
            <CommonButton
              buttonVariant="submit"
              onClick={handleSubmit}
              disabled={
                !formData.username ||
                !formData.nickname ||
                !formData.email ||
                !formData.phone ||
                (!editingUser && (!formData.password || !formData.confirmPassword || !passwordStrength.isValid))
              }
            >
              {t("common.save")}
            </CommonButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.04),
          }}>
            {t("common.user.deleteConfirm")}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography color="error.main">
              {t("common.user.deleteConfirmMessage")}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ 
            px: 3, 
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.02),
          }}>
            <CommonButton
              buttonVariant="cancel"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("common.cancel")}
            </CommonButton>
            <CommonButton 
              buttonVariant="confirm" 
              onClick={handleDeleteConfirm}
              color="error"
            >
              {t("common.confirm")}
            </CommonButton>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: 2,
              boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
            }
          }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ 
              width: "100%",
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem',
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PerformanceLayout>
  );
} 