import request from '@/app/utils/request';
import type { Result } from '@/app/types/result';
import type { HomeStatsVO } from '@/app/types/home';

export const homeService = {
    getHomeStats: () => {
        return request.get<Result<HomeStatsVO>>('/home/stats');
    },

    getKbTrend: (startDate: string, endDate: string) => {
        return request.get<Result<number[]>>('/home/kb/trend', {
            params: { startDate, endDate }
        });
    },

    getDocTrend: (startDate: string, endDate: string) => {
        return request.get<Result<number[]>>('/home/doc/trend', {
            params: { startDate, endDate }
        });
    }
}; 