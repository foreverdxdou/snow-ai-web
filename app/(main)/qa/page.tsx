'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { useDebouncedCallback } from '@/app/utils/performance';

// 使用 React.memo 优化消息组件
const ChatMessage = React.memo(({ 
    chat, 
    isUser 
}: { 
    chat: KbChatHistory; 
    isUser: boolean;
}) => (
    <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', mb: 2 }}>
        <Paper
            sx={{
                maxWidth: '85%',
                p: 2,
                bgcolor: isUser ? 'primary.main' : 'background.paper',
                color: isUser ? 'primary.contrastText' : 'text.primary',
                borderRadius: isUser ? '12px 12px 0 12px' : '12px 12px 12px 0',
                ...(isUser ? {} : markdownStyles),
            }}
        >
            {isUser ? (
                <Typography>{chat.question}</Typography>
            ) : (
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
            )}
        </Paper>
    </Box>
));

ChatMessage.displayName = 'ChatMessage';

// 使用 React.memo 优化知识库选择组件
const KnowledgeBaseSelector = React.memo(({ 
    knowledgeBases, 
    selectedKbs, 
    onSelectAll, 
    onKbSelect 
}: { 
    knowledgeBases: KnowledgeBaseVO[];
    selectedKbs: number[];
    onSelectAll: () => void;
    onKbSelect: (id: number, checked: boolean) => void;
}) => (
    <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1">
                选择知识库:
            </Typography>
            <Button
                size="small"
                startIcon={selectedKbs.length === knowledgeBases.length ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                onClick={onSelectAll}
            >
                {selectedKbs.length === knowledgeBases.length ? '取消全选' : '全选'}
            </Button>
        </Box>

        <FormGroup row sx={{ mt: 1 }}>
            {knowledgeBases.map((kb) => (
                <FormControlLabel
                    key={kb.id}
                    control={
                        <Checkbox
                            checked={selectedKbs.includes(kb.id)}
                            onChange={(e) => onKbSelect(kb.id, e.target.checked)}
                        />
                    }
                    label={kb.name}
                />
            ))}
        </FormGroup>
    </Box>
));

KnowledgeBaseSelector.displayName = 'KnowledgeBaseSelector';

const markdownStyles = {
    '& .markdown-body': {
        '& pre': {
            position: 'relative',
            '&:hover .copy-button': {
                opacity: 1,
            },
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

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 使用 useCallback 优化函数
    const fetchKnowledgeBases = useCallback(async () => {
        try {
            const response = await knowledgeService.getList({
                current: 1,
                size: 100
            });
            const kbs = response.data.data.records;
            setKnowledgeBases(kbs);
            setSelectedKbs([]);
        } catch (error) {
            console.error('获取知识库列表失败:', error);
        }
    }, []);

    const fetchChatHistory = useCallback(async () => {
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
    }, [sessionId, t]);

    useEffect(() => {
        fetchKnowledgeBases();
    }, [fetchKnowledgeBases]);

    useEffect(() => {
        if (sessionId) {
            fetchChatHistory();
        }
    }, [sessionId, fetchChatHistory]);

    const scrollToBottom = useCallback(() => {
        if (chatBoxRef.current) {
            setTimeout(() => {
                chatBoxRef.current?.scrollTo({
                    top: chatBoxRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, []);

    const handleSelectAll = useCallback(() => {
        setSelectedKbs(prev =>
            prev.length === knowledgeBases.length ? [] : knowledgeBases.map(kb => kb.id)
        );
    }, [knowledgeBases]);

    const handleKbSelect = useCallback((id: number, checked: boolean) => {
        setSelectedKbs(prev =>
            checked ? [...prev, id] : prev.filter(kbId => kbId !== id)
        );
    }, []);

    const handleClearHistory = useCallback(async () => {
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
    }, [sessionId, t]);

    const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }, []);

    const handleAbort = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setLoading(false);
        }
    }, []);

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
        setChatHistory(prev => [...prev, newQuestion]);
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
                    if (ev.event === 'done' || ev.event === 'complete') {
                        setLoading(false);
                        abortControllerRef.current = null;
                        return;
                    }
                    const data = ev.data;
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
                    abortControllerRef.current = null;
                },
                onerror(err) {
                    if (err.name === 'AbortError') {
                        return;
                    }
                    console.error('Stream error:', err);
                    setSnackbar({
                        open: true,
                        message: t('qa.systemError'),
                        severity: 'error',
                    });
                    setLoading(false);
                    abortControllerRef.current = null;
                    throw err;
                }
            });
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            console.error('发送消息失败:', error);
            setSnackbar({
                open: true,
                message: t('qa.systemError'),
                severity: 'error',
            });
            setLoading(false);
            abortControllerRef.current = null;
        }
    }, [question, loading, sessionId, selectedKbs, t, handleAbort, scrollToBottom]);

    useEffect(() => {
        return () => {
            handleAbort();
        };
    }, [handleAbort]);

    // 使用 useMemo 优化计算属性
    const isAllSelected = useMemo(() => 
        selectedKbs.length === knowledgeBases.length && knowledgeBases.length > 0,
        [selectedKbs.length, knowledgeBases.length]
    );

    return (
        <PerformanceLayout>
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
                        onKbSelect={handleKbSelect}
                    />

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
                            <ChatMessage chat={chat} isUser={true} />
                            <ChatMessage chat={chat} isUser={false} />
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
                            onClick={loading ? handleAbort : handleSend}
                            disabled={!question.trim() && !loading}
                            title={loading ? t('qa.clickToStop') : t('qa.send')}
                            sx={{
                                alignSelf: 'flex-end',
                                width: 56,
                                height: 56,
                                bgcolor: loading ? 'error.main' : 'primary.main',
                                color: 'primary.contrastText',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: loading ? 'error.dark' : 'primary.dark',
                                    transform: loading ? 'rotate(90deg)' : 'none',
                                },
                                '&.Mui-disabled': {
                                    bgcolor: 'action.disabledBackground',
                                    color: 'action.disabled',
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
                                                },
                                                '100%': {
                                                    opacity: 1,
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
        </PerformanceLayout>
    );
} 