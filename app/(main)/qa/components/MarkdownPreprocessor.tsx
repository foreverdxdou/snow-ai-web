import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Markdown预处理组件
 * 用于处理不规则的Markdown格式
 */
export const MarkdownPreprocessor: React.FC<{ content: string }> = ({ content }) => {
    const { t } = useTranslation();
    
    if (!content) return null;
    
    // 预处理Markdown内容
    // const processedContent = preprocessMarkdown(content);
    const processedContent = content;
    
    return (
        <div className="markdown-preprocessor">
            {processedContent}
        </div>
    );
};

/**
 * 预处理不规则的Markdown格式
 * @param content 原始Markdown内容
 * @returns 处理后的Markdown内容
 */
export const preprocessMarkdown = (content: string): string => {
    if (!content) return '';
    
    let processed = content;
    
    // 只处理最基本的不规则格式
    
    // 1. 处理标题格式
    processed = processed.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');
    
    // 2. 处理列表格式
    processed = processed.replace(/^([-*+])([^\s])/gm, '$1 $2');
    
    // 3. 处理引用格式
    processed = processed.replace(/^>([^\s])/gm, '> $1');
    
    // 4. 处理代码块格式
    processed = processed.replace(/([^\n])```/g, '$1\n```');
    processed = processed.replace(/```([^\n])/g, '```\n$1');
    
    // 5. 处理表格格式
    processed = processed.replace(/\|([^|]*?[^\s])\|/g, '| $1 |');
    
    // 6. 处理不规则的换行
    processed = processed.replace(/\r\n/g, '\n');
    processed = processed.replace(/\r/g, '\n');
    processed = processed.replace(/\n{3,}/g, '\n\n');
    
    return processed;
};

/**
 * 将推理内容转换为Markdown引用格式
 * @param content 原始内容
 * @returns 转换后的引用格式内容
 */
export const convertToQuoteFormat = (content: string): string => {
    if (!content) return '';
    
    // 分割内容为行
    const lines = content.split('\n');
    
    // 为每一行添加引用符号
    const quotedLines = lines.map(line => {
        // 如果行已经是引用格式，不重复添加
        if (line.trim().startsWith('> ')) {
            return line;
        }
        // 如果是空行，保持空行
        if (line.trim() === '') {
            return '';
        }
        // 为非空行添加引用符号
        return `> ${line}`;
    });
    
    // 合并行
    return quotedLines.join('\n');
};

export default MarkdownPreprocessor; 