import { PaperCard } from "@/components/PaperCard";
import { MathBlock } from "@/components/MathBlock";
import "katex/dist/katex.min.css";

// 假设您的全局CSS已设置了基础字体变量，例如：
// font-serif: Merriweather, Noto Serif SC
// font-sans: Inter, Noto Sans SC

export default function Home() {
    return (
        <>
            {/* 导航栏 (未在原page.tsx中，但需要补充) */}
            {/* 假设您有一个 Header 组件，包含在您的 Layout 或全局文件中 */}
            {/* <header className="sticky top-0 z-10 border-b bg-fcfcfc py-6 px-8 flex justify-between items-center">
                <a href="#" className="font-serif font-bold text-xl tracking-widest text-gray-900">
                    <span className="text-gray-800">Rocket</span>
                    <span className="text-red-600 italic">Alpha</span> // 模拟新的 Logo 颜色
                </a>
                <nav>
                    <ul className="flex space-x-8 list-none">
                        <li><a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">仪表盘</a></li>
                        // ... 其他导航项
                    </ul>
                </nav>
            </header>
            */}

            {/* Hero 区域 (公式与标语) - 对应 .hero */}
            <section className="py-20 text-center border-b border-gray-200">
                <div className="container mx-auto max-w-5xl px-8"> {/* 增加左右边距 */}
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-gray-900">系统化探索 Alpha</h1>
                    <p className="text-xl text-gray-600 max-w-xl mx-auto mb-10"> {/* 模拟 .hero-subtitle 样式 */}
                        基于严谨的统计分析与基础经济学逻辑
                    </p>
                    {/* MathBlock - 模拟 .math-display 样式 */}
                    <div className="text-2xl mt-8 mb-4 text-gray-700">
                        <MathBlock>
                            {/* 保持 KaTeX 的公式渲染 */}
                            {String.raw`
$$ R_{i,t} - R_{f,t} = \alpha_i + \sum_{k=1}^K \beta_{k} F_{k,t} + \epsilon_{i,t} $$
`}
                        </MathBlock>
                    </div>
                </div>
            </section>

            {/* 核心三个板块 - 对应 .modules */}
            <section className="py-16 container mx-auto max-w-7xl px-8">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* 卡片 1: 因子看板 (基于您的第一个示例卡片进行修改) */}
                    <div className="bg-white border border-gray-200 p-8 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg hover:border-gray-300">
                        <div className="flex justify-between items-baseline mb-6 border-b pb-4 border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-gray-800">因子看板</h3>
                            <span className="font-mono text-xs uppercase text-blue-700 border border-blue-700 px-1 py-0.5 rounded-sm">
                                风险溢价
                            </span>
                        </div>
                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex justify-between"><span>动量 Momentum</span><span className="text-green-600 font-medium">+1.2σ (偏高)</span></div>
                            <div className="flex justify-between"><span>价值 Value</span><span className="text-red-600 font-medium">-0.8σ (偏低)</span></div>
                            <div className="flex justify-between"><span>波动率 Volatility</span><span className="text-gray-500">0.1σ (中性)</span></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-6 pt-2 border-t border-dashed border-gray-300">最后更新：2025-11-21</p>
                        <a href="#" className="inline-block mt-4 font-mono text-sm text-gray-900 hover:text-blue-700 border-b border-blue-700 pb-px">
                            探索因子数据 &rarr;
                        </a>
                    </div>

                    {/* 卡片 2: 量化价值 - 模拟 .card 样式 */}
                    <div className="bg-white border border-gray-200 p-8 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg hover:border-gray-300">
                        <div className="flex justify-between items-baseline mb-6 border-b pb-4 border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-gray-800">量化价值</h3>
                            <span className="font-mono text-xs uppercase text-blue-700 border border-blue-700 px-1 py-0.5 rounded-sm">
                                基本面
                            </span>
                        </div>
                        <div className="text-sm text-gray-700 text-justify mb-4">
                            系统化识别交易价格显著低于内在价值的高质量上市公司。
                        </div>
                        <div className="bg-gray-50 p-4 rounded-sm font-mono text-xs">
                            {/* 模拟表格 - 对应 .data-viz-placeholder */}
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-300">
                                <tr className="text-gray-600"><th>代码</th><th>F-Score</th><th>安全边际</th></tr>
                                </thead>
                                <tbody>
                                <tr className="h-6"><td>600519</td><td>8</td><td>15%</td></tr>
                                <tr className="h-6"><td>000858</td><td>7</td><td>22%</td></tr>
                                <tr className="h-6"><td>601318</td><td>6</td><td className="text-red-600">-5%</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <a href="#" className="inline-block mt-4 font-mono text-sm text-gray-900 hover:text-blue-700 border-b border-blue-700 pb-px">
                            筛选投资标的 &rarr;
                        </a>
                    </div>

                    {/* 卡片 3: 机器学习 - 模拟 .card 样式 */}
                    <div className="bg-white border border-gray-200 p-8 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg hover:border-gray-300">
                        <div className="flex justify-between items-baseline mb-6 border-b pb-4 border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-gray-800">机器学习</h3>
                            <span className="font-mono text-xs uppercase text-blue-700 border border-blue-700 px-1 py-0.5 rounded-sm">
                                非线性
                            </span>
                        </div>
                        <div className="text-sm text-gray-700 text-justify mb-4">
                            部署梯度提升树 (XGBoost) 与深度学习模型以捕捉非线性市场信号。
                        </div>
                        <div className="bg-gray-800 text-gray-300 p-4 rounded-sm font-mono text-xs overflow-x-auto">
                            {/* 模拟代码块 - 对应深色 .data-viz-placeholder */}
                            <pre className="whitespace-pre-wrap">
                                &gt; import xgboost as xgb<br/>
                                &gt; model = xgb.train(params)<br/>
                                &gt; pred = model.predict(X_test)<br/>
                                &gt; <span className="text-green-400">IC_Test: 0.084</span><br/>
                                &gt; <span className="text-red-400">Overfit: Low</span>
                            </pre>
                        </div>
                        <a href="#" className="inline-block mt-4 font-mono text-sm text-gray-900 hover:text-blue-700 border-b border-blue-700 pb-px">
                            查看模型信号 &rarr;
                        </a>
                    </div>

                </div>
            </section>

            {/* 研究洞察 & 经典重温 - 对应 .papers-section */}
            <section className="py-16 border-t border-gray-200 bg-gray-50">
                <div className="container mx-auto max-w-7xl px-8">
                    <h2 className="text-center font-serif text-3xl md:text-4xl font-bold mb-12 text-gray-900">研究洞察与经典重温</h2>
                    <div className="space-y-0">
                        {/* 所有的 PaperCard 组件都需要调整内部样式 */}
                        <PaperCard
                            cnTitle="中国市场的规模因子与价值因子"
                            enTitle="Size and Value in China"
                            authors="Jianan Liu, Robert F. Stambaugh, Yu Yuan"
                            affiliation="上海交通大学 • 宾夕法尼亚大学沃顿商学院"
                            journal="Journal of Financial Economics, 2019"
                            pdf="Size-and-Value-in-China.pdf"
                            tag="2019-03 • CC BY 4.0"
                        />
                        <PaperCard
                            cnTitle="股票预期收益率的横截面研究"
                            enTitle="The Cross-Section of Expected Stock Returns"
                            authors="Eugene F. Fama, Kenneth R. French"
                            journal="Journal of Finance, 1992"
                            pdf="The Cross-Section of Expected Stock Returns.pdf"
                            tag="1992-06 • 被引用 36,000+"
                        />
                        <PaperCard
                            cnTitle="共同基金业绩持续性研究"
                            enTitle="On Persistence in Mutual Fund Performance"
                            authors="Mark M. Carhart"
                            journal="Journal of Finance, 1997"
                            pdf="Carhart-Four-Factor-1997.pdf"
                            tag="1997 • 四因子模型开山之作"
                        />
                        <PaperCard
                            cnTitle="五因子资产定价模型"
                            enTitle="A Five-Factor Asset Pricing Model"
                            authors="Eugene F. Fama, Kenneth R. French"
                            journal="Journal of Financial Economics, 2015"
                            pdf="Fama-French-Five-Factor-2015.pdf"
                            tag="2015 • 近十年主流模型"
                        />
                        <PaperCard
                            cnTitle="质量减垃圾：高质量股票的超额回报"
                            enTitle="Quality Minus Junk"
                            authors="Cliff Asness, Andrea Frazzini, Lasse H. Pedersen"
                            affiliation="AQR Capital Management"
                            journal="Review of Accounting Studies, 2014"
                            pdf="Quality-Minus-Junk-2013.pdf"
                            tag="2013 • Quality 因子开山"
                        />
                    </div>
                </div>
            </section>

            {/* 底部 (未在原page.tsx中，但需要补充) */}
            {/* 假设您有一个 Footer 组件，包含在您的 Layout 或全局文件中 */}
            {/*
            <footer className="py-8 text-center text-xs text-gray-500 border-t border-gray-200">
                <div className="container mx-auto px-8">
                    <p>&copy; 2025 Alpha Quant Research. 版权所有。</p>
                    <p className="mt-1">数据来源：Wind & CSMAR。仅供学术交流使用。</p>
                </div>
            </footer>
            */}
        </>
    );
}