//app/strategy-zoo/page.tsx
'use client';

import React, { useState } from 'react';
// 引入图标
import {
    ArrowUp, ArrowDown, ArrowUpDown, Shield, DollarSign,
    Target, Settings, ChevronLeft, SlidersHorizontal, Zap,
} from 'lucide-react';

// --- 1. 定义 TypeScript 接口 ---

// 定义单条策略数据的结构
interface StrategyData {
    id: number;
    name: string; // 策略名称
    returnAnn: string; // 年化收益率
    sharpe: string; // 夏普比率
    maxDrawdown: string; // 最大回撤
    turnover: string; // 换手率
    beta: string; // 相对基准的 Beta
    exposureType: 'Value' | 'Momentum' | 'Blend' | 'Quality' | 'LowVol'; // 核心暴露类型
}

// 定义所有可排序的列键名
type SortKey = keyof Omit<StrategyData, 'id' | 'name' | 'exposureType'>;

// 定义排序配置的结构
interface SortConfig {
    key: SortKey | null;
    direction: 'asc' | 'desc';
}

// --- 2. 模拟数据 ---
const initialData: StrategyData[] = [
    { id: 1, name: 'Value-Momentum Blend', returnAnn: '18.5', sharpe: '1.55', maxDrawdown: '-8.2', turnover: '3.1', beta: '0.85', exposureType: 'Blend' },
    { id: 2, name: 'Low Volatility (低波动)', returnAnn: '7.4', sharpe: '0.92', maxDrawdown: '-4.5', turnover: '2.0', beta: '0.55', exposureType: 'LowVol' },
    { id: 3, name: 'Fundamental Value (基本面价值)', returnAnn: '12.1', sharpe: '1.20', maxDrawdown: '-10.5', turnover: '1.5', beta: '1.02', exposureType: 'Value' },
    { id: 4, name: 'Quality Growth (质量成长)', returnAnn: '15.9', sharpe: '1.45', maxDrawdown: '-7.1', turnover: '2.8', beta: '0.95', exposureType: 'Quality' },
    { id: 5, name: 'Short-Term Reversal (短期反转)', returnAnn: '-2.3', sharpe: '-0.30', maxDrawdown: '-15.8', turnover: '8.5', beta: '1.15', exposureType: 'Momentum' },
    { id: 6, name: 'High-Frequency Mean Reversion', returnAnn: '9.8', sharpe: '1.05', maxDrawdown: '-6.0', turnover: '12.0', beta: '0.70', exposureType: 'Blend' },
];

// --- 3. 独立且类型化的工具组件 (复用 Factor Zoo 逻辑) ---

interface SortIconProps {
    columnKey: SortKey;
    sortConfig: SortConfig;
}

const SortIcon = ({ columnKey, sortConfig }: SortIconProps) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-300 ml-1" />;
    return sortConfig.direction === 'asc'
        ? <ArrowUp size={14} className="text-teal-700 ml-1" />
        : <ArrowDown size={14} className="text-teal-700 ml-1" />;
};

// 辅助函数：根据值返回颜色类名 (Sharpe > 1.0 为绿色，Max Drawdown < -10% 为红色)
const getColorClass = (key: SortKey, valStr: string): string => {
    const val = parseFloat(valStr);

    if (key === 'sharpe') {
        if (val > 1.0) return "text-green-700 font-bold";
        if (val < 0.5) return "text-red-700";
        return "text-gray-700";
    }

    if (key === 'maxDrawdown') {
        if (val < -10.0) return "text-red-700 font-bold"; // 最大回撤越大（负值越小）越差
        if (val > -5.0) return "text-green-700"; // 最大回撤越小越好
        return "text-gray-700";
    }

    if (key === 'returnAnn') {
        if (val > 10.0) return "text-green-700 font-bold";
        if (val < 0.0) return "text-red-700";
        return "text-gray-700";
    }

    return "text-gray-600";
};

// 暴露类型标签组件
const ExposureTag = ({ type }: { type: StrategyData['exposureType'] }) => {
    let colorClass = '';
    let bgColorClass = '';
    switch (type) {
        case 'Value':
            colorClass = 'text-blue-700';
            bgColorClass = 'bg-blue-50';
            break;
        case 'Momentum':
            colorClass = 'text-red-700';
            bgColorClass = 'bg-red-50';
            break;
        case 'Quality':
            colorClass = 'text-green-700';
            bgColorClass = 'bg-green-50';
            break;
        case 'LowVol':
            colorClass = 'text-purple-700';
            bgColorClass = 'bg-purple-50';
            break;
        case 'Blend':
        default:
            colorClass = 'text-teal-700';
            bgColorClass = 'bg-teal-50';
            break;
    }
    return (
        <span className={`font-mono text-xs uppercase ${colorClass} ${bgColorClass} px-2 py-0.5 rounded-full font-medium`}>
            {type}
        </span>
    );
};

// --- 4. 主组件 StrategyZooPage ---
const StrategyMethodology = () => (
    <div className="bg-white p-8 border border-gray-200 shadow-lg">
        <h2 className="font-serif text-3xl font-bold mb-4 text-gray-900">策略回测标准与方法论</h2>
        <p className="text-gray-600 mb-6">此处将详细说明所有策略的构建、调仓、回测和风险管理规则，确保透明度和可重复性。</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
            <li><span className="font-bold">基准：</span>沪深 300 (CSI 300 Total Return)</li>
            <li><span className="font-bold">交易成本：</span>双边滑点 5 BPS，佣金 2 BPS。</li>
            <li><span className="font-bold">调仓周期：</span>Value, Quality 策略为季度；Momentum, LowVol 为月度。</li>
            <li><span className="font-bold">风险限制：</span>单个行业权重上限 25%，单个股票权重上限 3%。</li>
        </ul>
    </div>
);


export default function StrategyZooPage() {
    const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | '5Y'>('3Y');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'sharpe', direction: 'desc' });
    const [data, setData] = useState<StrategyData[]>(initialData);

    // 【新增状态】控制显示哪个页面：'zoo' (主表格) 或 'methodology' (流程说明)
    const [view, setView] = useState<'zoo' | 'methodology'>('zoo');


    const handleSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        // 默认情况下，Sharpe 和 Return 是降序，Drawdown 是升序
        const defaultAscKeys: SortKey[] = ['maxDrawdown', 'turnover', 'beta'];

        // 切换排序方向
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'desc') {
                direction = 'asc';
            } else {
                // 如果是夏普和收益，升序后再点击回到默认降序
                direction = defaultAscKeys.includes(key) ? 'desc' : 'asc';
            }
        } else {
            // 新列点击，使用默认排序方向
            direction = defaultAscKeys.includes(key) ? 'asc' : 'desc';
        }

        const sortedData = [...data].sort((a, b) => {
            const valA = parseFloat(a[key]);
            const valB = parseFloat(b[key]);

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setData(sortedData);
    };

    // 默认排序：初始加载时进行一次排序
    React.useEffect(() => {
        handleSort('sharpe');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // 【条件渲染】如果当前是方法论视图，则直接渲染 StrategyMethodology 组件
    if (view === 'methodology') {
        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans">
                <div className="max-w-7xl mx-auto mb-6">
                    {/* 返回按钮 */}
                    <button
                        onClick={() => setView('zoo')}
                        className="flex items-center text-gray-700 hover:text-teal-700 transition-colors mb-6 text-sm font-medium"
                    >
                        <ChevronLeft size={16} className="mr-1" /> 返回策略总览
                    </button>
                    <StrategyMethodology />
                </div>
            </div>
        );
    }

    // --- 概览指标卡计算 ---
    const bestSharpeStrategy = data.reduce((max, current) =>
        parseFloat(current.sharpe) > parseFloat(max.sharpe) ? current : max, data[0]
    );
    const worstDrawdownStrategy = data.reduce((min, current) =>
        parseFloat(current.maxDrawdown) > parseFloat(min.maxDrawdown) ? current : min, data[0]
    );

    // 【默认渲染】主策略总览表格
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto mb-6">
                {/* --- 顶部导航区 --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-900 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="font-serif text-4xl font-bold text-gray-900">Strategy Zoo</h1>
                        </div>
                        <p className="text-gray-600 font-serif italic">
                            多类型量化投资策略表现监控 / 基准：沪深 300
                        </p>
                    </div>

                    {/* 时间与操作区 */}
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex bg-white border border-gray-300 rounded-sm p-1 shadow-sm">
                            <button
                                onClick={() => setTimeRange('1Y')}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${timeRange === '1Y' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                近 1Y
                            </button>
                            <div className="w-px bg-gray-200 my-1"></div>
                            <button
                                onClick={() => setTimeRange('3Y')}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${timeRange === '3Y' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                近 3Y
                            </button>
                            <div className="w-px bg-gray-200 my-1"></div>
                            <button
                                onClick={() => setTimeRange('5Y')}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${timeRange === '5Y' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                近 5Y
                            </button>
                        </div>
                        <button className="bg-teal-700 text-white px-4 py-2 text-sm font-medium hover:bg-teal-800 shadow-sm transition-colors">
                            回测工具箱 <Settings size={16} className="ml-1 inline-block" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 策略计算标准链接栏 (切换按钮) --- */}
            <div className="max-w-7xl mx-auto mb-8">
                <div
                    onClick={() => setView('methodology')}
                    className="flex items-center justify-between p-3 bg-white border border-teal-200 text-teal-700 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer"
                >
                    <span className="flex items-center text-sm font-medium gap-3">
                        <SlidersHorizontal size={18} className="text-teal-600" />
                        <span className="font-serif">策略回测标准与方法论</span>
                        <span className="text-gray-500 font-mono text-xs hidden sm:inline-block">/ Backtest Rules & Configuration</span>
                    </span>
                    <span className="font-mono text-xs uppercase border border-teal-700 px-2 py-0.5 rounded-full hover:bg-teal-700 hover:text-white transition-colors">
                        查看详情
                    </span>
                </div>
            </div>

            {/* --- 概览指标卡 (Dashboard Summary) --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "最优风险调整", value: bestSharpeStrategy.name, sub: `${bestSharpeStrategy.sharpe} Sharpe Ratio`, icon: <Shield size={16}/>, color: 'border-l-teal-700' },
                    { label: "最大回撤最小", value: worstDrawdownStrategy.name, sub: `${worstDrawdownStrategy.maxDrawdown}% Max DD`, icon: <Target size={16}/>, color: 'border-l-blue-700' },
                    { label: "平均换手率", value: "2.8x", sub: "Monthly", icon: <Zap size={16}/>, color: 'border-l-red-700' },
                    { label: "策略数量", value: `${data.length} Activated`, sub: "Full Universe", icon: <DollarSign size={16}/>, color: 'border-l-gray-900' },
                ].map((card, idx) => (
                    <div key={idx} className={`bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow border-l-4 ${card.color}`}>
                        <div className="text-xs text-gray-500 uppercase font-mono mb-1 flex items-center gap-2">
                            {card.icon} {card.label}
                        </div>
                        <div className="text-xl font-serif font-bold text-gray-900">{card.value}</div>
                        <div className={`text-sm font-mono mt-1 ${idx === 0 ? 'text-teal-700' : 'text-gray-500'}`}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* --- 核心数据表格 --- */}
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-medium tracking-wider">
                            <th className="p-4 w-60 font-serif text-gray-900">策略名称 (Strategy)</th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('returnAnn')}>
                                <div className="flex items-center">年化收益 <SortIcon columnKey="returnAnn" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('sharpe')}>
                                <div className="flex items-center">夏普比率 <SortIcon columnKey="sharpe" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('maxDrawdown')}>
                                <div className="flex items-center">最大回撤 <SortIcon columnKey="maxDrawdown" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('turnover')}>
                                <div className="flex items-center">年化换手率 <SortIcon columnKey="turnover" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('beta')}>
                                <div className="flex items-center">相对 Beta <SortIcon columnKey="beta" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 text-gray-400">
                                <div className="flex items-center">核心暴露</div>
                            </th>
                            <th className="p-4 w-24">净值曲线</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 font-serif font-bold text-gray-800 border-l-2 border-transparent hover:border-teal-700 transition-all">
                                    {row.name}
                                </td>
                                <td className={`p-4 font-mono-financial ${getColorClass('returnAnn', row.returnAnn)}`}>
                                    {row.returnAnn}%
                                </td>
                                <td className={`p-4 font-mono-financial-bold ${getColorClass('sharpe', row.sharpe)} bg-teal-50/50`}>
                                    {row.sharpe}
                                </td>
                                <td className={`p-4 font-mono-financial ${getColorClass('maxDrawdown', row.maxDrawdown)}`}>
                                    {row.maxDrawdown}%
                                </td>
                                <td className="p-4 font-mono-financial text-gray-600">
                                    {row.turnover}x
                                </td>
                                <td className="p-4 font-mono-financial text-gray-900">
                                    {row.beta}
                                </td>
                                <td className="p-4">
                                    <ExposureTag type={row.exposureType} />
                                </td>
                                <td className="p-4">
                                    {/* 这里用 CSS 模拟一条趋势线 */}
                                    <div className="h-6 w-16 flex items-end gap-0.5 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-teal-700' : 'bg-red-700'}`} style={{height: '40%'}}></div>
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-teal-700' : 'bg-red-700'}`} style={{height: '60%'}}></div>
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-teal-700' : 'bg-red-700'}`} style={{height: '30%'}}></div>
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-teal-700' : 'bg-red-700'}`} style={{height: '80%'}}></div>
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-teal-700' : 'bg-red-700'}`} style={{height: '50%'}}></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 底部注释 */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <span>* Sharpe Ratio 计算基于无风险利率 2.5%; 最大回撤为历史最大峰谷值。</span>
                    <span>Displaying {data.length} strategies</span>
                </div>
            </div>
        </div>
    );
}