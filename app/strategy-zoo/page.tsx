// app/strategy-zoo/page.tsx
'use client';

import React, { useState } from 'react';
import {
    ArrowUp, ArrowDown, ArrowUpDown, Shield, DollarSign,
    Target, Settings, ChevronLeft, SlidersHorizontal, Zap,
} from 'lucide-react';
import { addMonths, subMonths, format, parse } from 'date-fns';


import { StrategyMethodology } from './StrategyMethodology';

// --- 1. 引入新数据 (假设文件名为 策略表现_多周期_2510.json) ---
import multiPeriodData from './data/策略表现_多周期.json';

// --- 2. 定义 TypeScript 接口 ---

// 定义 JSON 原始单周期数据的结构 (内部结构)
interface RawPeriodData {
    "策略名称": string;
    "年化超额": string;
    "夏普比率": string;
    "最大回撤": string;
    "超额回撤": string;
    "相对胜率": string;
    "年化换手(倍)": string;
    "月均持仓数": string;
}

// 定义 JSON 原始多周期数据的结构 (外部结构)
interface RawMultiPeriodData {
    [strategyName: string]: {
        [periodKey: string]: RawPeriodData;
    }
}

// 定义单条策略数据的结构 (与原组件逻辑保持一致)
interface StrategyData {
    id: number;
    name: string;          // 策略名称
    excessReturn: number;  // 年化超额收益 (已转换为数字)
    sharpe: number;        // 夏普比率 (已转换为数字)
    maxDrawdown: number;   // 最大回撤 (净值, 已转换为数字)
    maxExcessDrawdown: number; // 最大超额回撤 (已转换为数字)
    winRate: number;       // 相对基准胜率 (已转换为数字)
    turnover: number;      // 年化换手率 (已转换为数字)
}

// 定义所有可排序的列键名
type SortKey = keyof Omit<StrategyData, 'id' | 'name'>;

// 定义排序配置的结构
interface SortConfig {
    key: SortKey | null;
    direction: 'asc' | 'desc';
}

// --- 3. 数据转换函数 ---
/**
 * 清理并转换字符串中的百分号、单位和逗号为浮点数
 */
const cleanAndParse = (str: string): number => {
    // 移除 %, x, 倍 等非数字字符，并移除千分位逗号
    const cleanedStr = str.replace(/[%\sx倍,]/g, '');
    return parseFloat(cleanedStr) || 0;
};

/**
 * 将原始嵌套 JSON 数据转换为 StrategyData 数组
 * @param multiPeriodData 原始多周期 JSON 对象
 * @param periodKey 要提取的周期键 ('12个月_2510' 或 '36个月_2510')
 * @returns 转换后的 StrategyData 数组
 */
const transformData = (multiPeriodData: RawMultiPeriodData, periodKey: string): StrategyData[] => {
    const strategies: StrategyData[] = [];
    let idCounter = 1;

    for (const strategyName in multiPeriodData) {
        const periodData = multiPeriodData[strategyName][periodKey];

        // 确保该策略存在当前周期的数据
        if (periodData) {
            strategies.push({
                id: idCounter++,
                name: periodData['策略名称'],
                excessReturn: cleanAndParse(periodData['年化超额']),
                sharpe: cleanAndParse(periodData['夏普比率']),
                maxDrawdown: cleanAndParse(periodData['最大回撤']),
                maxExcessDrawdown: cleanAndParse(periodData['超额回撤']),
                winRate: cleanAndParse(periodData['相对胜率']),
                turnover: cleanAndParse(periodData['年化换手(倍)']),
            });
        }
    }

    return strategies;
};


// --- 4. 工具组件 & 周期计算 (新增周期计算函数) ---

// 假设所有的回测都截止于 2025 年 10 月 (即 '2025-10')
const END_DATE_KEY = '2025-10';

/**
 * 根据时间范围返回具体的月份区间字符串。
 * @param timeRange '一年' 或 '三年'
 * @returns 'YYYY-MM 到 YYYY-MM'
 */
const getPeriodDisplayRange = (timeRange: '一年' | '三年'): string => {
    const endDate = parse(END_DATE_KEY, 'yyyy-MM', new Date());
    let monthsToSubtract = 0;

    if (timeRange === '一年') {
        // 近一年 (12个月) 的回测：回测收益期为 T 到 T+11，所以起始月份是 11 个月前
        // 结束月份是 END_DATE_KEY
        monthsToSubtract = 11;
    } else if (timeRange === '三年') {
        // 近三年 (36个月) 的回测：回测收益期为 T 到 T+35
        monthsToSubtract = 35;
    } else {
        return `数据截止 ${END_DATE_KEY}`;
    }

    const startDate = subMonths(endDate, monthsToSubtract);

    // 返回 'YYYY-MM 到 YYYY-MM' 格式
    return `${format(startDate, 'yyyy-MM')} 到 ${format(endDate, 'yyyy-MM')}`;
};


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

// 辅助函数：根据值返回颜色类名 (现在 val 是 number)
const getColorClass = (key: SortKey, val: number): string => {
    if (key === 'sharpe') {
        if (val > 1.0) return "text-green-700 font-bold";
        if (val < 0.5) return "text-red-700";
        return "text-gray-700";
    }

    if (key === 'maxDrawdown' || key === 'maxExcessDrawdown') {
        // 注意：回撤值是负数，-10.0% = -10.0
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

// --- 5. 主组件 StrategyZooPage (修改数据加载和排序逻辑) ---

// 周期映射工具：修改键名
const mapTimeRangeToKey = (timeRange: '一年' | '三年'): string => {
    if (timeRange === '一年') return '12个月_2510';
    if (timeRange === '三年') return '36个月_2510';
    return '36个月_2510'; // 默认值
}

export default function StrategyZooPage() {
    // timeRange 只有 '一年' 和 '三年' 两种选择
    const [timeRange, setTimeRange] = useState<'一年' | '三年'>('一年');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'sharpe', direction: 'desc' });

    // 初始数据为空，将在 useEffect 中加载
    const [data, setData] = useState<StrategyData[]>([]);

    const [view, setView] = useState<'zoo' | 'methodology'>('zoo');

    const sortData = (currentData: StrategyData[], config: SortConfig): StrategyData[] => {
        if (!config.key) return currentData;

        // 这里不需要 defaultAscKeys，只需在 handleSort 中确定初始排序方向
        const { key, direction } = config;

        return [...currentData].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        // 明确定义哪些指标值越小越好 (需要默认升序)
        const defaultAscKeys: SortKey[] = ['maxDrawdown', 'maxExcessDrawdown', 'turnover'];

        if (sortConfig.key === key) {
            direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // 新列：如果是回撤或换手，默认升序（值越小越好），否则默认降序（值越大越好）
            direction = defaultAscKeys.includes(key) ? 'asc' : 'desc';
        }

        const newSortConfig = { key, direction };
        const sortedData = sortData(data, newSortConfig);

        setSortConfig(newSortConfig);
        setData(sortedData);
    };

    // 监听 timeRange 变化，重新加载数据并应用排序
    React.useEffect(() => {
        const periodKey = mapTimeRangeToKey(timeRange);

        // 1. 提取和转换新周期的数据
        const newData = transformData(multiPeriodData as unknown as RawMultiPeriodData, periodKey);

        // 2. 重新应用当前排序配置 (或默认配置)
        const initialSortKey: SortKey = 'sharpe';
        const initialSortConfig: SortConfig = { key: initialSortKey, direction: 'desc' };

        // 优先使用当前的排序键，如果没有，则使用默认的 sharpe 降序
        const currentSortConfig = sortConfig.key ? sortConfig : initialSortConfig;

        const sortedData = sortData(newData, currentSortConfig);

        setData(sortedData);
        setSortConfig(currentSortConfig);

        // 依赖于 timeRange 和 multiPeriodData。multiPeriodData 在组件生命周期内通常不变。
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRange]);


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

    // 如果数据正在加载或为空，显示空状态或加载状态
    if (data.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans flex justify-center items-center">
                <p className="text-gray-500">
                    {/* 显示当前回测周期 */}
                    加载 {timeRange} 策略数据中...
                </p>
            </div>
        );
    }

    // 计算概览指标
    // 注意：toFixed(2) 用于格式化显示
    const bestSharpeStrategy = data.reduce((max, cur) => cur.sharpe > max.sharpe ? cur : max, data[0]);
    // 胜率最高的
    const bestWinRateStrategy = data.reduce((max, cur) => cur.winRate > max.winRate ? cur : max, data[0]);

    // 计算平均换手率
    const avgTurnover = (data.reduce((sum, cur) => sum + cur.turnover, 0) / data.length).toFixed(1);

    // 获取当前周期范围
    const currentPeriodRange = getPeriodDisplayRange(timeRange);


    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto mb-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-900 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="font-serif text-4xl font-bold text-gray-900">Strategy Zoo</h1>
                        </div>
                        <p className="text-gray-600 font-serif italic mb-1">
                            多类型量化投资策略表现监控 / 基准：沪深 300
                        </p>
                        {/* !!! 新增：显示具体回测区间 !!! */}
                        <p className="text-sm text-teal-700 font-mono flex items-center gap-2">
                            <Zap size={14} className="text-teal-600"/>
                            当前回测周期: <span className="font-bold">{currentPeriodRange}</span>
                        </p>
                        {/* ------------------------------- */}
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex bg-white border border-gray-300 rounded-sm p-1 shadow-sm">
                            {/* !!! 修改：按钮文本和值改为 '一年', '三年' !!! */}
                            {(['一年', '三年'] as const).map((range) => (
                                <React.Fragment key={range}>
                                    <button
                                        onClick={() => setTimeRange(range)}
                                        // !!! 修改：加宽按钮样式 px-4 py-2 !!!
                                        className={`px-4 py-2 text-sm font-medium transition-colors ${timeRange === range ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        近 {range}
                                    </button>
                                    {/* 仅在 1Y 和 3Y 之间显示分隔线 */}
                                    {range === '一年' && <div className="w-px bg-gray-200 my-1"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        <button className="bg-teal-700 text-white px-4 py-2 text-sm font-medium hover:bg-teal-800 shadow-sm transition-colors flex items-center">
                            回测工具箱 <Settings size={16} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 方法论入口 Banner (保持不变) */}
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

            {/* 概览卡片 (保持不变) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "最优风险调整", value: bestSharpeStrategy.name, sub: `${bestSharpeStrategy.sharpe.toFixed(2)} Sharpe Ratio`, icon: <Shield size={16}/>, color: 'border-l-teal-700' },
                    { label: "最高胜率策略", value: bestWinRateStrategy.name, sub: `${bestWinRateStrategy.winRate.toFixed(2)}% Win Rate`, icon: <Target size={16}/>, color: 'border-l-blue-700' },
                    { label: "平均换手率", value: `${avgTurnover}x`, sub: "Annualized", icon: <Zap size={16}/>, color: 'border-l-red-700' },
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

            {/* 核心表格 (保持不变) */}
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
                                    {row.excessReturn > 0 ? '+' : ''}{row.excessReturn.toFixed(2)}%
                                </td>

                                {/* 夏普 */}
                                <td className={`p-4 font-mono-financial-bold ${getColorClass('sharpe', row.sharpe)} bg-teal-50/30`}>
                                    {row.sharpe.toFixed(2)}
                                </td>

                                {/* 最大回撤 */}
                                <td className={`p-4 font-mono-financial ${getColorClass('maxDrawdown', row.maxDrawdown)}`}>
                                    {row.maxDrawdown.toFixed(2)}%
                                </td>

                                {/* 最大超额回撤 */}
                                <td className={`p-4 font-mono-financial ${getColorClass('maxExcessDrawdown', row.maxExcessDrawdown)}`}>
                                    {row.maxExcessDrawdown.toFixed(2)}%
                                </td>

                                {/* 相对胜率 */}
                                <td className={`p-4 font-mono-financial ${getColorClass('winRate', row.winRate)}`}>
                                    {row.winRate.toFixed(2)}%
                                </td>

                                {/* 换手率 */}
                                <td className="p-4 font-mono-financial text-gray-600">
                                    {row.turnover.toFixed(2)}x
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <span>* 超额收益相对于 CSI 300 TR; 胜率计算周期为月度。 (当前周期: {currentPeriodRange})</span>
                    <span>Displaying {data.length} strategies</span>
                </div>
            </div>
        </div>
    );
}