import { PaperCard } from "@/components/PaperCard";
import { MathBlock } from "@/components/MathBlock";
import { Eq } from "@/components/Math";

// 假设您的全局CSS已设置了基础字体变量，例如：
// font-serif: Merriweather, Noto Serif SC
// font-sans: Inter, Noto Sans SC

export default function Home() {
    return (
        <>
            {/* Hero 区域 (公式与标语) - 对应 .hero */}
            <section className="py-20 text-center border-b border-gray-200">
                <div className="container mx-auto max-w-5xl px-8"> {/* 增加左右边距 */}
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-gray-900">系统化探索 Alpha</h1>
                    <p className="text-xl text-gray-600 max-w-xl mx-auto mb-10"> {/* 模拟 .hero-subtitle 样式 */}
                        基于严谨的统计分析与基础经济学逻辑
                    </p>
                    {/* MathBlock - 模拟 .math-display 样式 */}
                    <div className="text-2xl mt-8 mb-4 text-gray-700">
                        {/* 经典的资产定价模型公式 */}
                        <Eq>{`$$R_{i,t} - R_{f,t} = \\alpha_i + \\sum_{k=1}^K \\beta_k F_{k,t} + \\epsilon_{i,t}$$`}</Eq>
                    </div>
                </div>
            </section>

            {/* 核心三个板块 - 对应 .modules */}
            <section className="py-16 container mx-auto max-w-7xl px-8">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* 卡片 1: 因子动物园 (Factor Zoo) - 替换原“因子看板” */}
                    <div className="bg-white border border-gray-200 p-8 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg hover:border-gray-300">
                        <div className="flex justify-between items-baseline mb-6 border-b pb-4 border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-gray-800">因子动物园 Factor Zoo</h3>
                            {/* 标签颜色改为红色 */}
                            <span className="font-mono text-xs uppercase text-red-700 border border-red-700 px-1 py-0.5 rounded-sm">
                                暴露度
                            </span>
                        </div>
                        <div className="space-y-4 text-sm text-gray-700">
                            {/* 英文因子名称，中文趋势 */}
                            <div className="flex justify-between"><span>Momentum</span><span className="text-green-600 font-medium">+1.5σ (Overweight)</span></div>
                            <div className="flex justify-between"><span>Value</span><span className="text-red-600 font-medium">-1.0σ (Underweight)</span></div>
                            <div className="flex justify-between"><span>Quality</span><span className="text-gray-500">0.2σ (Neutral)</span></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-6 pt-2 border-t border-dashed border-gray-300">最后更新：2025-11-21</p>
                        {/* 链接颜色改为红色 */}
                        <a href="#" className="inline-block mt-4 font-mono text-sm text-gray-900 hover:text-red-700 border-b border-red-700 pb-px">
                            因子风险仪表盘 &rarr;
                        </a>
                    </div>

                    {/* 卡片 2: 模型动物园 (Model Zoo) - 替换原“量化价值” */}
                    <div className="bg-white border border-gray-200 p-8 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg hover:border-gray-300">
                        <div className="flex justify-between items-baseline mb-6 border-b pb-4 border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-gray-800">模型动物园 Model Zoo</h3>
                            {/* 标签颜色改为紫色 */}
                            <span className="font-mono text-xs uppercase text-purple-700 border border-purple-700 px-1 py-0.5 rounded-sm">
                                集成学习
                            </span>
                        </div>
                        <div className="text-sm text-gray-700 text-justify mb-4">
                            管理并优化多种预测模型（如 GBDT、LightGBM、LSTM）的预测信号集成。
                        </div>
                        <div className="bg-gray-50 p-4 rounded-sm font-mono text-xs">
                            {/* 模型性能表格 */}
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-300">
                                <tr className="text-gray-600"><th>模型</th><th>IC Score</th><th>Rank IC</th></tr>
                                </thead>
                                <tbody>
                                <tr className="h-6"><td>LGBM_V3</td><td>0.081</td><td className="text-green-600">0.095</td></tr>
                                <tr className="h-6"><td>LSTM_SEQ</td><td>0.065</td><td>0.070</td></tr>
                                <tr className="h-6"><td>GNN_Alpha</td><td>0.052</td><td className="text-red-600">0.033</td></tr>
                                </tbody>
                            </table>
                        </div>
                        {/* 链接颜色改为紫色 */}
                        <a href="#" className="inline-block mt-4 font-mono text-sm text-gray-900 hover:text-purple-700 border-b border-purple-700 pb-px">
                            模型性能监控 &rarr;
                        </a>
                    </div>

                    {/* 卡片 3: 基本面量化 (Fundamental Quant) - 替换原“机器学习” */}
                    <div className="bg-white border border-gray-200 p-8 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg hover:border-gray-300">
                        <div className="flex justify-between items-baseline mb-6 border-b pb-4 border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-gray-800">基本面量化 Fundamental Quant</h3>
                            {/* 标签颜色改为青色 */}
                            <span className="font-mono text-xs uppercase text-teal-700 border border-teal-700 px-1 py-0.5 rounded-sm">
                                价值/质量
                            </span>
                        </div>
                        <div className="text-sm text-gray-700 text-justify mb-4">
                            融合财务报表分析、管理层质量评估和估值模型，形成高质量投资组合。
                        </div>
                        <div className="bg-gray-800 text-gray-300 p-4 rounded-sm font-mono text-xs overflow-x-auto">
                            {/* 模拟基本面分析终端 - 单引号已转义为 &apos; */}
                            <pre className="whitespace-pre-wrap">
                                &gt; ticker = &apos;600519&apos;<br/>
                                &gt; <span className="text-yellow-400">ROE_Avg5y: 35.8%</span><br/>
                                &gt; <span className="text-green-400">Valuation_Margin: 20%</span><br/>
                                &gt; PE_TTM: 30.5<br/>
                                &gt; <span className="text-red-400">Risk_Score: Low</span>
                            </pre>
                        </div>
                        {/* 链接颜色改为青色 */}
                        <a href="#" className="inline-block mt-4 font-mono text-sm text-gray-900 hover:text-teal-700 border-b border-teal-700 pb-px">
                            筛选高质量资产 &rarr;
                        </a>
                    </div>

                </div>
            </section>

            {/* 研究洞察 & 经典重温 - 对应 .papers-section */}
            <section className="py-16 border-t border-gray-200 bg-gray-50">
                <div className="container mx-auto max-w-7xl px-8">
                    <h2 className="text-center font-serif text-3xl md:text-4xl font-bold mb-12 text-gray-900">经典研究</h2>
                    {/* PaperCard 列表 - 确保 PaperCard 内部样式适合列表展示 */}
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