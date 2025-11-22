// app/factor-model-explained/page.tsx
import Link from "next/link";
import { Eq, Inline } from "@/components/Math";
import React from "react";

export const metadata = {
    title: "多因子模型公式详解 | 系统化探索 Alpha",
    description: "经典 Fama-French 多因子资产定价模型完整符号解释与实证应用",
};

interface InlineEqProps {
    children: React.ReactNode;
    className?: string;
}

// app/factor-model-explained/page.tsx
const InlineEq: React.FC<InlineEqProps> = ({ children, className = "text-sm" }) => (
    <span // 👈 修复：改为<span>，它是一个合法的行内元素
        className={`bg-gray-100 px-2 py-1 rounded font-mono inline-flex items-center justify-center ${className}`}
    >
        <Inline>{children}</Inline>
    </span>
);

export default function FactorModelExplained() {
    const basicEqClass = "text-lg";
    const inlineEqClass = "text-sm";

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
                        经典多因子资产定价模型<br className="sm:hidden" />公式解读
                    </h1>

                    {/* 核心公式大卡片 */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 md:p-20 my-20 text-center transition-all duration-300 hover:shadow-2xl hover:border-gray-300">
                        <Link href="/factor-model-explained" className="group block cursor-default" scroll={false}>
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

                    {/* 符号解释表格 */}
                    <section className="grid md:grid-cols-2 gap-8 my-20">
                        {/* 左列：下标与收益率 */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                            <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">下标与收益率</h3>
                            <div className="space-y-5 text-lg">
                                <div><InlineEq className={inlineEqClass}>i</InlineEq>　第 i 只股票或投资组合</div>
                                <div><InlineEq className={inlineEqClass}>t</InlineEq>　时间下标（月/日）</div>
                                <div><InlineEq className={inlineEqClass}>{"R_{i,t}"}</InlineEq>　股票 i 在 t 期的总收益率</div>
                                <div><InlineEq className={inlineEqClass}>{"R_{f,t}"}</InlineEq>　t 期无风险利率</div>
                                <div className="flex items-start">
                                    <InlineEq className={basicEqClass}>{"R_{i,t} - R_{f,t}"}</InlineEq>
                                    <span className="ml-4">　超额收益率（Excess Return）</span>
                                </div>
                            </div>
                        </div>

                        {/* 右列：核心参数 */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                            <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">核心参数</h3>
                            <div className="space-y-5 text-lg">
                                <div>
                                    <InlineEq className={`${inlineEqClass} bg-red-50 text-red-700`}>{"\\alpha_i"}</InlineEq>　阿尔法（真实选股能力）<br />
                                    <span className="text-sm text-gray-600">风险调整后显著为正 → 存在超额收益</span>
                                </div>
                                <div><InlineEq className={inlineEqClass}>{"\\beta_{i,k}"}</InlineEq>　股票 i 对因子 k 的暴露（因子载荷）</div>
                                <div>
                                    <InlineEq className={inlineEqClass}>{"F_{k,t}"}</InlineEq>　因子 k 在 t 期的溢价<br />
                                    <span className="text-sm text-gray-600">MKT、SMB、HML、RMW、CMA、UMD 等</span>
                                </div>
                                <div><InlineEq className={inlineEqClass}>{"\\epsilon_{i,t}"}</InlineEq>　特异性残差（不可解释的随机噪音）</div>
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

                    {/* 主流模型对照表 + 重点推荐论文 */}
                    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-8 my-20 overflow-x-auto">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-gray-800">主流多因子模型一览（附原文 PDF）</h2>
                        <table className="w-full text-left border-collapse text-lg">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4">模型</th>
                                <th className="p-4">年份</th>
                                <th className="p-4">因子</th>
                                <th className="p-4">原文论文 PDF</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="p-4">CAPM</td>
                                <td className="p-4">1964</td>
                                <td className="p-4">MKT</td>
                                <td className="p-4">
                                    <a href="/papers/CAPM（1964）：capital asset prices a theory of market equilibrium under conditions of risk.pdf"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:underline flex items-center gap-1">
                                        Sharpe (1964) <span className="text-xs">↗</span>
                                    </a>
                                </td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="p-4">Fama-French 三因子</td>
                                <td className="p-4">1993</td>
                                <td className="p-4">MKT + SMB + HML</td>
                                <td className="p-4">
                                    <a href="/papers/FF三因子：The Cross-Section of Expected Stock Returns.pdf"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:underline flex items-center gap-1">
                                        FF (1993) <span className="text-xs">↗</span>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4">Carhart 四因子</td>
                                <td className="p-4">1997</td>
                                <td className="p-4">三因子 + MOM</td>
                                <td className="p-4">
                                    <a href="/papers/Carhart四因子：PersistenceofMutualFundPerformancebyCarhart.pdf"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:underline flex items-center gap-1">
                                        Carhart (1997) <span className="text-xs">↗</span>
                                    </a>
                                </td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="p-4">Fama-French 五因子</td>
                                <td className="p-4">2015</td>
                                <td className="p-4">三因子 + RMW + CMA</td>
                                <td className="p-4">
                                    <a href="/papers/FF五因子：FiveFactor.pdf"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:underline flex items-center gap-1">
                                        FF (2015) <span className="text-xs">↗</span>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        {/* 重点推荐论文 */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-serif font-bold text-gray-800 mb-6">
                                ✨ 重点推荐阅读（本页核心公式最完整实证来源）
                            </h3>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                                <p className="text-lg font-medium text-gray-800 mb-4">
                                    Fama & French (1996) 《Multifactor Explanations of Asset Pricing Anomalies》
                                </p>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    这篇论文正式给出了你页面里最经典的时间序列回归形式，<br />
                                    并用真实数据展示了三因子模型如何解释绝大多数 CAPM 异象。<br />
                                    几乎所有教科书、博客、量化课程在解释&nbsp;
                                    <InlineEq className="text-base">{"\\alpha_i"}</InlineEq>、
                                    <InlineEq className="text-base">{"\\beta_{i,k}"}</InlineEq>、
                                    <InlineEq className="text-base">{"F_{k,t}"}</InlineEq>&nbsp;时都引用这篇。
                                </p>
                                <a
                                    href="https://www3.nd.edu/~nmark/FinancialEconometrics/2022Course/CourseNotes/THE_Fama_French_3FactorPaper.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
                                >
                                    立即下载 PDF（免费）
                                </a>
                            </div>
                        </div>
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