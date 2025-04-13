import { Box, Paper, Typography, IconButton, Tooltip, Snackbar, Alert, Collapse, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { ContentCopy as ContentCopyIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, KeyboardArrowUp as KeyboardArrowUpIcon, Refresh as RefreshIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
import { preprocessMarkdown, convertToQuoteFormat } from './MarkdownPreprocessor';
import { qaService } from '@/app/services/qa';

const markdownStyles = {
    '& .markdown-body': {
        color: 'text.primary',
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            mt: 2,
            mb: 1,
            fontWeight: 600,
            lineHeight: 1.25,
            color: (theme: Theme) => theme.palette.mode === 'dark' ? '#E2E8F0' : '#1E293B',
        },
        '& p': {
            mt: 0,
            mb: 2,
            lineHeight: 1.6,
            color: (theme: Theme) => theme.palette.mode === 'dark' ? '#CBD5E1' : '#334155',
        },
        '& a': {
            color: (theme: Theme) => theme.palette.mode === 'dark' ? '#60A5FA' : '#2563EB',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
                color: (theme: Theme) => theme.palette.mode === 'dark' ? '#93C5FD' : '#3B82F6',
            },
        },
        '& img': {
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            margin: '1em 0',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        '& pre': {
            mt: 2,
            mb: 2,
            p: 2,
            borderRadius: '12px',
            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
            overflow: 'auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '& code': {
                color: (theme: Theme) => theme.palette.mode === 'dark' ? '#E2E8F0' : '#1E293B',
                fontSize: '0.875rem',
                fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            },
        },
        '& code': {
            color: (theme: Theme) => theme.palette.mode === 'dark' ? '#60A5FA' : '#2563EB',
            fontSize: '0.875rem',
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            p: 0.5,
            borderRadius: '4px',
            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
        },
        '& blockquote': {
            m: 0,
            mt: 2,
            mb: 2,
            pl: 2,
            borderLeft: '4px solid',
            borderColor: (theme: Theme) => theme.palette.mode === 'dark' ? '#60A5FA' : '#2563EB',
            color: (theme: Theme) => theme.palette.mode === 'dark' ? '#CBD5E1' : '#475569',
            fontStyle: 'italic',
            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.5)',
            borderRadius: '0 8px 8px 0',
            p: 2,
        },
        '& table': {
            width: '100%',
            mt: 2,
            mb: 2,
            borderCollapse: 'separate',
            borderSpacing: 0,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '& th, & td': {
                p: 1.5,
                border: '1px solid',
                borderColor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
            '& th': {
                fontWeight: 600,
                bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                color: (theme: Theme) => theme.palette.mode === 'dark' ? '#E2E8F0' : '#1E293B',
            },
            '& td': {
                color: (theme: Theme) => theme.palette.mode === 'dark' ? '#CBD5E1' : '#334155',
            },
        },
        '& ul, & ol': {
            mt: 0,
            mb: 2,
            pl: 3,
            '& li': {
                mb: 0.5,
                position: 'relative',
                color: (theme: Theme) => theme.palette.mode === 'dark' ? '#CBD5E1' : '#334155',
                '&::marker': {
                    color: (theme: Theme) => theme.palette.mode === 'dark' ? '#60A5FA' : '#2563EB',
                },
            },
        },
        '& hr': {
            my: 2,
            border: 'none',
            borderTop: '1px solid',
            borderColor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            opacity: 0.3,
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

// 添加更酷炫的滚动动画
const scrollAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const ReasoningScroll = ({ content, isStreaming }: { content: string; isStreaming: boolean }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const hasEndThinkTag = content.includes('</think>');
  const hasMultipleLines = lines.length > 1;
  
  if (!isStreaming || hasEndThinkTag || !hasMultipleLines) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '120px',
          width: '100%',
          '&::before': {
            content: '"•"',
            mr: 1,
            color: 'grey.400',
            flexShrink: 0,
          }
        }}
      >
        {content}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '120px',
        overflow: 'hidden',
        width: '100%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 5%, rgba(255,255,255,0.1) 95%, rgba(255,255,255,0) 100%)',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          height: '30px',
          zIndex: 1,
          pointerEvents: 'none',
        },
        '&::before': {
          top: 0,
          background: 'linear-gradient(to bottom, grey.100, transparent)',
        },
        '&::after': {
          bottom: 0,
          background: 'linear-gradient(to top, grey.100, transparent)',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          animation: `${scrollAnimation} ${Math.max(10, lines.length * 2)}s linear infinite`,
          '&:hover': {
            animationPlayState: 'paused',
          },
          width: '100%',
          padding: '0 16px',
          boxSizing: 'border-box',
          '& > *': {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              color: 'primary.main',
            }
          }
        }}
      >
        {lines.map((line, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              color: 'text.secondary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              display: 'flex',
              alignItems: 'flex-start',
              width: '100%',
              '&::before': {
                content: '"•"',
                mr: 1,
                color: 'grey.400',
                flexShrink: 0,
                mt: '0.2em',
                transition: 'all 0.3s ease',
              },
              '&:hover::before': {
                color: 'primary.main',
                transform: 'scale(1.2)',
              }
            }}
          >
            {line}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

interface ChatMessageProps {
    chat: KbChatHistory;
    onRegenerate?: () => void;
    onDelete?: () => void;
}

export const ChatMessage = ({ chat, onRegenerate, onDelete }: ChatMessageProps) => {
    const { t } = useTranslation();
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });
    const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
    }>({
        open: false,
    });

    const handleCopyMessage = () => {
        const hasEndThinkTag = chat.answer.includes('</think>');
        const hasThinkTag = chat.answer.includes('<think>');
        
        let messageText = '';
        
        if (hasEndThinkTag) {
            if (hasThinkTag) {
                // 处理包含<think>和</think>的情况
                const parts = chat.answer.split(/<think>|<\/think>/);
                messageText = parts[2] || '';
            } else {
                // 处理只包含</think>的情况
                const parts = chat.answer.split('</think>');
                messageText = parts[0] || '';
            }
        } else {
            messageText = chat.answer;
        }
        
        // 预处理Markdown内容，移除Markdown语法
        const plainText = preprocessMarkdown(messageText)
            .replace(/#{1,6}\s/g, '') // 移除标题
            .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
            .replace(/\*(.*?)\*/g, '$1') // 移除斜体
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // 移除链接
            .replace(/!\[(.*?)\]\((.*?)\)/g, '$1') // 移除图片
            .replace(/`(.*?)`/g, '$1') // 移除行内代码
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/>\s(.*)/g, '$1') // 移除引用
            .replace(/^\s*[-*+]\s/gm, '') // 移除列表项
            .replace(/^\s*\d+\.\s/gm, '') // 移除有序列表
            .replace(/\|.*\|/g, '') // 移除表格
            .replace(/\n{3,}/g, '\n\n') // 规范化换行
            .trim();
        
        navigator.clipboard.writeText(plainText).then(() => {
            setSnackbar({
                open: true,
                message: t('qa.copySuccess'),
                severity: 'success'
            });
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setSnackbar({
                open: true,
                message: t('qa.copyError'),
                severity: 'error'
            });
        });
    };

    const handleDeleteMessage = () => {
        setDeleteDialog({ open: true });
    };

    const handleConfirmDelete = async () => {
        try {
            await qaService.clearChatHistoryByRequestId(chat.requestId);
            setSnackbar({
                open: true,
                message: t('qa.deleteMessageSuccess'),
                severity: 'success',
            });
            setDeleteDialog({ open: false });
            // 通知父组件刷新聊天历史
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: t('qa.deleteMessageError'),
                severity: 'error',
            });
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ open: false });
    };

    const handleToggleReasoning = () => {
        setIsReasoningExpanded(prev => !prev);
    };

    const renderAnswer = (answer: string) => {
        // 检查是否是ThinkingDots标记
        if (answer === 'THINKING_DOTS') {
            return <ThinkingDots />;
        }
        
        const hasEndThinkTag = answer.includes('</think>');
        const hasThinkTag = answer.includes('<think>');
        const isThinking = hasThinkTag && !hasEndThinkTag;
        
        let parts: string[] = [];
        let reasoningContent = '';
        let finalAnswer = '';
        
        if (hasEndThinkTag) {
            if (hasThinkTag) {
                parts = answer.split(/<think>|<\/think>/);
                reasoningContent = parts[1] || '';
                finalAnswer = parts[2] || '';
            } else {
                parts = answer.split('</think>');
                reasoningContent = parts[0] || '';
                finalAnswer = parts[1] || '';
            }
        } else if (hasThinkTag) {
            parts = answer.split('<think>');
            reasoningContent = parts[1] || '';
        } else {
            finalAnswer = answer;
        }
        
        return (
            <Box>
                {reasoningContent && (
                    <Collapse in={isReasoningExpanded}>
                        <Box sx={{ 
                            mb: 2,
                            pl: 2,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                backgroundColor: '#a0a1ae',
                                borderRadius: '4px'
                            }
                        }}>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: '#a0a1ae',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.6,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {reasoningContent}
                            </Typography>
                        </Box>
                    </Collapse>
                )}
                {finalAnswer && (
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                        components={{
                            h1: ({ children }) => (
                                <Typography variant="h1" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
                            h2: ({ children }) => (
                                <Typography variant="h2" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
                            h3: ({ children }) => (
                                <Typography variant="h3" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
                            h4: ({ children }) => (
                                <Typography variant="h4" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
                            h5: ({ children }) => (
                                <Typography variant="h5" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
                            h6: ({ children }) => (
                                <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
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
                            strong: ({ children }) => (
                                <Typography component="span" sx={{ fontWeight: 700 }}>
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
                        {preprocessMarkdown(finalAnswer)}
                    </ReactMarkdown>
                )}
            </Box>
        );
    };

    return (
        <>
            <Box>
                {/* 用户问题 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 3 }}>
                    <Paper
                        sx={{
                            maxWidth: '85%',
                            p: 2.5,
                            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? '#2563EB' : '#3B82F6',
                            color: '#FFFFFF',
                            borderRadius: '20px 20px 0 20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                width: '20px',
                                height: '20px',
                                background: 'inherit',
                                clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                            },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                                bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? '#1D4ED8' : '#2563EB',
                            },
                        }}
                    >
                        <Typography sx={{ 
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            fontWeight: 500,
                        }}>
                            {chat.question}
                        </Typography>
                    </Paper>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Tooltip title={t('qa.copyMessage')}>
                            <IconButton
                                onClick={() => handleCopyMessage()}
                                sx={{
                                    color: (theme: Theme) => theme.palette.mode === 'dark' ? '#60A5FA' : '#2563EB',
                                    opacity: 0.7,
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        opacity: 1, 
                                        transform: 'scale(1.1)',
                                        bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                                    },
                                }}
                                size="small"
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('qa.deleteMessage')}>
                            <IconButton
                                onClick={handleDeleteMessage}
                                sx={{
                                    color: (theme: Theme) => theme.palette.mode === 'dark' ? '#F87171' : '#EF4444',
                                    opacity: 0.7,
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        opacity: 1, 
                                        transform: 'scale(1.1)',
                                        bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    },
                                }}
                                size="small"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* AI 回答 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {(chat.answer.includes('</think>') || chat.answer.includes('<think>')) && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1.5,
                            ml: 1
                        }}>
                            <Box
                                component="span"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: (theme: Theme) => theme.palette.mode === 'dark' ? '#60A5FA' : '#2563EB',
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            >
                                ❄️
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: (theme: Theme) => theme.palette.mode === 'dark' ? '#94A3B8' : '#64748B',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontWeight: 500,
                                }}
                            >
                                {chat.answer.includes('</think>') && chat.isStop === 0 ? t('qa.thinkingCompleted') : chat.isStop === 1 ? t('qa.thinkingAborted') : t('qa.thinking')}
                                {!chat.answer.includes('</think>') && chat.answer.includes('<think>') && chat.isStop === 0 && <ThinkingDots />}
                            </Typography>
                            {chat.answer.includes('</think>') && (
                                <IconButton
                                    onClick={handleToggleReasoning}
                                    sx={{
                                        color: (theme: Theme) => theme.palette.mode === 'dark' ? '#94A3B8' : '#64748B',
                                        padding: '2px',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: (theme: Theme) => theme.palette.mode === 'dark' ? '#60A5FA' : '#2563EB',
                                            bgcolor: 'transparent',
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                    size="small"
                                >
                                    {isReasoningExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                </IconButton>
                            )}
                        </Box>
                    )}
                    <Paper
                        elevation={2}
                        sx={{
                            maxWidth: '85%',
                            p: 2.5,
                            borderRadius: '20px 20px 20px 0',
                            bgcolor: (theme: Theme) => theme.palette.mode === 'dark' 
                                ? 'rgba(139, 92, 246, 0.12)'  // 暗色模式：柔和的紫色
                                : 'rgba(248, 250, 252, 0.95)', // 亮色模式：浅灰色
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                width: '20px',
                                height: '20px',
                                background: 'inherit',
                                clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
                            },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                                bgcolor: (theme: Theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(139, 92, 246, 0.18)'  // 暗色模式悬停：稍深的紫色
                                    : 'rgba(248, 250, 252, 1)', // 亮色模式悬停：更实的浅灰色
                            },
                            ...markdownStyles,
                        }}
                    >
                        <Box className="markdown-body">
                            {renderAnswer(chat.answer)}
                        </Box>
                    </Paper>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Tooltip title={t('qa.copyMessage')}>
                            <IconButton
                                onClick={() => handleCopyMessage()}
                                sx={{
                                    color: (theme: Theme) => theme.palette.mode === 'dark' ? '#60A5FA' : '#2563EB',
                                    opacity: 0.7,
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        opacity: 1, 
                                        transform: 'scale(1.1)',
                                        bgcolor: (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                                    },
                                }}
                                size="small"
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
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

            {/* 删除确认对话框 */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleCancelDelete}
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1,
                    fontWeight: 600,
                }}>
                    {t('qa.deleteMessageConfirm')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                    }}>
                        此操作将永久删除该消息，是否继续？
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleCancelDelete}
                        variant="outlined"
                        sx={{
                            minWidth: 80,
                            fontWeight: 500,
                        }}
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        sx={{
                            minWidth: 80,
                            fontWeight: 500,
                        }}
                    >
                        删除
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export { ThinkingDots }; 