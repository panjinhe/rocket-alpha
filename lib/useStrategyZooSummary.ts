// lib/useStrategyZooSummary.ts
import { useMemo } from 'react';
import strategyData from '@/app/strategy-zoo/data/策略表现_多周期.json';

interface StrategyMetric {
    "策略名称": string;
    "年化超额": string;
    "夏普比率": string;
    // 其他字段按需添加
}

// 使用索引签名以适应动态的月份键名（如 "12个月_2511"）
interface RawStrategyData {
    [strategyName: string]: {
        [timePeriod: string]: StrategyMetric;
    }
}

export interface StrategySummary {
    champion: {
        name: string;
        sharpe: string;
        excess: string;
    };
    runnersUp: Array<{
        rank: number;
        name: string;
        sharpe: string;
    }>;
    lastUpdate: string;
}

export function useStrategyZooSummary(): StrategySummary {
    return useMemo(() => {
        const raw = strategyData as unknown as RawStrategyData;
        const strategies = Object.values(raw);

        // 1. 动态确定目标键名 (例如: "12个月_2511")
        // 逻辑：取第一个非空策略对象，查找所有以 "12个月_" 开头的键，排序取最大的那个
        let targetKey = "12个月_2511"; // 默认兜底
        const sampleStrategy = strategies.find(s => s);

        if (sampleStrategy) {
            const keys = Object.keys(sampleStrategy).filter(k => k.startsWith("12个月_"));
            if (keys.length > 0) {
                // 排序以确保取到最新的月份 (2511 > 2510)
                keys.sort();
                targetKey = keys[keys.length - 1];
            }
        }

        // 2. 根据键名解析日期用于展示 (2511 -> 2025-11)
        const dateSuffix = targetKey.split('_')[1] || "2511";
        const formattedDate = `20${dateSuffix.substring(0, 2)}-${dateSuffix.substring(2, 4)}`;

        // 3. 提取并排序数据
        const ranked = strategies
            .filter(s => s && s[targetKey]) // 关键防御：只处理包含目标月份数据的策略
            .map(s => {
                const data = s[targetKey];
                return {
                    name: data["策略名称"],
                    sharpeVal: parseFloat(data["夏普比率"]), // 排序用数值
                    sharpe: data["夏普比率"],               // 展示用字符串
                    excess: data["年化超额"]
                };
            })
            .sort((a, b) => b.sharpeVal - a.sharpeVal);

        // 4. 处理结果（含空数据保护）
        const champion = ranked.length > 0 ? ranked[0] : {
            name: '数据计算中',
            sharpe: '0.00',
            excess: '0.00%'
        };

        const runnersUp = ranked.slice(1, 4).map((s, i) => ({
            rank: i + 2,
            name: s.name,
            sharpe: s.sharpe,
        }));

        return {
            champion: {
                name: champion.name,
                sharpe: champion.sharpe,
                excess: champion.excess,
            },
            runnersUp,
            lastUpdate: `${formattedDate}-30`,
        };
    }, []);
}