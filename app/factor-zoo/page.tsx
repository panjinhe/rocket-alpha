// app/factor-zoo/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
// 引入图标
import { ArrowUp, ArrowDown, ArrowUpDown, Info, TrendingUp, Activity, FlaskConical, ChevronLeft } from 'lucide-react';

// 导入 FactorMethodology 组件 (修复: 显式添加 .tsx 扩展名)
import FactorMethodology from './FactorMethodology';

// 导入 JSON 数据 (修复: 显式添加 .json 扩展名)
import data1Y from './data/多空组合因子表现12月_2510.json';
import data3Y from './data/多空组合因子表现36月_2510.json';


// --- 1. 定义 TypeScript 接口 ---

// 定义 JSON 原始数据的结构
interface RawFactorData {
    "因子名称": string;
    "多空年化": number;
    "超额年化": number;
    "换手率": number;
    "IC": number;
    "IR": number;
}

// 定义组件内部使用的数据结构
interface FactorData {
    id: number;
    name: string; // 因子名称
    returnAnn: string; // 多空年化 (已转换为百分比字符串)
    excessAnn: string; // 超额年化 (已转换为百分比字符串)
    turnover: string; // 换手率
    icMean: string; // IC
    ir: string; // IR
}

// 定义所有可排序的列键名 (排除 id 和 name)
type SortKey = keyof Omit<FactorData, 'id' | 'name'>;

// 定义排序配置的结构
interface SortConfig {
    key: SortKey | null;
    direction: 'asc' | 'desc';
}

// --- 2. 数据处理函数 ---

// 辅助函数：将原始 JSON 数据映射并格式化为 FactorData
const mapAndFormatData = (rawData: RawFactorData[]): FactorData[] => {
    return rawData.map((d, index) => ({
        id: index + 1,
        name: d["因子名称"],
        // 转换为百分比字符串，保留两位小数
        returnAnn: (d["多空年化"] * 100).toFixed(2),
        excessAnn: (d["超额年化"] * 100).toFixed(2),
        // 保留两位小数
        turnover: d["换手率"].toFixed(2),
        // IC 保留四位小数
        icMean: d["IC"].toFixed(4),
        // IR 保留两位小数
        ir: d["IR"].toFixed(2),
    }));
};

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
    const [data, setData] = useState<FactorData[]>([]);
    const [view, setView] = useState<'zoo' | 'methodology'>('zoo');


    // 使用 useEffect 加载和格式化数据
    useEffect(() => {
        // 确保数据类型正确
        const rawData = timeRange === '1Y' ? (data1Y as RawFactorData[]) : (data3Y as RawFactorData[]);
        const mappedData = mapAndFormatData(rawData);

        // 应用初始排序或恢复排序
        if (sortConfig.key) {
            const sortedData = [...mappedData].sort((a, b) => {
                const key = sortConfig.key as SortKey;
                const valA = parseFloat(a[key]);
                const valB = parseFloat(b[key]);

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
            setData(sortedData);
        } else {
            // 默认按年化收益率降序排列
            const defaultSortKey: SortKey = 'returnAnn';
            const sortedData = [...mappedData].sort((a, b) => {
                const valA = parseFloat(a[defaultSortKey]);
                const valB = parseFloat(b[defaultSortKey]);

                if (valA < valB) return 1;
                if (valA > valB) return -1;
                return 0;
            });
            setSortConfig({ key: defaultSortKey, direction: 'desc' });
            setData(sortedData);
        }

    }, [timeRange]);


    const handleSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        // 如果点击的是同一列，且当前是降序，则切换为升序
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

    // 计算概览指标
    const summaryMetrics = useMemo(() => {
        if (data.length === 0) return {};

        const bestPerformer = data.reduce((max, d) =>
            parseFloat(d.returnAnn) > parseFloat(max.returnAnn) ? d : max, data[0]
        );
        const highestIC = data.reduce((max, d) =>
            parseFloat(d.icMean) > parseFloat(max.icMean) ? d : max, data[0]
        );

        return {
            bestPerformer,
            highestIC
        };
    }, [data]);


    // 【条件渲染】方法论视图
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
                                className={`px-4 py-1.5 text-sm font-medium transition-colors ${timeRange === '1Y' ? 'bg-red-700 text-white font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                近一年 (1Y)
                            </button>
                            <div className="w-px bg-gray-200 my-1"></div>
                            <button
                                onClick={() => setTimeRange('3Y')}
                                className={`px-4 py-1.5 text-sm font-medium transition-colors ${timeRange === '3Y' ? 'bg-red-700 text-white font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                近三年 (3Y)
                            </button>
                        </div>
                        <button className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-red-800 shadow-sm transition-colors rounded-sm">
                            导出数据 CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 因子计算标准链接栏 (改为按钮和点击事件) --- */}
            <div className="max-w-7xl mx-auto mb-8">
                <div
                    onClick={() => setView('methodology')} // 【关键修改】点击切换到方法论视图
                    className="flex items-center justify-between p-3 bg-white border border-red-200 text-red-700 shadow-sm hover:shadow-md hover:border-red-300 transition-all cursor-pointer rounded-lg"
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
                    { label: "最佳表现因子", value: summaryMetrics.bestPerformer?.name || 'N/A', sub: `${summaryMetrics.bestPerformer?.returnAnn || '0.00'}% Ann.`, icon: <TrendingUp size={16}/>, color: 'border-l-green-600', subColor: 'text-green-700' },
                    { label: "最高 IC 均值", value: summaryMetrics.highestIC?.name || 'N/A', sub: `${summaryMetrics.highestIC?.icMean || '0.0000'} Mean IC`, icon: <Activity size={16}/>, color: 'border-l-blue-600', subColor: 'text-blue-700' },
                    { label: "市场拥挤度", value: "High", sub: "Turnover Spike", icon: <Info size={16}/>, color: 'border-l-yellow-600', subColor: 'text-yellow-700' },
                    { label: "数据时间范围", value: timeRange === '1Y' ? '近一年' : '近三年', sub: `更新至 2025-11-21`, icon: null, color: 'border-l-gray-600', subColor: 'text-gray-500' },
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

            {/* --- 核心数据表格 --- */}
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-medium tracking-wider">
                            <th className="p-4 w-48 font-serif text-gray-900">因子名称 (Factor)</th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('returnAnn' as SortKey)}>
                                <div className="flex items-center">年化收益率 (%) <SortIcon columnKey="returnAnn" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('excessAnn' as SortKey)}>
                                <div className="flex items-center">超额年化 (%) <SortIcon columnKey="excessAnn" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('turnover' as SortKey)}>
                                <div className="flex items-center">换手率 (x) <SortIcon columnKey="turnover" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('icMean' as SortKey)}>
                                <div className="flex items-center">IC 均值 <SortIcon columnKey="icMean" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('ir' as SortKey)}>
                                <div className="flex items-center">IR 值 <SortIcon columnKey="ir" sortConfig={sortConfig} /></div>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 font-serif font-bold text-gray-800 border-l-2 border-transparent hover:border-red-700 transition-all">
                                    {row.name}
                                </td>
                                <td className={`p-4 font-mono font-medium ${getColorClass(row.returnAnn)}`}>
                                    {row.returnAnn}
                                </td>
                                <td className={`p-4 font-mono ${getColorClass(row.excessAnn)}`}>
                                    {row.excessAnn}
                                </td>
                                <td className="p-4 font-mono text-gray-600">
                                    {row.turnover}
                                </td>
                                <td className={`p-4 font-mono font-bold ${getColorClass(row.icMean)}`}>
                                    {row.icMean}
                                </td>
                                <td className="p-4 font-mono text-gray-900 bg-gray-50/50">
                                    {row.ir}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 底部注释 */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <span>* IC (Information Coefficient) 计算基于 Rank IC; IR = IC Mean / IC Std. Unique Alpha (独特性) 暂未计算显示。</span>
                    <span>显示 {data.length} 个因子 ({timeRange} 数据)</span>
                </div>
            </div>
        </div>
    );
}