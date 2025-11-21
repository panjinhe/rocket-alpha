// components/Math.tsx
'use client';

import { MathJaxContext, MathJax } from "better-react-mathjax";
import React from "react";

const config = {
    loader: { load: ["[tex]/ams", "[tex]/color"] },
    tex: {
        packages: { "[+]": ["ams", "color"] },
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    },
};

/* ==================== 块级公式 =================== */
interface EqProps {
    children: string | React.ReactNode;
    className?: string;
}

export const Eq: React.FC<EqProps> = ({ children, className }) => {
    const math = React.useMemo(() => String(children).trim(), [children]);

    return (
        <div className={`my-12 text-center text-2xl md:text-3xl leading-relaxed ${className ?? ""}`}>
            <MathJax hideUntilTypeset={"first"} dynamic>
                {math}
            </MathJax>
        </div>
    );
};

/* ==================== 行内公式 =================== */
interface InlineProps {
    children: string | React.ReactNode;
    className?: string;
}

// components/Math.tsx 的 Inline 最终版
export const Inline: React.FC<InlineProps> = ({ children, className }) => {
    const raw = String(children).trim();

    const math = raw.startsWith('$') || raw.startsWith('\\(') || raw.startsWith('\\[')
        ? raw
        : /[_\^]/.test(raw) || raw.length === 1  // 新增：单个字母也强制数学模式
            ? `\\(${raw}\\)`
            : raw;

    return <MathJax inline dynamic className={className}>{math}</MathJax>;
};

/* ==================== 全局 Provider =================== */
export const MathProvider = ({ children }: { children: React.ReactNode }) => (
    <MathJaxContext config={config} version={3}>
        {children}
    </MathJaxContext>
);