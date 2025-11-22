'use client';

import React, { useState } from 'react';
// 引入图标
import { ArrowUp, ArrowDown, ArrowUpDown, Info, TrendingUp, Activity, FlaskConical, ChevronLeft } from 'lucide-react';

// 导入 FactorMethodology 组件
import FactorMethodology from './FactorMethodology';

// --- 1. 定义 TypeScript 接口 (修改 volatility 为 uniqueAlpha) ---

// 定义单条因子数据的结构
interface FactorData {
    id: number;
    name: string;
    returnAnn: string;
    excessAnn: string;
    turnover: string;
    icMean: string;
    ir: string;
    uniqueAlpha: string; // 新增：因子的独特性指标，衡量方法：Unique Alpha Contribution = (因子IR * (1 - 与基准相关系数)) * 100%，表示因子提供的独特超额收益贡献百分比（越高越独特）
}

// 定义所有可排序的列键名
type SortKey = keyof Omit<FactorData, 'id' | 'name' | 'uniqueAlpha'>;

// 定义排序配置的结构
interface SortConfig {
    key: SortKey | null;
    direction: 'asc' | 'desc';
}

// --- 2. 模拟数据 (替换 volatility 为 uniqueAlpha) ---
const initialData: FactorData[] = [
    { id: 1, name: 'Momentum (动量)', returnAnn: '12.4', excessAnn: '5.2', turnover: '2.5', icMean: '0.06', ir: '1.8', uniqueAlpha: '85%' },
    { id: 2, name: 'Value (价值)', returnAnn: '-3.2', excessAnn: '-1.5', turnover: '1.2', icMean: '-0.02', ir: '-0.5', uniqueAlpha: '60%' },
    { id: 3, name: 'Size (市值)', returnAnn: '8.1', excessAnn: '2.1', turnover: '0.8', icMean: '0.03', ir: '0.9', uniqueAlpha: '72%' },
    { id: 4, name: 'Volatility (波动率)', returnAnn: '-5.4', excessAnn: '-4.2', turnover: '3.0', icMean: '-0.05', ir: '-1.2', uniqueAlpha: '45%' },
    { id: 5, name: 'Quality (质量)', returnAnn: '6.5', excessAnn: '1.8', turnover: '1.5', icMean: '0.04', ir: '1.1', uniqueAlpha: '78%' },
    { id: 6, name: 'Liquidity (流动性)', returnAnn: '4.2', excessAnn: '0.5', turnover: '4.1', icMean: '0.01', ir: '0.3', uniqueAlpha: '55%' },
    { id: 7, name: 'Growth (成长)', returnAnn: '10.1', excessAnn: '3.8', turnover: '2.2', icMean: '0.05', ir: '1.4', uniqueAlpha: '82%' },
];

// --- 3. 独立且类型化的工具组件 (保持不变) ---

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


// --- 4. 主组件 FactorZooContent ---
export default function FactorZooContent() {
    const [timeRange, setTimeRange] = useState<'1Y' | '3Y'>('1Y');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'desc' });
    const [data, setData] = useState<FactorData[]>(initialData);

    // 【新增状态】控制显示哪个页面：'zoo' (主表格) 或 'methodology' (流程说明)
    const [view, setView] = useState<'zoo' | 'methodology'>('zoo');


    const handleSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
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

    // 【条件渲染】如果当前是方法论视图，则直接渲染 FactorMethodology 组件
    if (view === 'methodology') {
        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans">
                <div className="max-w-7xl mx-auto mb-6">
                    {/* 返回按钮 */}
                    <button
                        onClick={() => setView('zoo')}
                        className="flex items-center text-gray-700 hover:text-red-700 transition-colors mb-4 text-sm font-medium"
                    >
                        <ChevronLeft size={16} className="mr-1" /> 返回因子总览
                    </button>
                    {/* 导入 FactorMethodology 组件 */}
                    <FactorMethodology />
                </div>
            </div>
        );
    }

    // 【默认渲染】主因子总览表格
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto mb-6">
                {/* --- 顶部导航区 --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-900 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="font-serif text-4xl font-bold text-gray-900">Factor Zoo</h1>
                            <span className="px-2 py-1 text-xs border border-gray-900 bg-gray-900 text-white font-mono uppercase">
                                Alpha One
                            </span>
                        </div>
                        <p className="text-gray-600 font-serif italic">
                            多因子风险与收益全景监控 / 沪深全市场 (A-Share Universe)
                        </p>
                    </div>

                    {/* 时间与操作区 */}
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex bg-white border border-gray-300 rounded-sm p-1 shadow-sm">
                            <button
                                onClick={() => setTimeRange('1Y')}
                                className={`px-4 py-1.5 text-sm font-medium transition-colors ${timeRange === '1Y' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                近一年 (1Y)
                            </button>
                            <div className="w-px bg-gray-200 my-1"></div>
                            <button
                                onClick={() => setTimeRange('3Y')}
                                className={`px-4 py-1.5 text-sm font-medium transition-colors ${timeRange === '3Y' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                近三年 (3Y)
                            </button>
                        </div>
                        <button className="bg-red-700 text-white px-4 py-2 text-sm font-medium hover:bg-red-800 shadow-sm transition-colors">
                            导出数据 CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 因子计算标准链接栏 (改为按钮和点击事件) --- */}
            <div className="max-w-7xl mx-auto mb-8">
                <div
                    onClick={() => setView('methodology')} // 【关键修改】点击切换到方法论视图
                    className="flex items-center justify-between p-3 bg-white border border-red-200 text-red-700 shadow-sm hover:shadow-md hover:border-red-300 transition-all cursor-pointer"
                >
                    <span className="flex items-center text-sm font-medium gap-3">
                        <FlaskConical size={18} className="text-red-600" />
                        <span className="font-serif">多因子指标计算流程说明</span>
                        <span className="text-gray-500 font-mono text-xs hidden sm:inline-block">/ Methodology & Backtest Standards</span>
                    </span>
                    <span className="font-mono text-xs uppercase border border-red-700 px-2 py-0.5 rounded-full hover:bg-red-700 hover:text-white transition-colors">
                        查看详情
                    </span>
                </div>
            </div>
            {/* --- 新增栏目结束 --- */}

            {/* --- 概览指标卡 (Dashboard Summary) --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "最佳表现因子", value: "Momentum", sub: "+12.4% Ann.", icon: <TrendingUp size={16}/> },
                    { label: "最高 IC 均值", value: "Momentum", sub: "0.06 Mean IC", icon: <Activity size={16}/> },
                    { label: "市场拥挤度", value: "High", sub: "Turnover Spike", icon: <Info size={16}/> },
                    { label: "数据更新时间", value: "2025-11-21", sub: "Daily Close", icon: null },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-gray-900">
                        <div className="text-xs text-gray-500 uppercase font-mono mb-1 flex items-center gap-2">
                            {card.icon} {card.label}
                        </div>
                        <div className="text-xl font-serif font-bold text-gray-900">{card.value}</div>
                        <div className={`text-sm font-mono mt-1 ${idx === 0 ? 'text-green-700' : 'text-gray-500'}`}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* --- 核心数据表格 --- */}
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-medium tracking-wider">
                            <th className="p-4 w-48 font-serif text-gray-900">因子名称 (Factor)</th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('returnAnn')}>
                                <div className="flex items-center">年化收益率 <SortIcon columnKey="returnAnn" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('excessAnn')}>
                                <div className="flex items-center">超额年化 <SortIcon columnKey="excessAnn" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('turnover')}>
                                <div className="flex items-center">换手率 <SortIcon columnKey="turnover" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('icMean')}>
                                <div className="flex items-center">IC 均值 <SortIcon columnKey="icMean" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('ir')}>
                                <div className="flex items-center">IR 值 <SortIcon columnKey="ir" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 text-gray-400">
                                <div className="flex items-center">独特性 (Unique)</div>
                            </th>
                            <th className="p-4 w-24">趋势图</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 font-serif font-bold text-gray-800 border-l-2 border-transparent hover:border-red-700 transition-all">
                                    {row.name}
                                </td>
                                <td className={`p-4 font-mono font-medium ${getColorClass(row.returnAnn)}`}>
                                    {row.returnAnn}%
                                </td>
                                <td className={`p-4 font-mono ${getColorClass(row.excessAnn)}`}>
                                    {row.excessAnn}%
                                </td>
                                <td className="p-4 font-mono text-gray-600">
                                    {row.turnover}x
                                </td>
                                <td className={`p-4 font-mono font-bold ${getColorClass(row.icMean)}`}>
                                    {row.icMean}
                                </td>
                                <td className="p-4 font-mono text-gray-900 bg-gray-50/50">
                                    {row.ir}
                                </td>
                                <td className="p-4 font-mono text-green-700 font-medium">
                                    {row.uniqueAlpha}
                                </td>
                                <td className="p-4">
                                    {/* 这里通常放置 Sparkline 小图，此处用 CSS 模拟一条趋势线 */}
                                    <div className="h-6 w-16 flex items-end gap-0.5 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-red-700' : 'bg-green-700'}`} style={{height: '40%'}}></div>
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-red-700' : 'bg-green-700'}`} style={{height: '60%'}}></div>
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-red-700' : 'bg-green-700'}`} style={{height: '30%'}}></div>
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-red-700' : 'bg-green-700'}`} style={{height: '80%'}}></div>
                                        <div className={`w-1 ${parseFloat(row.returnAnn) > 0 ? 'bg-red-700' : 'bg-green-700'}`} style={{height: '50%'}}></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 底部注释 */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <span>* IC (Information Coefficient) 计算基于 Rank IC; IR = IC Mean / IC Std. Unique Alpha = IR * (1 - |Corr with Benchmark|) * 100%.</span>
                    <span>Displaying {data.length} factors</span>
                </div>
            </div>
        </div>
    );
}