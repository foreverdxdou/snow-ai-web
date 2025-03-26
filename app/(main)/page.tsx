'use client';

import { Box, Typography, Paper, Grid, Card, CardContent, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
    const { t } = useTranslation();
    const theme = useTheme();

    const stats = [
        { label: t('stats.documents'), value: '1,234' },
        { label: t('stats.categories'), value: '56' },
        { label: t('stats.tags'), value: '89' },
        { label: t('stats.users'), value: '45' },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {t('home.welcome')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('home.description')}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h3" sx={{ mb: 1, color: 'primary.main' }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {stat.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        {t('home.recentActivity')}
                    </Typography>
                    <Typography color="text.secondary">
                        {t('home.noRecentActivity')}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
} 