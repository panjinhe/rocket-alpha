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

export const Inline: React.FC<InlineProps> = ({ children, className }) => {
    // 关键改动：直接把 children 转成字符串后，强制包在 \( ... \) 里
    // 这样不管原来有没有 $，都不会再出现裸 $ 导致 TS 报错
    const raw = String(children);
    const math = raw.trim();

    // 如果已经自带 $ 或 \( 或 \[，就保持原样；否则强制加上 \(...\)
    const content = /^\s*(\$\$|\\\[|\\\(|\$)/.test(math) ? math : `\\(${math}\\)`;

    return (
        <MathJax inline dynamic className={className}>
            {content}
        </MathJax>
    );
};

/* ==================== 全局 Provider =================== */
export const MathProvider = ({ children }: { children: React.ReactNode }) => (
    <MathJaxContext config={config} version={3}>
        {children}
    </MathJaxContext>
);