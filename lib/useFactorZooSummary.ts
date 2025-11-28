// lib/useFactorZooSummary.ts
import { useMemo } from 'react';
import data1Y from '@/app/factor-zoo/data/因子表现回测12月_2511.json';
import data3Y from '@/app/factor-zoo/data/因子表现回测36月_2511.json';

interface RawFactor {
    "因子名称": string;
    "多空超额年化": number;
}

export type TimeRange = '1Y' | '3Y';

export interface FactorSummary {
    champion: {
        name: string;
        return: string;
    };
    runnersUp: Array<{
        rank: number;
        name: string;
        return: string;
    }>;
    lastUpdate: string;
}

export function useFactorZooSummary(timeRange: TimeRange = '3Y'): FactorSummary {
    return useMemo(() => {
        const raw = (timeRange === '1Y' ? data1Y : data3Y) as RawFactor[];

        const ranked = raw
            .map(f => ({
                name: f["因子名称"].split('(')[0].trim(),
                excessAnn: f["多空超额年化"] * 100,
            }))
            .sort((a, b) => b.excessAnn - a.excessAnn);

        const format = (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;

        const champion = ranked[0];
        const runnersUp = ranked.slice(1, 4).map((f, i) => ({
            rank: i + 2,
            name: f.name,
            return: format(f.excessAnn),
        }));

        return {
            champion: {
                name: champion.name,
                return: format(champion.excessAnn),
            },
            runnersUp,
            lastUpdate: '2025-11-30',
        };
    }, [timeRange]);
}