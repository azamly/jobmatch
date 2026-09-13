import type { BreadcrumbItem as BI } from '@/types';
import { MatchDetails, VacancyWithEmployer } from '@/types/employer';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    DollarSign,
    Clock,
    Building2,
    Calendar,
    FileText,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Bookmark,
    BookmarkCheck,
    SendIcon,
    ArrowLeft,
    Check
} from 'lucide-react';
import { getVacancyType } from '@/lib/employer.data';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { cn, useVacancyView } from '@/lib/utils';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

const breadcrumbs: BI[] = [
    { title: "Панель управления", href: "/dashboard" },
    { title: "Вакансии", href: "/dashboard" },
    { title: "Просмотр", href: "" },
];

interface Props {
    vacancy: VacancyWithEmployer;
    match?: MatchDetails | null;
    hasApplied?: boolean;
    isFavorite?: boolean;
}

export default function MoreVacancyPage({ vacancy, match, hasApplied = false, isFavorite = false }: Props) {
    const { requestSendToView } = useVacancyView();
    const [saved, setSaved] = useState(isFavorite);
    const [applied, setApplied] = useState(hasApplied);
    const [isApplying, setIsApplying] = useState(false);

    const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);
    const employerName = vacancy.employer?.company_name?.trim() ? vacancy.employer.company_name : 'Работодатель';

    const scorePercent = match ? match.score_percent : (vacancy.score ? Math.round(vacancy.score * 100) : 0);

    const toggleSave = () => {
        const next = !saved;
        router.post(
            route('vacancies.save', vacancy.id),
            { save: next },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSaved(next);
                    toast.success(next ? 'Вакансия сохранена в избранное' : 'Вакансия удалена из избранного');
                },
                onError: () => toast.error('Ошибка сохранения'),
            }
        );
    };

    const handleApply = () => {
        setIsApplying(true);
        router.post(
            route('vacancies.quick-apply', vacancy.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setApplied(true);
                    setIsApplying(false);
                    toast.success('Отклик успешно отправлен работодателю!');
                },
                onError: () => {
                    setIsApplying(false);
                    toast.error('Не удалось отправить отклик. Заполните профиль.');
                },
            }
        );
    };

    const getScoreColor = (val: number) => {
        if (val >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        if (val >= 60) return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30';
        if (val >= 40) return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
        return 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/30';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Вакансия: ${vacancy.title}`} />

            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
                {/* Back button and title */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard" className="flex items-center gap-1">
                                <ArrowLeft className="h-4 w-4" /> Назад к вакансиям
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleSave}
                            className="flex items-center gap-2"
                        >
                            {saved ? (
                                <>
                                    <BookmarkCheck className="h-4 w-4 text-primary fill-primary/20" /> В сохранённых
                                </>
                            ) : (
                                <>
                                    <Bookmark className="h-4 w-4" /> Сохранить
                                </>
                            )}
                        </Button>

                        {applied ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5" /> Вы уже откликнулись
                            </Badge>
                        ) : (
                            <Button
                                size="sm"
                                disabled={isApplying}
                                onClick={handleApply}
                                className="flex items-center gap-2"
                            >
                                <SendIcon className="h-4 w-4" />
                                {isApplying ? 'Отправка...' : 'Откликнуться'}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Vacancy Header Card */}
                        <Card className="border border-border/80 shadow-sm">
                            <CardHeader className="space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl font-bold">{vacancy.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 text-base font-medium text-muted-foreground mt-1">
                                            <Building2 className="h-4 w-4" />
                                            <span>{employerName}</span>
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={vacancy.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'bg-red-500/10 text-red-600 border-red-500/30'}
                                    >
                                        {vacancy.status === 'active' ? 'Активна' : 'В архиве'}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2 border-t border-border/40">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        <span>{vacancy.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{getVacancyType(vacancy.type)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                        <DollarSign className="h-4 w-4 text-emerald-600" />
                                        <span>
                                            {vacancy.salary_type === 'money'
                                                ? salaryMoney
                                                    ? `${vacancy.salary_start.toLocaleString()} – ${vacancy.salary_end.toLocaleString()} смн.`
                                                    : 'По договорённости'
                                                : 'По договорённости'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{new Date(vacancy.created_at).toLocaleDateString('ru-RU')}</span>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* AI Match Score Breakdown Card */}
                        {match && (
                            <Card className="border-2 border-primary/30 bg-primary/5 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold">Оценка соответствия резюме</CardTitle>
                                                <CardDescription className="text-xs">
                                                    Интеллектуальный анализ вашего профиля и требований вакансии
                                                </CardDescription>
                                            </div>
                                        </div>

                                        <Badge
                                            variant="outline"
                                            className={cn('text-sm font-bold px-3 py-1 border', getScoreColor(scorePercent))}
                                        >
                                            {scorePercent}% Match
                                        </Badge>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full bg-muted rounded-full h-2.5 mt-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${scorePercent}%` }}
                                        />
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-1">
                                    {/* Matched reasons */}
                                    {match.matched_reasons.length > 0 && (
                                        <div className="space-y-2">
                                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Преимущества вашего профиля:
                                            </span>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {match.matched_reasons.map((reason, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2 p-2 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-500/20"
                                                    >
                                                        <span>{reason}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Missing requirements */}
                                    {match.missing_reasons.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-border/40">
                                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" /> Дополнительные требования:
                                            </span>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {match.missing_reasons.map((reason, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-medium border border-amber-500/20"
                                                    >
                                                        <span>{reason}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Detailed Description Sections */}
                        <Card className="border border-border/80 shadow-sm space-y-6 p-6">
                            {/* Description */}
                            {vacancy.description && (
                                <div className="space-y-2">
                                    <h3 className="text-base font-bold text-foreground">О вакансии</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {vacancy.description}
                                    </p>
                                </div>
                            )}

                            {/* Responsibilities */}
                            {vacancy.responsibility && (
                                <div className="space-y-2 pt-4 border-t border-border/40">
                                    <h3 className="text-base font-bold text-foreground">Обязанности</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {vacancy.responsibility}
                                    </p>
                                </div>
                            )}

                            {/* Qualifications */}
                            {vacancy.qualifications && (
                                <div className="space-y-2 pt-4 border-t border-border/40">
                                    <h3 className="text-base font-bold text-foreground">Требования к кандидату</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {vacancy.qualifications}
                                    </p>
                                </div>
                            )}

                            {/* Experience and Education */}
                            {(vacancy.experience || vacancy.education) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/40">
                                    {vacancy.experience && (
                                        <div className="space-y-1">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Требуемый опыт:</span>
                                            <p className="text-sm font-medium">{vacancy.experience}</p>
                                        </div>
                                    )}
                                    {vacancy.education && (
                                        <div className="space-y-1">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Образование:</span>
                                            <p className="text-sm font-medium">{vacancy.education}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Benefits */}
                            {vacancy.benefits && (
                                <div className="space-y-2 pt-4 border-t border-border/40">
                                    <h3 className="text-base font-bold text-foreground">Мы предлагаем</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {vacancy.benefits}
                                    </p>
                                </div>
                            )}

                            {/* Skills Tags */}
                            {vacancy.skills && vacancy.skills.length > 0 && (
                                <div className="space-y-2 pt-4 border-t border-border/40">
                                    <h3 className="text-base font-bold text-foreground mb-2">Ключевые навыки</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {vacancy.skills.map((skill, index) => {
                                            const isMatched = match?.matched_skills?.some(
                                                ms => ms.toLowerCase() === skill.toLowerCase()
                                            );
                                            return (
                                                <Badge
                                                    key={index}
                                                    variant={isMatched ? "default" : "secondary"}
                                                    className={cn(
                                                        "text-xs px-2.5 py-1",
                                                        isMatched && "bg-primary/20 text-primary border border-primary/30"
                                                    )}
                                                >
                                                    {isMatched ? `✓ ${skill}` : skill}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar action column */}
                    <div className="space-y-6">
                        <Card className="sticky top-6 border border-border/80 shadow-sm">
                            <CardHeader className="space-y-1 pb-4">
                                <CardTitle className="text-lg font-bold">Быстрый отклик</CardTitle>
                                <CardDescription className="text-xs">
                                    Отправьте резюме работодателю в один клик
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="p-3 rounded-lg bg-muted/50 text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Компания:</span>
                                        <span className="font-medium text-foreground">{employerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Локация:</span>
                                        <span className="font-medium text-foreground">{vacancy.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Занятость:</span>
                                        <span className="font-medium text-foreground">{getVacancyType(vacancy.type)}</span>
                                    </div>
                                </div>

                                {applied ? (
                                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs text-center font-medium border border-emerald-500/20">
                                        ✓ Вы успешно откликнулись на эту вакансию
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        disabled={isApplying}
                                        onClick={handleApply}
                                    >
                                        <SendIcon className="mr-2 h-4 w-4" />
                                        {isApplying ? 'Отправка...' : 'Откликнуться на вакансию'}
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={toggleSave}
                                >
                                    {saved ? (
                                        <>
                                            <BookmarkCheck className="mr-2 h-4 w-4 text-primary" /> Сохранено
                                        </>
                                    ) : (
                                        <>
                                            <Bookmark className="mr-2 h-4 w-4" /> Сохранить в избранное
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
