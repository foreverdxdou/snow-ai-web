'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    useTheme,
} from '@mui/material';
import {
    QuestionAnswer as QuestionAnswerIcon,
    LibraryBooks as LibraryBooksIcon,
    Description as DescriptionIcon,
    TrendingUp as TrendingUpIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';
import { homeService } from '@/app/services/home';
import type { HomeStatsVO } from '@/app/types/home';
import { formatDistance } from '@/app/utils/date';

// 使用 React.memo 优化统计卡片组件
const StatCard = React.memo(({ 
    title, 
    value, 
    icon: Icon, 
    color,
    trend,
    trendTitle
}: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    color: string;
    trend?: number;
    trendTitle?: string;
}) => (
    <Card sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3,
        }
    }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        bgcolor: color,
                        mr: 2,
                    }}
                >
                    <Icon sx={{ color: 'white' }} />
                </Box>
                <Box>
                    <Typography color="textSecondary" variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4">
                        {value}
                    </Typography>
                    {trend !== undefined && (
                        <Typography 
                            variant="body2" 
                            color={trend >= 0 ? 'success.main' : 'error.main'}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <TrendingUpIcon sx={{ 
                                mr: 0.5, 
                                transform: trend < 0 ? 'rotate(180deg)' : 'none' 
                            }} />
                            {trendTitle}: {trend}
                        </Typography>
                    )}
                </Box>
            </Box>
            <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                    },
                }}
            />
        </CardContent>
    </Card>
));

StatCard.displayName = 'StatCard';

// 最新列表组件
const LatestList = React.memo(({ 
    title, 
    items, 
    renderItem 
}: { 
    title: string; 
    items: any[]; 
    renderItem: (item: any) => React.ReactNode;
}) => (
    <Paper sx={{ height: '100%', p: 2 }}>
        <Typography variant="h6" gutterBottom>
            {title}
        </Typography>
        <List>
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <ListItem>
                        {renderItem(item)}
                    </ListItem>
                    {index < items.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </List>
    </Paper>
));

LatestList.displayName = 'LatestList';

export default function HomePage() {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const [stats, setStats] = useState<HomeStatsVO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await homeService.getHomeStats();
                setStats(response.data.data);
            } catch (error) {
                console.error('Failed to fetch home stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <PerformanceLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <LinearProgress sx={{ width: '50%' }} />
                </Box>
            </PerformanceLayout>
        );
    }

    const statCards = [
        {
            title: t('home.stats.knowledge'),
            value: stats?.kbStats.totalCount || 0,
            icon: LibraryBooksIcon,
            color: '#2e7d32',
            trend: stats?.kbStats.activeCount || 0,
            trendTitle: t('home.stats.activeKb'),
        },
        {
            title: t('home.stats.documents'),
            value: stats?.docStats.totalCount || 0,
            icon: DescriptionIcon,
            color: '#ed6c02',
            trend: stats?.docStats.parsedCount || 0,
            trendTitle: t('home.stats.parsedDoc'),
        },
        {
            title: t('home.stats.weeklyNewKb'),
            value: stats?.kbStats.weeklyNewCount || 0,
            icon: QuestionAnswerIcon,
            color: '#1976d2',
            trend: stats?.kbStats.monthlyNewCount || 0,
            trendTitle: t('home.stats.monthlyNewKb'),
        },
        {
            title: t('home.stats.weeklyNewDoc'),
            value: stats?.docStats.weeklyNewCount || 0,
            icon: QuestionAnswerIcon,
            color: '#9c27b0',
            trend: stats?.docStats.monthlyNewCount || 0,
            trendTitle: t('home.stats.monthlyNewDoc'),
        },
    ];

    return (
        <PerformanceLayout>
            <Box>
                <Typography variant="h4" gutterBottom>
                    {t('home.title')}
                </Typography>
                <Grid container spacing={3}>
                    {statCards.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <StatCard {...stat} />
                        </Grid>
                    ))}
                    
                    {/* 最新知识库列表 */}
                    <Grid item xs={12} md={6}>
                        <LatestList
                            title={t('home.latest.knowledge')}
                            items={stats?.latestKbs || []}
                            renderItem={(kb) => (
                                <ListItemText
                                    primary={kb.name}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                                                {kb.description || t('home.latest.noDescription')}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                {formatDistance(kb.createTime, i18n.language)}
                                                <Box component="span" sx={{ ml: 2 }}>
                                                    {t('home.latest.creator')}：{kb.creatorName}
                                                </Box>
                                            </Typography>
                                        </>
                                    }
                                />
                            )}
                        />
                    </Grid>

                    {/* 最新文档列表 */}
                    <Grid item xs={12} md={6}>
                        <LatestList
                            title={t('home.latest.documents')}
                            items={stats?.latestDocs || []}
                            renderItem={(doc) => (
                                <ListItemText
                                    primary={doc.title}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                                                {t('home.latest.kbName')}：{doc.kbName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                {formatDistance(doc.createTime, i18n.language)}
                                                <Box component="span" sx={{ ml: 2 }}>
                                                    {t('home.latest.creator')}：{doc.creatorName}
                                                </Box>
                                                <Box component="span" sx={{ ml: 2 }}>
                                                    {t('home.latest.type')}：{doc.fileType}
                                                </Box>
                                            </Typography>
                                        </>
                                    }
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Box>
        </PerformanceLayout>
    );
} 