// components/PaperCard.tsx (示例)

import React from 'react';

interface PaperCardProps {
    cnTitle: string;
    enTitle: string;
    authors: string;
    affiliation?: string;
    journal: string;
    pdf: string;
    tag: string;
}

export const PaperCard: React.FC<PaperCardProps> = ({
                                                        cnTitle,
                                                        enTitle,
                                                        authors,
                                                        affiliation,
                                                        journal,
                                                        pdf,
                                                        tag,
                                                    }) => {
    return (
        // 对应 .paper-item
        <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0 transition hover:bg-white px-4 -mx-4">

            {/* 左边：标题 + 作者 + 机构 */}
            <div className="flex-1 pr-6">

                {/* 标题部分 - 对应 .paper-title */}
                <div className="mb-1 text-gray-900">
                    <a href={pdf} download className="text-gray-900 no-underline font-semibold hover:text-blue-700 transition">
                        {cnTitle}
                        <br />
                        <span className="font-normal text-base text-gray-600 block mt-0.5">
                            {enTitle}
                        </span>
                    </a>
                </div>

                {/* 作者与机构 */}
                <div className="text-sm text-gray-600 leading-relaxed">
                    <strong className="font-medium">作者：</strong>{authors}
                    {affiliation && (
                        <span className="text-xs block mt-0.5 text-gray-500">
                            {affiliation}
                        </span>
                    )}
                </div>

                {/* 期刊元信息 */}
                <div className="text-xs text-gray-500 mt-1">
                    {journal}
                </div>
            </div>

            {/* 右边：PDF下载 + 日期 - 对应 .paper-meta */}
            <div className="text-right whitespace-nowrap font-mono">
                <a href={pdf} download className="text-blue-700 no-underline font-medium text-sm hover:text-blue-800 transition">
                    [PDF 下载]
                </a>
                <div className="text-gray-500 text-xs mt-1">
                    {tag}
                </div>
            </div>
        </div>
    );
};