"use client";

import "katex/dist/katex.min.css";
import MarkdownIt from "markdown-it";
// 1. 使用 * as 导入来适应 CommonJS/ESM 混用环境
import * as mk from "markdown-it-katex";

// 只初始化一次
const md = new MarkdownIt({ html: true });
// 2. 访问 mk.default 来获取实际的插件函数 (即 CommonJS 的 module.exports)
md.use(mk.default);

interface MathBlockProps {
    children: string;
}

export function MathBlock({ children }: MathBlockProps) {
    if (!children?.trim()) return null;

    // ... (渲染逻辑不变)
    const html = md.render(children.trim());

    return (
        <div
            className="my-12 text-center text-2xl leading-relaxed text-primary"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}