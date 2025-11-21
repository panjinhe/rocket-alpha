import { Download } from "lucide-react";

type PaperCardProps = {
    cnTitle: string;
    enTitle: string;
    authors: string;
    affiliation?: string;
    journal: string;
    pdf: string;
    tag?: string;
};

export function PaperCard({ cnTitle, enTitle, authors, affiliation, journal, pdf, tag }: PaperCardProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-8 border-b border-border last:border-0">
            <div className="flex-1 space-y-4">
                <h3 className="text-lg font-serif font-semibold leading-tight">
                    <a href={`/papers/${pdf}`} download className="hover:text-accent transition">
                        {cnTitle}
                        <br />
                        <span className="text-base font-normal text-muted-foreground">{enTitle}</span>
                    </a>
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>作者：</strong>{authors}</p>
                    {affiliation && <p className="text-xs opacity-80">{affiliation}</p>}
                    <p className="mt-2 text-muted-foreground/80">{journal}</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <a
                    href={`/papers/${pdf}`}
                    download
                    className="flex items-center gap-2 text-accent hover:underline font-medium text-sm"
                >
                    <Download className="h-4 w-4" />
                    PDF 下载
                </a>
                {tag && <span className="text-xs text-muted-foreground">{tag}</span>}
            </div>
        </div>
    );
}