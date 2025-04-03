import { Box, Paper, Typography, IconButton, Tooltip, Snackbar, Alert, Collapse } from '@mui/material';
import { ContentCopy as ContentCopyIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { useTranslation } from 'react-i18next';
import type { KbChatHistory } from '@/app/types/qa';
import { Theme } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { useState } from 'react';

const markdownStyles = {
    '& .markdown-body': {
        color: 'text.primary',
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            mt: 2,
            mb: 1,
            fontWeight: 600,
            lineHeight: 1.25,
        },
        '& h1': { fontSize: '2em' },
        '& h2': { fontSize: '1.5em' },
        '& h3': { fontSize: '1.25em' },
        '& h4': { fontSize: '1em' },
        '& h5': { fontSize: '0.875em' },
        '& h6': { fontSize: '0.85em' },
        '& p': {
            mt: 0,
            mb: 2,
            lineHeight: 1.6,
        },
        '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        '& img': {
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            margin: '1em 0',
        },
        '& pre': {
            mt: 2,
            mb: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
            overflow: 'auto',
            '& code': {
                color: 'inherit',
                fontSize: '0.875rem',
                fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            },
        },
        '& code': {
            color: 'primary.main',
            fontSize: '0.875rem',
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            p: 0.5,
            borderRadius: 0.5,
            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        '& blockquote': {
            m: 0,
            mt: 2,
            mb: 2,
            pl: 2,
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            color: 'text.secondary',
            fontStyle: 'italic',
        },
        '& table': {
            width: '100%',
            mt: 2,
            mb: 2,
            borderCollapse: 'collapse',
            '& th, & td': {
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
            },
            '& th': {
                fontWeight: 600,
                bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
            },
        },
        '& ul, & ol': {
            mt: 0,
            mb: 2,
            pl: 3,
            '& li': {
                mb: 0.5,
            },
        },
        '& hr': {
            my: 2,
            border: 'none',
            borderTop: '1px solid',
            borderColor: 'divider',
        },
    },
};

// 添加思考中的动画效果
const thinkingAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
`;

const ThinkingDots = () => (
    <Box sx={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 1,
        ml: 1,
        verticalAlign: 'middle',
        height: '24px'
    }}>
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: `${thinkingAnimation} 1s infinite ease-in-out`,
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
            }}
        />
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: `${thinkingAnimation} 1s infinite ease-in-out 0.2s`,
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
            }}
        />
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: `${thinkingAnimation} 1s infinite ease-in-out 0.4s`,
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
            }}
        />
    </Box>
);

// 添加推理内容样式
const reasoningStyles = {
    '& .reasoning-content': {
        display: 'none',
        transition: 'all 0.3s ease-out',
    },
    '& .reasoning-content.expanded': {
        display: 'block',
        marginBottom: '16px',
        '& .reasoning-text': {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            position: 'relative',
            paddingLeft: '16px',
            color: 'text.secondary',
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: 'grey.400',
                borderRadius: '2px',
            }
        }
    },
    '& .reasoning-toggle': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'primary.main',
        '&:hover': {
            opacity: 0.8,
        },
    },
    '& .final-answer': {
        transition: 'margin-top 0.3s ease-out',
        marginTop: (theme: Theme) => theme.spacing(2),
        '& p': {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
        }
    },
    '& .message-actions': {
        display: 'flex',
        gap: 1,
        mt: 0.5,
    },
};

interface ChatMessageProps {
    chat: KbChatHistory;
}

export const ChatMessage = ({ chat }: ChatMessageProps) => {
    const { t } = useTranslation();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });
    const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);

    const handleCopyMessage = async (isQuestion: boolean) => {
        try {
            let messageText = '';
            if (isQuestion) {
                messageText = chat.question;
            } else {
                // 如果是回答，检查是否包含推理内容
                if (chat.answer.includes('</think>')) {
                    const parts = chat.answer.split(/<\/?think>/);
                    // 只复制最终答案部分
                    messageText = parts[2] || chat.answer;
                } else {
                    messageText = chat.answer;
                }
            }
            await navigator.clipboard.writeText(messageText);
            setSnackbar({
                open: true,
                message: t('qa.copySuccess'),
                severity: 'success'
            });
        } catch (error) {
            console.error('复制失败:', error);
            setSnackbar({
                open: true,
                message: t('qa.copyError'),
                severity: 'error'
            });
        }
    };

    const handleToggleReasoning = () => {
        setIsReasoningExpanded(prev => !prev);
    };

    const renderAnswer = () => {
        // 检查是否包含 <think> 标签
        const hasThinkTag = chat.answer.includes('<think>');
        const hasEndThinkTag = chat.answer.includes('</think>');
        
        if (!hasThinkTag) {
            return (
                <Box className="final-answer">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize, [rehypeHighlight, { ignoreMissing: true }]]}
                        components={{
                            p: ({ children }) => (
                                <Typography 
                                    component="p" 
                                    sx={{ 
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        mb: 2 
                                    }}
                                >
                                    {children}
                                </Typography>
                            ),
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <Box component="div" sx={{ position: 'relative' }}>
                                        <IconButton
                                            onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: 8,
                                                bgcolor: 'background.paper',
                                                opacity: 0,
                                                transition: 'all 0.2s',
                                                '&:hover': { opacity: 1 },
                                            }}
                                            size="small"
                                        >
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                        <pre className={className}><code {...props}>{children}</code></pre>
                                    </Box>
                                ) : (
                                    <code className={className} {...props}>{children}</code>
                                );
                            }
                        }}
                    >
                        {chat.answer}
                    </ReactMarkdown>
                </Box>
            );
        }

        const parts = chat.answer.split(/<\/?think>/);
        console.log('parts', parts);

        return (
            <Box sx={reasoningStyles}>
                {hasThinkTag && (
                    <Box className={`reasoning-content ${isReasoningExpanded ? 'expanded' : ''}`}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'grey.100',
                                borderRadius: 2,
                                borderLeft: '4px solid',
                                borderColor: 'grey.400',
                            }}
                        >
                            <Typography variant="body2" className="reasoning-text">
                                {parts[1]}
                            </Typography>
                        </Paper>
                    </Box>
                )}
                {hasEndThinkTag && (
                    <Box className="final-answer">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize, [rehypeHighlight, { ignoreMissing: true }]]}
                            components={{
                                p: ({ children }) => (
                                    <Typography 
                                        component="p" 
                                        sx={{ 
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            mb: 2 
                                        }}
                                    >
                                        {children}
                                    </Typography>
                                ),
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <Box component="div" sx={{ position: 'relative' }}>
                                            <IconButton
                                                onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 8,
                                                    top: 8,
                                                    bgcolor: 'background.paper',
                                                    opacity: 0,
                                                    transition: 'all 0.2s',
                                                    '&:hover': { opacity: 1 },
                                                }}
                                                size="small"
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                            <pre className={className}><code {...props}>{children}</code></pre>
                                        </Box>
                                    ) : (
                                        <code className={className} {...props}>{children}</code>
                                    );
                                }
                            }}
                        >
                            {parts[2]}
                        </ReactMarkdown>
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <>
            <Box>
                {/* 用户问题 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 2 }}>
                    <Paper
                        sx={{
                            maxWidth: '85%',
                            p: 2,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            borderRadius: '12px 12px 0 12px',
                        }}
                    >
                        <Typography>{chat.question}</Typography>
                    </Paper>
                    <Tooltip title={t('qa.copyMessage')}>
                        <IconButton
                            onClick={() => handleCopyMessage(true)}
                            sx={{
                                mt: 0.5,
                                color: 'primary.main',
                                opacity: 0.7,
                                transition: 'all 0.2s',
                                '&:hover': { opacity: 1, transform: 'scale(1.1)' },
                            }}
                            size="small"
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* AI 回答 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Paper
                        elevation={2}
                        sx={{
                            maxWidth: '85%',
                            p: 2,
                            borderRadius: '12px 12px 12px 0',
                            bgcolor: 'background.paper',
                            '&:hover': { boxShadow: 3 },
                            ...markdownStyles,
                        }}
                    >
                        <Box className="markdown-body">
                            {renderAnswer()}
                            {chat.answer === t('qa.thinking') && <ThinkingDots />}
                        </Box>
                    </Paper>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Tooltip title={t('qa.copyMessage')}>
                            <IconButton
                                onClick={() => handleCopyMessage(false)}
                                sx={{
                                    color: 'primary.main',
                                    opacity: 0.7,
                                    transition: 'all 0.2s',
                                    '&:hover': { opacity: 1, transform: 'scale(1.1)' },
                                }}
                                size="small"
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {chat.answer.includes('</think>') && (
                            <Tooltip title={isReasoningExpanded || chat.answer.includes('<think>') ? t('qa.collapseReasoning') : t('qa.expandReasoning')}>
                                <IconButton
                                    onClick={handleToggleReasoning}
                                    sx={{
                                        color: 'primary.main',
                                        opacity: 0.7,
                                        transition: 'all 0.2s',
                                        '&:hover': { opacity: 1, transform: 'scale(1.1)' },
                                    }}
                                    size="small"
                                >
                                    {isReasoningExpanded || chat.answer.includes('<think>') ? <KeyboardArrowUpIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ zIndex: 9999 }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%', minWidth: '200px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}; 