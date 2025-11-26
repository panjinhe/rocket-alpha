// app/strategy-zoo/StrategyMethodology.tsx
'use client';

import React from 'react';
import {
    Scale, Database, ShieldAlert,
    Calculator, Clock, ArrowRight
} from 'lucide-react';

export const StrategyMethodology = () => {
    return (
        <div className="bg-white border border-gray-200 shadow-xl rounded-sm overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-gray-900 p-8 text-white">
                <h2 className="font-serif text-3xl font-bold mb-2">策略回测标准与方法论</h2>
                <h3 className="text-teal-400 font-mono text-sm uppercase tracking-widest">Backtest Methodology & Framework</h3>
                <p className="mt-4 text-gray-300 max-w-2xl text-sm leading-relaxed">
                    本平台所有策略均基于统一的量化回测框架构建，以确保横向可比性。
                    以下详细说明了数据处理、信号构建、组合优化及风险控制的具体规则。
                </p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section 1: 基础设置 */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-teal-700">
                        <Database size={20} />
                        <h4 className="font-bold text-lg">1. 基础环境与数据 (Universe & Data)</h4>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start">
                            <ArrowRight size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                            <span>
                                <strong className="text-gray-900">股票池 (Universe):</strong> 剔除 ST、PT、上市未满 60 天新股及停牌股票。核心股票池为沪深 300 成分股。
                            </span>
                        </li>
                        <li className="flex items-start">
                            <ArrowRight size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                            <span>
                                <strong className="text-gray-900">基准 (Benchmark):</strong> 沪深 300 全收益指数 (CSI 300 Total Return)。
                            </span>
                        </li>
                        <li className="flex items-start">
                            <ArrowRight size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                            <span>
                                <strong className="text-gray-900">复权方式:</strong> 后复权 (Dividend Adjusted) 价格用于计算收益。
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Section 2: 交易成本 */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-teal-700">
                        <Calculator size={20} />
                        <h4 className="font-bold text-lg">2. 交易成本 (Transaction Costs)</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <table className="w-full text-sm">
                            <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-500">买入滑点 (Slippage)</td>
                                <td className="py-2 text-right font-mono font-bold text-gray-900">5 bps</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-500">卖出滑点 (Slippage)</td>
                                <td className="py-2 text-right font-mono font-bold text-gray-900">5 bps</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-500">交易佣金 (Commission)</td>
                                <td className="py-2 text-right font-mono font-bold text-gray-900">2 bps</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-gray-500">印花税 (Stamp Duty)</td>
                                <td className="py-2 text-right font-mono font-bold text-gray-900">5 bps (Sell only)</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 3: 组合构建 */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-teal-700">
                        <Scale size={20} />
                        <h4 className="font-bold text-lg">3. 组合构建 (Portfolio Construction)</h4>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start">
                            <ArrowRight size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                            <span>
                                <strong className="text-gray-900">权重优化:</strong> 使用 Mean-Variance 优化器，目标函数为最大化 IR (Information Ratio)。
                            </span>
                        </li>
                        <li className="flex items-start">
                            <ArrowRight size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                            <span>
                                <strong className="text-gray-900">个股权重上限:</strong> 单只股票权重不超过 <span className="font-mono bg-gray-100 px-1">3.0%</span>。
                            </span>
                        </li>
                        <li className="flex items-start">
                            <ArrowRight size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                            <span>
                                <strong className="text-gray-900">行业中性:</strong> 相对基准行业偏离度控制在 <span className="font-mono bg-gray-100 px-1">±2.0%</span> 以内 (中信一级行业分类)。
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Section 4: 风险管理 */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-teal-700">
                        <ShieldAlert size={20} />
                        <h4 className="font-bold text-lg">4. 风险控制 (Risk Management)</h4>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start">
                            <ArrowRight size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                            <span>
                                <strong className="text-gray-900">止损机制:</strong> 单个策略回撤超过 20% 触发熔断审查机制。
                            </span>
                        </li>
                        <li className="flex items-start">
                            <ArrowRight size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                            <span>
                                <strong className="text-gray-900">风格暴露:</strong> 严格控制 Size (市值) 和 Beta 暴露，确保收益来源于选股 Alpha 这里的风格因子。
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
                <Clock size={14} />
                <span>最后更新时间: 2025-11-25 | 所有的历史回测数据不代表未来表现。</span>
            </div>
        </div>
    );
};