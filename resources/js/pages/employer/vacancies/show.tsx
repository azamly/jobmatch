import type { BreadcrumbItem as BI } from '@/types';
import { BestCandidateItem, VacancyWithEmployer } from '@/types/employer';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    DollarSign,
    Clock,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    User,
    ArrowLeft,
    Edit,
    MessageCircle,
    Briefcase
} from 'lucide-react';
import { getVacancyType } from '@/lib/employer.data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';

const breadcrumbs: BI[] = [
    { title: "Вакансии", href: "/vacancies" },
    { title: "Просмотр", href: "" },
];

interface Props {
    vacancy: VacancyWithEmployer;
    bestCandidates?: BestCandidateItem[];
    applications?: any[];
}

export default function ShowVacancyPage({ vacancy, bestCandidates = [], applications = [] }: Props) {
    const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);

    const getScoreBadgeColor = (val: number) => {
        if (val >= 80) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
        if (val >= 60) return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
        if (val >= 40) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Вакансия: ${vacancy.title}`} />

            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
                {/* Top header navigation */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/vacancies" className="flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" /> Назад к списку вакансий
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('vacancies.edit', vacancy.id)} className="flex items-center gap-1">
                                <Edit className="h-4 w-4" /> Редактировать вакансию
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Vacancy Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border border-border/80 shadow-sm">
                            <CardHeader className="space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl font-bold">{vacancy.title}</CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground mt-1">
                                            {vacancy.employer?.company_name || 'Ваша компания'}
                                        </CardDescription>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={vacancy.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-red-500/10 text-red-600 border-red-500/30"}
                                    >
                                        {vacancy.status === "active" ? "Активна" : "Неактивна"}
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
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {vacancy.description && (
                                    <div className="space-y-2">
                                        <h3 className="text-base font-bold text-foreground">Описание</h3>
                                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{vacancy.description}</p>
                                    </div>
                                )}

                                {vacancy.responsibility && (
                                    <div className="space-y-2 pt-4 border-t border-border/40">
                                        <h3 className="text-base font-bold text-foreground">Обязанности</h3>
                                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{vacancy.responsibility}</p>
                                    </div>
                                )}

                                {vacancy.qualifications && (
                                    <div className="space-y-2 pt-4 border-t border-border/40">
                                        <h3 className="text-base font-bold text-foreground">Требования</h3>
                                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{vacancy.qualifications}</p>
                                    </div>
                                )}

                                {(vacancy.experience || vacancy.education) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/40 text-sm">
                                        {vacancy.experience && (
                                            <div>
                                                <span className="text-xs font-semibold text-muted-foreground uppercase">Опыт:</span>
                                                <p className="font-medium text-foreground">{vacancy.experience}</p>
                                            </div>
                                        )}
                                        {vacancy.education && (
                                            <div>
                                                <span className="text-xs font-semibold text-muted-foreground uppercase">Образование:</span>
                                                <p className="font-medium text-foreground">{vacancy.education}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {vacancy.skills && vacancy.skills.length > 0 && (
                                    <div className="space-y-2 pt-4 border-t border-border/40">
                                        <h3 className="text-base font-bold text-foreground">Ключевые навыки</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {vacancy.skills.map((skill, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="text-xs text-muted-foreground pt-4 border-t border-border/40">
                                    Опубликовано {new Date(vacancy.created_at).toLocaleDateString("ru-RU")}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: AI Best Matching Candidates */}
                    <div className="space-y-6">
                        <Card className="border-2 border-primary/30 shadow-sm bg-primary/5">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Подходящие кандидаты</CardTitle>
                                        <CardDescription className="text-xs">
                                            Рейтинг лучших кандидатов на основе AI-сопоставления
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {bestCandidates.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-muted-foreground">
                                        Нет подходящих кандидатов
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {bestCandidates.map((cand, idx) => {
                                            const candidateName = cand.profile ? `${cand.profile.first_name || ''} ${cand.profile.last_name || ''}`.trim() : (cand.user?.name || 'Кандидат');
                                            const candidateProfession = cand.profile?.summary || cand.profile?.experiences?.[0]?.job_title || 'Соискатель';

                                            return (
                                                <div
                                                    key={idx}
                                                    className="p-3.5 rounded-lg border border-border/80 bg-card hover:border-primary/40 transition-colors space-y-2.5 shadow-sm"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-start gap-2 min-w-0">
                                                            <span className="text-lg leading-none">{cand.medal}</span>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-sm text-foreground truncate">{candidateName}</p>
                                                                <p className="text-xs text-muted-foreground truncate">{candidateProfession}</p>
                                                            </div>
                                                        </div>

                                                        <Badge
                                                            variant="outline"
                                                            className={cn("text-xs font-bold px-2 py-0.5 shrink-0", getScoreBadgeColor(cand.score_percent))}
                                                        >
                                                            {cand.score_percent}% Match
                                                        </Badge>
                                                    </div>

                                                    {/* Matched reasons */}
                                                    {cand.match && (
                                                        <div className="text-[11px] space-y-1 pt-1 border-t border-border/40">
                                                            {cand.match.matched_reasons?.slice(0, 2).map((r, rIdx) => (
                                                                <div key={rIdx} className="text-emerald-700 dark:text-emerald-400 font-medium">
                                                                    {r}
                                                                </div>
                                                            ))}
                                                            {cand.match.missing_reasons?.slice(0, 1).map((mr, mrIdx) => (
                                                                <div key={mrIdx} className="text-amber-700 dark:text-amber-400 font-medium">
                                                                    {mr}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-[11px] text-muted-foreground">
                                                            {cand.profile?.location || 'Душанбе'}
                                                        </span>
                                                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2" asChild>
                                                            <Link href={`/chat-conversation/${cand.user?.id || 0}`}>
                                                                <MessageCircle className="w-3.5 h-3.5 mr-1" /> Написать
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
