import { AnalyticsCard } from '@/components/jobseeker/analytics-card';
import { Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Eye,
    Inbox,
    Loader2,
    Plus,
    Search,
    SlidersHorizontal,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import {
    ProfileCompleteness,
    Recommended,
    RecommendedPagination,
    VacancyPagination,
    VacancyWithEmployer,
} from '@/types/employer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CVViewer } from '@/components/jobseeker/cv-viewer';
import { JobSeekerProfile } from '@/types/jobseeker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getVacancyType } from '@/lib/employer.data';
import { Badge } from '@/components/ui/badge';
import JobseekerPaginate from '@/components/jobseeker-paginate';
import VacancyCard from '@/components/jobseeker/vacancy-card';
import { SharedData } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';

interface FilterState {
    search: string;
    location: string;
    jobType: string[];
    salaryRange: [number, number];
    skills: string[];
    sortBy: string;
    industry: string | null;
}

export default function JobSeekerDashboard({
    jobseeker,
    hasJobSeeker,
    completeness,
    vacancies,
    totalCountApplication = 0,
    totalCountViews = 0,
    totalCountAllVacancies = 0,
    totalCountRecommendedVacancies = 0,
    recommended,
}: {
    jobseeker: JobSeekerProfile;
    hasJobSeeker: boolean;
    completeness?: ProfileCompleteness | null;
    vacancies: VacancyPagination;
    totalCountApplication: number;
    totalCountViews: number;
    totalCountAllVacancies: number;
    totalCountRecommendedVacancies: number;
    recommended: RecommendedPagination;
}) {
    const [showCVPreview, setShowCVPreview] = useState(false);
    const { filters, industries = [] } = usePage<SharedData & { filters: FilterState; industries: { id: number; name: string }[] }>().props;
    const [searchTerm, setSearchTerm] = useState<string>(filters?.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        search: filters?.search || '',
        location: filters?.location || '',
        jobType: filters?.jobType || [],
        salaryRange: filters?.salaryRange && Array.isArray(filters.salaryRange) && filters.salaryRange.length === 2
            ? filters.salaryRange
            : [0, 100000],
        skills: filters?.skills || [],
        sortBy: filters?.sortBy || 'relevance',
        industry: filters?.industry || null,
    });
    const [isSearching, setIsSearching] = useState(false);

    const updateFilters = useCallback(
        debounce((filters: FilterState) => {
            const params: Record<string, any> = {};
            if (filters.search) params.search = filters.search;
            if (filters.location) params.location = filters.location;
            if (filters.jobType.length) params.jobType = filters.jobType;
            if (filters.salaryRange) params.salaryRange = filters.salaryRange;
            if (filters.skills.length) params.skills = filters.skills;
            if (filters.industry) params.industry = filters.industry;
            params.sortBy = filters.sortBy;

            router.get(route('dashboard'), params, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Filter applied
                },
                onError: () => {
                    toast.error('Ошибка при применении фильтров');
                },
            });
        }, 300),
        []
    );

    useEffect(() => {
        const updatedFilters = { ...activeFilters, search: searchTerm };
        updateFilters(updatedFilters);
        return () => {
            updateFilters.cancel();
        };
    }, [searchTerm, activeFilters, updateFilters]);

    const hasActiveFilters = () => {
        return (
            activeFilters.search ||
            activeFilters.location ||
            activeFilters.jobType.length > 0 ||
            activeFilters.skills.length > 0 ||
            activeFilters.salaryRange[0] !== 0 ||
            activeFilters.salaryRange[1] !== 100000 ||
            activeFilters.sortBy !== 'relevance' ||
            activeFilters.industry !== null
        );
    };

    const handleResetFilters = () => {
        const resetFilters: FilterState = {
            search: '',
            location: '',
            jobType: [],
            salaryRange: [0, 100000],
            skills: [],
            sortBy: 'relevance',
            industry: null,
        };
        setActiveFilters(resetFilters);
        setSearchTerm('');
        updateFilters(resetFilters);
        toast.info('Фильтры и поиск сброшены');
    };

    const handleApplyFilters = (filters: FilterState) => {
        setActiveFilters(filters);
        setShowFilters(false);
        updateFilters(filters);
        toast.success('Фильтры применены');
    };

    const renderFilterUI = (dataLength: number) => (
        <div className="space-y-4">
            <div className="flex flex-wrap md:flex-nowrap gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Поиск вакансий по названию, компании или навыкам..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10"
                    />
                </div>

                <Dialog open={showFilters} onOpenChange={setShowFilters}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn('h-10', hasActiveFilters() ? 'border-primary text-primary font-semibold' : '')}
                        >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Фильтры
                            {hasActiveFilters() && (
                                <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                                    ✓
                                </Badge>
                            )}
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Фильтры вакансий</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div>
                                <Label className="text-xs font-semibold">Город / Локация</Label>
                                <Input
                                    value={activeFilters.location}
                                    onChange={(e) =>
                                        setActiveFilters({ ...activeFilters, location: e.target.value })
                                    }
                                    placeholder="Душанбе, Худжанд..."
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-xs font-semibold">Тип занятости</Label>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {['full', 'part', 'remote', 'contract', 'internship', 'temporary'].map(
                                        (type) => (
                                            <Button
                                                key={type}
                                                type="button"
                                                size="sm"
                                                variant={
                                                    activeFilters.jobType.includes(type)
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className="text-xs h-7"
                                                onClick={() =>
                                                    setActiveFilters({
                                                        ...activeFilters,
                                                        jobType: activeFilters.jobType.includes(type)
                                                            ? activeFilters.jobType.filter((t) => t !== type)
                                                            : [...activeFilters.jobType, type],
                                                    })
                                                }
                                            >
                                                {getVacancyType(type)}
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <Label className="font-semibold">Диапазон зарплаты</Label>
                                    <span className="text-muted-foreground">{activeFilters.salaryRange[0]} – {activeFilters.salaryRange[1]} смн.</span>
                                </div>
                                <Slider
                                    value={activeFilters.salaryRange}
                                    onValueChange={(value: [number, number]) =>
                                        setActiveFilters({ ...activeFilters, salaryRange: value })
                                    }
                                    min={0}
                                    max={100000}
                                    step={500}
                                />
                            </div>

                            <div>
                                <Label className="text-xs font-semibold">Навыки (через запятую)</Label>
                                <Input
                                    value={activeFilters.skills.join(', ')}
                                    onChange={(e) =>
                                        setActiveFilters({
                                            ...activeFilters,
                                            skills: e.target.value
                                                ? e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                                                : [],
                                        })
                                    }
                                    placeholder="Python, React, SQL..."
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-xs font-semibold">Отрасль</Label>
                                <Select
                                    value={activeFilters.industry || 'all'}
                                    onValueChange={(value) =>
                                        setActiveFilters({ ...activeFilters, industry: value === 'all' ? null : value })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Все отрасли" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Все отрасли</SelectItem>
                                        {industries.map((ind) => (
                                            <SelectItem key={ind.id} value={ind.id.toString()}>
                                                {ind.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold">Сортировка</Label>
                                <Select
                                    value={activeFilters.sortBy}
                                    onValueChange={(value) =>
                                        setActiveFilters({ ...activeFilters, sortBy: value })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="По релевантности" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">По соответствию (Match Score)</SelectItem>
                                        <SelectItem value="date">По дате публикации</SelectItem>
                                        <SelectItem value="salary_high">По зарплате (по убыванию)</SelectItem>
                                        <SelectItem value="salary_low">По зарплате (по возрастанию)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 pt-2 border-t">
                                <Button className="flex-1" onClick={() => handleApplyFilters(activeFilters)}>Применить</Button>
                                <Button variant="outline" onClick={handleResetFilters}>Сбросить</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {hasActiveFilters() && (
                    <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-10 text-xs">
                        Сбросить
                    </Button>
                )}
            </div>

            {hasActiveFilters() && (
                <div className="flex flex-wrap items-center gap-1.5 p-3 bg-muted/40 rounded-lg text-xs">
                    <span className="font-semibold text-muted-foreground mr-1">Фильтры:</span>
                    {activeFilters.search && <Badge variant="secondary">Поиск: {activeFilters.search}</Badge>}
                    {activeFilters.location && <Badge variant="secondary">Локация: {activeFilters.location}</Badge>}
                    {activeFilters.jobType.map((t) => (
                        <Badge key={t} variant="secondary">{getVacancyType(t)}</Badge>
                    ))}
                    {activeFilters.industry && (
                        <Badge variant="secondary">
                            Отрасль: {industries.find(i => i.id.toString() === activeFilters.industry)?.name || ''}
                        </Badge>
                    )}
                </div>
            )}

            <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
                <span>Найдено вакансий: <strong className="text-foreground">{dataLength}</strong></span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto w-full">
            {/* Analytics Card Bar */}
            <AnalyticsCard
                totalCountApplication={totalCountApplication}
                totalCountRecommendedVacancies={totalCountRecommendedVacancies}
                totalCountAllVacancies={totalCountAllVacancies}
                totalCountViewProfile={totalCountViews}
            />

            {/* Profile Completeness Card (if profile exists) */}
            {completeness && (
                <Card className="border border-border/80 bg-card shadow-sm">
                    <CardHeader className="py-3 px-4 md:px-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-bold">
                                        Заполненность профиля: {completeness.percentage}%
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {completeness.percentage >= 80
                                            ? 'Отлично! Ваш профиль полностью готов к автоматическому подбору вакансий.'
                                            : 'Заполните недостающие разделы для более точного расчета Match Score.'}
                                    </p>
                                </div>
                            </div>

                            <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                                <Link href={route('jobseeker.edit')}>
                                    Редактировать профиль <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </div>

                        <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    completeness.percentage >= 80 ? "bg-emerald-500" : completeness.percentage >= 50 ? "bg-blue-500" : "bg-amber-500"
                                )}
                                style={{ width: `${completeness.percentage}%` }}
                            />
                        </div>
                    </CardHeader>
                </Card>
            )}

            {/* Section Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Вакансии</h1>
                    <p className="text-sm text-muted-foreground">
                        Поиск подходящей работы на основе ваших навыков и опыта
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {hasJobSeeker ? (
                        <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9">
                                    <Eye className="h-4 w-4 mr-1.5" /> Просмотр резюме
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Предпросмотр вашего резюме</DialogTitle>
                                </DialogHeader>
                                <CVViewer data={jobseeker} showActions={false} />
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Button asChild size="sm" className="h-9">
                            <Link href={route('jobseeker.index')}>
                                <Plus className="h-4 w-4 mr-1.5" /> Заполнить резюме (CV)
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs & Vacancy List */}
            <Tabs defaultValue="recommended" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-md h-10">
                    <TabsTrigger value="recommended" className="text-xs md:text-sm font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        Рекомендованные ({recommended.total || 0})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="text-xs md:text-sm font-semibold">
                        Все вакансии ({totalCountAllVacancies})
                    </TabsTrigger>
                </TabsList>

                {/* Recommended Tab */}
                <TabsContent value="recommended" className="space-y-6">
                    {renderFilterUI(recommended.data.length)}

                    {recommended.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 rounded-xl border border-dashed p-8 bg-muted/20">
                            <Inbox className="h-12 w-12 text-muted-foreground/60" />
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">Пока нет рекомендаций</h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Заполните ваш профиль или нажмите кнопку ниже, чтобы запустить расчет соответствия с вакансиями.
                                </p>
                            </div>
                            <Button asChild onClick={() => setIsSearching(true)}>
                                <Link href={route('recommended.vacancy', jobseeker ? jobseeker.id : 0)}>
                                    {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Обновить рекомендации
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="text-xs"
                                    onClick={() => setIsSearching(true)}
                                >
                                    <Link href={route('recommended.vacancy', jobseeker ? jobseeker.id : 0)}>
                                        {isSearching ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />}
                                        Пересчитать AI Match
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {recommended.data.map((rec: Recommended, idx: number) => (
                                    <VacancyCard
                                        key={rec.id || idx}
                                        vacancy={rec.vacancy}
                                        setScore={true}
                                        score={rec.score}
                                    />
                                ))}
                            </div>

                            {recommended.data.length > 0 && (
                                <div className="mt-6 flex justify-end">
                                    <JobseekerPaginate data={recommended} />
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* All Vacancies Tab */}
                <TabsContent value="all" className="space-y-6">
                    {renderFilterUI(vacancies.data.length)}

                    {vacancies.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 rounded-xl border border-dashed p-8 bg-muted/20">
                            <Inbox className="h-12 w-12 text-muted-foreground/60" />
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">Вакансии не найдены</h3>
                                <p className="text-sm text-muted-foreground">
                                    Попробуйте изменить параметры поиска или сбросить фильтры.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleResetFilters}>
                                Сбросить фильтры
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {vacancies.data.map((vacancy: VacancyWithEmployer, idx: number) => (
                                    <VacancyCard
                                        key={vacancy.id || idx}
                                        vacancy={vacancy}
                                        setScore={hasJobSeeker}
                                        score={vacancy.score}
                                    />
                                ))}
                            </div>

                            {vacancies.data.length > 0 && (
                                <div className="mt-6 flex justify-end">
                                    <JobseekerPaginate data={vacancies} />
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
