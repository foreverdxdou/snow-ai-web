'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
import { KnowledgeBaseSelector } from './components/KnowledgeBaseSelector';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

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
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 获取知识库列表
    const fetchKnowledgeBases = useCallback(async () => {
        try {
            if (isMountedRef.current) {
                const response = await knowledgeService.getUserKnowledgeBases();
                const kbs = response.data.data;
                if (Array.isArray(kbs)) {
                    // 过滤掉状态为0的知识库
                    const activeKbs = kbs.filter(kb => kb.status === 1);
                    setKnowledgeBases(activeKbs);
                    setSelectedKbs([]);
                } else {
                    setKnowledgeBases([]);
                    setSelectedKbs([]);
                }
            }
        } catch (error) {
            if (isMountedRef.current) {
                setSnackbar({
                    open: true,
                    message: t('knowledge.fetchError'),
                    severity: 'error',
                });
                setKnowledgeBases([]);
                setSelectedKbs([]);
            }
        }
    }, [t]);

    // 获取历史记录
    const fetchChatHistory = useCallback(async () => {
        try {
            const response = await qaService.getChatHistory(sessionId);
            if (isMountedRef.current) {
                setChatHistory(response.data.data.records);
                scrollToBottom();
            }
        } catch (error) {
            if (isMountedRef.current) {
                setSnackbar({
                    open: true,
                    message: t('qa.loadHistoryError'),
                    severity: 'error',
                });
            }
        }
    }, [sessionId, t]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchKnowledgeBases();
        return () => {
            isMountedRef.current = false;
            setKnowledgeBases([]);
            setSelectedKbs([]);
        };
    }, [fetchKnowledgeBases]);

    useEffect(() => {
        if (sessionId) {
            isMountedRef.current = true;
            fetchChatHistory();
            return () => {
                isMountedRef.current = false;
                setChatHistory([]);
            };
        }
    }, [sessionId, fetchChatHistory]);

    // 使用 useCallback 优化中断会话处理
    const handleAbort = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setLoading(false);
        }
    }, []);

    // 使用 useCallback 优化聊天历史更新
    const updateChatHistory = useCallback((answer: string) => {
        if (isMountedRef.current) {
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].answer = answer;
                return newHistory;
            });
        }
    }, []);

    // 使用 useCallback 优化滚动处理
    const scrollToBottom = useCallback(() => {
        if (chatBoxRef.current) {
            const timeoutId = setTimeout(() => {
                if (chatBoxRef.current) {
                    chatBoxRef.current.scrollTo({
                        top: chatBoxRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, []);

    // 发送消息
    const handleSend = useCallback(async () => {
        if (!question.trim() || loading) return;

        handleAbort();

        setLoading(true);
        const questionText = question;
        setQuestion('');

        abortControllerRef.current = new AbortController();

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

        if (isMountedRef.current) {
            setChatHistory(prev => [...prev, newQuestion]);
        }
        scrollToBottom();

        try {
            const requestData: QaRequest = {
                question: questionText,
                sessionId,
                temperature: 0.7,
                maxTokens: 2000
            };

            const baseUrl = '/api/v1/kb/qa';
            const endpoint = selectedKbs.length > 0 ? 'chat/stream' : 'general/stream';
            const queryParams = selectedKbs.length > 0 ? `?kbIds=${selectedKbs}` : '';
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
                signal: abortControllerRef.current.signal,
                onmessage(ev) {
                    if (!isMountedRef.current) return;
                    
                    if (ev.event === 'done' || ev.event === 'complete') {
                        setLoading(false);
                        abortControllerRef.current = null;
                        return;
                    }
                    const data = ev.data;
                    answer += data;
                    updateChatHistory(answer);
                    scrollToBottom();
                },
                onclose() {
                    if (isMountedRef.current) {
                        setLoading(false);
                        abortControllerRef.current = null;
                    }
                },
                onerror(err) {
                    if (!isMountedRef.current) return;
                    
                    if (err.name === 'AbortError') {
                        return;
                    }
                    setSnackbar({
                        open: true,
                        message: t('qa.systemError'),
                        severity: 'error',
                    });
                    setLoading(false);
                    abortControllerRef.current = null;
                    throw err;
                },
            });
        } catch (error) {
            if (!isMountedRef.current) return;
            
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            setSnackbar({
                open: true,
                message: t('qa.systemError'),
                severity: 'error',
            });
            setLoading(false);
            abortControllerRef.current = null;
        }
    }, [question, loading, sessionId, selectedKbs, t, handleAbort, scrollToBottom, updateChatHistory]);

    // 使用 useCallback 优化按键事件处理
    const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    // 使用 useCallback 优化清空历史记录处理
    const handleClearHistory = useCallback(async () => {
        if (!window.confirm(t('qa.clearHistoryConfirm'))) return;
        try {
            await qaService.clearChatHistory(sessionId);
            if (isMountedRef.current) {
                setChatHistory([]);
                setSnackbar({
                    open: true,
                    message: t('qa.clearHistorySuccess'),
                    severity: 'success',
                });
            }
        } catch (error) {
            console.error('清空历史记录失败:', error);
            if (isMountedRef.current) {
                setSnackbar({
                    open: true,
                    message: t('qa.clearHistoryError'),
                    severity: 'error',
                });
            }
        }
    }, [sessionId, t]);

    // 使用 useCallback 优化 Snackbar 关闭处理
    const handleSnackbarClose = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    // 处理全选/取消全选
    const handleSelectAll = useCallback(() => {
        setSelectedKbs(prev =>
            prev.length === knowledgeBases.length ? [] : knowledgeBases.map(kb => kb.id)
        );
    }, [knowledgeBases]);

    // 处理单个知识库选择
    const handleKbSelect = useCallback((id: number, checked: boolean) => {
        setSelectedKbs(prev =>
            checked ? [...prev, id] : prev.filter(kbId => kbId !== id)
        );
    }, []);

    // 使用 useCallback 优化问题输入处理
    const handleQuestionChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(event.target.value);
    }, []);

    // 在组件卸载时清理
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            handleAbort();
            setChatHistory([]);
            setKnowledgeBases([]);
            setSelectedKbs([]);
            setQuestion('');
            setLoading(false);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [handleAbort]);

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

                <KnowledgeBaseSelector
                    knowledgeBases={knowledgeBases}
                    selectedKbs={selectedKbs}
                    onSelectAll={handleSelectAll}
                    onSelectKb={handleKbSelect}
                />
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
                    <ChatMessage key={index} chat={chat} />
                ))}
            </Box>

            <Box sx={{
                p: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}>
                <ChatInput
                    question={question}
                    loading={loading}
                    onQuestionChange={handleQuestionChange}
                    onKeyPress={handleKeyPress}
                    onSend={handleSend}
                    onAbort={handleAbort}
                />
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
} 