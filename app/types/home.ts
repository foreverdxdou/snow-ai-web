export interface DocStats {
    totalCount: number;
    parsedCount: number;
    weeklyNewCount: number;
    monthlyNewCount: number;
}

export interface KbStats {
    totalCount: number;
    activeCount: number;
    weeklyNewCount: number;
    monthlyNewCount: number;
}

export interface LatestDoc {
    id: number;
    title: string;
    fileType: string;
    kbName: string;
    createTime: string;
    creatorName: string;
}

export interface LatestKb {
    id: number;
    name: string;
    description: string;
    createTime: string;
    creatorName: string;
}

export interface HomeStatsVO {
    kbStats: KbStats;
    docStats: DocStats;
    latestKbs: LatestKb[];
    latestDocs: LatestDoc[];
} 