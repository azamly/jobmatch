import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Eye, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface StateCardProps {
    totalActiveVacancies?: number;
    totalViews?: number;
    totalApplications?: number;
}

export default function StateCard({
                                      totalActiveVacancies = 0,
                                      totalViews = 0,
                                      totalApplications = 0
                                  }: StateCardProps) {

    const conversion = totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : '0';

    return (
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

            <Card className="@container/card bg-gradient-to-t from-blue-500/10 to-card shadow-xs">
                <CardHeader>
                    <CardDescription className="text-sm text-blue-600 dark:text-blue-400">Всего просмотров</CardDescription>
                    <CardTitle className="text-2xl font-bold text-blue-700 tabular-nums @[250px]/card:text-3xl dark:text-blue-300">
                        {totalViews}
                    </CardTitle>
                    <CardAction className="flex items-center justify-center">
                        <Eye className="h-8 w-8 text-blue-500" />
                    </CardAction>
                </CardHeader>
            </Card>

            <Card className="@container/card bg-gradient-to-t from-blue-500/10 to-card shadow-xs">
                <CardHeader>
                    <CardDescription className="text-sm text-blue-600 dark:text-blue-400">Всего откликов</CardDescription>
                    <CardTitle className="text-2xl font-semibold text-blue-700 tabular-nums @[250px]/card:text-3xl dark:text-blue-300">
                        {totalApplications}
                    </CardTitle>
                    <CardAction className="flex items-center justify-center">
                        <Users className="h-8 w-8 text-blue-500" />
                    </CardAction>
                </CardHeader>
            </Card>

            <Card className="@container/card bg-gradient-to-t from-blue-500/10 to-card shadow-xs">
                <CardHeader>
                    <CardDescription className="text-sm text-blue-600 dark:text-blue-400">Активные вакансии</CardDescription>
                    <CardTitle className="text-2xl font-semibold text-blue-700 tabular-nums @[250px]/card:text-3xl dark:text-blue-300">
                        {totalActiveVacancies}
                    </CardTitle>
                    <CardAction className="flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-blue-500" />
                    </CardAction>
                </CardHeader>
            </Card>

            <Card className="@container/card bg-gradient-to-t from-blue-500/10 to-card shadow-xs">
                <CardHeader>
                    <CardDescription className="text-sm text-blue-600 dark:text-blue-400">Средняя конверсия</CardDescription>
                    <CardTitle className="text-2xl font-semibold text-blue-700 tabular-nums @[250px]/card:text-3xl dark:text-blue-300">
                        {conversion}%
                    </CardTitle>
                    <CardAction className="flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-blue-500" />
                    </CardAction>
                </CardHeader>
            </Card>

        </div>
    );
}
