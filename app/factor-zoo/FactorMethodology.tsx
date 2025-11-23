// components/FactorMethodology.tsx
import React from 'react';
// 引入 LucideIcon 类型，用于确保 icon props 的类型正确性
import { Sigma, Zap, BarChart, BookOpen, Layers, LucideIcon } from 'lucide-react';

interface SectionTitleProps {
    icon: LucideIcon;
    title: string;
    // 允许 description 包含 ReactNode，以便传入 JSX 元素
    description: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon: Icon, title, description }) => (
    <div className="flex items-start mb-4">
        <div className="p-3 bg-red-100 rounded-full mr-4">
            <Icon size={20} className="text-red-700" />
        </div>
        <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">{title}</h2>
            {/* description 渲染为 ReactNode */}
            <p className="text-gray-500">{description}</p>
        </div>
    </div>
);


export default function FactorMethodology() {

    // 渲染关键指标表格
    const renderKpiTable = () => (
        <table className="min-w-full divide-y divide-gray-200 border border-gray-100">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">指标 (Metric)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">计算说明</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">意义</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">年化收益率 (Return Ann.)</td>
                <td className="px-6 py-4 text-sm text-gray-600">组合回测期内收益率的年化值。</td>
                <td className="px-6 py-4 text-sm text-gray-600">衡量因子获得绝对收益的能力。</td>
            </tr>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">信息系数均值 (IC Mean)</td>
                <td className="px-6 py-4 text-sm text-gray-600">因子值排名与次月收益率排名的 Spearman 相关性均值。</td>
                {/* 修复加粗：使用 dangerouslySetInnerHTML */}
                <td
                    className="px-6 py-4 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: '衡量因子预测能力的 <strong>稳定</strong> 性。' }}
                ></td>
            </tr>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">信息率 (IR)</td>
                <td className="px-6 py-4 text-sm text-gray-600">IC Mean / IC 标准差 (σ_IC)</td>
                {/* 修复加粗：使用 dangerouslySetInnerHTML */}
                <td
                    className="px-6 py-4 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: '衡量因子预测能力的 <strong>质量</strong>，越高代表有效且稳定。' }}
                ></td>
            </tr>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">换手率 (Turnover)</td>
                {/* 修复加粗：使用 <strong> 标签和 dangerouslySetInnerHTML */}
                <td
                    className="px-6 py-4 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: '月度换仓的年化值。' }}
                ></td>
                <td className="px-6 py-4 text-sm text-gray-600">衡量组合流动性需求和交易成本。</td>
            </tr>
            </tbody>
        </table>
    );

    // 辅助函数：将纯文本字符串中的 Markdown 加粗语法（**...**）转换为 JSX
    const renderBoldText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // 提取加粗内容
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-2xl rounded-lg">
                <div className="flex items-center mb-6 border-b pb-4">
                    <BookOpen size={30} className="text-gray-900 mr-3" />
                    <h1 className="font-serif text-3xl font-bold text-gray-900">多因子指标计算流程说明</h1>
                </div>

                {/* I. 数据层 */}
                <div className="mb-10">
                    <SectionTitle
                        icon={Layers}
                        title="I. 基础设置与数据准备 (Data Layer)"
                        description="定义回测的股票池范围、数据清洗和同步标准。"
                    />
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        {/* 修复加粗 */}
                        <li>{renderBoldText('股票池：')} 沪深 A 股全市场，剔除 ST、退市、{renderBoldText('上市未满 6 个月')} 股票。</li>
                        <li>{renderBoldText('流动性：')} 剔除过去 6 个月日均成交额排名后 10% 的股票。</li>
                        <li>{renderBoldText('数据同步：')} 因子计算基于调仓日 {renderBoldText('前一交易日')} 的收盘数据和最新的已发布财务数据。</li>
                    </ul>
                </div>

                {/* II. 因子计算层 */}
                <div className="mb-10">
                    <SectionTitle
                        icon={Sigma}
                        title="II. 因子暴露计算与标准化 (Calculation Layer)"
                        description="原始指标转化为可回测因子的关键流程。"
                    />
                    <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                        <li>{renderBoldText('计算因子暴露：')} 收集原始指标（如过去 12 月回报率）。</li>
                        {/* 修复加粗 */}
                        <li>{renderBoldText('去极值处理：')} 对原始因子值进行 {renderBoldText('中位数去极值')} (Median Winsorization)。</li>
                        <li>{renderBoldText('中性化处理：')} 通过截面线性回归对因子暴露进行 {renderBoldText('市值中性化')} 和 {renderBoldText('行业中性化')}。</li>
                        {/* 修复加粗 */}
                        <li>{renderBoldText('标准化：')} 对中性化后的因子值进行 {renderBoldText('Z-Score 标准化')}，确保均值为 0，标准差为 1。</li>
                    </ol>
                </div>

                {/* III. 组合构建层 */}
                <div className="mb-10">
                    <SectionTitle
                        icon={BarChart}
                        title="III. 组合构建与绩效评估 (Portfolio Layer)"
                        description="定义多空组合的交易策略和风险评估。"
                    />
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        {/* 修复加粗 */}
                        <li>{renderBoldText('调仓频率：')} {renderBoldText('月度调仓')} (每月最后一个交易日收盘后)。</li>
                        <li>{renderBoldText('生成多空组合：')} 股票按因子分数分为 {renderBoldText('10 组 (Quintiles)')}，长仓 Q10，短仓 Q1。</li>
                        {/* 修复加粗 */}
                        <li>{renderBoldText('权重策略：')} 长仓和短仓均采用 {renderBoldText('等权重 (Equal Weight)')} 策略。</li>
                        <li>{renderBoldText('组合回报：')} 每日/月度净回报 = 长仓回报 - 短仓回报 - 交易成本。</li>
                    </ul>
                </div>

                {/* IV. 关键指标定义 */}
                <div className="mb-4">
                    <SectionTitle
                        icon={Zap}
                        title="IV. 核心绩效指标定义"
                        description="平台表格中展示的各项指标的统计学定义。"
                    />
                    {renderKpiTable()}
                    <blockquote className="mt-6 p-3 border-l-4 border-red-700 bg-red-50 text-sm text-gray-700 italic">
                        {/* 修复加粗 */}
                        注意：本平台采用 <strong>Rank IC</strong>（即因子值排名与未来收益率排名的相关系数）进行计算，其结果代表了因子对未来收益率排名的预测能力。
                    </blockquote>
                </div>
            </div>
        </div>
    );
}