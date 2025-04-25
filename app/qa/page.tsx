"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fab,
  Collapse,
  Menu,
} from "@mui/material";
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  ContentCopy as ContentCopyIcon,
  Add as AddIcon,
  DeleteOutline as DeleteOutlineIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ArrowUpward as ArrowUpwardIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Folder as FolderIcon,
  ClearAll as ClearAllIcon,
  Stop as StopIcon,
  DataObject as DataObjectIcon,
  Storage as StorageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { qaService } from "@/app/services/qa";
import { knowledgeService } from "@/app/services/knowledge";
import type { KnowledgeBaseVO } from "@/app/types/knowledge";
import type { KbChatHistory, QaRequest } from "@/app/types/qa";
import Cookies from "js-cookie";
import "highlight.js/styles/github-dark.css";
import { Theme } from "@mui/material/styles";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ChatMessage } from "./components/ChatMessage";
import { llmService } from "@/app/services/llm";
import type { LlmConfig } from "@/app/types/llm";
import { isToday, isWithinInterval, subDays } from "date-fns";
import { UserInfo } from "@/app/components/UserInfo";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

// 添加自定义样式
const markdownStyles = {
  "& .markdown-body": {
    color: "text.primary",
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      mt: 2,
      mb: 1,
      fontWeight: 600,
      lineHeight: 1.25,
    },
    "& h1": { fontSize: "2em" },
    "& h2": { fontSize: "1.5em" },
    "& h3": { fontSize: "1.25em" },
    "& h4": { fontSize: "1em" },
    "& h5": { fontSize: "0.875em" },
    "& h6": { fontSize: "0.85em" },
    "& p": {
      mt: 0,
      mb: 2,
      lineHeight: 1.6,
    },
    "& a": {
      color: "primary.main",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      display: "block",
      margin: "1em 0",
    },
    "& pre": {
      mt: 2,
      mb: 2,
      p: 2,
      borderRadius: 1,
      bgcolor: (theme: Theme) =>
        theme.palette.mode === "dark" ? "grey.900" : "grey.100",
      overflow: "auto",
      "& code": {
        color: "inherit",
        fontSize: "0.875rem",
        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
      },
    },
    "& code": {
      color: "primary.main",
      fontSize: "0.875rem",
      fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
      p: 0.5,
      borderRadius: 0.5,
      bgcolor: (theme: Theme) =>
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)",
    },
    "& blockquote": {
      m: 0,
      mt: 2,
      mb: 2,
      pl: 2,
      borderLeft: "4px solid",
      borderColor: "primary.main",
      color: "text.secondary",
      fontStyle: "italic",
    },
    "& table": {
      width: "100%",
      mt: 2,
      mb: 2,
      borderCollapse: "collapse",
      "& th, & td": {
        p: 1,
        border: "1px solid",
        borderColor: "divider",
      },
      "& th": {
        fontWeight: 600,
        bgcolor: (theme: Theme) =>
          theme.palette.mode === "dark" ? "grey.900" : "grey.100",
      },
    },
    "& ul, & ol": {
      mt: 0,
      mb: 2,
      pl: 3,
      "& li": {
        mb: 0.5,
      },
    },
    "& hr": {
      my: 2,
      border: "none",
      borderTop: "1px solid",
      borderColor: "divider",
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
    } else if (
      isWithinInterval(chatDate, { start: sevenDaysAgo, end: today })
    ) {
      if (!groups.lastSevenDays) groups.lastSevenDays = [];
      groups.lastSevenDays.push(chat);
    } else if (
      isWithinInterval(chatDate, { start: thirtyDaysAgo, end: sevenDaysAgo })
    ) {
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
  const { user } = useAuth();
  const router = useRouter();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseVO[]>([]);
  const [selectedKbs, setSelectedKbs] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [llmModels, setLlmModels] = useState<LlmConfig[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<KbChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [userChatHistory, setUserChatHistory] = useState<KbChatHistory[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);
  const [historyAnchorEl, setHistoryAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    sessionId: string;
  }>({
    open: false,
    sessionId: "",
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
          const activeKbs = kbs.filter((kb) => kb.status === 1);
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
          message: t("knowledge.fetchError"),
          severity: "error",
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
          message: t("qa.loadHistoryError"),
          severity: "error",
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
          // 默认选中第一个模型
          if (response.data.data.length > 0) {
            setSelectedModel(response.data.data[0].id);
          }
        }
      }
    } catch (error) {
      console.error("获取大模型配置失败:", error);
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
      console.error("获取用户对话历史失败:", error);
      if (isMountedRef.current) {
        setSnackbar({
          open: true,
          message: t("qa.loadHistoryError"),
          severity: "error",
        });
      }
    }
  }, [t]);

  // 使用 useCallback 优化中断会话处理
  const handleAbort = useCallback(() => {
    if (abortControllerRef.current) {
      console.log("正在中断连接...");
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
                  behavior: "smooth",
                });
              }
            }, 100);
          }
        } catch (error) {
          console.error("获取聊天历史失败:", error);
          if (isMountedRef.current) {
            setSnackbar({
              open: true,
              message: t("qa.loadHistoryError"),
              severity: "error",
            });
          }
        }
      }, 100);
    }
  }, [selectedSessionId, sessionId, t]);

  // 使用 useCallback 优化聊天历史更新
  const updateChatHistory = useCallback(
    (answer: string, isStreaming: boolean) => {
      if (isMountedRef.current) {
        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].answer = answer;
          newHistory[newHistory.length - 1].isStreaming = isStreaming;
          return newHistory;
        });
      }
    },
    []
  );

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (chatBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };

    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.addEventListener("scroll", handleScroll);
      return () => chatBox.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // 使用 useCallback 优化滚动处理
  const scrollToBottom = useCallback(() => {
    if (chatBoxRef.current) {
      const timeoutId = setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // 滚动到底部
  const onClickScrollToBottom = () => {
    if (chatBoxRef.current) {
      setIsScrollToBottom(true);
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // 发送消息
  const handleSend = useCallback(async () => {
    if (!question.trim() || loading) return;

    // 只有在已经有连接的情况下才中断
    if (abortControllerRef.current) {
      handleAbort();
      // 等待之前的连接完全中断
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setLoading(true);
    const questionText = question;
    setQuestion("");

    // 创建新的 AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const newQuestion: KbChatHistory = {
      id: Date.now(),
      sessionId: selectedSessionId || sessionId,
      requestId: uuidv4(),
      kbIds: selectedKbs.join(","),
      userId: 0,
      question: questionText,
      answer: "THINKING_DOTS",
      tokensUsed: 0,
      processTime: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      isStop: 0,
    };

    if (isMountedRef.current) {
      setChatHistory((prev) => [...prev, newQuestion]);
    }
    scrollToBottom();

    try {
      const requestData: QaRequest = {
        question: questionText,
        sessionId: selectedSessionId || sessionId,
        requestId: uuidv4(),
        temperature: 0.7,
        maxTokens: 2000,
        ...(selectedModel && { llmId: selectedModel }),
      };

      const baseUrl = "/api/v1/kb/qa";
      const endpoint =
        selectedKbs.length > 0 ? "chat/stream" : "general/stream";
      const queryParams = selectedKbs.length > 0 ? `?kbIds=${selectedKbs}` : "";
      const url = `${baseUrl}/${endpoint}${queryParams}`;

      let answer = "";

      console.log("准备建立连接:", url);
      try {
        await fetchEventSource(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Accept-Encoding": "identity",
            "X-Accept-Encoding-Override": "identity",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
          body: JSON.stringify(requestData),
          signal: controller.signal,
          openWhenHidden: true,
          async onopen(response: Response) {
            console.log("连接已打开，状态:", response.status);
            if (response.ok && response.status === 200) {
              console.log("连接成功建立");
            } else {
              console.error("连接打开但状态异常:", response.status);
              throw new Error(`Failed to open connection: ${response.status}`);
            }
          },
          onmessage(ev) {
            if (!isMountedRef.current) return;

            if (ev.event === "done" || ev.event === "complete") {
              console.log("收到完成消息");
              setLoading(false);
              return;
            }

            try {
              const data = JSON.parse(ev.data);
              if (data.content) {
                answer += data.content;
                updateChatHistory(answer, true);
                if (isScrollToBottom) {
                  scrollToBottom();
                }
              }
            } catch (error) {
              console.error("处理消息数据时出错:", error);
            }
          },
          onclose() {
            console.log("连接关闭，当前answer长度:", answer.length);
            if (!isMountedRef.current) return;

            setLoading(false);
          },
          onerror(err) {
            console.error("连接错误:", err);
            if (!isMountedRef.current) return;

            if (err.name === "AbortError") {
              console.log("连接被手动中断");
              return;
            }

            setSnackbar({
              open: true,
              message: t("qa.systemError"),
              severity: "error",
            });
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("fetchEventSource 执行出错:", error);
        throw error;
      }
    } catch (error) {
      console.error("整体请求异常:", error);
      if (!isMountedRef.current) return;

      if (error instanceof Error && error.name === "AbortError") {
        console.log("请求被中断");
        return;
      }

      setSnackbar({
        open: true,
        message: t("qa.systemError"),
        severity: "error",
      });
      setLoading(false);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [
    question,
    loading,
    sessionId,
    selectedKbs,
    selectedModel,
    t,
    handleAbort,
    scrollToBottom,
    updateChatHistory,
    selectedSessionId,
  ]);

  // 使用 useCallback 优化按键事件处理
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

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
          message: t("qa.clearHistorySuccess"),
          severity: "success",
        });
        // 重新获取会话列表
        fetchUserChatHistory();
      }
    } catch (error) {
      console.error("清空历史记录失败:", error);
      if (isMountedRef.current) {
        setSnackbar({
          open: true,
          message: t("qa.clearHistoryError"),
          severity: "error",
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
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // 处理全选/取消全选
  const handleSelectAll = useCallback(() => {
    setIsSelectAll(prev => {
      const newSelectAll = !prev;
      setSelectedKbs(newSelectAll ? knowledgeBases.map(kb => kb.id) : []);
      return newSelectAll;
    });
  }, [knowledgeBases]);

  // 监听选中状态变化
  useEffect(() => {
    // 当选中的知识库数量等于总数时，自动设置全选状态
    setIsSelectAll(selectedKbs.length === knowledgeBases.length);
  }, [selectedKbs, knowledgeBases]);

  // 处理单个知识库选择
  const handleKbSelect = useCallback((id: number, checked: boolean) => {
    setSelectedKbs((prev) =>
      checked ? [...prev, id] : prev.filter((kbId) => kbId !== id)
    );
  }, []);

  // 使用 useCallback 优化问题输入处理
  const handleQuestionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setQuestion(event.target.value);
    },
    []
  );

  // 处理选择历史会话
  const handleSelectSession = useCallback(
    async (sid: string) => {
      setSelectedSessionId(sid);
      setSessionId(sid);
      try {
        const response = await qaService.getChatHistory(sid);
        if (isMountedRef.current) {
          setChatHistory(response.data.data.records);
          scrollToBottom();
        }
      } catch (error) {
        console.error("获取对话历史失败:", error);
        if (isMountedRef.current) {
          setSnackbar({
            open: true,
            message: t("qa.loadHistoryError"),
            severity: "error",
          });
        }
      }
    },
    [t, scrollToBottom]
  );

  // 开始新对话
  const handleNewChat = useCallback(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setSelectedSessionId(newSessionId);
    setChatHistory([]);
  }, []);

  // 处理删除单个会话
  const handleDeleteSession = useCallback(
    async (sid: string, event: React.MouseEvent) => {
      event.stopPropagation(); // 阻止事件冒泡，避免触发会话选择
      setDeleteDialog({
        open: true,
        sessionId: sid,
      });
    },
    []
  );

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
          message: t("qa.deleteHistorySuccess"),
          severity: "success",
        });
        // 重新获取会话列表
        fetchUserChatHistory();
      }
    } catch (error) {
      console.error("删除会话失败:", error);
      if (isMountedRef.current) {
        setSnackbar({
          open: true,
          message: t("qa.deleteHistoryError"),
          severity: "error",
        });
      }
    } finally {
      setDeleteDialog({ open: false, sessionId: "" });
    }
  }, [deleteDialog.sessionId, sessionId, t, fetchUserChatHistory]);

  // 取消删除
  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ open: false, sessionId: "" });
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
            message: t("qa.loadError"),
            severity: "error",
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
      setSelectedModel("");
      setInitialLoading(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [
    fetchKnowledgeBases,
    fetchChatHistory,
    fetchLlmModels,
    fetchUserChatHistory,
    t,
  ]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* 底层 - 聊天面板 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        {/* 聊天内容区域 - 可滚动 */}
        <Box
          ref={chatBoxRef}
          sx={{
            flex: 1,
            overflow: "auto",
            width: "100%",
            height: "100%",
            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              borderRadius: 3,
              "&:hover": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.2)",
              },
            },
          }}
        >
          <Box
            sx={{
              maxWidth: 1000,
              minWidth: 600,
              width: "100%",
              mx: "auto",
              p: 3,
              pb: "180px", // 为底部输入框留出空间
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {initialLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              chatHistory.map((chat, index) => (
                <ChatMessage
                  key={index}
                  chat={chat}
                  onRegenerate={() => {
                    const originalQuestion = question;
                    setQuestion(chat.question);
                    setTimeout(() => {
                      handleSend();
                      setQuestion(originalQuestion);
                    }, 0);
                  }}
                  onDelete={() => handleSelectSession(chat.sessionId)}
                />
              ))
            )}
          </Box>
        </Box>

        {/* 底部输入区域 - 固定位置 */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 1000,
            minWidth: 600,
            p: 2,
            bgcolor: "background.default",

            zIndex: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              width: "100%",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
              "&:focus-within": {
                borderColor: "primary.main",
                boxShadow: (theme) => `0px 0px 8px ${theme.palette.primary.main}25`,
              },
            }}
          >
            {/* 第一行：聊天输入框 */}
            <Box
              onClick={() => {
                const inputElement = document.querySelector<HTMLTextAreaElement>('.MuiInputBase-input');
                if (inputElement) {
                  inputElement.focus();
                }
              }}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                flex: 3,
                cursor: "text",
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={20}
                value={question}
                onChange={handleQuestionChange}
                onKeyPress={handleKeyPress}
                placeholder={t("qa.inputPlaceholder")}
                disabled={loading}
                variant="standard"
                sx={{
                  height: "100%",
                  "& .MuiInputBase-root": {
                    padding: 0,
                    minHeight: "100%",
                    "&:before, &:after": {
                      display: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: 0,
                    fontSize: "1rem",
                    lineHeight: 1.5,
                  },
                }}
              />
            </Box>

            {/* 第二行：选择器和发送按钮 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                p: 2,
                pt: 1,
                minHeight: "60px",
                flex: 1,
              }}
            >
              {/* 知识库选择器 */}
              <Tooltip
                title={
                  selectedKbs.length === 0
                    ? t("qa.selectKnowledgeBase")
                    : t("qa.selectedKnowledgeBase")
                }
              >
                <FormControl
                  size="small"
                  sx={{
                    flex: "none",
                    width: "auto",
                    minWidth: selectedKbs.length === 0 ? 40 : "auto",
                    maxWidth: 300,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Select
                    multiple
                    value={selectedKbs}
                    onChange={(e) => {
                      const value = e.target.value as number[];
                      setSelectedKbs(value);
                    }}
                    displayEmpty
                    renderValue={(selected: number[]) => {
                      if (selected.length === 0) {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                            }}
                          >
                            <StorageIcon
                              sx={{
                                fontSize: "1.25rem",
                                color: "text.secondary",
                              }}
                            />
                          </Box>
                        );
                      }
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            width: "100%",
                            overflow: "hidden",
                            px: 1,
                          }}
                        >
                          <StorageIcon
                            sx={{
                              fontSize: "1.25rem",
                              color: "primary.main",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            noWrap
                            sx={{
                              fontSize: "0.875rem",
                              color: "text.primary",
                              flexShrink: 1,
                              minWidth: 0,
                            }}
                          >
                            {selectedKbs.length} 个知识库
                          </Typography>
                        </Box>
                      );
                    }}
                    sx={{
                      height: 40,
                      bgcolor: (theme: Theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.05)",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid",
                        borderColor: "divider",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        py: 1,
                        px: 1,
                        minWidth: selectedKbs.length === 0 ? 40 : "auto",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          minWidth: 200,
                          width: "auto",
                          maxWidth: "min(400px, 90vw)",
                          mt: 1,
                          boxShadow: (theme) => theme.shadows[3],
                          "& .MuiMenuItem-root": {
                            minHeight: 40,
                            width: "100%",
                          },
                          "& .MuiTypography-root": {
                            flex: 1,
                            marginRight: 1,
                          },
                        },
                      },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      slotProps: {
                        paper: {
                          sx: {
                            overflow: "hidden",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleSelectAll}
                      sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1,
                        px: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 1,
                        }}
                      >
                        {isSelectAll ? (
                          <CheckBoxIcon
                            sx={{ fontSize: "1.25rem", color: "primary.main" }}
                          />
                        ) : (
                          <CheckBoxOutlineBlankIcon
                            sx={{ fontSize: "1.25rem", color: "text.secondary" }}
                          />
                        )}
                        <Typography sx={{ fontSize: "0.875rem" }}>
                          全选
                        </Typography>
                      </Box>
                    </MenuItem>
                    {knowledgeBases.map((kb) => (
                      <MenuItem
                        key={kb.id}
                        value={kb.id}
                        sx={{
                          py: 1,
                          px: 2,
                          "&:hover": {
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.05)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            gap: 1,
                          }}
                        >
                          {selectedKbs.includes(kb.id) ? (
                            <CheckBoxIcon
                              sx={{ fontSize: "1.25rem", color: "primary.main" }}
                            />
                          ) : (
                            <CheckBoxOutlineBlankIcon
                              sx={{ fontSize: "1.25rem", color: "text.secondary" }}
                            />
                          )}
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              flexGrow: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {kb.name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Tooltip>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* 大模型选择器 */}
                <FormControl
                  size="small"
                  sx={{
                    flex: "none",
                    width: (theme) => ({
                      width: "auto",
                      minWidth: 40,
                      transition: theme.transitions.create(["width"], {
                        duration: theme.transitions.duration.standard,
                      }),
                    }),
                  }}
                >
                  <Select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    displayEmpty
                    renderValue={(selected) => {
                      const model = llmModels.find((m) => m.id === selected);
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "100%",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: "text.primary",
                              textAlign: "right",
                            }}
                          >
                            {model?.modelName}
                          </Typography>
                        </Box>
                      );
                    }}
                    sx={{
                      height: 40,
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: "8px 32px 8px 8px",
                        paddingRight: "32px !important",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          width: "auto",
                          minWidth: "200px",
                        },
                      },
                    }}
                  >
                    {llmModels.map((model) => (
                      <MenuItem
                        key={model.id}
                        value={model.id}
                        sx={{
                          minHeight: "auto",
                          py: 1,
                          px: 2,
                          whiteSpace: "normal",
                          "&.Mui-selected": {
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(144, 202, 249, 0.16)"
                                : "rgba(33, 150, 243, 0.08)",
                            "&:hover": {
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(144, 202, 249, 0.24)"
                                  : "rgba(33, 150, 243, 0.12)",
                            },
                          },
                          "&:hover": {
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(144, 202, 249, 0.08)"
                                : "rgba(33, 150, 243, 0.04)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            gap: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              flexGrow: 1,
                            }}
                          >
                            {model.modelName}
                          </Typography>
                          {selectedModel === model.id && (
                            <Box
                              component="span"
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "0.75rem",
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </Box>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* 发送按钮 */}
                <IconButton
                  color="primary"
                  onClick={loading ? handleAbort : handleSend}
                  disabled={!question.trim() && !loading}
                  title={loading ? t("qa.clickToStop") : t("qa.send")}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: loading ? "error.main" : "primary.main",
                    color: "primary.contrastText",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: loading ? "error.dark" : "primary.dark",
                      transform: loading ? "rotate(90deg)" : "scale(1.05)",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                >
                  {loading ? (
                    <Box
                      sx={{ position: "relative", display: "inline-flex" }}
                    >
                      <CircularProgress
                        size={18}
                        color="inherit"
                        sx={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          marginLeft: "-9px",
                          marginTop: "-9px",
                        }}
                      />
                      <StopIcon
                        sx={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          marginLeft: "-9px",
                          marginTop: "-9px",
                          fontSize: 18,
                          animation: "fadeIn 0.3s ease-in-out",
                          "@keyframes fadeIn": {
                            "0%": {
                              opacity: 0,
                              transform: "scale(0.8)",
                            },
                            "100%": {
                              opacity: 1,
                              transform: "scale(1)",
                            },
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <ArrowUpwardIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>

        {showScrollButton && (
          <Box
            sx={{
              position: "fixed",
              bottom: 180,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              pointerEvents: "none",
              display: "flex",
              justifyContent: "center",
              width: "auto",
            }}
          >
            <IconButton
              size="small"
              onClick={onClickScrollToBottom}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease",
                pointerEvents: "auto",
                backdropFilter: "blur(8px)",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                },
              }}
            >
              <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* 上层 - 左侧和右侧面板 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: "none", // 允许点击穿透到底层
          zIndex: 10,
        }}
      >
        {/* 左上角 - Snow AI */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 240,
            pointerEvents: "auto",
            background: "transparent",
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 1000,
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "linear-gradient(45deg, #007FFF 30%, #0059B2 90%)"
                  : "linear-gradient(45deg, #66B2FF 30%, #0059B2 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: 1,
              fontSize: "1.25rem",
              width: "auto",
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "visible",
              textOverflow: "clip",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
            onClick={() => router.push("/")}
          >
            {t("common.appName")}
          </Typography>
        </Box>

        {/* 右上角 - 用户信息和操作按钮 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            background: "transparent",
            pointerEvents: "auto",
            p: 2,
            gap: 1,
          }}
        >
          <Tooltip title={t("qa.newChat")}>
            <IconButton
              onClick={handleNewChat}
              sx={{
                color: "primary.main",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(144, 202, 249, 0.08)"
                      : "rgba(33, 150, 243, 0.08)",
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("qa.chatHistory")}>
            <IconButton
              onClick={(event) => {
                const target = event.currentTarget;
                setHistoryAnchorEl(target);
                setShowChatHistory(true);
              }}
              sx={{
                color: showChatHistory ? "primary.main" : "text.secondary",
              }}
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("qa.clearHistory")}>
            <IconButton
              onClick={handleClearHistory}
              sx={{
                color: "error.main",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(244, 67, 54, 0.08)"
                      : "rgba(244, 67, 54, 0.04)",
                },
              }}
            >
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
          <UserInfo userInfo={user} />
        </Box>
      </Box>

      {/* 历史会话弹出菜单 */}
      <Menu
        anchorEl={historyAnchorEl}
        open={Boolean(historyAnchorEl)}
        onClose={() => {
          setHistoryAnchorEl(null);
          setShowChatHistory(false);
        }}
        sx={{
          "& .MuiPaper-root": {
            width: 320,
            maxHeight: "70vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[8],
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <List
          sx={{
            "&::-webkit-scrollbar": {
              width: 6,
              position: "absolute",
              right: 0,
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              borderRadius: 3,
              "&:hover": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.2)",
              },
            },
          }}
        >
          {userChatHistory.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">{t("qa.noHistory")}</Typography>
            </Box>
          ) : (
            Object.entries(groupChatHistory(userChatHistory)).map(
              ([group, chats]) => (
                <Box key={group}>
                  <ListItem
                    sx={{
                      py: 1,
                      px: 2,
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(0, 0, 0, 0.8)"
                          : "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
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
                      onClick={() => {
                        handleSelectSession(chat.sessionId);
                        setHistoryAnchorEl(null);
                        setShowChatHistory(false);
                      }}
                      sx={{
                        py: 1.5,
                        px: 2,
                        minHeight: 48,
                        "&.Mui-selected": {
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(144, 202, 249, 0.08)"
                              : "rgba(33, 150, 243, 0.08)",
                        },
                      }}
                    >
                      <ListItemText
                        primary={chat.question}
                        primaryTypographyProps={{
                          noWrap: true,
                          sx: {
                            fontSize: "0.875rem",
                            pr: 4,
                          },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteSession(chat.sessionId, e)}
                        sx={{
                          position: "absolute",
                          right: 8,
                          opacity: 0,
                          "&:hover": {
                            opacity: 1,
                          },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </ListItemButton>
                  ))}
                </Box>
              )
            )
          )}
        </List>
      </Menu>

      {/* Snackbar 和 Dialog 组件 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 400,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>{t("qa.deleteMessageConfirm")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("qa.deleteMessageConfirmText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>{t("common.cancel")}</Button>
          <Button onClick={handleConfirmDelete} color="error">
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={clearHistoryDialog.open}
        onClose={handleCancelClearHistory}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 400,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>{t("qa.clearHistoryConfirm")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("qa.clearHistoryConfirmText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClearHistory}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleConfirmClearHistory} color="error">
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
