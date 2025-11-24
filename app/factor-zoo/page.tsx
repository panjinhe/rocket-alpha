// app/factor-zoo/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Info, TrendingUp, Activity, FlaskConical, ChevronLeft, Layers, LayoutList } from 'lucide-react';

import FactorMethodology from './FactorMethodology';
import data1Y from './data/因子表现回测12月_2510.json';
import data3Y from './data/因子表现回测36月_2510.json';

// --- 1. 类型定义更新 ---
interface RawFactorData {
    "因子名称": string;
    // 多空相关
    "多空年化": number;
    "多空超额年化": number;
    "多空换手": number;
    // 多头/分组相关 (新增)
    "Q10年化"?: number;
    "Q1年化"?: number;
    "Q10换手"?: number;
    "Q1换手"?: number;
    // 通用
    "IC": number;
    "IR": number;
}

interface FactorData {
    id: number;
    name: string;
    // 多空数据
    returnAnn: string;
    excessAnn: string;
    turnover: string;
    // 多头数据 (新增)
    q10Ann: string;
    q1Ann: string;
    q10Turnover: string;
    q1Turnover: string;
    // 通用数据
    icMean: string;
    ir: string;
}

type SortKey = keyof Omit<FactorData, 'id' | 'name'>;

interface SortConfig {
    key: SortKey | null;
    direction: 'asc' | 'desc';
}

type PortfolioType = 'long_short' | 'long_only'; // 新增组合类型状态

// --- 小组件 ---
interface SortIconProps {
    columnKey: SortKey;
    sortConfig: SortConfig;
}

const SortIcon = ({ columnKey, sortConfig }: SortIconProps) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-300 ml-1" />;
    return sortConfig.direction === 'asc'
        ? <ArrowUp size={14} className="text-red-700 ml-1" />
        : <ArrowDown size={14} className="text-red-700 ml-1" />;
};

const getColorClass = (valStr: string): string => {
    const val = parseFloat(valStr);
    if (val > 0) return "text-green-700";
    if (val < 0) return "text-red-700";
    return "text-gray-600";
};

// --- 2. 数据格式化更新 ---
const mapAndFormatData = (rawData: RawFactorData[]): FactorData[] => {
    return rawData.map((d, index) => ({
        id: index + 1,
        name: d["因子名称"],
        // 多空
        returnAnn: (d["多空年化"] * 100).toFixed(2),
        excessAnn: (d["多空超额年化"] * 100).toFixed(2),
        turnover: d["多空换手"].toFixed(2),
        // 多头 (处理可能存在的 undefined，虽然 json 中应该有)
        q10Ann: d["Q10年化"] ? (d["Q10年化"] * 100).toFixed(2) : "0.00",
        q1Ann: d["Q1年化"] ? (d["Q1年化"] * 100).toFixed(2) : "0.00",
        q10Turnover: d["Q10换手"] ? d["Q10换手"].toFixed(2) : "0.00",
        q1Turnover: d["Q1换手"] ? d["Q1换手"].toFixed(2) : "0.00",
        // 通用
        icMean: d["IC"].toFixed(4),
        ir: d["IR"].toFixed(2),
    }));
};

// --- 主组件 ---
export default function FactorZooContent() {
    const [timeRange, setTimeRange] = useState<'1Y' | '3Y'>('3Y');
    const [portfolioType, setPortfolioType] = useState<PortfolioType>('long_only'); // 新增状态
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'returnAnn', direction: 'desc' });
    const [data, setData] = useState<FactorData[]>([]);
    const [view, setView] = useState<'zoo' | 'methodology'>('zoo');

    const rawData = useMemo(() => {
        return timeRange === '1Y' ? (data1Y as RawFactorData[]) : (data3Y as RawFactorData[]);
    }, [timeRange]);

    const processedData = useMemo(() => {
        const mapped = mapAndFormatData(rawData);

        if (sortConfig.key) {
            return [...mapped].sort((a, b) => {
                const valA = parseFloat(a[sortConfig.key!]);
                const valB = parseFloat(b[sortConfig.key!]);
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            });
        }
        // 默认排序逻辑：如果是多空，按多空年化；如果是多头，按Q10年化
        const defaultKey = portfolioType === 'long_short' ? 'returnAnn' : 'q10Ann';
        return [...mapped].sort((a, b) => parseFloat(b[defaultKey]) - parseFloat(a[defaultKey]));
    }, [rawData, sortConfig, portfolioType]);

    useEffect(() => {
        setData(processedData);
    }, [processedData]);

    const handleSort = (key: SortKey) => {
        const direction =
            sortConfig.key === key && sortConfig.direction === 'desc'
                ? 'asc'
                : 'desc';
        setSortConfig({ key, direction });
    };

    // 概览指标 (根据组合类型动态调整显示的“最佳表现”逻辑)
    const summaryMetrics = useMemo(() => {
        if (data.length === 0) return {};

        // 根据当前视图决定“最佳表现”看哪个字段
        const returnKey = portfolioType === 'long_short' ? 'returnAnn' : 'q10Ann';

        const bestPerformer = data.reduce((max, d) =>
            parseFloat(d[returnKey]) > parseFloat(max[returnKey]) ? d : max, data[0]
        );
        const highestIC = data.reduce((max, d) =>
            parseFloat(d.icMean) > parseFloat(max.icMean) ? d : max, data[0]
        );

        return { bestPerformer, highestIC, returnKey };
    }, [data, portfolioType]);

    if (view === 'methodology') {
        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans">
                <div className="max-w-7xl mx-auto mb-6">
                    <button
                        onClick={() => setView('zoo')}
                        className="flex items-center text-gray-700 hover:text-red-700 transition-colors mb-4 text-sm font-medium"
                    >
                        <ChevronLeft size={16} className="mr-1" /> 返回因子总览
                    </button>
                    <FactorMethodology />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto mb-6">
                {/* 标题与顶部控制栏 */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-900 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="font-serif text-4xl font-bold text-gray-900">Factor Zoo</h1>
                        </div>
                        <p className="text-gray-600 font-serif italic">
                            多因子风险与收益全景监控 / 沪深全市场 (A-Share Universe)
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                        {/* 组合类型切换按钮组 - 交换顺序 */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
                            {/* ← 先渲染多头分组（现在在左边） */}
                            <button
                                onClick={() => {
                                    setPortfolioType('long_only');
                                    setSortConfig({ key: 'q10Ann', direction: 'desc' });
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${
                                    portfolioType === 'long_only'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <LayoutList size={14} /> 多头分组 (Long Only)
                            </button>

                            {/* ← 再渲染多空组合（现在在右边） */}
                            <button
                                onClick={() => {
                                    setPortfolioType('long_short');
                                    setSortConfig({ key: 'returnAnn', direction: 'desc' });
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${
                                    portfolioType === 'long_short'
                                        ? 'bg-white text-red-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <Layers size={14} /> 多空组合 (L/S)
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* 时间切换 */}
                            <div className="flex bg-white border border-gray-300 rounded-sm p-1 shadow-sm">
                                <button
                                    onClick={() => setTimeRange('3Y')}
                                    className={`px-4 py-1.5 text-sm font-medium transition-colors ${timeRange === '3Y' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    近三年 (3Y)
                                </button>
                                <div className="w-px bg-gray-200 my-1"></div>
                                <button
                                    onClick={() => setTimeRange('1Y')}
                                    className={`px-4 py-1.5 text-sm font-medium transition-colors ${timeRange === '1Y' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    近一年 (1Y)
                                </button>
                            </div>

                            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors rounded-sm">
                                导出 CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 方法论入口卡片 (保持不变) */}
            <div className="max-w-7xl mx-auto mb-8">
                <div
                    onClick={() => setView('methodology')}
                    className="flex items-center justify-between p-3 bg-white border border-red-200 text-red-700 shadow-sm hover:shadow-md hover:border-red-300 transition-all cursor-pointer rounded-lg"
                >
                    <span className="flex items-center text-sm font-medium gap-3">
                        <FlaskConical size={18} className="text-red-600" />
                        <span className="font-serif">多因子指标计算流程说明</span>
                    </span>
                    <span className="font-mono text-xs uppercase border border-red-700 px-2 py-0.5 rounded-full hover:bg-red-700 hover:text-white transition-colors">
                        查看详情
                    </span>
                </div>
            </div>

            {/* 概览卡片 */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    {
                        label: portfolioType === 'long_short' ? "最佳 L/S 表现" : "最佳 Q10 表现",
                        value: summaryMetrics.bestPerformer?.name || 'N/A',
                        sub: `${summaryMetrics.bestPerformer ? summaryMetrics.bestPerformer[summaryMetrics.returnKey as keyof FactorData] : '0.00'}% Ann.`,
                        icon: <TrendingUp size={16}/>,
                        color: 'border-l-green-600',
                        subColor: 'text-green-700'
                    },
                    { label: "最高 IC 均值", value: summaryMetrics.highestIC?.name || 'N/A', sub: `${summaryMetrics.highestIC?.icMean || '0.0000'} Mean IC`, icon: <Activity size={16}/>, color: 'border-l-blue-600', subColor: 'text-blue-700' },
                    { label: "当前视图", value: portfolioType === 'long_short' ? "多空对冲" : "多头分组", sub: "Portfolio Mode", icon: <Info size={16}/>, color: 'border-l-yellow-600', subColor: 'text-yellow-700' },
                    { label: "数据范围", value: timeRange === '1Y' ? '近一年' : '近三年', sub: `Samples: ${data.length}`, icon: null, color: 'border-l-gray-600', subColor: 'text-gray-500' },
                ].map((card, idx) => (
                    <div key={idx} className={`bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow border-l-4 ${card.color} rounded-lg`}>
                        <div className="text-xs text-gray-500 uppercase font-mono mb-1 flex items-center gap-2">
                            {card.icon} {card.label}
                        </div>
                        <div className="text-xl font-serif font-bold text-gray-900">{card.value}</div>
                        <div className={`text-sm font-mono mt-1 ${card.subColor}`}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* 主表格 */}
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-medium tracking-wider">
                            <th className="p-4 w-48 font-serif text-gray-900 sticky left-0 bg-gray-50 z-10 shadow-r-md">因子名称</th>

                            {/* 4. 根据 portfolioType 动态渲染表头 */}
                            {portfolioType === 'long_short' ? (
                                <>
                                    <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('returnAnn')}>
                                        <div className="flex items-center">多空年化 (%) <SortIcon columnKey="returnAnn" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('excessAnn')}>
                                        <div className="flex items-center">多空超额年化 (%) <SortIcon columnKey="excessAnn" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('turnover')}>
                                        <div className="flex items-center">多空换手 <SortIcon columnKey="turnover" sortConfig={sortConfig} /></div>
                                    </th>
                                </>
                            ) : (
                                <>
                                    <th className="p-4 cursor-pointer hover:bg-gray-100 group bg-blue-50/30" onClick={() => handleSort('q10Ann')}>
                                        <div className="flex items-center text-blue-900">Q10 年化 (%) <SortIcon columnKey="q10Ann" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-100 group bg-blue-50/30" onClick={() => handleSort('q1Ann')}>
                                        <div className="flex items-center text-blue-900">Q1 年化 (%) <SortIcon columnKey="q1Ann" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('q10Turnover')}>
                                        <div className="flex items-center">Q10 换手 <SortIcon columnKey="q10Turnover" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('q1Turnover')}>
                                        <div className="flex items-center">Q1 换手 <SortIcon columnKey="q1Turnover" sortConfig={sortConfig} /></div>
                                    </th>
                                </>
                            )}

                            {/* 通用字段 */}
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('icMean')}>
                                <div className="flex items-center">IC 均值 <SortIcon columnKey="icMean" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('ir')}>
                                <div className="flex items-center">IR 值 <SortIcon columnKey="ir" sortConfig={sortConfig} /></div>
                            </th>
                        </tr>
                        </thead>

                        <tbody className="text-sm divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 font-serif font-bold text-gray-800 border-l-2 border-transparent hover:border-red-700 transition-all sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                                    {row.name}
                                </td>

                                {/* 5. 根据 portfolioType 动态渲染表格内容 */}
                                {portfolioType === 'long_short' ? (
                                    <>
                                        <td className={`p-4 font-mono-financial ${getColorClass(row.returnAnn)}`}>
                                            {row.returnAnn}
                                        </td>
                                        <td className={`p-4 font-mono-financial ${getColorClass(row.excessAnn)}`}>
                                            {row.excessAnn}
                                        </td>
                                        <td className="p-4 font-mono-financial text-gray-600">
                                            {row.turnover}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className={`p-4 font-mono-financial font-medium bg-blue-50/10 ${getColorClass(row.q10Ann)}`}>
                                            {row.q10Ann}
                                        </td>
                                        <td className={`p-4 font-mono-financial bg-blue-50/10 ${getColorClass(row.q1Ann)}`}>
                                            {row.q1Ann}
                                        </td>
                                        <td className="p-4 font-mono-financial text-gray-600">
                                            {row.q10Turnover}
                                        </td>
                                        <td className="p-4 font-mono-financial text-gray-600">
                                            {row.q1Turnover}
                                        </td>
                                    </>
                                )}

                                <td className={`p-4 font-mono-financial font-bold ${getColorClass(row.icMean)}`}>
                                    {row.icMean}
                                </td>
                                <td className="p-4 font-mono-financial bg-gray-50/50">
                                    {row.ir}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">
                    <span>
                        {portfolioType === 'long_short'
                            ? "* 多空 (Long-Short): 做多Top组 / 做空Bottom组。"
                            : "* Q10 = Top Group (Factor High), Q1 = Bottom Group (Factor Low)."}
                        IC 计算基于 Rank IC; IR = IC Mean / IC Std.
                    </span>
                    <span>显示 {data.length} 个因子 ({timeRange === '1Y' ? '近一年' : '近三年'} 数据)</span>
                </div>
            </div>
        </div>
    );
}