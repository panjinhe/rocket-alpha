// app/factor-model-explained/page.tsx
import Link from "next/link";
import { Eq } from "@/components/Math";
import React from 'react'; // 确保 React 已导入

export const metadata = {
    title: "多因子模型公式详解 | 系统化探索 Alpha",
    description: "经典 Fama-French 多因子资产定价模型完整符号解释与实证应用",
};

// 1. 【新增】定义 InlineEq 的 Props 接口
interface InlineEqProps {
    children: React.ReactNode; // 明确指定 children 的类型为 React.ReactNode
    className?: string; // className 是可选的字符串
}

// 2. 【修改】辅助组件：用于包裹内联公式，统一风格
// 使用 React.FC<InlineEqProps> 避免 TS2745 错误
const InlineEq: React.FC<InlineEqProps> = ({ children, className = 'text-sm' }) => (
    <div className={`bg-gray-100 px-2 py-1 rounded font-mono inline-flex items-center justify-center ${className}`}>
        <Eq>{children}</Eq>
    </div>
);

export default function FactorModelExplained() {
    // 基础公式的样式，与描述文字的 text-lg 保持一致
    const basicEqClass = 'text-lg';
    // 下标公式的样式，与 code 块的 text-sm 保持一致
    const inlineEqClass = 'text-sm';

    return (
        <>
            {/* 顶部固定导航 */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="font-serif text-2xl font-bold hover:text-red-600 transition">
                        系统化探索 Alpha
                    </Link>
                    <span className="text-sm text-gray-500 hidden sm:inline">多因子模型公式详解</span>
                </div>
            </div>

            <div className="min-h-screen bg-gray-50 py-16 md:py-24">
                <div className="container mx-auto max-w-5xl px-8">

                    {/* 主标题 */}
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16 text-gray-900 leading-tight">
                        经典多因子资产定价模型<br className="sm:hidden" />公式完整解读
                    </h1>

                    {/* 核心公式大卡片（与首页完全一致的交互风格） */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 md:p-20 my-20 text-center
                          transition-all duration-300 hover:shadow-2xl hover:border-gray-300">
                        <Link
                            href="/factor-model-explained" // 当前页就是解释页，所以这里可以 anchor 到下方，或直接保持可点击感
                            className="group block cursor-default"
                            scroll={false}
                        >
                            <div className="text-4xl md:text-6xl leading-relaxed mb-8">
                                <Eq>
                                    {`$$R_{i,t} - R_{f,t} = \\alpha_i + \\sum_{k=1}^{K} \\beta_{i,k} F_{k,t} + \\epsilon_{i,t}$$`}
                                </Eq>
                            </div>
                            <p className="text-xl text-gray-700 font-medium">
                                Fama-French 类多因子模型（时间序列回归形式）
                            </p>
                        </Link>
                    </div>

                    {/* 符号解释表格（双列卡片式，视觉更清爽） */}
                    <section className="grid md:grid-cols-2 gap-8 my-20">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                            <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">下标与收益率</h3>
                            <div className="space-y-5 text-lg">
                                {/* i */}
                                <div><InlineEq className={inlineEqClass}>{`$i$`}</InlineEq>　第 i 只股票或投资组合</div>
                                {/* t */}
                                <div><InlineEq className={inlineEqClass}>{`$t$`}</InlineEq>　时间下标（月/日）</div>
                                {/* R_i,t */}
                                <div><InlineEq className={inlineEqClass}>{`$R_{i,t}$`}</InlineEq>　股票 i 在 t 期的总收益率</div>
                                {/* R_f,t */}
                                <div><InlineEq className={inlineEqClass}>{`$R_{f,t}$`}</InlineEq>　t 期无风险利率</div>
                                {/* R_i,t - R_f,t (超额收益率) */}
                                <div className="flex items-start">
                                    <InlineEq className={basicEqClass}>{`$R_{i,t} - R_{f,t}$`}</InlineEq>
                                    <span className="ml-4">　超额收益率（Excess Return）</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                            <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">核心参数</h3>
                            <div className="space-y-5 text-lg">
                                {/* alpha_i */}
                                <div>
                                    <InlineEq className={`${inlineEqClass} bg-red-50 text-red-700`}>{`$\\alpha_i$`}</InlineEq>　阿尔法（真实选股能力）<br/>
                                    <span className="text-sm text-gray-600">风险调整后显著为正 → 存在超额收益</span>
                                </div>
                                {/* beta_i,k */}
                                <div>
                                    <InlineEq className={inlineEqClass}>{`$\\beta_{i,k}$`}</InlineEq>　股票 i 对因子 k 的暴露（因子载荷）
                                </div>
                                {/* F_k,t */}
                                <div>
                                    <InlineEq className={inlineEqClass}>{`$F_{k,t}$`}</InlineEq>　因子 k 在 t 期的溢价<br/>
                                    <span className="text-sm text-gray-600">MKT、SMB、HML、RMW、CMA、UMD 等</span>
                                </div>
                                {/* epsilon_i,t */}
                                <div>
                                    <InlineEq className={inlineEqClass}>{`$\\epsilon_{i,t}$`}</InlineEq>　特异性残差（不可解释的随机噪音）
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 一句话直观理解 */}
                    <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 my-20 text-center">
                        <h2 className="text-3xl font-serif font-bold mb-10 text-gray-900">一句话读懂整个公式</h2>
                        <p className="text-2xl leading-relaxed text-gray-700">
                            某资产<strong className="text-red-600">超额收益</strong>＝
                            <strong className="text-red-600">真·选股能力 α</strong>　+
                            <strong className="text-blue-600">系统性因子暴露 × 因子溢价</strong>　+
                            <strong className="text-gray-600">纯随机噪音 ε</strong>
                        </p>
                    </section>

                    {/* 主流模型对照表（保持简洁） */}
                    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-8 overflow-x-auto">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-gray-800">主流多因子模型一览</h2>
                        <table className="w-full text-left border-collapse text-lg">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4">模型</th>
                                <th className="p-4">年份</th>
                                <th className="p-4">因子</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            <tr><td className="p-4">CAPM</td><td className="p-4">1964</td><td className="p-4">MKT</td></tr>
                            <tr className="bg-gray-50"><td className="p-4">Fama-French 三因子</td><td className="p-4">1993</td><td className="p-4">MKT + SMB + HML</td></tr>
                            <tr><td className="p-4">Carhart 四因子</td><td className="p-4">1997</td><td className="p-4">三因子 + MOM</td></tr>
                            <tr className="bg-gray-50"><td className="p-4">Fama-French 五因子</td><td className="p-4">2015</td><td className="p-4">三因子 + RMW + CMA</td></tr>
                            <tr><td className="p-4">q-factor 模型</td><td className="p-4">2015</td><td className="p-4">MKT + ME + I/A + ROE</td></tr>
                            </tbody>
                        </table>
                    </section>

                    {/* 页脚 */}
                    <div className="mt-20 text-center text-gray-500 text-sm">
                        <p>更新于 2025 年 11 月 21 日　|　数据与模型解释参考 Fama & French 原论文系列</p>
                    </div>
                </div>
            </div>
        </>
    );
}