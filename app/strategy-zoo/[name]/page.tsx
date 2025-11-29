// app/strategy-zoo/[name]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush
} from 'recharts';
import { ChevronLeft, Activity, TrendingUp, Layers, AlertCircle, Loader2 } from 'lucide-react';

// --- 1. 类型定义修改 ---
// 根据新的 JSON 结构，将原本是 string 的百分比字段改为 number
interface StrategyDetailedMetrics {
    totalReturn: number;      // 改为 number (例如 18.12)
    benchmarkReturn: number;  // 改为 number (例如 0.47)
    annualizedReturn: number; // 改为 number (例如 0.1976)
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
    maxDrawdown: number;      // 改为 number (例如 47.150)
}

interface DailyNavData { date: string; strategy: number; benchmark: number; }
interface HoldingData { date: string; code: string; name: string; weight: number; industry: string; }
interface StrategyDetailData {
    id?: string; name: string; description: string;
    metrics: StrategyDetailedMetrics; navCurve: DailyNavData[]; holdings: HoldingData[];
}

// --- 组件：指标卡片 ---
const MetricCard = ({ label, value, subValue, highlight = false }: { label: string, value: string | number, subValue?: string, highlight?: boolean }) => (
    <div className={`p-4 bg-white border rounded-sm shadow-sm ${highlight ? 'border-teal-600 border-l-4' : 'border-gray-200'}`}>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
        <div className={`text-lg font-mono font-bold ${highlight ? 'text-teal-800' : 'text-gray-900'}`}>
            {value}
        </div>
        {subValue && <div className="text-xs text-gray-400 mt-1">{subValue}</div>}
    </div>
);

export default function StrategyDetailPage() {
    const params = useParams();
    const router = useRouter();

    const rawName = params.name as string;
    const strategyName = decodeURIComponent(rawName);

    // 状态管理
    const [data, setData] = useState<StrategyDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [holdingDate, setHoldingDate] = useState('');

    // --- Effect 1: 加载数据 ---
    useEffect(() => {
        const fetchData = async () => {
            if (!strategyName) return;

            setLoading(true);
            try {
                // 使用 strategyName 请求 JSON
                const response = await fetch(`/data/strategies/${strategyName}.json`);

                if (!response.ok) {
                    throw new Error(`未找到策略 "${strategyName}" 的详细数据`);
                }

                const result: StrategyDetailData = await response.json();
                setData(result);
            } catch (err) {
                console.error(err);
                setError('无法加载策略数据，请检查文件名是否匹配。');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [strategyName]);

    // --- Effect 2: 设置默认持仓日期 ---
    useEffect(() => {
        if (data && data.holdings && data.holdings.length > 0) {
            const uniqueDates = Array.from(new Set(data.holdings.map(h => h.date)));
            if (uniqueDates.length > 0) {
                setHoldingDate(uniqueDates[0]);
            }
        }
    }, [data]);

    // --- 视图渲染 ---
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-500">
                <Loader2 size={32} className="animate-spin text-teal-700 mb-2" />
                <p>正在加载策略: {strategyName}...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">数据加载失败</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
                >
                    返回策略列表
                </button>
            </div>
        );
    }

    const availableDates = data.holdings ? Array.from(new Set(data.holdings.map(h => h.date))) : [];

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                                {data.name}
                                <span className="text-xs font-sans font-normal bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">Live</span>
                            </h1>
                            <p className="text-xs text-gray-500 font-mono">Strategy: {strategyName}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* 1. 核心指标矩阵 */}
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-teal-600"/> 核心表现 (Key Metrics)
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <MetricCard
                            label="累计收益"
                            value={`${(data.metrics.totalReturn * 100).toFixed(2)}%`}
                            highlight
                        />
                        <MetricCard
                            label="年化收益"
                            value={`${(data.metrics.annualizedReturn * 100).toFixed(2)}%`}
                        />
                        <MetricCard
                            label="Alpha"
                            value={data.metrics.alpha.toFixed(3)}
                        />
                        <MetricCard
                            label="Sharpe"
                            value={data.metrics.sharpe.toFixed(3)}
                        />
                        <MetricCard
                            label="最大回撤"
                            value={`${data.metrics.maxDrawdown.toFixed(2)}%`}
                        />
                        <MetricCard
                            label="胜率"
                            value={`${(data.metrics.winRate * 100).toFixed(1)}%`}
                        />

                        <MetricCard
                            label="Beta"
                            value={data.metrics.beta.toFixed(3)}
                        />
                        <MetricCard
                            label="Sortino"
                            value={data.metrics.sortino.toFixed(3)}
                        />
                        <MetricCard
                            label="Info Ratio"
                            value={data.metrics.infoRatio.toFixed(3)}
                        />
                        <MetricCard
                            label="波动率"
                            value={`${(data.metrics.volatility * 100).toFixed(2)}%`}
                            subValue={`基准: ${(data.metrics.benchmarkVolatility * 100).toFixed(2)}%`}
                        />
                        <MetricCard
                            label="盈亏比"
                            value={data.metrics.plRatio.toFixed(3)}
                        />
                        <MetricCard
                            label="盈亏次数"
                            value={`${data.metrics.winCount} / ${data.metrics.lossCount}`}
                        />
                    </div>
                </section>

                {/* 2. 交互式净值曲线图 */}
                <section className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp size={18} className="text-teal-600"/> 净值走势 (Cumulative Return)
                        </h2>
                        <div className="flex gap-2 text-sm">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-600 rounded-full"></div> 策略</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-400 rounded-full"></div> 基准</span>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.navCurve} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{fontSize: 12, fill: '#666'}}
                                    tickLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{fontSize: 12, fill: '#666'}}
                                    tickLine={false}
                                    tickFormatter={(val) => val.toFixed(2)}
                                />
                                <Tooltip
                                    contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                    itemStyle={{fontSize: '12px', fontWeight: 500}}
                                    labelStyle={{color: '#374151', marginBottom: '4px', fontSize: '12px'}}
                                />
                                <Brush
                                    dataKey="date"
                                    height={30}
                                    stroke="#0f766e"
                                    fill="#f0fdfa"
                                    tickFormatter={() => ''}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="strategy"
                                    stroke="#0f766e"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name="策略净值"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="benchmark"
                                    stroke="#9ca3af"
                                    strokeWidth={2}
                                    dot={false}
                                    strokeDasharray="5 5"
                                    name="基准净值"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* 3. 持仓分析 */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Layers size={18} className="text-teal-600"/> 月末前五大持仓 (Top Holdings)
                        </h2>
                        {availableDates.length > 0 && (
                            <select
                                value={holdingDate}
                                onChange={(e) => setHoldingDate(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-sm focus:ring-teal-500 focus:border-teal-500 block p-2"
                            >
                                {availableDates.map(date => (
                                    <option key={date} value={date}>{date}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 font-serif">代码</th>
                                <th className="px-6 py-3 font-serif">名称</th>
                                <th className="px-6 py-3 font-serif">行业</th>
                                <th className="px-6 py-3 text-right font-serif">权重 (%)</th>
                                <th className="px-6 py-3 text-right font-serif">占比图示</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.holdings
                                .filter(h => h.date === holdingDate)
                                .map((stock, idx) => (
                                    <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900">{stock.code}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{stock.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                                                {stock.industry}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-teal-700 font-bold">{stock.weight.toFixed(2)}%</td>
                                        <td className="px-6 py-4 text-right font-mono">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-200 mt-2">
                                                <div className="bg-teal-600 h-1.5 rounded-full" style={{width: `${(stock.weight / 10) * 100}%`}}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            {data.holdings.filter(h => h.date === holdingDate).length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                        该日期暂无持仓数据
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}