import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

export const formatDistance = (date: Date | string | number, locale: string = 'zh-CN') => {
    const distance = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: locale === 'zh' ? zhCN : enUS,
    });

    // 英文转中文
    if (locale === 'zh-CN') {
        return distance
            .replace(/about /g, '')
            .replace(/less than a minute ago/g, '刚刚')
            .replace(/a minute ago/g, '1分钟前')
            .replace(/(\d+) minutes ago/g, '$1分钟前')
            .replace(/an hour ago/g, '1小时前')
            .replace(/(\d+) hours ago/g, '$1小时前')
            .replace(/a day ago/g, '1天前')
            .replace(/(\d+) days ago/g, '$1天前')
            .replace(/a month ago/g, '1个月前')
            .replace(/(\d+) months ago/g, '$1个月前')
            .replace(/a year ago/g, '1年前')
            .replace(/(\d+) years ago/g, '$1年前');
    }

    return distance;
}; 