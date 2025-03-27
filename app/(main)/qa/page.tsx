'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    IconButton,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Tooltip,
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import {
    Send as SendIcon,
    Delete as DeleteIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { qaService } from '@/app/services/qa';
import { knowledgeService } from '@/app/services/knowledge';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import type { KbChatHistory, QaRequest } from '@/app/types/qa';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Theme } from '@mui/material/styles';
import { fetchEventSource } from '@microsoft/fetch-event-source';

// 添加自定义样式
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

export default function QaPage() {
    const { t } = useTranslation();
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseVO[]>([]);
    const [selectedKbs, setSelectedKbs] = useState<number[]>([]);
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState<KbChatHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(uuidv4());
    const chatBoxRef = useRef<HTMLDivElement>(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 获取知识库列表
    const fetchKnowledgeBases = async () => {
        try {
            const response = await knowledgeService.getList({
                current: 1,
                size: 100
            });
            const kbs = response.data.data.records;
            setKnowledgeBases(kbs);
            // 默认不全选
            setSelectedKbs([]);
        } catch (error) {
            console.error('获取知识库列表失败:', error);
        }
    };

    // 获取历史记录
    const fetchChatHistory = async () => {
        try {
            const response = await qaService.getChatHistory(sessionId);
            setChatHistory(response.data.data.records);
            scrollToBottom();
        } catch (error) {
            console.error('获取历史记录失败:', error);
            setSnackbar({
                open: true,
                message: t('qa.loadHistoryError'),
                severity: 'error',
            });
        }
    };

    useEffect(() => {
        fetchKnowledgeBases();
    }, []);

    useEffect(() => {
        if (sessionId) {
            fetchChatHistory();
        }
    }, [sessionId]);

    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            setTimeout(() => {
                chatBoxRef.current?.scrollTo({
                    top: chatBoxRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100); // 给一点时间让 markdown 渲染完成
        }
    };

    // 处理全选/取消全选
    const handleSelectAll = () => {
        setSelectedKbs(prev =>
            prev.length === knowledgeBases.length ? [] : knowledgeBases.map(kb => kb.id)
        );
    };

    // 处理单个知识库选择
    const handleKbSelect = (id: number, checked: boolean) => {
        setSelectedKbs(prev =>
            checked ? [...prev, id] : prev.filter(kbId => kbId !== id)
        );
    };

    // 清空历史记录
    const handleClearHistory = async () => {
        if (!window.confirm(t('qa.clearHistoryConfirm'))) return;
        try {
            await qaService.clearChatHistory(sessionId);
            setChatHistory([]);
            setSnackbar({
                open: true,
                message: t('qa.clearHistorySuccess'),
                severity: 'success',
            });
        } catch (error) {
            console.error('清空历史记录失败:', error);
            setSnackbar({
                open: true,
                message: t('qa.clearHistoryError'),
                severity: 'error',
            });
        }
    };

    // 处理按键事件
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    // 发送消息
    const handleSend = async () => {
        if (!question.trim() || loading) return;

        setLoading(true);
        const questionText = question;
        setQuestion('');

        // 添加用户问题到历史记录
        const newQuestion: KbChatHistory = {
            id: Date.now(),
            sessionId,
            kbId: selectedKbs[0] || 0,
            userId: 0,
            question: questionText,
            answer: t('qa.thinking'),
            tokensUsed: 0,
            processTime: 0,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
        };
        setChatHistory(prev => [...prev, newQuestion]);
        scrollToBottom();

        try {
            const requestData: QaRequest = {
                question: questionText,
                sessionId,
                temperature: 0.7,
                maxTokens: 2000
            };

            // 构建请求 URL 和参数
            const baseUrl = '/api/v1/kb/qa';
            const endpoint = selectedKbs.length > 0 ? 'chat/stream' : 'general/stream';
            const queryParams = selectedKbs.length > 0 ? `?kbId=${selectedKbs[0]}` : '';
            const url = `${baseUrl}/${endpoint}${queryParams}`;

            let answer = '';

            await fetchEventSource(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Accept-Encoding': 'identity',
                    'X-Accept-Encoding-Override': 'identity'
                },
                body: JSON.stringify(requestData),
                onmessage(ev) {
                    if (ev.event === 'done' || ev.event === 'complete') {
                        setLoading(false);
                        return;
                    }
                    const data = ev.data.trim();
                    if (data === '[DONE]') {
                        setLoading(false);
                        return;
                    }
                    answer += data;
                    setChatHistory(prev => {
                        const newHistory = [...prev];
                        newHistory[newHistory.length - 1].answer = answer;
                        return newHistory;
                    });
                    scrollToBottom();
                },
                onclose() {
                    setLoading(false);
                },
                onerror(err) {
                    console.error('Stream error:', err);
                    setSnackbar({
                        open: true,
                        message: t('qa.systemError'),
                        severity: 'error',
                    });
                    setLoading(false);
                    throw err;
                },
            });
        } catch (error) {
            console.error('发送消息失败:', error);
            setSnackbar({
                open: true,
                message: t('qa.systemError'),
                severity: 'error',
            });
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {t('qa.title')}
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleClearHistory}
                    >
                        {t('qa.clearHistory')}
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1">
                        {t('qa.selectKb')}:
                    </Typography>
                    <Button
                        size="small"
                        startIcon={selectedKbs.length === knowledgeBases.length ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                        onClick={handleSelectAll}
                    >
                        {t('qa.selectAll')}
                    </Button>
                </Box>

                <FormGroup row sx={{ mt: 1 }}>
                    {knowledgeBases.map((kb) => (
                        <FormControlLabel
                            key={kb.id}
                            control={
                                <Checkbox
                                    checked={selectedKbs.includes(kb.id)}
                                    onChange={(e) => handleKbSelect(kb.id, e.target.checked)}
                                />
                            }
                            label={kb.name}
                        />
                    ))}
                </FormGroup>

                {selectedKbs.length === 0 && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                        {t('qa.noKbSelected')}
                    </Alert>
                )}
            </Box>

            <Box
                ref={chatBoxRef}
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {chatHistory.map((chat, index) => (
                    <Box key={index}>
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
                                sx={{
                                    maxWidth: '85%',
                                    p: 2,
                                    borderRadius: '12px 12px 12px 0',
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
                                                                transition: 'opacity 0.2s',
                                                                '&:hover': {
                                                                    bgcolor: 'action.hover',
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
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Box sx={{
                p: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('qa.inputPlaceholder')}
                        disabled={loading}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSend}
                        disabled={!question.trim() || loading}
                        sx={{
                            alignSelf: 'flex-end',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                            '&.Mui-disabled': {
                                bgcolor: 'action.disabledBackground',
                                color: 'action.disabled',
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <SendIcon />
                        )}
                    </IconButton>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
} 