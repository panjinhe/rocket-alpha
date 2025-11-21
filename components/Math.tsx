// components/Math.tsx
'use client';

import { MathJaxContext, MathJax } from "better-react-mathjax";

// 官方最新推荐配置（支持 AMS 符号、颜色、完美渲染你的公式）
const config = {
    loader: { load: ["[tex]/ams", "[tex]/color"] },
    tex: {
        packages: { "[+]": ["ams", "color"] },
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    },
};

// 块级公式（主页大公式专用）
export const Eq = ({ children }: { children: string }) => (
    <div className="my-12 text-center text-2xl md:text-3xl leading-relaxed">
        <MathJax hideUntilTypeset={"first"} dynamic>
            {children}
        </MathJax>
    </div>
);

// 行内公式（可选）
export const Inline = ({ children }: { children: string }) => (
    <MathJax inline dynamic>
        {children}
    </MathJax>
);

// ！！！最重要：全局只包裹一次！！！
// 在 app/layout.tsx 里全局包裹一次就够了（不需要每个组件都配 config）
export const MathProvider = ({ children }: { children: React.ReactNode }) => (
    <MathJaxContext config={config} version={3}>
        {children}
    </MathJaxContext>
);