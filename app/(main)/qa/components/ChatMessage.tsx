import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
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

interface ChatMessageProps {
    chat: KbChatHistory;
}

export const ChatMessage = ({ chat }: ChatMessageProps) => {
    const { t } = useTranslation();

    return (
        <Box>
            {/* 用户问题 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
            </Box>

            {/* AI 回答 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper
                    elevation={2}
                    sx={{
                        maxWidth: '85%',
                        p: 2,
                        borderRadius: '12px 12px 12px 0',
                        bgcolor: 'background.paper',
                        position: 'relative',
                        '&:hover': {
                            boxShadow: 3,
                        },
                        ...markdownStyles,
                    }}
                >
                    <Box className="markdown-body">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[
                                rehypeRaw,
                                rehypeSanitize,
                                [rehypeHighlight, { ignoreMissing: true }]
                            ]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <Box
                                            component="div"
                                            sx={{
                                                position: 'relative',
                                                '& pre': {
                                                    mt: '0 !important',
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                },
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 8,
                                                    top: 8,
                                                    bgcolor: 'background.paper',
                                                    opacity: 0,
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                        opacity: 1,
                                                    },
                                                }}
                                                size="small"
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                            <pre className={className}>
                                                <code {...props}>{children}</code>
                                            </pre>
                                        </Box>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {chat.answer}
                        </ReactMarkdown>
                        {chat.answer === t('qa.thinking') && <ThinkingDots />}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}; 