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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import {
    Send as SendIcon,
    Delete as DeleteIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    ContentCopy as ContentCopyIcon,
    Add as AddIcon,
    DeleteOutline as DeleteOutlineIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { qaService } from '@/app/services/qa';
import { knowledgeService } from '@/app/services/knowledge';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import type { KbChatHistory, QaRequest } from '@/app/types/qa';
import Cookies from 'js-cookie';
import 'highlight.js/styles/github-dark.css';
import { Theme } from '@mui/material/styles';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { KnowledgeBaseSelector } from './components/KnowledgeBaseSelector';
import { ChatMessage, ThinkingDots } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { llmService } from '@/app/services/llm';
import type { LlmConfig } from '@/app/types/llm';
import { format, isToday, isWithinInterval, subDays } from 'date-fns';

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

// 添加分组函数
const groupChatHistory = (history: KbChatHistory[]) => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    const thirtyDaysAgo = subDays(today, 30);

    return history.reduce((groups, chat) => {
        const chatDate = new Date(chat.createTime);
        
        if (isToday(chatDate)) {
            if (!groups.today) groups.today = [];
            groups.today.push(chat);
        } else if (isWithinInterval(chatDate, { start: sevenDaysAgo, end: today })) {
            if (!groups.lastSevenDays) groups.lastSevenDays = [];
            groups.lastSevenDays.push(chat);
        } else if (isWithinInterval(chatDate, { start: thirtyDaysAgo, end: sevenDaysAgo })) {
            if (!groups.lastThirtyDays) groups.lastThirtyDays = [];
            groups.lastThirtyDays.push(chat);
        } else {
            if (!groups.earlier) groups.earlier = [];
            groups.earlier.push(chat);
        }
        
        return groups;
    }, {} as Record<string, KbChatHistory[]>);
};

export default function QaPage() {
    const { t } = useTranslation();
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseVO[]>([]);
    const [selectedKbs, setSelectedKbs] = useState<number[]>([]);
    const [llmModels, setLlmModels] = useState<LlmConfig[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState<KbChatHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [sessionId, setSessionId] = useState(uuidv4());
    const [userChatHistory, setUserChatHistory] = useState<KbChatHistory[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string>('');
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        sessionId: string;
    }>({
        open: false,
        sessionId: '',
    });

    const [clearHistoryDialog, setClearHistoryDialog] = useState<{
        open: boolean;
    }>({
        open: false,
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

    // 获取可用的大模型配置
    const fetchLlmModels = useCallback(async () => {
        try {
            if (isMountedRef.current) {
                const response = await llmService.getEnabledLlmConfig();
                if (response.data.code === 200 && response.data.data) {
                    setLlmModels(response.data.data);
                }
            }
        } catch (error) {
            console.error('获取大模型配置失败:', error);
        }
    }, []);

    // 获取用户对话历史列表
    const fetchUserChatHistory = useCallback(async () => {
        try {
            const response = await qaService.getUserChatHistory();
            if (isMountedRef.current) {
                setUserChatHistory(response.data.data);
            }
        } catch (error) {
            console.error('获取用户对话历史失败:', error);
            if (isMountedRef.current) {
                setSnackbar({
                    open: true,
                    message: t('qa.loadHistoryError'),
                    severity: 'error',
                });
            }
        }
    }, [t]);

    // 使用 useCallback 优化中断会话处理
    const handleAbort = useCallback(() => {
        if (abortControllerRef.current) {
            console.log('正在中断连接...');
            // 使用 signal 中断连接
            abortControllerRef.current.abort();
            // 等待连接完全中断后再清理
            setTimeout(async () => {
                abortControllerRef.current = null;
                setLoading(false);
                
                // 重新获取聊天历史
                try {
                    const sid = selectedSessionId || sessionId;
                    const response = await qaService.getChatHistory(sid);
                    if (isMountedRef.current) {
                        setChatHistory(response.data.data.records);
                        // 使用setTimeout确保在状态更新后滚动
                        setTimeout(() => {
                            if (chatBoxRef.current) {
                                chatBoxRef.current.scrollTo({
                                    top: chatBoxRef.current.scrollHeight,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                    }
                } catch (error) {
                    console.error('获取聊天历史失败:', error);
                    if (isMountedRef.current) {
                        setSnackbar({
                            open: true,
                            message: t('qa.loadHistoryError'),
                            severity: 'error',
                        });
                    }
                }
            }, 100);
        }
    }, [selectedSessionId, sessionId, t]);

    // 使用 useCallback 优化聊天历史更新
    const updateChatHistory = useCallback((answer: string, isStreaming: boolean) => {
        if (isMountedRef.current) {
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].answer = answer;
                newHistory[newHistory.length - 1].isStreaming = isStreaming;
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

        // 只有在已经有连接的情况下才中断
        if (abortControllerRef.current) {
            handleAbort();
            // 等待之前的连接完全中断
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        setLoading(true);
        const questionText = question;
        setQuestion('');

        // 创建新的 AbortController
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const newQuestion: KbChatHistory = {
            id: Date.now(),
            sessionId: selectedSessionId || sessionId,
            requestId: uuidv4(),
            kbIds: selectedKbs.join(','),
            userId: 0,
            question: questionText,
            answer: 'THINKING_DOTS',
            tokensUsed: 0,
            processTime: 0,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
            isStop: 0,
        };

        if (isMountedRef.current) {
            setChatHistory(prev => [...prev, newQuestion]);
        }
        scrollToBottom();

        try {
            const requestData: QaRequest = {
                question: questionText,
                sessionId: selectedSessionId || sessionId,
                requestId: uuidv4(),
                temperature: 0.7,
                maxTokens: 2000,
                ...(selectedModel && { llmId: selectedModel })
            };

            const baseUrl = '/api/v1/kb/qa';
            const endpoint = selectedKbs.length > 0 ? 'chat/stream' : 'general/stream';
            const queryParams = selectedKbs.length > 0 ? `?kbIds=${selectedKbs}` : '';
            const url = `${baseUrl}/${endpoint}${queryParams}`;

            let answer = '';

            console.log('准备建立连接:', url);
            try {
                await fetchEventSource(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                        'Accept-Encoding': 'identity',
                        'X-Accept-Encoding-Override': 'identity',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive'
                    },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                    openWhenHidden: true,
                    async onopen(response: Response) {
                        console.log('连接已打开，状态:', response.status);
                        if (response.ok && response.status === 200) {
                            console.log('连接成功建立');
                        } else {
                            console.error('连接打开但状态异常:', response.status);
                            throw new Error(`Failed to open connection: ${response.status}`);
                        }
                    },
                    onmessage(ev) {
                        if (!isMountedRef.current) return;
                        
                        if (ev.event === 'done' || ev.event === 'complete') {
                            console.log('收到完成消息');
                            setLoading(false);
                            return;
                        }
                        
                        try {
                            const data = ev.data;
                            if (data) {
                                answer += data;
                                updateChatHistory(answer, true);
                                scrollToBottom();
                            }
                        } catch (error) {
                            console.error('处理消息数据时出错:', error);
                        }
                    },
                    onclose() {
                        console.log('连接关闭，当前answer长度:', answer.length);
                        if (!isMountedRef.current) return;
                        
                        setLoading(false);
                    },
                    onerror(err) {
                        console.error('连接错误:', err);
                        if (!isMountedRef.current) return;
                        
                        if (err.name === 'AbortError') {
                            console.log('连接被手动中断');
                            return;
                        }
                        
                        setSnackbar({
                            open: true,
                            message: t('qa.systemError'),
                            severity: 'error',
                        });
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error('fetchEventSource 执行出错:', error);
                throw error;
            }
        } catch (error) {
            console.error('整体请求异常:', error);
            if (!isMountedRef.current) return;
            
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('请求被中断');
                return;
            }
            
            setSnackbar({
                open: true,
                message: t('qa.systemError'),
                severity: 'error',
            });
            setLoading(false);
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    }, [question, loading, sessionId, selectedKbs, selectedModel, t, handleAbort, scrollToBottom, updateChatHistory, selectedSessionId]);

    // 使用 useCallback 优化按键事件处理
    const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    // 使用 useCallback 优化清空历史记录处理
    const handleClearHistory = useCallback(() => {
        setClearHistoryDialog({
            open: true,
        });
    }, []);

    // 确认清空历史记录
    const handleConfirmClearHistory = useCallback(async () => {
        try {
            await qaService.clearChatHistoryByUser();
            if (isMountedRef.current) {
                setChatHistory([]);
                setSnackbar({
                    open: true,
                    message: t('qa.clearHistorySuccess'),
                    severity: 'success',
                });
                // 重新获取会话列表
                fetchUserChatHistory();
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
        } finally {
            setClearHistoryDialog({ open: false });
        }
    }, [t, fetchUserChatHistory]);

    // 取消清空历史记录
    const handleCancelClearHistory = useCallback(() => {
        setClearHistoryDialog({ open: false });
    }, []);

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

    // 处理选择历史会话
    const handleSelectSession = useCallback(async (sid: string) => {
        setSelectedSessionId(sid);
        setSessionId(sid);
        try {
            const response = await qaService.getChatHistory(sid);
            if (isMountedRef.current) {
                setChatHistory(response.data.data.records);
                scrollToBottom();
            }
        } catch (error) {
            console.error('获取对话历史失败:', error);
            if (isMountedRef.current) {
                setSnackbar({
                    open: true,
                    message: t('qa.loadHistoryError'),
                    severity: 'error',
                });
            }
        }
    }, [t, scrollToBottom]);

    // 开始新对话
    const handleNewChat = useCallback(() => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        setSelectedSessionId(newSessionId);
        setChatHistory([]);
    }, []);

    // 处理删除单个会话
    const handleDeleteSession = useCallback(async (sid: string, event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止事件冒泡，避免触发会话选择
        setDeleteDialog({
            open: true,
            sessionId: sid,
        });
    }, []);

    // 确认删除会话
    const handleConfirmDelete = useCallback(async () => {
        const sid = deleteDialog.sessionId;
        try {
            await qaService.clearChatHistory(sid);
            if (isMountedRef.current) {
                if (sid === sessionId) {
                    setChatHistory([]);
                }
                setSnackbar({
                    open: true,
                    message: t('qa.deleteHistorySuccess'),
                    severity: 'success',
                });
                // 重新获取会话列表
                fetchUserChatHistory();
            }
        } catch (error) {
            console.error('删除会话失败:', error);
            if (isMountedRef.current) {
                setSnackbar({
                    open: true,
                    message: t('qa.deleteHistoryError'),
                    severity: 'error',
                });
            }
        } finally {
            setDeleteDialog({ open: false, sessionId: '' });
        }
    }, [deleteDialog.sessionId, sessionId, t, fetchUserChatHistory]);

    // 取消删除
    const handleCancelDelete = useCallback(() => {
        setDeleteDialog({ open: false, sessionId: '' });
    }, []);

    // 初始化加载
    useEffect(() => {
        isMountedRef.current = true;
        setInitialLoading(true);

        const initializeData = async () => {
            try {
                await Promise.all([
                    fetchKnowledgeBases(),
                    fetchChatHistory(),
                    fetchLlmModels(),
                    fetchUserChatHistory(),
                ]);
            } catch (error) {
                if (isMountedRef.current) {
                    setSnackbar({
                        open: true,
                        message: t('qa.loadError'),
                        severity: 'error',
                    });
                }
            } finally {
                if (isMountedRef.current) {
                    setInitialLoading(false);
                }
            }
        };

        initializeData();

        return () => {
            isMountedRef.current = false;
            setKnowledgeBases([]);
            setSelectedKbs([]);
            setChatHistory([]);
            setLlmModels([]);
            setSelectedModel('');
            setInitialLoading(false);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [fetchKnowledgeBases, fetchChatHistory, fetchLlmModels, fetchUserChatHistory, t]);

    return (
        <Box sx={{ height: '100%', display: 'flex' }}>
            {/* 左侧对话历史面板 */}
            <Box sx={{
                width: 260,
                borderRight: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleNewChat}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 1,
                            },
                        }}
                    >
                        {t('qa.newChat')}
                    </Button>
                </Box>
                <List sx={{
                    flex: 1,
                    overflow: 'auto',
                    py: 0,
                    '&::-webkit-scrollbar': {
                        width: 4,
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: (theme) => theme.palette.mode === 'dark' ? '#555' : '#ddd',
                        borderRadius: 2,
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: (theme) => theme.palette.mode === 'dark' ? '#666' : '#bbb',
                    },
                }}>
                    {userChatHistory.length === 0 ? (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            p: 3,
                            color: 'text.secondary',
                        }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                {t('qa.noHistory')}
                            </Typography>
                            <Typography variant="caption" sx={{ textAlign: 'center' }}>
                                点击"新对话"开始聊天
                            </Typography>
                        </Box>
                    ) : (
                        Object.entries(groupChatHistory(userChatHistory)).map(([group, chats]) => (
                            <Box key={group}>
                                <ListItem
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                        bgcolor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(0, 0, 0, 0.8)'
                                                : 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            opacity: 0.8,
                                        }}
                                    >
                                        {t(`qa.${group}`)}
                                    </Typography>
                                </ListItem>
                                {chats.map((chat) => (
                                    <ListItemButton
                                        key={chat.sessionId}
                                        selected={chat.sessionId === selectedSessionId}
                                        onClick={() => handleSelectSession(chat.sessionId)}
                                        sx={{
                                            py: 1.5,
                                            px: 2,
                                            minHeight: 48,
                                            transition: 'all 0.2s ease',
                                            borderLeft: '2px solid',
                                            borderLeftColor: chat.sessionId === selectedSessionId ? 'primary.main' : 'transparent',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: chat.sessionId === selectedSessionId ? '8px' : '2px',
                                                right: 2,
                                                height: '1px',
                                                bgcolor: 'divider',
                                                opacity: 0.5,
                                            },
                                            '&.Mui-selected': {
                                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                                    ? 'rgba(144, 202, 249, 0.08)' 
                                                    : 'rgba(33, 150, 243, 0.08)',
                                                '&:hover': {
                                                    bgcolor: (theme) => theme.palette.mode === 'dark'
                                                        ? 'rgba(144, 202, 249, 0.12)'
                                                        : 'rgba(33, 150, 243, 0.12)',
                                                },
                                                '& .delete-button': {
                                                    opacity: 1,
                                                },
                                            },
                                            '&:hover': {
                                                bgcolor: (theme) => theme.palette.mode === 'dark'
                                                    ? 'rgba(255, 255, 255, 0.05)'
                                                    : 'rgba(0, 0, 0, 0.04)',
                                                '& .delete-button': {
                                                    opacity: 1,
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={chat.question}
                                            primaryTypographyProps={{
                                                noWrap: true,
                                                sx: { 
                                                    fontWeight: chat.sessionId === selectedSessionId ? 500 : 400,
                                                    fontSize: '0.875rem',
                                                    color: chat.sessionId === selectedSessionId ? 'primary.main' : 'text.primary',
                                                    opacity: chat.sessionId === selectedSessionId ? 1 : 0.85,
                                                    pr: 4, // 为删除按钮留出空间
                                                }
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            className="delete-button"
                                            onClick={(e) => handleDeleteSession(chat.sessionId, e)}
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                opacity: 0,
                                                transition: 'opacity 0.2s ease',
                                                color: 'text.secondary',
                                                p: 0.5,
                                                '&:hover': {
                                                    color: 'error.main',
                                                    bgcolor: (theme) => theme.palette.mode === 'dark'
                                                        ? 'rgba(244, 67, 54, 0.08)'
                                                        : 'rgba(244, 67, 54, 0.04)',
                                                },
                                            }}
                                        >
                                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </ListItemButton>
                                ))}
                            </Box>
                        ))
                    )}
                </List>
            </Box>

            {/* 右侧聊天面板 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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

                    {initialLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <KnowledgeBaseSelector
                                knowledgeBases={knowledgeBases}
                                selectedKbs={selectedKbs}
                                onSelectAll={handleSelectAll}
                                onSelectKb={handleKbSelect}
                            />
                        </Box>
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
                    {initialLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        chatHistory.map((chat, index) => (
                            <ChatMessage 
                                key={index} 
                                chat={chat} 
                                onRegenerate={() => {
                                    // 保存当前问题
                                    const originalQuestion = question;
                                    // 设置问题为原始问题
                                    setQuestion(chat.question);
                                    // 使用 setTimeout 确保问题已设置后再调用 handleSend
                                    setTimeout(() => {
                                        handleSend();
                                        // 恢复原始问题
                                        setTimeout(() => {
                                            setQuestion(originalQuestion);
                                        }, 100);
                                    }, 0);
                                }}
                                onDelete={() => handleSelectSession(chat.sessionId)}
                            />
                        ))
                    )}
                </Box>

                <Box sx={{
                    p: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl size="small" sx={{ alignSelf: 'flex-start', width: 200 }}>
                            <InputLabel id="model-select-label">{t('qa.selectModel')}</InputLabel>
                            <Select
                                labelId="model-select-label"
                                value={selectedModel}
                                label={t('qa.selectModel')}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                sx={{
                                    bgcolor: 'background.paper',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'divider',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <MenuItem value="">
                                    <em>{t('qa.noModelSelected')}</em>
                                </MenuItem>
                                {llmModels.map((model) => (
                                    <MenuItem key={model.id} value={model.id}>
                                        {model.modelName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <ChatInput
                            question={question}
                            loading={loading}
                            onQuestionChange={handleQuestionChange}
                            onKeyPress={handleKeyPress}
                            onSend={handleSend}
                            onAbort={handleAbort}
                        />
                    </Box>
                </Box>
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
                    {t('qa.deleteHistoryConfirm')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                    }}>
                        此操作将永久删除该对话，是否继续？
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

            {/* 清空历史记录确认对话框 */}
            <Dialog
                open={clearHistoryDialog.open}
                onClose={handleCancelClearHistory}
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
                    {t('qa.clearHistoryConfirm')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                    }}>
                        此操作将永久删除所有对话，是否继续？
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleCancelClearHistory}
                        variant="outlined"
                        sx={{
                            minWidth: 80,
                            fontWeight: 500,
                        }}
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleConfirmClearHistory}
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
        </Box>
    );
} 