'use client';

import React, { useMemo } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CardHeader,
    LinearProgress,
} from '@mui/material';
import {
    QuestionAnswer as QuestionAnswerIcon,
    LibraryBooks as LibraryBooksIcon,
    Description as DescriptionIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PerformanceLayout } from '@/app/components/common/PerformanceLayout';

// 使用 React.memo 优化统计卡片组件
const StatCard = React.memo(({ 
    title, 
    value, 
    icon: Icon, 
    color 
}: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    color: string;
}) => (
    <Card>
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

export default function HomePage() {
    const { t } = useTranslation();

    // 使用 useMemo 优化统计数据
    const stats = useMemo(() => [
        {
            title: t('home.stats.qa'),
            value: 0,
            icon: QuestionAnswerIcon,
            color: '#1976d2',
        },
        {
            title: t('home.stats.knowledge'),
            value: 0,
            icon: LibraryBooksIcon,
            color: '#2e7d32',
        },
        {
            title: t('home.stats.documents'),
            value: 0,
            icon: DescriptionIcon,
            color: '#ed6c02',
        },
        {
            title: t('home.stats.users'),
            value: 0,
            icon: PeopleIcon,
            color: '#9c27b0',
        },
    ], [t]);

    return (
        <PerformanceLayout>
            <Box>
                <Typography variant="h4" gutterBottom>
                    {t('home.title')}
                </Typography>
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <StatCard {...stat} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </PerformanceLayout>
    );
} 