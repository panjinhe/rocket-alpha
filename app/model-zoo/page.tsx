'use client';

import React, { useState } from 'react';
// 引入图标
import {
    ArrowUp, ArrowDown, ArrowUpDown, Cpu, Zap, Activity,
    TrendingUp, FlaskConical, ChevronLeft, GitBranch,
} from 'lucide-react';

// --- 1. 定义 TypeScript 接口 ---

// 定义单条模型数据的结构
interface ModelData {
    id: number;
    name: string; // 模型名称 (e.g., LGBM_V3)
    type: 'ML' | 'DL' | 'Traditional' | 'Ensemble'; // 模型类型
    ICMean: string; // 信息系数均值 (越高越好)
    RankIC: string; // 排序信息系数均值 (越高越好)
    IR: string; // 信息比率 (IC Mean / IC Std)
    trainLoss: string; // 训练损失 (越低越好)
    timeComplexity: string; // 预测时间复杂度 (越低越好)
    status: 'Stable' | 'Training' | 'Degraded' | 'Experiment'; // 模型状态
}

// 定义所有可排序的列键名
type SortKey = keyof Omit<ModelData, 'id' | 'name' | 'type' | 'status'>;

// 定义排序配置的结构
interface SortConfig {
    key: SortKey | null;
    direction: 'asc' | 'desc';
}

// --- 2. 模拟数据 ---
const initialData: ModelData[] = [
    { id: 1, name: 'LightGBM_V3', type: 'ML', ICMean: '0.081', RankIC: '0.095', IR: '1.25', trainLoss: '0.045', timeComplexity: '1.2', status: 'Stable' },
    { id: 2, name: 'LSTM_Sequential', type: 'DL', ICMean: '0.065', RankIC: '0.070', IR: '0.88', trainLoss: '0.038', timeComplexity: '5.8', status: 'Degraded' },
    { id: 3, name: 'ElasticNet_Trad', type: 'Traditional', ICMean: '0.042', RankIC: '0.050', IR: '0.61', trainLoss: '0.052', timeComplexity: '0.5', status: 'Stable' },
    { id: 4, name: 'XGBoost_V2', type: 'ML', ICMean: '0.075', RankIC: '0.082', IR: '1.05', trainLoss: '0.048', timeComplexity: '2.1', status: 'Experiment' },
    { id: 5, name: 'GNN_Alpha_V1', type: 'DL', ICMean: '0.052', RankIC: '0.033', IR: '0.45', trainLoss: '0.035', timeComplexity: '9.5', status: 'Training' },
    { id: 6, name: 'Stacking_Ensemble', type: 'Ensemble', ICMean: '0.092', RankIC: '0.110', IR: '1.40', trainLoss: '0.040', timeComplexity: '7.0', status: 'Stable' },
];

// --- 3. 独立且类型化的工具组件 ---

interface SortIconProps {
    columnKey: SortKey;
    sortConfig: SortConfig;
}

const SortIcon = ({ columnKey, sortConfig }: SortIconProps) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-300 ml-1" />;
    return sortConfig.direction === 'asc'
        ? <ArrowUp size={14} className="text-purple-700 ml-1" />
        : <ArrowDown size={14} className="text-purple-700 ml-1" />;
};

// 辅助函数：根据值返回颜色类名
const getColorClass = (key: SortKey, valStr: string): string => {
    const val = parseFloat(valStr);

    if (key === 'ICMean' || key === 'RankIC' || key === 'IR') {
        // 预测能力指标：越高越好
        if (val > 0.08) return "text-green-700 font-bold";
        if (val < 0.04) return "text-red-700";
        return "text-gray-700";
    }

    if (key === 'trainLoss') {
        // 训练损失：越低越好
        if (val < 0.04) return "text-green-700 font-bold";
        if (val > 0.05) return "text-red-700";
        return "text-gray-700";
    }

    if (key === 'timeComplexity') {
        // 时间复杂度：越低越好
        if (val < 2.0) return "text-green-700";
        if (val > 5.0) return "text-red-700 font-bold";
        return "text-gray-700";
    }

    return "text-gray-600";
};

// 状态标签组件
const StatusTag = ({ status }: { status: ModelData['status'] }) => {
    let colorClass = '';
    let bgColorClass = '';
    let icon;
    switch (status) {
        case 'Stable':
            colorClass = 'text-green-700';
            bgColorClass = 'bg-green-50';
            icon = <Cpu size={14} className="mr-1" />;
            break;
        case 'Training':
            colorClass = 'text-blue-700';
            bgColorClass = 'bg-blue-50';
            icon = <Zap size={14} className="mr-1 animate-pulse" />;
            break;
        case 'Degraded':
            colorClass = 'text-red-700';
            bgColorClass = 'bg-red-50';
            icon = <TrendingUp size={14} className="mr-1 rotate-180" />;
            break;
        case 'Experiment':
        default:
            colorClass = 'text-yellow-700';
            bgColorClass = 'bg-yellow-50';
            icon = <FlaskConical size={14} className="mr-1" />;
            break;
    }
    return (
        <span className={`font-mono text-xs uppercase ${colorClass} ${bgColorClass} px-2 py-0.5 rounded-full font-medium flex items-center`}>
            {icon} {status}
        </span>
    );
};

// 模型方法论组件 (骨架)
const ModelMethodology = () => (
    <div className="bg-white p-8 border border-gray-200 shadow-lg">
        <h2 className="font-serif text-3xl font-bold mb-4 text-gray-900">模型训练与监控方法论</h2>
        <p className="text-gray-600 mb-6">此处将详细说明所有模型的输入特征、训练周期、超参数配置、以及线上监控流程，确保可追踪性。</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
            <li><span className="font-bold">特征工程：</span>涵盖动量、价值、质量、宏观、高频价量五大类共 120 个特征。</li>
            <li><span className="font-bold">目标函数：</span>针对 Rank IC 进行优化 (Customized Huber Loss)。</li>
            <li><span className="font-bold">训练周期：</span>所有模型每两周进行一次全量数据回溯训练。</li>
            <li><span className="font-bold">A/B测试：</span>新版本模型（如 V3）需经过 6 个月影子测试才能上线。</li>
        </ul>
    </div>
);


// --- 4. 主组件 ModelZooPage ---
export default function ModelZooPage() {
    const [version, setVersion] = useState<'Current' | 'All'>('Current');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'RankIC', direction: 'desc' });
    const [data, setData] = useState<ModelData[]>(initialData);
    const [view, setView] = useState<'zoo' | 'methodology'>('zoo');


    const handleSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        // 预测能力指标（IC, IR）是降序，损失和复杂度是升序
        const defaultAscKeys: SortKey[] = ['trainLoss', 'timeComplexity'];

        if (sortConfig.key === key) {
            direction = sortConfig.direction === 'desc' ? 'asc' : 'desc';
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

    // 默认排序：初始加载时进行一次排序
    React.useEffect(() => {
        handleSort('RankIC');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 【条件渲染】方法论视图
    if (view === 'methodology') {
        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans">
                <div className="max-w-7xl mx-auto mb-6">
                    <button
                        onClick={() => setView('zoo')}
                        className="flex items-center text-gray-700 hover:text-purple-700 transition-colors mb-6 text-sm font-medium"
                    >
                        <ChevronLeft size={16} className="mr-1" /> 返回模型总览
                    </button>
                    <ModelMethodology />
                </div>
            </div>
        );
    }

    // --- 概览指标卡计算 ---
    const bestICModel = data.reduce((max, current) =>
        parseFloat(current.RankIC) > parseFloat(max.RankIC) ? current : max, data[0]
    );
    const lowestLossModel = data.reduce((min, current) =>
        parseFloat(current.trainLoss) < parseFloat(min.trainLoss) ? current : min, data[0]
    );

    // 【默认渲染】主模型总览表格
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto mb-6">
                {/* --- 顶部导航区 --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-900 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="font-serif text-4xl font-bold text-gray-900">Model Zoo</h1>
                        </div>
                        <p className="text-gray-600 font-serif italic">
                            量化预测模型性能与训练状态监控 / 集成学习 (Ensemble Strategy)
                        </p>
                    </div>

                    {/* 版本与操作区 */}
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex bg-white border border-gray-300 rounded-sm p-1 shadow-sm">
                            <button
                                onClick={() => setVersion('Current')}
                                className={`px-4 py-1.5 text-sm font-medium transition-colors ${version === 'Current' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                线上版本
                            </button>
                            <div className="w-px bg-gray-200 my-1"></div>
                            <button
                                onClick={() => setVersion('All')}
                                className={`px-4 py-1.5 text-sm font-medium transition-colors ${version === 'All' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                全部版本
                            </button>
                        </div>
                        <button className="bg-purple-700 text-white px-4 py-2 text-sm font-medium hover:bg-purple-800 shadow-sm transition-colors">
                            触发紧急再训练 <Cpu size={16} className="ml-1 inline-block" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 模型标准链接栏 (切换按钮) --- */}
            <div className="max-w-7xl mx-auto mb-8">
                <div
                    onClick={() => setView('methodology')}
                    className="flex items-center justify-between p-3 bg-white border border-purple-200 text-purple-700 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer"
                >
                    <span className="flex items-center text-sm font-medium gap-3">
                        <GitBranch size={18} className="text-purple-600" />
                        <span className="font-serif">模型架构与训练标准</span>
                        <span className="text-gray-500 font-mono text-xs hidden sm:inline-block">/ Architecture & Monitoring Pipeline</span>
                    </span>
                    <span className="font-mono text-xs uppercase border border-purple-700 px-2 py-0.5 rounded-full hover:bg-purple-700 hover:text-white transition-colors">
                        查看详情
                    </span>
                </div>
            </div>

            {/* --- 概览指标卡 (Dashboard Summary) --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "最优预测能力", value: bestICModel.name, sub: `${bestICModel.RankIC} Rank IC`, icon: <TrendingUp size={16}/>, color: 'border-l-purple-700' },
                    { label: "最低训练损失", value: lowestLossModel.name, sub: `${lowestLossModel.trainLoss} Loss`, icon: <Zap size={16}/>, color: 'border-l-green-700' },
                    { label: "模型健康状态", value: "3 Stable / 1 Degraded", sub: "实时预测延迟 < 10ms", icon: <Activity size={16}/>, color: 'border-l-yellow-700' },
                    { label: "最新版本", value: "Stacking_Ensemble", sub: "2025-11-21", icon: <GitBranch size={16}/>, color: 'border-l-gray-900' },
                ].map((card, idx) => (
                    <div key={idx} className={`bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow border-l-4 ${card.color}`}>
                        <div className="text-xs text-gray-500 uppercase font-mono mb-1 flex items-center gap-2">
                            {card.icon} {card.label}
                        </div>
                        <div className="text-xl font-serif font-bold text-gray-900">{card.value}</div>
                        <div className={`text-sm font-mono mt-1 ${idx === 0 ? 'text-purple-700' : 'text-gray-500'}`}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* --- 核心数据表格 --- */}
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-medium tracking-wider">
                            <th className="p-4 w-60 font-serif text-gray-900">模型名称 (Model Name)</th>
                            <th className="p-4 text-gray-400">模型类型</th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('ICMean')}>
                                <div className="flex items-center">IC 均值 <SortIcon columnKey="ICMean" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('RankIC')}>
                                <div className="flex items-center">Rank IC <SortIcon columnKey="RankIC" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('IR')}>
                                <div className="flex items-center">信息比率 (IR) <SortIcon columnKey="IR" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('trainLoss')}>
                                <div className="flex items-center">训练损失 <SortIcon columnKey="trainLoss" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('timeComplexity')}>
                                <div className="flex items-center">推理耗时(ms) <SortIcon columnKey="timeComplexity" sortConfig={sortConfig} /></div>
                            </th>
                            <th className="p-4 w-24">当前状态</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 font-serif font-bold text-gray-800 border-l-2 border-transparent hover:border-purple-700 transition-all">
                                    {row.name}
                                </td>
                                <td className="p-4 font-mono text-xs text-gray-500">
                                    {row.type}
                                </td>
                                <td className={`p-4 font-mono font-medium ${getColorClass('ICMean', row.ICMean)}`}>
                                    {row.ICMean}
                                </td>
                                <td className={`p-4 font-mono font-bold ${getColorClass('RankIC', row.RankIC)} bg-purple-50/50`}>
                                    {row.RankIC}
                                </td>
                                <td className={`p-4 font-mono ${getColorClass('IR', row.IR)}`}>
                                    {row.IR}
                                </td>
                                <td className={`p-4 font-mono ${getColorClass('trainLoss', row.trainLoss)}`}>
                                    {row.trainLoss}
                                </td>
                                <td className={`p-4 font-mono ${getColorClass('timeComplexity', row.timeComplexity)}`}>
                                    {row.timeComplexity}ms
                                </td>
                                <td className="p-4">
                                    <StatusTag status={row.status} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 底部注释 */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <span>* Rank IC (排序信息系数) 是量化预测能力的核心指标。推理耗时为平均单日全市场预测所需时间。</span>
                    <span>Displaying {data.length} models</span>
                </div>
            </div>
        </div>
    );
}