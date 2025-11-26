//app/strategy-zoo/page.tsx
'use client';

import React, { useState } from 'react';
// 引入图标
import {
    ArrowUp, ArrowDown, ArrowUpDown, Shield, DollarSign,
    Target, Settings, ChevronLeft, SlidersHorizontal, Zap,
} from 'lucide-react';

// 引入刚才创建的组件 (假设在同级目录)
import { StrategyMethodology } from './StrategyMethodology';

// --- 1. 定义 TypeScript 接口 ---

// 定义单条策略数据的结构
interface StrategyData {
    id: number;
    name: string;          // 策略名称
    excessReturn: string;  // 年化超额收益 (New)
    sharpe: string;        // 夏普比率
    maxDrawdown: string;   // 最大回撤 (净值)
    maxExcessDrawdown: string; // 最大超额回撤 (New)
    winRate: string;       // 相对基准胜率 (New, e.g. "58%")
    turnover: string;      // 年化换手率
}

// 定义所有可排序的列键名
type SortKey = keyof Omit<StrategyData, 'id' | 'name' | 'exposureType'>;

// 定义排序配置的结构
interface SortConfig {
    key: SortKey | null;
    direction: 'asc' | 'desc';
}

// --- 2. 模拟数据 (更新为包含新字段) ---
const initialData: StrategyData[] = [
    {
        id: 1, name: 'Value-Momentum Blend',
        excessReturn: '8.5', sharpe: '1.55', maxDrawdown: '-8.2', maxExcessDrawdown: '-4.1',
        winRate: '62', turnover: '3.1'
    },
    {
        id: 2, name: 'Low Volatility (低波动)',
        excessReturn: '3.4', sharpe: '0.92', maxDrawdown: '-4.5', maxExcessDrawdown: '-2.8',
        winRate: '54', turnover: '2.0'
    },
    {
        id: 3, name: 'Fundamental Value (基本面价值)',
        excessReturn: '6.1', sharpe: '1.20', maxDrawdown: '-12.5', maxExcessDrawdown: '-7.5',
        winRate: '58', turnover: '1.5'
    },
    {
        id: 4, name: 'Quality Growth (质量成长)',
        excessReturn: '7.9', sharpe: '1.45', maxDrawdown: '-7.1', maxExcessDrawdown: '-5.2',
        winRate: '60', turnover: '2.8'
    },
    {
        id: 5, name: 'Short-Term Reversal (短期反转)',
        excessReturn: '-1.2', sharpe: '-0.30', maxDrawdown: '-15.8', maxExcessDrawdown: '-10.4',
        winRate: '45', turnover: '8.5'
    },
    {
        id: 6, name: 'High-Freq Mean Reversion',
        excessReturn: '4.8', sharpe: '1.05', maxDrawdown: '-6.0', maxExcessDrawdown: '-3.5',
        winRate: '56', turnover: '12.0'
    },
];

// --- 3. 工具组件 ---

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

// 辅助函数：根据值返回颜色类名
const getColorClass = (key: SortKey, valStr: string): string => {
    const val = parseFloat(valStr);

    if (key === 'sharpe') {
        if (val > 1.0) return "text-green-700 font-bold";
        if (val < 0.5) return "text-red-700";
        return "text-gray-700";
    }

    if (key === 'maxDrawdown' || key === 'maxExcessDrawdown') {
        // 回撤通常是负数。更小的负数（绝对值大）是坏的。
        if (val < -10.0) return "text-red-700 font-bold";
        if (val > -5.0) return "text-green-700";
        return "text-gray-700";
    }

    if (key === 'excessReturn') {
        if (val > 5.0) return "text-green-700 font-bold";
        if (val < 0.0) return "text-red-700";
        return "text-gray-700";
    }

    if (key === 'winRate') {
        if (val > 55) return "text-green-700 font-bold";
        if (val < 50) return "text-red-700";
        return "text-gray-700";
    }

    return "text-gray-600";
};

// --- 4. 主组件 StrategyZooPage ---

export default function StrategyZooPage() {
    const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | '5Y'>('3Y');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'sharpe', direction: 'desc' });
    const [data, setData] = useState<StrategyData[]>(initialData);

    const [view, setView] = useState<'zoo' | 'methodology'>('zoo');

    const handleSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        // 默认情况下，Sharpe, Return, WinRate 是降序
        // Drawdown, Turnover 是升序 (通常希望Drawdown小(绝对值大为坏)，Turnover小)
        // 注意：Drawdown是负数，-5 > -10。所以想要"最好的"排前面，应该是降序(desc) -> -5 在 -10 前面。
        // Turnover: 越小越好 -> 升序(asc)。

        // 这里的逻辑：点击第一次时，如果是"越大越好"的指标，用 desc；"越小越好"的指标，用 asc。
        const defaultAscKeys: SortKey[] = ['turnover'];

        if (sortConfig.key === key) {
            direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
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

    // 初始排序
    React.useEffect(() => {
        handleSort('sharpe');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 视图切换：方法论页面
    if (view === 'methodology') {
        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans">
                <div className="max-w-7xl mx-auto mb-6">
                    <button
                        onClick={() => setView('zoo')}
                        className="flex items-center text-gray-700 hover:text-teal-700 transition-colors mb-6 text-sm font-medium group"
                    >
                        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        返回策略总览
                    </button>
                    {/* 引入新的完善组件 */}
                    <StrategyMethodology />
                </div>
            </div>
        );
    }

    // 计算概览指标
    const bestSharpeStrategy = data.reduce((max, cur) => parseFloat(cur.sharpe) > parseFloat(max.sharpe) ? cur : max, data[0]);
    // 胜率最高的
    const bestWinRateStrategy = data.reduce((max, cur) => parseFloat(cur.winRate) > parseFloat(max.winRate) ? cur : max, data[0]);

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto mb-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-900 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="font-serif text-4xl font-bold text-gray-900">Strategy Zoo</h1>
                        </div>
                        <p className="text-gray-600 font-serif italic">
                            多类型量化投资策略表现监控 / 基准：沪深 300
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex bg-white border border-gray-300 rounded-sm p-1 shadow-sm">
                            {(['1Y', '3Y'] as const).map((range) => (
                                <React.Fragment key={range}>
                                    <button
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1.5 text-sm font-medium transition-colors ${timeRange === range ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        近 {range}
                                    </button>
                                    {range !== '3Y' && <div className="w-px bg-gray-200 my-1"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        <button className="bg-teal-700 text-white px-4 py-2 text-sm font-medium hover:bg-teal-800 shadow-sm transition-colors flex items-center">
                            回测工具箱 <Settings size={16} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 方法论入口 Banner */}
            <div className="max-w-7xl mx-auto mb-8">
                <div
                    onClick={() => setView('methodology')}
                    className="flex items-center justify-between p-3 bg-white border border-teal-200 text-teal-700 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer rounded-sm"
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

            {/* 概览卡片 */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "最优风险调整", value: bestSharpeStrategy.name, sub: `${bestSharpeStrategy.sharpe} Sharpe Ratio`, icon: <Shield size={16}/>, color: 'border-l-teal-700' },
                    { label: "最高胜率策略", value: bestWinRateStrategy.name, sub: `${bestWinRateStrategy.winRate}% Win Rate`, icon: <Target size={16}/>, color: 'border-l-blue-700' },
                    { label: "平均换手率", value: "3.5x", sub: "Annualized", icon: <Zap size={16}/>, color: 'border-l-red-700' },
                    { label: "在库策略", value: `${data.length} Active`, sub: "Full Universe", icon: <DollarSign size={16}/>, color: 'border-l-gray-900' },
                ].map((card, idx) => (
                    <div key={idx} className={`bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow border-l-4 ${card.color}`}>
                        <div className="text-xs text-gray-500 uppercase font-mono mb-1 flex items-center gap-2">
                            {card.icon} {card.label}
                        </div>
                        <div className="text-xl font-serif font-bold text-gray-900 truncate" title={card.value}>{card.value}</div>
                        <div className={`text-sm font-mono mt-1 ${idx === 0 ? 'text-teal-700' : 'text-gray-500'}`}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* 核心表格 */}
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-lg rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-medium tracking-wider">
                            <th className="p-4 w-48 font-serif text-gray-900">策略名称 (Strategy)</th>

                            {/* 1. 年化超额 */}
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('excessReturn')}>
                                <div className="flex items-center">年化超额 <SortIcon columnKey="excessReturn" sortConfig={sortConfig} /></div>
                            </th>

                            {/* 2. 夏普比率 */}
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('sharpe')}>
                                <div className="flex items-center">夏普比率 <SortIcon columnKey="sharpe" sortConfig={sortConfig} /></div>
                            </th>

                            {/* 3. 最大回撤 */}
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('maxDrawdown')}>
                                <div className="flex items-center">最大回撤 <SortIcon columnKey="maxDrawdown" sortConfig={sortConfig} /></div>
                            </th>

                            {/* 4. 最大超额回撤 */}
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('maxExcessDrawdown')}>
                                <div className="flex items-center">超额回撤 <SortIcon columnKey="maxExcessDrawdown" sortConfig={sortConfig} /></div>
                            </th>

                            {/* 5. 相对基准胜率 */}
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('winRate')}>
                                <div className="flex items-center">相对胜率 <SortIcon columnKey="winRate" sortConfig={sortConfig} /></div>
                            </th>

                            {/* 6. 年化换手率 */}
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('turnover')}>
                                <div className="flex items-center">年化换手 <SortIcon columnKey="turnover" sortConfig={sortConfig} /></div>
                            </th>

                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 font-serif font-bold text-gray-800 border-l-2 border-transparent hover:border-teal-700 transition-all">
                                    {row.name}
                                </td>

                                {/* 年化超额 */}
                                <td className={`p-4 font-mono-financial ${getColorClass('excessReturn', row.excessReturn)}`}>
                                    {parseFloat(row.excessReturn) > 0 ? '+' : ''}{row.excessReturn}%
                                </td>

                                {/* 夏普 */}
                                <td className={`p-4 font-mono-financial-bold ${getColorClass('sharpe', row.sharpe)} bg-teal-50/30`}>
                                    {row.sharpe}
                                </td>

                                {/* 最大回撤 */}
                                <td className={`p-4 font-mono-financial text-gray-600`}>
                                    {row.maxDrawdown}%
                                </td>

                                {/* 最大超额回撤 */}
                                <td className={`p-4 font-mono-financial ${getColorClass('maxExcessDrawdown', row.maxExcessDrawdown)}`}>
                                    {row.maxExcessDrawdown}%
                                </td>

                                {/* 相对胜率 */}
                                <td className={`p-4 font-mono-financial ${getColorClass('winRate', row.winRate)}`}>
                                    {row.winRate}%
                                </td>

                                {/* 换手率 */}
                                <td className="p-4 font-mono-financial text-gray-600">
                                    {row.turnover}x
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <span>* 超额收益相对于 CSI 300 TR; 胜率计算周期为月度。</span>
                    <span>Displaying {data.length} strategies</span>
                </div>
            </div>
        </div>
    );
}