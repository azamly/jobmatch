import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Inbox, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Application,
    ApplicationPagination,
    PaginationLink,
    Vacancy
} from '@/types/employer';
import { Button } from '@/components/ui/button';
import { ApplicationCard } from '@/components/employer/application-list';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Отклики от вакансий',
        href: '/vacancy-applications',
    },
];

export default function Applications({
                                         vacanciesId,
                                         totalCountApplied = 0,
                                         totalCountRejected = 0,
                                         totalCountAccepted = 0,
                                         applications,
                                         vacancies
                                     }: {
    vacanciesId: number[] | null,
    totalCountApplied: number,
    totalCountRejected: number,
    totalCountAccepted: number,
    applications: ApplicationPagination,
    vacancies: Vacancy[]
}) {
    // Инициализация состояния с учетом параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search') || '';
    const initialStatus = urlParams.get('status') || 'all';
    const initialVacancy = urlParams.get('vacancy_id') || 'all';

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [selectedVacancy, setSelectedVacancy] = useState(initialVacancy);
    const [isSearching, setIsSearching] = useState(false);

    const totalPages = applications.last_page;
    const currentPage = applications.current_page;

    const goForward10 = Math.min(currentPage + 10, totalPages);
    const goBack10 = Math.max(currentPage - 10, 1);

    // Синхронизация состояния с URL при изменении параметров
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSearchTerm(params.get('search') || '');
        setSelectedStatus(params.get('status') || 'all');
        setSelectedVacancy(params.get('vacancy_id') || 'all');
    }, []);

    const handleFilter = () => {
        setIsSearching(true);
        router.get(
            route('vacancy-applications.show'),
            {
                search: searchTerm || undefined,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
                vacancy_id: selectedVacancy === 'all' ? undefined : selectedVacancy,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSearching(false);
                },
                onError: (errors) => {
                    setIsSearching(false);
                    toast.error('Ошибка при фильтрации: ' + JSON.stringify(errors));
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title}></Head>
            <h1 className={'font-bold text-3xl ml-6 mt-6'}>Все отклики</h1>
            <div className='p-6 space-y-6'>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="">
                            <div className="text-2xl font-bold">{totalCountApplied + totalCountAccepted + totalCountRejected}</div>
                            <div className="text-sm text-muted-foreground">Всего откликов</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="">
                            <div className="text-2xl font-bold">{totalCountApplied}</div>
                            <div className="text-sm text-muted-foreground">Заявлено</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="">
                            <div className="text-2xl font-bold">{totalCountAccepted}</div>
                            <div className="text-sm text-muted-foreground">Принято</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="">
                            <div className="text-2xl font-bold">{totalCountRejected}</div>
                            <div className="text-sm text-muted-foreground">Отклонено</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Фильтры</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Поиск по позиции или компании..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Статус" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все статусы</SelectItem>
                                    <SelectItem value="applied">Заявлено</SelectItem>
                                    <SelectItem value="accepted">Принято</SelectItem>
                                    <SelectItem value="rejected">Отклонено</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedVacancy} onValueChange={setSelectedVacancy}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Вакансия" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все вакансии</SelectItem>
                                    {vacancies.map((vacancy) => (
                                        <SelectItem key={vacancy.id} value={vacancy.id.toString()}>
                                            {vacancy.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter} disabled={isSearching}>
                                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Применить
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <h1 className='text-2xl font-bold'>Отклики</h1>

                {applications.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
                        <Inbox className="h-16 w-16 text-muted-foreground" />
                        <span>Пока нет откликов</span>
                    </div>
                ) : (
                    <>
                        {applications.data.map((application) => (
                            <ApplicationCard key={application.id} application={application} />
                        ))}

                        <div className="flex flex-wrap items-center gap-2 justify-end">
                            {currentPage > 10 && (
                                <Link
                                    href={applications.path + `?page=${goBack10}`}
                                    className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                                >
                                    <ChevronsLeft className="w-4 h-4" />
                                </Link>
                            )}

                            {applications.links.map((link: PaginationLink, index: number) => {
                                let content: React.ReactNode = <span dangerouslySetInnerHTML={{ __html: link.label }} />;

                                if (link.label === '&laquo;' || link.label.toLowerCase().includes('previous')) {
                                    content = <ChevronLeft className="w-4 h-4" />;
                                } else if (link.label === '&raquo;' || link.label.toLowerCase().includes('next')) {
                                    content = <ChevronRight className="w-4 h-4" />;
                                }

                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-1 border rounded-md ${
                                            link.active
                                                ? 'bg-primary text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {content}
                                    </Link>
                                ) : (
                                    <Button
                                        key={index}
                                        disabled
                                        className="px-3 py-1 border rounded-md bg-gray-100 text-gray-400 border-gray-300"
                                    >
                                        {content}
                                    </Button>
                                );
                            })}

                            {currentPage + 10 <= totalPages && (
                                <Link
                                    href={applications.path + `?page=${goForward10}`}
                                    className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                                >
                                    <ChevronsRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
