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

export default function UserPage() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [formData, setFormData] = React.useState<UserSaveRequest>({
    username: "",
    nickname: "",
    email: "",
    phone: "",
    password: "",
    status: 1,
    roleIds: [],
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
    try {
      const response = await roleService.getList({ current: 1, size: 100 });
      if (response.data?.code === 200 && response.data?.data) {
        setRoles(response.data.data.records);
      }
    } catch (error) {
      console.error("获取角色列表失败:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // 使用 useCallback 优化事件处理函数
  const handleOpen = useCallback((user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        status: user.status,
        roleIds: user.roleIds,
      });
    } else {
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
          }}
        >
          <SearchBar>
            <CommonInput
              label={t("common.user.username")}
              value={params.username || ""}
              onChange={(value) =>
                setParams({ ...params, username: value as string })
              }
            />
            <CommonInput
              label={t("common.user.nickname")}
              value={params.nickname || ""}
              onChange={(value) =>
                setParams({ ...params, nickname: value as string })
              }
            />
            <CommonInput
              label={t("common.user.email")}
              value={params.email || ""}
              onChange={(value) =>
                setParams({ ...params, email: value as string })
              }
            />
            <CommonInput
              label={t("common.user.phone")}
              value={params.phone || ""}
              onChange={(value) =>
                setParams({ ...params, phone: value as string })
              }
            />
            <CommonSelect
              label={t("common.user.status")}
              value={params.status || ""}
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
            />
            <CommonButton
              buttonVariant="reset"
              onClick={() => {
                setParams(defaultParams);
                refresh();
              }}
            >
              {t("common.reset")}
            </CommonButton>
            <CommonButton
              buttonVariant="add"
              onClick={() => handleOpen()}
              sx={{ marginLeft: "auto" }}
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
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Pagination
              total={total}
              current={Number(params.current)}
              pageSize={Number(params.size)}
              onChange={handlePageChange}
            />
          </Box>
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingUser ? t("common.user.edit") : t("common.user.add")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <CommonInput
                label={t("common.user.username")}
                value={formData.username}
                onChange={(value) =>
                  setFormData({ ...formData, username: value as string })
                }
                fullWidth
                required
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
                error={!formData.phone}
                helperText={
                  !formData.phone ? t("common.user.phoneRequired") : ""
                }
              />
              {!editingUser && (
                <>
                  <CommonInput
                    label={t("common.user.password")}
                    type="password"
                    value={formData.password}
                    onChange={(value) =>
                      setFormData({ ...formData, password: value as string })
                    }
                    fullWidth
                    required
                    error={!formData.password}
                    helperText={
                      !formData.password ? t("common.user.passwordRequired") : ""
                    }
                  />
                  <CommonInput
                    label={t("common.user.confirmPassword")}
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        confirmPassword: value as string,
                      })
                    }
                    fullWidth
                    required
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
          <DialogActions>
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
                (!editingUser && (!formData.password || !formData.confirmPassword))
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
        >
          <DialogTitle>{t("common.user.deleteConfirm")}</DialogTitle>
          <DialogContent>
            <Typography>{t("common.user.deleteConfirmMessage")}</Typography>
          </DialogContent>
          <DialogActions>
            <CommonButton
              buttonVariant="cancel"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("common.cancel")}
            </CommonButton>
            <CommonButton buttonVariant="confirm" onClick={handleDeleteConfirm}>
              {t("common.confirm")}
            </CommonButton>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PerformanceLayout>
  );
} 