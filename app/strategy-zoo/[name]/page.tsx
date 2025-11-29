// app/strategy-zoo/[name]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Area, ComposedChart, ReferenceLine
} from 'recharts';
import {
    ChevronLeft, Activity, TrendingUp, Layers, AlertCircle, Loader2, Calendar, PieChart,
    FileText, GitMerge, ListOrdered, Lightbulb
} from 'lucide-react';

// --- 类型定义 ---
interface StrategyDetailedMetrics {
    totalReturn: number;
    benchmarkReturn: number;
    annualizedReturn: number;
    alpha: number;
    beta: number;
    sharpe: number;
    sortino: number;
    infoRatio: number;
    volatility: number;
    benchmarkVolatility: number;
    winRate: number;
    dailyWinRate: number;
    plRatio: number;
    winCount: number;
    lossCount: number;
    maxDrawdown: number;
}

// [修改] 方法论数据结构：移除 factors，只保留通用描述和逻辑步骤
interface MethodologyData {
    description: string;
    logic: string[];
}

interface TooltipPayloadItem {
    name: string;
    value: number;
    color: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
}

interface DailyNavData { date: string; strategy: number; benchmark: number; }
interface HoldingData { date: string; code: string; name: string; weight: number; industry: string; }

// [修改] 主数据结构包含 methodology
interface StrategyDetailData {
    id?: string; name: string; description: string;
    metrics: StrategyDetailedMetrics;
    navCurve: DailyNavData[];
    holdings: HoldingData[];
    methodology?: MethodologyData; // 可选字段
}

// --- 组件：策略逻辑展示块 (新版 - 无因子列表) ---
const StrategyLogicCard = ({ data }: { data: MethodologyData }) => {
    return (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden ring-1 ring-slate-100 mt-8">
            {/* 标题栏 */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                        <FileText size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">策略构建方法论</h2>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    Methodology
                </span>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* 左侧：核心思想 (占 2/5) */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Lightbulb size={16} className="text-amber-500" /> 核心逻辑 (Core Logic)
                    </h3>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed text-justify">
                        {data.description}
                    </div>
                </div>

                {/* 右侧：执行流程 (占 3/5) */}
                <div className="lg:col-span-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <GitMerge size={16} className="text-teal-500" /> 执行步骤 (Execution Steps)
                    </h3>

                    <div className="relative space-y-0">
                        {/* 左侧连接线 */}
                        <div className="absolute left-3.5 top-2 bottom-4 w-0.5 bg-slate-200"></div>

                        {data.logic.map((step, idx) => (
                            <div key={idx} className="relative flex items-start gap-4 pb-6 last:pb-0 group">
                                {/* 序号节点 */}
                                <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 group-hover:border-teal-500 group-hover:text-teal-600 transition-colors flex items-center justify-center text-slate-400 font-mono text-xs font-bold shadow-sm">
                                    {idx + 1}
                                </div>
                                {/* 文本卡片 */}
                                <div className="flex-1 pt-1">
                                    <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                                        {step}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 组件：美化后的指标卡片 (保持不变) ---
const MetricCard = ({ label, value, subValue, highlight = false, trend = 'neutral' }: any) => (
    <div className={`
        group relative p-5 bg-white border rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${highlight ? 'border-teal-500 shadow-md ring-1 ring-teal-50' : 'border-gray-100'}
    `}>
        {highlight && <div className="absolute top-0 right-0 p-3 opacity-5 text-teal-600"><Activity size={48}/></div>}
        <div className="flex justify-between items-start mb-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
            {highlight && <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></div>}
        </div>
        <div className={`text-2xl font-mono-financial tracking-tight ${
            trend === 'up' ? 'text-red-600' :
                trend === 'down' ? 'text-green-600' :
                    highlight ? 'text-teal-700' : 'text-slate-800'
        }`}>
            {value}
        </div>
        {subValue && (
            <div className="text-xs text-gray-400 mt-2 font-medium flex items-center gap-1">
                {subValue}
            </div>
        )}
    </div>
);

// --- 组件：自定义图表 Tooltip (保持不变) ---
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-4 rounded-lg shadow-xl text-sm ring-1 ring-black/5">
                <p className="font-mono text-slate-500 mb-2 border-b border-slate-100 pb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3 mb-1 min-w-[140px]">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-slate-600 font-medium flex-1">{entry.name}</span>
                        <span className="font-mono-financial text-slate-800">
                            {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function StrategyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const rawName = params.name as string;
    const strategyName = decodeURIComponent(rawName);

    const [data, setData] = useState<StrategyDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [holdingDate, setHoldingDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!strategyName) return;
            setLoading(true);
            try {
                const response = await fetch(`/data/strategies/${strategyName}.json`);
                if (!response.ok) throw new Error(`未找到策略数据`);
                const result: StrategyDetailData = await response.json();
                setData(result);
            } catch (err) {
                console.error(err);
                setError('无法加载策略数据，请检查文件名匹配。');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [strategyName]);

    useEffect(() => {
        if (data && data.holdings && data.holdings.length > 0) {
            const uniqueDates = Array.from(new Set(data.holdings.map(h => h.date)));
            if (uniqueDates.length > 0) setHoldingDate(uniqueDates[0]);
        }
    }, [data]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-slate-500">
                <Loader2 size={32} className="animate-spin text-teal-600 mb-3" />
                <p className="text-sm font-medium animate-pulse">正在加载量化数据引擎...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-50 text-center max-w-md">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={24} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">数据加载异常</h2>
                    <p className="text-slate-500 mb-6 text-sm">{error}</p>
                    <button onClick={() => router.back()} className="px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
                        返回策略列表
                    </button>
                </div>
            </div>
        );
    }

    const availableDates = data.holdings ? Array.from(new Set(data.holdings.map(h => h.date))) : [];

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans pb-20 selection:bg-teal-100 selection:text-teal-900">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <button onClick={() => router.back()} className="group p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-slate-900">
                            <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">{data.name}</h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1.5 animate-pulse"></div>
                                    Live Trading
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                                <span>ID: {strategyName}</span>
                                <span className="text-slate-300">|</span>
                                <span className="truncate max-w-md">{data.description}</span>
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="text-right mr-2">
                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Latest NAV</div>
                            <div className="text-lg font-mono-financial text-slate-900">
                                {data.navCurve.length > 0 ? data.navCurve[data.navCurve.length - 1].strategy.toFixed(4) : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* 1. 核心指标 */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-600"><Activity size={18}/></div>
                        <h2 className="text-lg font-bold text-slate-800">核心表现分析</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <MetricCard label="累计收益" value={`${(data.metrics.totalReturn * 100).toFixed(2)}%`} trend={data.metrics.totalReturn > 0 ? 'up' : 'down'} highlight />
                        <MetricCard label="年化收益" value={`${(data.metrics.annualizedReturn * 100).toFixed(2)}%`} trend="up" />
                        <MetricCard label="Alpha" value={data.metrics.alpha.toFixed(3)} />
                        <MetricCard label="Sharpe Ratio" value={data.metrics.sharpe.toFixed(3)} highlight />
                        <MetricCard label="最大回撤" value={`${(data.metrics.maxDrawdown).toFixed(2)}%`} trend="down" />
                        <MetricCard label="胜率" value={`${(data.metrics.winRate * 100).toFixed(1)}%`} />
                        <MetricCard label="Beta" value={data.metrics.beta.toFixed(3)} />
                        <MetricCard label="Sortino" value={data.metrics.sortino.toFixed(3)} />
                        <MetricCard label="Info Ratio" value={data.metrics.infoRatio.toFixed(3)} />
                        <MetricCard label="波动率" value={`${(data.metrics.volatility * 100).toFixed(2)}%`} subValue={`Base: ${(data.metrics.benchmarkVolatility * 100).toFixed(1)}%`} />
                        <MetricCard label="盈亏比" value={data.metrics.plRatio.toFixed(3)} />
                        <MetricCard label="盈亏场次" value={`${data.metrics.winCount} / ${data.metrics.lossCount}`} />
                    </div>
                </section>

                {/* 2. 净值图表 */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 ring-1 ring-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-teal-50 rounded-md text-teal-600"><TrendingUp size={18}/></div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">净值走势</h2>
                                <p className="text-xs text-slate-400">Cumulative Wealth Curve</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-sm bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 px-2">
                                <span className="w-2.5 h-2.5 rounded-sm bg-teal-600 shadow-sm"></span>
                                <span className="font-medium text-slate-600">策略净值</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 border-l border-slate-200">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                <span className="font-medium text-slate-500">基准 (沪深300)</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data.navCurve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{fontSize: 11, fill: '#94a3b8'}} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} minTickGap={40} dy={10} />
                                <YAxis domain={['auto', 'auto']} tick={{fontSize: 11, fill: '#94a3b8'}} tickLine={false} axisLine={false} tickFormatter={(val) => val.toFixed(2)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Brush dataKey="date" height={40} stroke="#cbd5e1" fill="#f8fafc" tickFormatter={() => ''} className="opacity-50 hover:opacity-100 transition-opacity" />
                                <ReferenceLine y={1} stroke="#e2e8f0" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="4 4" name="基准净值" animationDuration={1500} />
                                <Area type="monotone" dataKey="strategy" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStrategy)" name="策略净值" animationDuration={1500} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* [新增] 3. 策略构建方法论 */}
                {data.methodology && (
                    <section>
                        <StrategyLogicCard data={data.methodology} />
                    </section>
                )}

                {/* 4. 持仓分析 */}
                <section>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-50 rounded-md text-orange-600"><Layers size={18}/></div>
                            <h2 className="text-lg font-bold text-slate-800">持仓穿透 (Top Holdings)</h2>
                        </div>
                        {availableDates.length > 0 && (
                            <div className="relative">
                                <select value={holdingDate} onChange={(e) => setHoldingDate(e.target.value)} className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 block w-40 p-2.5 pr-8 shadow-sm font-mono-financial cursor-pointer hover:border-teal-400 transition-colors">
                                    {availableDates.map(date => <option key={date} value={date}>{date}</option>)}
                                </select>
                                <Calendar className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" size={16}/>
                            </div>
                        )}
                    </div>
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden ring-1 ring-slate-100">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">代码</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">名称</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">行业</th>
                                <th className="px-6 py-4 text-right font-semibold tracking-wider">权重 (%)</th>
                                <th className="px-6 py-4 text-right font-semibold tracking-wider w-1/4">占比图示</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {data.holdings.filter(h => h.date === holdingDate).map((stock, idx) => (
                                <tr key={idx} className="bg-white hover:bg-teal-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-mono-financial text-slate-600 group-hover:text-teal-700 transition-colors">{stock.code}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{stock.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-white group-hover:border-teal-200 group-hover:text-teal-700 transition-colors">{stock.industry}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono-financial text-slate-700">{stock.weight.toFixed(2)}%</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: `${(stock.weight / 6) * 100}%`}}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.holdings.filter(h => h.date === holdingDate).length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3"><PieChart size={24} className="text-slate-300"/></div>
                                        该日期暂无持仓数据
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 text-center flex justify-between px-6">
                            <span>数据来源: 内部回测系统</span>
                            <span>更新时间: {holdingDate}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}