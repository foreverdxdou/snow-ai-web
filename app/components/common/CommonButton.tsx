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
    Check as CheckIcon
} from '@mui/icons-material';

// 基础按钮样式
const BaseButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 500,
    padding: '8px 20px',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
        transform: 'translateX(-100%)',
        transition: 'transform 0.6s',
    },
    '&:hover::before': {
        transform: 'translateX(100%)',
    },
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
    '&:active': {
        transform: 'translateY(0)',
    },
    '&:disabled': {
        transform: 'none',
        boxShadow: 'none',
    }
}));

// 查看详情按钮 - 图标按钮
export const DetailButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
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
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    }
}));

// 删除按钮 - 错误色图标按钮
export const DeleteButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.error.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.error.main, 0.08),
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
    backgroundColor: alpha(theme.palette.grey[500], 0.08),
    color: theme.palette.grey[700],
    border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
    '&:hover': {
        backgroundColor: alpha(theme.palette.grey[500], 0.12),
        borderColor: alpha(theme.palette.grey[500], 0.3),
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
    padding: '4px 12px',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        borderColor: alpha(theme.palette.primary.main, 0.3),
    }
}));

// 取消按钮 - 灰色
export const CancelButton = styled(BaseButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.grey[500], 0.08),
    color: theme.palette.grey[700],
    border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
    '&:hover': {
        backgroundColor: alpha(theme.palette.grey[500], 0.12),
        borderColor: alpha(theme.palette.grey[500], 0.3),
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

// 按钮组件
interface CommonButtonProps extends Omit<ButtonProps, 'variant'> {
    buttonVariant?: 'detail' | 'add' | 'edit' | 'delete' | 'upload' | 'search' | 'reset' | 'login' | 'expand' | 'cancel' | 'submit';
    icon?: boolean;
    expanded?: boolean;
}

export const CommonButton: React.FC<CommonButtonProps> = ({
    buttonVariant = 'detail',
    icon = false,
    expanded = false,
    children,
    ...props
}) => {
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
            default:
                return BaseButton;
        }
    };

    const ButtonComponent = getButtonComponent();

    // 如果是图标按钮，不显示文字
    if (buttonVariant === 'detail' || buttonVariant === 'delete' || buttonVariant === 'edit') {
        return (
            <ButtonComponent
                size="small"
                {...props}
            >
                {getIcon()}
            </ButtonComponent>
        );
    }

    return (
        <ButtonComponent
            startIcon={icon ? getIcon() : undefined}
            {...props}
        >
            {children}
        </ButtonComponent>
    );
}; 