import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Link,
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

import "katex/dist/katex.min.css";
import { useTranslation } from "react-i18next";
import type { KbChatHistory } from "@/app/types/qa";
import { Theme } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import { useState, useEffect } from "react";
import { qaService } from "@/app/services/qa";

// Remark 相关插件（需要单独安装）
import remarkGfm from "remark-gfm"; // GitHub Flavored Markdown
import remarkMath from "remark-math"; // 数学公式支持
import remarkBreaks from "remark-breaks"; // 换行转<br>

// Rehype 相关插件（需要单独安装）
import rehypeRaw from "rehype-raw"; // 解析原始HTML

const markdownStyles = {
  "& .markdown-body": {
    color: "text.primary",
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      mt: 2,
      mb: 1,
      fontWeight: 600,
      lineHeight: 1.25,
      color: (theme: Theme) =>
        theme.palette.mode === "dark" ? "#E2E8F0" : "#1E293B",
    },
    "& p": {
      mt: 0,
      mb: 2,
      lineHeight: 1.6,
      color: (theme: Theme) =>
        theme.palette.mode === "dark" ? "#CBD5E1" : "#334155",
    },
    "& a": {
      color: (theme: Theme) =>
        theme.palette.mode === "dark" ? "#60A5FA" : "#2563EB",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
        color: (theme: Theme) =>
          theme.palette.mode === "dark" ? "#93C5FD" : "#3B82F6",
      },
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      display: "block",
      margin: "1em 0",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },

    "& blockquote": {
      m: 0,
      mt: 2,
      mb: 2,
      pl: 2,
      borderLeft: "4px solid",
      borderColor: (theme: Theme) =>
        theme.palette.mode === "dark" ? "#60A5FA" : "#2563EB",
      color: (theme: Theme) =>
        theme.palette.mode === "dark" ? "#CBD5E1" : "#475569",
      fontStyle: "italic",
      bgcolor: (theme: Theme) =>
        theme.palette.mode === "dark"
          ? "rgba(30, 41, 59, 0.3)"
          : "rgba(241, 245, 249, 0.5)",
      borderRadius: "0 8px 8px 0",
      p: 2,
    },
    "& table": {
      width: "100%",
      mt: 2,
      mb: 2,
      borderCollapse: "separate",
      borderSpacing: 0,
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      "& th, & td": {
        p: 1.5,
        border: "1px solid",
        borderColor: (theme: Theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
      },
      "& th": {
        fontWeight: 600,
        bgcolor: (theme: Theme) =>
          theme.palette.mode === "dark"
            ? "rgba(30, 41, 59, 0.5)"
            : "rgba(241, 245, 249, 0.8)",
        color: (theme: Theme) =>
          theme.palette.mode === "dark" ? "#E2E8F0" : "#1E293B",
      },
      "& td": {
        color: (theme: Theme) =>
          theme.palette.mode === "dark" ? "#CBD5E1" : "#334155",
      },
    },
    "& ul, & ol": {
      mt: 0,
      mb: 2,
      pl: 3,
      "& li": {
        mb: 0.5,
        position: "relative",
        color: (theme: Theme) =>
          theme.palette.mode === "dark" ? "#CBD5E1" : "#334155",
        "&::marker": {
          color: (theme: Theme) =>
            theme.palette.mode === "dark" ? "#60A5FA" : "#2563EB",
        },
      },
    },
    "& hr": {
      my: 2,
      border: "none",
      borderTop: "1px solid",
      borderColor: (theme: Theme) =>
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
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
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 1,
      ml: 1,
      verticalAlign: "middle",
      height: "24px",
    }}
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: "primary.main",
        animation: `${thinkingAnimation} 1s infinite ease-in-out`,
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    />
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: "primary.main",
        animation: `${thinkingAnimation} 1s infinite ease-in-out 0.2s`,
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    />
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: "primary.main",
        animation: `${thinkingAnimation} 1s infinite ease-in-out 0.4s`,
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    />
  </Box>
);

interface ChatMessageProps {
  chat: KbChatHistory;
  onRegenerate?: () => void;
  onDelete?: () => void;
}

export const ChatMessage = ({
  chat,
  onRegenerate,
  onDelete,
}: ChatMessageProps) => {
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
  }>({
    open: false,
  });

  const handleCopyMessage = () => {
    const hasEndThinkTag = chat.answer.includes("</think>");
    const hasThinkTag = chat.answer.includes("<think>");

    let messageText = "";

    if (hasEndThinkTag) {
      if (hasThinkTag) {
        // 处理包含<think>和</think>的情况
        const parts = chat.answer.split(/<think>|<\/think>/);
        messageText = parts[2] || "";
      } else {
        // 处理只包含</think>的情况
        const parts = chat.answer.split("</think>");
        messageText = parts[0] || "";
      }
    } else {
      messageText = chat.answer;
    }

    navigator.clipboard
      .writeText(messageText)
      .then(() => {
        setSnackbar({
          open: true,
          message: t("qa.copySuccess"),
          severity: "success",
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setSnackbar({
          open: true,
          message: t("qa.copyError"),
          severity: "error",
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
        message: t("qa.deleteMessageSuccess"),
        severity: "success",
      });
      setDeleteDialog({ open: false });
      // 通知父组件刷新聊天历史
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("qa.deleteMessageError"),
        severity: "error",
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false });
  };

  const handleToggleReasoning = () => {
    setIsReasoningExpanded((prev) => !prev);
  };

  const renderAnswer = (answer: string) => {
    // 检查是否是ThinkingDots标记
    if (answer === "THINKING_DOTS") {
      return <ThinkingDots />;
    }

    const hasEndThinkTag = answer.includes("</think>");
    const hasThinkTag = answer.includes("<think>");
    const isThinking = hasThinkTag && !hasEndThinkTag;

    let parts: string[] = [];
    let reasoningContent = "";
    let finalAnswer = "";

    if (hasEndThinkTag) {
      if (hasThinkTag) {
        parts = answer.split(/<think>|<\/think>/);
        reasoningContent = parts[1] || "";
        finalAnswer = parts[2] || "";
      } else {
        parts = answer.split("</think>");
        reasoningContent = parts[0] || "";
        finalAnswer = parts[1] || "";
      }
    } else if (hasThinkTag) {
      parts = answer.split("<think>");
      reasoningContent = parts[1] || "";
    } else {
      finalAnswer = answer;
    }

    return (
      <Box>
        {reasoningContent && (
          <Collapse in={isReasoningExpanded}>
            <Box
              sx={{
                mb: 2,
                pl: 2,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  backgroundColor: "#a0a1ae",
                  borderRadius: "4px",
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#a0a1ae",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: 1.6,
                  fontSize: "0.875rem",
                }}
              >
                {reasoningContent}
              </Typography>
            </Box>
          </Collapse>
        )}
        {finalAnswer && (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children }) => (
                <Typography variant="h1" sx={{ mt: 3, mb: 2 }}>
                  {children}
                </Typography>
              ),
              h2: ({ children }) => (
                <Typography variant="h2" sx={{ mt: 3, mb: 2 }}>
                  {children}
                </Typography>
              ),
              h3: ({ children }) => (
                <Typography variant="h3" sx={{ mt: 3, mb: 2 }}>
                  {children}
                </Typography>
              ),
              h4: ({ children }) => (
                <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
                  {children}
                </Typography>
              ),
              h5: ({ children }) => (
                <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
                  {children}
                </Typography>
              ),
              h6: ({ children }) => (
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  {children}
                </Typography>
              ),
              p: ({ children }) => (
                <Typography
                  variant="body1"
                  sx={{ mb: 2, lineHeight: 1.6 }}
                  component="p"
                >
                  {children}
                </Typography>
              ),
              em: ({ children }) => (
                <Typography component="em" sx={{ fontStyle: "italic" }}>
                  {children}
                </Typography>
              ),
              strong: ({ children }) => (
                <Typography component="strong" sx={{ fontWeight: "bold" }}>
                  {children}
                </Typography>
              ),
              blockquote: ({ children }) => (
                <Box
                  component="blockquote"
                  sx={{
                    borderLeft: "4px solid",
                    borderColor: "primary.main",
                    pl: 2,
                    py: 1,
                    my: 2,
                    bgcolor: "action.hover",
                  }}
                >
                  {children}
                </Box>
              ),
              ul: ({ children }) => (
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                  {children}
                </Box>
              ),
              ol: ({ children }) => (
                <Box component="ol" sx={{ pl: 2, mb: 2 }}>
                  {children}
                </Box>
              ),
              li: ({ children }) => (
                <Typography component="li" sx={{ mb: 1 }}>
                  {children}
                </Typography>
              ),
              code: ({ children, className, ...props }) => {
                // 处理语言标记
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "plaintext";
                const codeContent =
                  typeof children === "string"
                    ? children
                    : Array.isArray(children)
                    ? children.join("")
                    : children?.toString() || "";

                // 如果是行内代码，使用不同的样式
                if (!className) {
                  return (
                    <Box
                      component="code"
                      sx={{
                        p: 0.5,
                        borderRadius: "4px",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.03)",
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "#60A5FA" : "#1E40AF",
                        fontSize: "0.875rem",
                        fontFamily:
                          'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                      }}
                    >
                      {codeContent}
                    </Box>
                  );
                }

                // 代码块的处理
                return (
                  <Box 
                    sx={{ 
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: (theme) => theme.palette.mode === 'dark' 
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {/* 顶部标题栏 */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        borderBottom: '1px solid',
                        borderColor: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(96, 165, 250, 0.1)',
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(15, 17, 22, 0.8)' 
                          : 'rgba(201, 204, 209, 0.95)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {/* 语言标记 */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: (theme) => theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.9)' 
                            : 'rgba(0, 0, 0, 0.8)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                        }}
                      >
                        {language}
                      </Typography>

                      {/* 复制按钮 */}
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(codeContent);
                          setSnackbar({
                            open: true,
                            message: t('qa.copySuccess'),
                            severity: 'success',
                          });
                        }}
                        sx={{
                          color: (theme) => theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'rgba(0, 0, 0, 0.7)',
                          '&:hover': {
                            color: (theme) => theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 1)' 
                              : 'rgba(0, 0, 0, 0.9)',
                            bgcolor: (theme) => theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)',
                          },
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1,
                          height: '24px',
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: '0.875rem' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                          {t('common.copy')}
                        </Typography>
                      </IconButton>
                    </Box>
                    {/* 代码内容区域 */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(17, 24, 39, 0.8)' 
                          : 'rgba(241, 245, 249, 0.95)',
                        '& code': {
                          margin: 0,
                          padding: 0,
                          fontSize: '0.9em',
                          lineHeight: 1.5,
                          fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                          color: (theme) => theme.palette.mode === 'dark' 
                            ? '#E5E7EB' 
                            : '#334155',
                          '& .hljs': {
                            backgroundColor: 'transparent !important',
                            padding: 0,
                          },
                          '& .hljs-keyword': {
                            color: (theme) => theme.palette.mode === 'dark' 
                              ? '#93C5FD' 
                              : '#1D4ED8',
                          },
                          '& .hljs-string': {
                            color: (theme) => theme.palette.mode === 'dark' 
                              ? '#86EFAC' 
                              : '#047857',
                          },
                          '& .hljs-comment': {
                            color: (theme) => theme.palette.mode === 'dark' 
                              ? '#9CA3AF' 
                              : '#64748B',
                          },
                          '& .hljs-number': {
                            color: (theme) => theme.palette.mode === 'dark' 
                              ? '#FCA5A5' 
                              : '#B91C1C',
                          },
                          '& .hljs-function': {
                            color: (theme) => theme.palette.mode === 'dark' 
                              ? '#FCD34D' 
                              : '#B45309',
                          },
                        },
                      }}
                    >
                      <code
                        className={`language-${language}`}
                        dangerouslySetInnerHTML={{
                          __html: hljs.highlight(codeContent, { language }).value
                        }}
                      />
                    </Box>
                  </Box>
                );
              },
              hr: () => (
                <Box
                  component="hr"
                  sx={{
                    border: "none",
                    borderTop: "1px solid",
                    borderColor: (theme: Theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                    my: 3,
                    opacity: 0.3,
                  }}
                />
              ),
              a: ({ href, children }) => (
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {children}
                </Link>
              ),
              img: ({ src, alt }) => (
                <Box
                  component="img"
                  src={src}
                  alt={alt}
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    my: 2,
                    borderRadius: 1,
                  }}
                />
              ),
            }}
          >
            {finalAnswer}
          </ReactMarkdown>
        )}
      </Box>
    );
  };

  return (
    <>
      <Box>
        {/* 用户问题 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            mb: 3,
          }}
        >
          <Paper
            sx={{
              maxWidth: "85%",
              p: 2.5,
              bgcolor: (theme: Theme) =>
                theme.palette.mode === "dark" ? "#2563EB" : "#3B82F6",
              color: "#FFFFFF",
              borderRadius: "20px 20px 0 20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                right: 0,
                bottom: 0,
                width: "20px",
                height: "20px",
                background: "inherit",
                clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              },
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                bgcolor: (theme: Theme) =>
                  theme.palette.mode === "dark" ? "#1D4ED8" : "#2563EB",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {chat.question}
            </Typography>
          </Paper>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Tooltip title={t("qa.copyMessage")}>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(chat.question);
                  setSnackbar({
                    open: true,
                    message: t("qa.copySuccess"),
                    severity: "success",
                  });
                }}
                sx={{
                  color: (theme: Theme) =>
                    theme.palette.mode === "dark" ? "#60A5FA" : "#2563EB",
                  opacity: 0.7,
                  transition: "all 0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.1)",
                    bgcolor: (theme: Theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(96, 165, 250, 0.1)"
                        : "rgba(37, 99, 235, 0.1)",
                  },
                }}
                size="small"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("qa.deleteMessage")}>
              <IconButton
                onClick={handleDeleteMessage}
                sx={{
                  color: (theme: Theme) =>
                    theme.palette.mode === "dark" ? "#F87171" : "#EF4444",
                  opacity: 0.7,
                  transition: "all 0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.1)",
                    bgcolor: (theme: Theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(248, 113, 113, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {(chat.answer.includes("</think>") ||
            chat.answer.includes("<think>")) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
                ml: 1,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: (theme: Theme) =>
                    theme.palette.mode === "dark" ? "#60A5FA" : "#2563EB",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                ❄️
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: (theme: Theme) =>
                    theme.palette.mode === "dark" ? "#94A3B8" : "#64748B",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 500,
                }}
              >
                {chat.answer.includes("</think>") && chat.isStop === 0
                  ? t("qa.thinkingCompleted")
                  : chat.isStop === 1
                  ? t("qa.thinkingAborted")
                  : t("qa.thinking")}
                {!chat.answer.includes("</think>") &&
                  chat.answer.includes("<think>") &&
                  chat.isStop === 0 && <ThinkingDots />}
              </Typography>
              {chat.answer.includes("</think>") && (
                <IconButton
                  onClick={handleToggleReasoning}
                  sx={{
                    color: (theme: Theme) =>
                      theme.palette.mode === "dark" ? "#94A3B8" : "#64748B",
                    padding: "2px",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: (theme: Theme) =>
                        theme.palette.mode === "dark" ? "#60A5FA" : "#2563EB",
                      bgcolor: "transparent",
                      transform: "scale(1.1)",
                    },
                  }}
                  size="small"
                >
                  {isReasoningExpanded ? (
                    <ExpandLessIcon fontSize="small" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" />
                  )}
                </IconButton>
              )}
            </Box>
          )}
          <Paper
            elevation={2}
            sx={{
              maxWidth: 1000,
              minWidth: 600,
              width: '100%',
              mx: 'auto',
              p: 2.5,
              borderRadius: "20px 20px 20px 0",
              bgcolor: (theme: Theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(139, 92, 246, 0.12)"
                  : "rgba(248, 250, 252, 0.95)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "20px",
                height: "20px",
                background: "inherit",
                clipPath: "polygon(0 0, 0 100%, 100% 100%)",
              },
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                bgcolor: (theme: Theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(139, 92, 246, 0.18)"
                    : "rgba(248, 250, 252, 1)",
              },
              ...markdownStyles,
            }}
          >
            <Box className="markdown-body">{renderAnswer(chat.answer)}</Box>
          </Paper>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Tooltip title={t("qa.copyMessage")}>
              <IconButton
                onClick={() => handleCopyMessage()}
                sx={{
                  color: (theme: Theme) =>
                    theme.palette.mode === "dark" ? "#60A5FA" : "#2563EB",
                  opacity: 0.7,
                  transition: "all 0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.1)",
                    bgcolor: (theme: Theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(96, 165, 250, 0.1)"
                        : "rgba(37, 99, 235, 0.1)",
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", minWidth: "200px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('qa.deleteMessageConfirm')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('qa.deleteMessageConfirmText')}
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
            {t('common.cancel')}
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
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { ThinkingDots };
