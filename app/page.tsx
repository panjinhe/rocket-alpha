import { PaperCard } from "@/components/PaperCard";
import { MathBlock } from "@/components/MathBlock";
import "katex/dist/katex.min.css";

export default function Home() {
    return (
        <>
            {/* Hero */}
            <section className="py-24 text-center border-b">
                <div className="container mx-auto max-w-5xl px-6">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">系统化探索 Alpha</h1>
                    <p className="text-xl text-muted-foreground mb-10">基于严谨的统计分析与基础经济学逻辑</p>
                    <MathBlock>
                        {String.raw`
$$ R_{i,t} - R_{f,t} = \alpha_i + \sum_{k=1}^K \beta_{k} F_{k,t} + \epsilon_{i,t} $$
`}
                    </MathBlock>
                </div>
            </section>

            {/* 因子/模型卡片区（可后续组件化） */}
            <section className="py-20 container mx-auto max-w-7xl px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* 示例卡片，后续你可以继续加 */}
                    <div className="border rounded-xl p-8 hover:shadow-xl transition bg-card">
                        <h3 className="font-serif text-2xl font-bold mb-4">因子看板</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between"><span>动量 Momentum</span><span className="text-green-600 font-medium">+1.2σ</span></div>
                            <div className="flex justify-between"><span>价值 Value</span><span className="text-red-600 font-medium">-0.8σ</span></div>
                            <div className="flex justify-between"><span>波动率 Volatility</span><span className="text-muted-foreground">0.1σ</span></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-6">最后更新：2025-11-21</p>
                    </div>
                    {/* 其他两个卡片同理，省略… */}
                </div>
            </section>

            {/* 研究洞察 & 经典重温 */}
            <section className="py-20 border-t bg-muted/30">
                <div className="container mx-auto max-w-7xl px-6">
                    <h2 className="text-center font-serif text-4xl font-bold mb-16">研究洞察与经典重温</h2>
                    <div className="space-y-0">
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
        </>
    );
}