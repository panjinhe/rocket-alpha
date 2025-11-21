import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link"; // ✨ 重点修改 1：导入 Link 组件

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const merriweather = Merriweather({
    weight: ["300", "700"],
    subsets: ["latin"],
    variable: "--font-serif",
});

export const metadata: Metadata = {
    title: "Rocket Alpha | 系统化投资研究",
    description: "追求可持续超额收益的学术量化研究站",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
        <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased bg-background text-foreground`}>
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
                    {/* ✨ 重点修改 2：替换 a 为 Link */}
                    <Link href="/" className="flex items-baseline space-x-1 text-3xl font-bold tracking-tight">
                        <span className="text-primary">Rocket</span>
                        <span className="text-accent font-serif italic">Alpha</span>
                    </Link>
                    <nav className="flex items-center gap-8 text-sm font-medium">
                        {["仪表盘", "量化模型", "价值选股", "研究报告"].map((item) => (
                            // 注意：这里的导航链接如果指向内部页面，也应使用 <Link>
                            <a key={item} href="#" className="hover:text-primary transition">
                                {item}
                            </a>
                        ))}
                        <ModeToggle />
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t py-10 text-center text-sm text-muted-foreground">
                <div className="container mx-auto max-w-7xl px-6">
                    <p>&copy; 2025 Rocket Alpha Research. 所有权利保留。</p>
                    <p className="mt-2">数据来源：Wind & CSMAR | 仅供学术交流使用</p>
                </div>
            </footer>
        </div>
        </body>
        </html>
    );
}