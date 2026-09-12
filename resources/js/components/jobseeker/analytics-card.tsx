"use client"

import type React from "react"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp,
    TrendingDown,
    Eye,
    Users,
    Briefcase,
    MessageCircle,
    Inbox,
    Star,
    ClipboardList
} from 'lucide-react';

interface AnalyticsCardProps {
    title: string
    value: string | number
    description?: string
    trend?: {
        value: number
        isPositive: boolean
    }
    icon?: React.ReactNode
}

export function AnalyticsCard({totalCountApplication=0,totalCountViewProfile=0,totalCountAllVacancies=0,totalCountRecommendedVacancies=0}:{totalCountApplication:number,totalCountAllVacancies:number,totalCountRecommendedVacancies:number,totalCountViewProfile:number}) {

    return (
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-1 @5xl/main:grid-cols-3">
            {/*<Card className="@container/card bg-gradient-to-t from-blue-500/10 to-card shadow-xs">*/}
            {/*    <CardHeader>*/}
            {/*        <CardDescription className="text-sm text-blue-600 dark:text-blue-400">Просмотр профиля</CardDescription>*/}
            {/*        <CardTitle*/}
            {/*            className="text-2xl font-bold text-blue-700 tabular-nums @[250px]/card:text-3xl dark:text-blue-300">*/}
            {/*            {totalCountViewProfile}*/}
            {/*        </CardTitle>*/}
            {/*        <CardAction className="flex items-center justify-center">*/}
            {/*            <Eye className="h-8 w-8 text-blue-500" />*/}
            {/*        </CardAction>*/}
            {/*    </CardHeader>*/}
            {/*</Card>*/}

            <Card className="@container/card bg-gradient-to-t from-blue-500/10 to-card shadow-xs">
                <CardHeader>
                    <CardDescription className="text-sm text-blue-600 dark:text-blue-400">Отклики</CardDescription>
                    <CardTitle
                        className="text-2xl font-semibold text-blue-700 tabular-nums @[250px]/card:text-3xl dark:text-blue-300">
                        {totalCountApplication}
                    </CardTitle>
                    <CardAction className="flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-blue-500" />
                    </CardAction>
                </CardHeader>
            </Card>

            <Card className="@container/card bg-gradient-to-t from-blue-500/10 to-card shadow-xs">
                <CardHeader>
                    <CardDescription className="text-sm text-blue-600 dark:text-blue-400">Кол-во вакансий</CardDescription>
                    <CardTitle
                        className="text-2xl font-semibold text-blue-700 tabular-nums @[250px]/card:text-3xl dark:text-blue-300">
                        {totalCountAllVacancies}
                    </CardTitle>
                    <CardAction className="flex items-center justify-center">
                        <ClipboardList className="h-8 w-8 text-blue-500" />
                    </CardAction>
                </CardHeader>
            </Card>
            <Card className="@container/card bg-gradient-to-t from-blue-500/10 to-card shadow-xs">
                <CardHeader>
                    <CardDescription className="text-sm text-blue-600 dark:text-blue-400">Кол-во рекомендаций</CardDescription>
                    <CardTitle
                        className="text-2xl font-semibold text-blue-700 tabular-nums @[250px]/card:text-3xl dark:text-blue-300">
                        {totalCountRecommendedVacancies}
                    </CardTitle>
                    <CardAction className="flex items-center justify-center">
                        <Star className="h-8 w-8 text-blue-500" />
                    </CardAction>
                </CardHeader>
            </Card>
        </div>

    )
}


