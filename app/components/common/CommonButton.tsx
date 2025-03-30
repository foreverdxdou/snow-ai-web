import React from 'react';
import { 
    Button, 
    IconButton, 
    ButtonProps, 
    styled,
    alpha
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Login as LoginIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    ArrowBack as ArrowBackIcon,
    Restore as RestoreIcon
} from '@mui/icons-material';

// 基础按钮样式
const BaseButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    padding: '8px 16px',
    height: '40px',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'none',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
    },
    '&:active': {
        transform: 'translateY(0)',
    },
    '&.Mui-disabled': {
        backgroundColor: alpha(theme.palette.action.disabled, 0.12),
        color: alpha(theme.palette.action.disabled, 0.38),
    }
}));

// 查看详情按钮 - 图标按钮
export const DetailButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        transform: 'translateY(-1px)',
    }
}));

// 新增按钮 - 主题色
export const AddButton = styled(BaseButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        borderColor: alpha(theme.palette.primary.main, 0.3),
    }
}));

// 修改按钮 - 主题色图标按钮
export const EditButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        transform: 'translateY(-1px)',
    }
}));

// 删除按钮 - 错误色图标按钮
export const DeleteButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.error.main,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: alpha(theme.palette.error.main, 0.08),
        transform: 'translateY(-1px)',
    }
}));

// 上传按钮 - 主题色
export const UploadButton = styled(BaseButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        borderColor: alpha(theme.palette.primary.main, 0.3),
    }
}));

// 搜索按钮 - 主题色渐变
export const SearchButton = styled(BaseButton)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    color: theme.palette.primary.contrastText,
    border: 'none',
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    }
}));

// 重置按钮 - 灰色
export const ResetButton = styled(BaseButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.grey[500], 0.15),
    color: theme.palette.mode === 'dark' 
        ? theme.palette.grey[300] 
        : theme.palette.grey[700],
    border: `1px solid ${alpha(theme.palette.grey[500], 0.3)}`,
    '&:hover': {
        backgroundColor: alpha(theme.palette.grey[500], 0.25),
        borderColor: alpha(theme.palette.grey[500], 0.4),
    }
}));

// 登录按钮 - 主题色渐变
export const LoginButton = styled(BaseButton)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    color: theme.palette.primary.contrastText,
    border: 'none',
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    }
}));

// 折叠/展开按钮 - 主题色
export const ExpandButton = styled(BaseButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    minWidth: 'auto',
    padding: '6px 16px',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        borderColor: alpha(theme.palette.primary.main, 0.3),
    }
}));

// 取消按钮 - 灰色
export const CancelButton = styled(BaseButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.grey[500], 0.15),
    color: theme.palette.mode === 'dark' 
        ? theme.palette.grey[300] 
        : theme.palette.grey[700],
    border: `1px solid ${alpha(theme.palette.grey[500], 0.3)}`,
    '&:hover': {
        backgroundColor: alpha(theme.palette.grey[500], 0.25),
        borderColor: alpha(theme.palette.grey[500], 0.4),
    }
}));

// 提交按钮 - 主题色渐变
export const SubmitButton = styled(BaseButton)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    color: theme.palette.primary.contrastText,
    border: 'none',
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    }
}));

// 关闭按钮 - 图标按钮
export const CloseButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.secondary,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { 
        color: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.08),
    }
}));

// 返回按钮 - 图标按钮
export const BackButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        transform: 'translateY(-1px)',
    }
}));

// 回滚按钮 - 警告色渐变
export const RollbackButton = styled(BaseButton)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.light} 90%)`,
    color: theme.palette.warning.contrastText,
    border: 'none',
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.warning.dark} 30%, ${theme.palette.warning.main} 90%)`,
    },
    '&.Mui-disabled': {
        background: alpha(theme.palette.warning.main, 0.12),
        color: alpha(theme.palette.warning.main, 0.38),
    }
}));

// 确认按钮 - 主题色渐变
export const ConfirmButton = styled(BaseButton)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
    color: theme.palette.success.contrastText,
    border: 'none',
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.success.dark} 30%, ${theme.palette.success.main} 90%)`,
    }
}));

// 按钮组件
interface CommonButtonProps extends Omit<ButtonProps, 'variant'> {
    buttonVariant?: 'detail' | 'add' | 'edit' | 'delete' | 'upload' | 'search' | 'reset' | 'login' | 'expand' | 'cancel' | 'submit' | 'close' | 'back' | 'rollback' | 'confirm';
    icon?: boolean;
    expanded?: boolean;
}

export const CommonButton = React.forwardRef<HTMLButtonElement, CommonButtonProps>(({
    buttonVariant = 'detail',
    icon = false,
    expanded = false,
    children,
    ...props
}, ref) => {
    const getIcon = () => {
        switch (buttonVariant) {
            case 'detail':
                return <VisibilityIcon sx={{ fontSize: 20 }} />;
            case 'add':
                return <AddIcon sx={{ fontSize: 20 }} />;
            case 'edit':
                return <EditIcon sx={{ fontSize: 20 }} />;
            case 'delete':
                return <DeleteIcon sx={{ fontSize: 20 }} />;
            case 'upload':
                return <UploadIcon sx={{ fontSize: 20 }} />;
            case 'search':
                return <SearchIcon sx={{ fontSize: 20 }} />;
            case 'reset':
                return <RefreshIcon sx={{ fontSize: 20 }} />;
            case 'login':
                return <LoginIcon sx={{ fontSize: 20 }} />;
            case 'expand':
                return expanded ? <ExpandLessIcon sx={{ fontSize: 20 }} /> : <ExpandMoreIcon sx={{ fontSize: 20 }} />;
            case 'cancel':
                return <CloseIcon sx={{ fontSize: 20 }} />;
            case 'submit':
                return <CheckIcon sx={{ fontSize: 20 }} />;
            case 'close':
                return <CloseIcon sx={{ fontSize: 20 }} />;
            case 'back':
                return <ArrowBackIcon sx={{ fontSize: 20 }} />;
            case 'rollback':
                return <RestoreIcon sx={{ fontSize: 20 }} />;
            case 'confirm':
                return <CheckIcon sx={{ fontSize: 20 }} />;
            default:
                return null;
        }
    };

    const getButtonComponent = () => {
        switch (buttonVariant) {
            case 'detail':
                return DetailButton;
            case 'add':
                return AddButton;
            case 'edit':
                return EditButton;
            case 'delete':
                return DeleteButton;
            case 'upload':
                return UploadButton;
            case 'search':
                return SearchButton;
            case 'reset':
                return ResetButton;
            case 'login':
                return LoginButton;
            case 'expand':
                return ExpandButton;
            case 'cancel':
                return CancelButton;
            case 'submit':
                return SubmitButton;
            case 'close':
                return CloseButton;
            case 'back':
                return BackButton;
            case 'rollback':
                return RollbackButton;
            case 'confirm':
                return ConfirmButton;
            default:
                return BaseButton;
        }
    };

    const ButtonComponent = getButtonComponent();

    // 如果是图标按钮，不显示文字
    if (buttonVariant === 'detail' || buttonVariant === 'delete' || buttonVariant === 'edit' || buttonVariant === 'close' || buttonVariant === 'back') {
        return (
            <ButtonComponent
                ref={ref}
                size="small"
                {...props}
            >
                {getIcon()}
            </ButtonComponent>
        );
    }

    return (
        <ButtonComponent
            ref={ref}
            startIcon={icon ? getIcon() : undefined}

            {...props}
        >
            {children}
        </ButtonComponent>
    );
});

CommonButton.displayName = 'CommonButton'; 