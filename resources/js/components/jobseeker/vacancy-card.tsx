import React, { useState } from 'react';
import { VacancyWithEmployer } from '@/types/employer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
    Bookmark,
    BookmarkCheck,
    Building,
    CheckCircle2,
    Clock,
    DollarSign,
    Eye,
    MapPin,
    SendIcon,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, useVacancyView } from '@/lib/utils';
import { getVacancyType } from '@/lib/employer.data';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

export default function VacancyCard({
    vacancy,
    setScore = false,
    score = 0
}: {
    vacancy: VacancyWithEmployer;
    setScore?: boolean;
    score?: number;
}) {
    const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);
    const { requestSendToView } = useVacancyView();
    const [isSaved, setIsSaved] = useState(vacancy.isFavorite ?? false);
    const [isApplying, setIsApplying] = useState(false);

    const employerName = vacancy.employer?.company_name?.trim()
        ? vacancy.employer.company_name
        : 'Работодатель';

    function toggleSaveJob(vacancyId: number) {
        requestSendToView(vacancyId);
        const newState = !isSaved;

        router.post(
            route('vacancies.save', vacancyId),
            { save: newState },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaved(newState);
                    toast.success(
                        newState
                            ? 'Вакансия сохранена в закладки'
                            : 'Вакансия удалена из закладок'
                    );
                },
                onError: () => toast.error('Ошибка при сохранении вакансии')
            }
        );
    }

    function handleQuickApply(vacancyId: number) {
        requestSendToView(vacancyId);
        setIsApplying(true);

        router.post(
            route('vacancies.quick-apply', vacancyId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsApplying(false);
                    toast.success('Отклик успешно отправлен!');
                },
                onError: (errors) => {
                    setIsApplying(false);
                    toast.error('Не удалось отправить отклик. Заполните профиль.');
                }
            }
        );
    }

    // Рассчитываем процент совпадения
    const matchObj = vacancy.match;
    const effectiveScore = matchObj ? matchObj.score_percent : (vacancy.score ? Math.round(vacancy.score * 100) : (score ? Math.round(score * 100) : null));

    const getScoreBadgeColor = (val: number) => {
        if (val >= 80) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
        if (val >= 60) return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
        if (val >= 40) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30';
    };

    return (
        <Card className="transition-all duration-200 hover:shadow-md border border-border/80 hover:border-primary/40 bg-card">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
                                <Link
                                    href={vacancy?.id ? route('vacancies.more', vacancy.id) : '#'}
                                    onClick={() => vacancy?.id && requestSendToView(vacancy.id)}
                                >
                                    {vacancy.title}
                                </Link>
                            </CardTitle>

                            {/* Match Score Badge */}
                            {(effectiveScore !== null && effectiveScore > 0) && (
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        'font-semibold text-xs px-2.5 py-0.5 flex items-center gap-1.5 shadow-sm',
                                        getScoreBadgeColor(effectiveScore)
                                    )}
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {effectiveScore}% Match
                                </Badge>
                            )}
                        </div>

                        <CardDescription className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Building className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{employerName}</span>
                        </CardDescription>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSaveJob(vacancy.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
                        title={isSaved ? 'Удалить из закладок' : 'Сохранить вакансию'}
                    >
                        {isSaved ? (
                            <BookmarkCheck className="h-5 w-5 text-primary fill-primary/20" />
                        ) : (
                            <Bookmark className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{vacancy.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{getVacancyType(vacancy.type)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>
                            {vacancy.salary_type === 'money'
                                ? salaryMoney
                                    ? `${vacancy.salary_start.toLocaleString()} – ${vacancy.salary_end.toLocaleString()} смн.`
                                    : 'По договорённости'
                                : 'По договорённости'}
                        </span>
                    </div>
                </div>

                {/* Description */}
                {vacancy.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {vacancy.description}
                    </p>
                )}

                {/* Match explanations if available */}
                {matchObj && (matchObj.matched_skills.length > 0 || matchObj.missing_skills.length > 0) && (
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-muted-foreground/10 text-xs space-y-1.5">
                        {matchObj.matched_skills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Совпало:
                                </span>
                                {matchObj.matched_skills.slice(0, 4).map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 text-[11px] py-0 px-2">
                                        ✓ {skill}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {matchObj.missing_skills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> Требуется:
                                </span>
                                {matchObj.missing_skills.slice(0, 2).map((skill, idx) => (
                                    <Badge key={idx} variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px] py-0 px-2">
                                        ⚠️ {skill}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Skills tags */}
                {vacancy.skills && vacancy.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {vacancy.skills.map((skill, index) => {
                            const isMatched = matchObj?.matched_skills?.some(
                                ms => ms.toLowerCase() === skill.toLowerCase()
                            );
                            return (
                                <Badge
                                    key={index}
                                    variant={isMatched ? "default" : "secondary"}
                                    className={cn(
                                        "text-xs font-normal",
                                        isMatched && "bg-primary/15 text-primary border-primary/20 hover:bg-primary/25"
                                    )}
                                >
                                    {isMatched ? `✓ ${skill}` : skill}
                                </Badge>
                            );
                        })}
                    </div>
                )}

                {/* Card footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                        Опубликовано {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="h-8 text-xs font-medium">
                            <Link
                                href={vacancy?.id ? route('vacancies.more', vacancy.id) : '#'}
                                onClick={() => vacancy?.id && requestSendToView(vacancy.id)}
                            >
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                Подробнее
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            className="h-8 text-xs font-medium"
                            disabled={isApplying}
                            onClick={() => handleQuickApply(vacancy.id)}
                        >
                            <SendIcon className="mr-1.5 h-3.5 w-3.5" />
                            {isApplying ? 'Отправка...' : 'Откликнуться'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
