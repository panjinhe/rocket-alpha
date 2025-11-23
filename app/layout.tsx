import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

import { MathProvider } from "@/components/Math"; // MathJax 全局 Provider
import Link from "next/link";

// 字体配置（使用 CSS Variable 方式，最推荐）
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700", "900"],
    variable: "--font-serif",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Rocket Alpha | 系统化投资研究",
        template: "%s | Rocket Alpha",
    },
    description: "追求可持续超额收益的学术量化研究站",
    keywords: ["量化投资", "因子模型", "Alpha研究", "Fama-French", "A股"],
    authors: [{ name: "Rocket Alpha Research" }],
    metadataBase: new URL("https://rocket-alpha.vercel.app"), // 改成你的域名
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
        {/* 字体 variable 注入到 <html> 最推荐 */}
        <body
            className={`${inter.variable} ${merriweather.variable} font-sans antialiased bg-background text-foreground`}
        >
        {/* 全局 MathJax 上下文（只包裹一次） */}
        <MathProvider>
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
                        <Link
                            href="/"
                            className="flex items-baseline space-x-1 text-3xl font-bold tracking-tight"
                        >
                            <span className="text-primary">Rocket</span>
                            <span className="text-accent font-serif italic">Alpha</span>
                        </Link>

                        <nav className="flex items-center gap-8 text-sm font-medium">
                            {[
                                { name: "研究社区", href: "/" },
                                { name: "产品咨询", href: "/" },
                                { name: "数据下载", href: "/download" },
                                { name: "市场报告", href: "/papers" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="hover:text-primary transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">{children}</main>

                <footer className="border-t py-10 text-center text-sm text-muted-foreground">
                    <div className="container mx-auto max-w-7xl px-6">
                        <p>&copy; 2025 Rocket Alpha Research. 所有权利保留。</p>
                        <p className="mt-2">
                            数据来源：雅虎 Finance & 谷歌 Finance API ⋅ 仅供学术交流使用
                        </p>
                        <p className="mt-4 text-xs">
                            {/* 友情链接部分 */}
                            <span className="font-semibold text-foreground mr-2">友情链接:</span>
                            <Link
                                href="https://finance.yahoo.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline mx-1"
                            >
                                雅虎 Finance
                            </Link>
                            {" | "}
                            <Link
                                href="https://developers.google.com/finance"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline mx-1"
                            >
                                谷歌 Finance API
                            </Link>
                        </p>
                    </div>
                </footer>
            </div>
        </MathProvider>
        </body>
        </html>
    );
}