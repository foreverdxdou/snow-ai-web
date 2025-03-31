import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import { Send as SendIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
    question: string;
    loading: boolean;
    onQuestionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyPress: (event: React.KeyboardEvent) => void;
    onSend: () => void;
    onAbort: () => void;
}

export const ChatInput = ({
    question,
    loading,
    onQuestionChange,
    onKeyPress,
    onSend,
    onAbort,
}: ChatInputProps) => {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                fullWidth
                multiline
                maxRows={4}
                value={question}
                onChange={onQuestionChange}
                onKeyPress={onKeyPress}
                placeholder={t('qa.inputPlaceholder')}
                disabled={loading}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                        '&.Mui-focused': {
                            bgcolor: 'background.paper',
                            boxShadow: 2,
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                    },
                }}
            />
            <IconButton
                color="primary"
                onClick={loading ? onAbort : onSend}
                disabled={!question.trim() && !loading}
                title={loading ? t('qa.clickToStop') : t('qa.send')}
                sx={{
                    alignSelf: 'flex-end',
                    width: 56,
                    height: 56,
                    bgcolor: loading ? 'error.main' : 'primary.main',
                    color: 'primary.contrastText',
                    transition: 'all 0.3s ease',
                    boxShadow: 2,
                    '&:hover': {
                        bgcolor: loading ? 'error.dark' : 'primary.dark',
                        transform: loading ? 'rotate(90deg)' : 'scale(1.05)',
                        boxShadow: 4,
                    },
                    '&.Mui-disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled',
                        boxShadow: 0,
                    },
                }}
            >
                {loading ? (
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                            size={24}
                            color="inherit"
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                marginLeft: '-12px',
                                marginTop: '-12px',
                            }}
                        />
                        <DeleteIcon
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                marginLeft: '-12px',
                                marginTop: '-12px',
                                animation: 'fadeIn 0.3s ease-in-out',
                                '@keyframes fadeIn': {
                                    '0%': {
                                        opacity: 0,
                                        transform: 'scale(0.8)',
                                    },
                                    '100%': {
                                        opacity: 1,
                                        transform: 'scale(1)',
                                    },
                                },
                            }}
                        />
                    </Box>
                ) : (
                    <SendIcon />
                )}
            </IconButton>
        </Box>
    );
}; 