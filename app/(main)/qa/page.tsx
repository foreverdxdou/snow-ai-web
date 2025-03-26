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
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { qaService } from '@/app/services/qa';
import { knowledgeService } from '@/app/services/knowledge';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';
import type { KbChatHistory, QaRequest } from '@/app/types/qa';
import Cookies from 'js-cookie';

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
            if (kbs.length > 0) {
                setSelectedKbs(kbs.map(kb => kb.id));
            }
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
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    // 处理全选/取消全选
    const handleSelectAll = (checked: boolean) => {
        setSelectedKbs(checked ? knowledgeBases.map(kb => kb.id) : []);
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

    // 发送消息
    const handleSend = async () => {
        if (!question.trim()) return;

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
            const queryParams = selectedKbs.length > 0 ? `?kbIds=${selectedKbs[0]}` : '';
            const url = `${baseUrl}/${endpoint}${queryParams}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + Cookies.get('token'),
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let answer = '';

            if (!reader) {
                throw new Error('Failed to get response reader');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        try {
                            const data = JSON.parse(line.slice(5));
                            if (data.content) {
                                answer += data.content;
                                setChatHistory(prev => {
                                    const newHistory = [...prev];
                                    newHistory[newHistory.length - 1].answer = answer;
                                    return newHistory;
                                });
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e);
                        }
                    }
                }
            }

            setLoading(false);
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
                        startIcon={<CheckBoxIcon />}
                        onClick={() => handleSelectAll(true)}
                    >
                        {t('qa.selectAll')}
                    </Button>
                    <Button
                        size="small"
                        startIcon={<CheckBoxOutlineBlankIcon />}
                        onClick={() => handleSelectAll(false)}
                    >
                        {t('qa.unselectAll')}
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
                        <Paper
                            sx={{
                                p: 2,
                                maxWidth: '80%',
                                alignSelf: 'flex-end',
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                            }}
                        >
                            <Typography>{chat.question}</Typography>
                        </Paper>
                        <Paper
                            sx={{
                                p: 2,
                                maxWidth: '80%',
                                mt: 1,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Typography
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {chat.answer}
                            </Typography>
                        </Paper>
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