// app/page.tsx
import Link from "next/link";
import { PaperCard } from "@/components/PaperCard";
import { Eq } from "@/components/Math";
import { Activity, TrendingUp, Sparkles, SlidersHorizontal } from 'lucide-react';

import { useFactorZooSummary } from '@/lib/useFactorZooSummary';
import { useStrategyZooSummary } from '@/lib/useStrategyZooSummary';

export default function Home() {
    // 因子数据（保持 3Y）
    const factorSummary = useFactorZooSummary('3Y');
    // 策略数据（Hook 内部自动处理最新月份）
    const strategySummary = useStrategyZooSummary();

    return (
        <>
            {/* Hero 区域 */}
            <section className="py-20 text-center border-b border-gray-200">
                <div className="container mx-auto max-w-5xl px-8">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-gray-900">
                        系统化探索 Alpha
                    </h1>
                    <p className="text-xl text-gray-600 max-w-xl mx-auto mb-10">
                        基于严谨的统计分析与基础经济学逻辑
                    </p>
                    <Link
                        href="/factor-model-explained"
                        className="block group cursor-pointer hover:opacity-80 transition-all duration-300"
                    >
                        <Eq>{`$$R_{i,t} - R_{f,t} = \\alpha_i + \\sum_{k=1}^K \\beta_k F_{k,t} + \\epsilon_{i,t}$$`}</Eq>
                        <p className="text-sm text-gray-500 mt-6 text-center">
                            点击查看完整符号解释
                        </p>
                    </Link>
                </div>
            </section>

            {/* 核心三个板块 */}
            <section className="py-16 container mx-auto max-w-7xl px-8">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* 卡片 1：因子动物园 */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-xl rounded-lg">
                        {/* Header 布局优化：英文下沉，防止与 Badge 挤压 */}
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <Activity className="w-5 h-5 text-gray-900" />
                                    <h3 className="font-serif text-lg font-bold text-gray-900">
                                        因子动物园
                                    </h3>
                                </div>
                                <div className="text-xs text-gray-400 font-mono pl-7 mt-0.5">FACTOR ZOO</div>
                            </div>
                            <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full font-medium ml-2">
                                Alpha Champion
                            </span>
                        </div>

                        {/* 冠军大高亮 */}
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6 mb-6 border-2 border-amber-300 shadow-lg">
                            <div className="absolute top-2 right-2">
                                <span className="text-4xl opacity-20">1st</span>
                            </div>
                            <p className="text-sm uppercase text-amber-700 font-mono tracking-wider mb-2">
                                当前最强因子 · 近三年冠军
                            </p>
                            <div className="text-2xl font-bold text-gray-900 font-serif leading-tight">
                                {factorSummary.champion.name}
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                                <div className="text-4xl font-bold text-amber-600">
                                    {factorSummary.champion.return}
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-amber-700 font-mono">
                                超额年化冠军 · A股全市场多空组合
                            </div>
                        </div>

                        {/* 第 2~4 名 */}
                        <div className="space-y-2.5 text-sm">
                            {factorSummary.runnersUp.map((item) => (
                                <div key={item.rank} className="flex justify-between items-center px-1">
                                    <span className="text-gray-500">
                                        <span className="inline-block w-6 text-xs font-mono-financial text-gray-900">
                                            {item.rank}
                                        </span>
                                        <span className="text-gray-700 font-medium">{item.name}</span>
                                    </span>
                                    <span className={`font-mono-financial ${item.return.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {item.return}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                            数据截止至 {factorSummary.lastUpdate}
                        </div>

                        <Link
                            href="/factor-zoo"
                            className="mt-4 block w-full text-center bg-red-700 text-white py-2.5 text-sm font-medium rounded-md hover:bg-red-800 transition-all shadow-md"
                        >
                            进入因子动物园 →
                        </Link>
                    </div>

                    {/* 卡片 2：模型动物园 */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-xl rounded-lg">
                        {/* Header 布局优化 */}
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="w-5 h-5 text-gray-900" />
                                    <h3 className="font-serif text-lg font-bold text-gray-900">
                                        模型动物园
                                    </h3>
                                </div>
                                <div className="text-xs text-gray-400 font-mono pl-7 mt-0.5">MODEL ZOO</div>
                            </div>
                            <span className="shrink-0 font-mono text-xs uppercase text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-medium ml-2">
                                Model Perf.
                            </span>
                        </div>

                        {/* 当前主导模型 */}
                        <div className="bg-gray-50 p-4 mb-5 rounded-md border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-mono mb-1">
                                当前主导模型 (Top Model)
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">LGBM_V3</span>
                                <span className="flex items-center space-x-1.5">
                                    <TrendingUp className="w-6 h-6 text-green-700" />
                                    <span className="text-2xl font-bold font-mono-financial text-green-700">
                                        +0.081
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* 第 2、3 名 */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-100">
                                <span className="text-gray-600">LSTM_SEQ</span>
                                <span className="font-mono-financial text-green-600">+0.065</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-100">
                                <span className="text-gray-600">GNN_Alpha</span>
                                <span className="font-mono-financial text-red-600">+0.052</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-6 pt-3 border-t border-gray-100">
                            最后更新：2025-11-30
                        </p>
                        <Link
                            href="/model-zoo"
                            className="block mt-4 w-full text-center bg-purple-700 text-white py-2.5 text-sm font-medium rounded-md hover:bg-purple-800 transition-colors shadow-md"
                        >
                            进入模型动物园 →
                        </Link>
                    </div>

                    {/* 卡片 3：策略动物园 */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-xl rounded-lg">
                        {/* Header 布局优化 */}
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <SlidersHorizontal className="w-5 h-5 text-gray-900" />
                                    <h3 className="font-serif text-lg font-bold text-gray-900">
                                        策略动物园
                                    </h3>
                                </div>
                                <div className="text-xs text-gray-400 font-mono pl-7 mt-0.5">STRATEGY ZOO</div>
                            </div>
                            <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full font-medium ml-2">
                                Sharpe Leader
                            </span>
                        </div>

                        {/* 冠军大高亮：模仿 Card 1，但使用 Teal/Cyan 色系 */}
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6 mb-6 border-2 border-teal-300 shadow-lg">
                            <div className="absolute top-2 right-2">
                                <span className="text-4xl opacity-20">1st</span>
                            </div>
                            <p className="text-sm uppercase text-teal-700 font-mono tracking-wider mb-2">
                                当前夏普冠军 · 近一年
                            </p>
                            <div className="text-xl font-bold text-gray-900 font-serif leading-tight">
                                {strategySummary.champion.name}
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                                <div className="text-4xl font-bold text-teal-700">
                                    {strategySummary.champion.sharpe}
                                </div>
                                <div className="text-xs text-teal-600 font-medium mb-1">
                                    夏普比率
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-teal-800 font-mono">
                                年化超额: {strategySummary.champion.excess}
                            </div>
                        </div>

                        {/* 第 2~4 名 */}
                        <div className="space-y-2.5 text-sm">
                            {strategySummary.runnersUp.map((item) => (
                                <div key={item.rank} className="flex justify-between items-center px-1">
                                    <span className="text-gray-500">
                                        <span className="inline-block w-6 text-xs font-mono-financial text-gray-900">
                                            {item.rank}
                                        </span>
                                        <span className="text-gray-700 font-medium">{item.name}</span>
                                    </span>
                                    <span className="font-mono-financial text-teal-600 font-bold">
                                        {item.sharpe}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                            数据截止至 {strategySummary.lastUpdate}
                        </div>

                        <Link
                            href="/strategy-zoo"
                            className="mt-4 block w-full text-center bg-teal-700 text-white py-2.5 text-sm font-medium rounded-md hover:bg-teal-800 transition-colors shadow-md"
                        >
                            探索投资策略 →
                        </Link>
                    </div>

                </div>
            </section>

            {/* 经典研究板块 */}
            <section className="py-16 border-t border-gray-200 bg-gray-50">
                <div className="container mx-auto max-w-7xl px-8">
                    <h2 className="text-center font-serif text-3xl md:text-4xl font-bold mb-12 text-gray-900">
                        经典研究
                    </h2>
                    <div className="space-y-0">
                        <PaperCard
                            cnTitle="中国市场的规模因子与价值因子"
                            enTitle="Size and Value in China"
                            authors="Jianan Liu, Robert F. Stambaugh, Yu Yuan"
                            affiliation="上海交通大学 • 宾夕法尼亚大学沃顿商学院"
                            journal="Journal of Financial Economics, 2019"
                            pdf="papers/Size-and-Value-in-China.pdf"
                            tag="2019-03 • CC BY 4.0"
                        />
                        <PaperCard
                            cnTitle="股票预期收益率的横截面研究"
                            enTitle="The Cross-Section of Expected Stock Returns"
                            authors="Eugene F. Fama, Kenneth R. French"
                            journal="Journal of Finance, 1992"
                            pdf="papers/The Cross-Section of Expected Stock Returns.pdf"
                            tag="1992-06 • 被引用 36,000+"
                        />
                        <PaperCard
                            cnTitle="共同基金业绩持续性研究"
                            enTitle="On Persistence in Mutual Fund Performance"
                            authors="Mark M. Carhart"
                            journal="Journal of Finance, 1997"
                            pdf="papers/PersistenceofMutualFundPerformancebyCarhart.pdf"
                            tag="1997 • 四因子模型开山之作"
                        />
                        <PaperCard
                            cnTitle="五因子资产定价模型"
                            enTitle="A Five-Factor Asset Pricing Model"
                            authors="Eugene F. Fama, Kenneth R. French"
                            journal="Journal of Financial Economics, 2015"
                            pdf="papers/FiveFactor.pdf"
                            tag="2015 • 近十年主流模型"
                        />
                        <PaperCard
                            cnTitle="质量减垃圾：高质量股票的超额回报"
                            enTitle="Quality Minus Junk"
                            authors="Cliff Asness, Andrea Frazzini, Lasse H. Pedersen"
                            affiliation="AQR Capital Management"
                            journal="Review of Accounting Studies, 2014"
                            pdf="papers/Quality Minus Junk.pdf"
                            tag="2013 • Quality 因子开山"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}