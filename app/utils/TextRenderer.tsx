// utils/TextRenderer.tsx

import React from 'react';

/**
 * 将包含 Markdown 加粗语法（**...**）的纯文本字符串转换为 JSX。
 * @param text - 包含 **加粗内容** 的字符串
 * @returns React.ReactNode - 渲染后的 JSX 元素数组
 */
export const renderBoldText = (text: string): React.ReactNode => {
    // 正则表达式：(\*\*.*?\*\*) 匹配并捕获所有 **...** 格式的加粗内容
    // 使用非贪婪匹配 (.*?) 确保只匹配最近的一对 **
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // 提取加粗内容（去掉开头的 ** 和结尾的 **）
            // 在这里可以使用 Tailwind CSS class 如 'font-semibold' 如果需要
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part; // 渲染非加粗的文本部分
    });
};