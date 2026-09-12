// // resources/js/Pages/jobseeker/apply.tsx
//
// import type { BreadcrumbItem as BI } from '@/types';
// import AppLayout from '@/layouts/app-layout';
// import { Head, Link, router, usePage } from '@inertiajs/react';
// import React, { useState, useCallback } from 'react';
// import {
//     Building,
//     CheckCircle,
//     ChevronLeft,
//     ChevronRight,
//     ChevronsLeft,
//     ChevronsRight,
//     Clock,
//     Eye,
//     Inbox,
//     MessageCircle,
//     Search,
//     XCircle,
// } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import {
//     Application,
//     ApplicationPagination,
//     PaginationLink,
//     VacancyPagination,
// } from '@/types/employer';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { getApplicationStatus, getVacancyType } from '@/lib/employer.data';
// import Paginate from '@/components/paginate';
// import ApplicationDetailsModal from '@/components/application-detail-modal';
// import { DatePickerInput } from '@/components/jobseeker/date-picker-input';
// import { debounce } from 'lodash'; // Импортируем lodash для дебouncing
//
// const breadcrumbs: BI[] = [
//     {
//         title: 'Отклики',
//         href: route('vacancies.apply'),
//     },
// ];
//
// export default function Apply({
//                                   applications,
//                                   totalCountApplied = 0,
//                                   totalCountRejected = 0,
//                                   totalCountAccepted = 0,
//                                   filters = {},
//                               }: {
//     applications: ApplicationPagination;
//     totalCountApplied: number;
//     totalCountRejected: number;
//     totalCountAccepted: number;
//     filters: any;
// }) {
//     const [searchTerm, setSearchTerm] = useState(filters.search || '');
//     const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
//     const [selectedType, setSelectedType] = useState(filters.type || 'all');
//     const [dateFrom, setDateFrom] = useState(filters.date_from || '');
//     const [dateTo, setDateTo] = useState(filters.date_to || '');
//     const [minSalary, setMinSalary] = useState(filters.min_salary || '');
//     const [maxSalary, setMaxSalary] = useState(filters.max_salary || '');
//     const [experience, setExperience] = useState(filters.experience || '');
//     const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//
//     // Дебounced функция для применения фильтров
//     const applyFilters = useCallback(
//         debounce((preserveScroll = true) => {
//             router.visit(route('vacancies.apply'), {
//                 data: {
//                     search: searchTerm,
//                     status: selectedStatus,
//                     type: selectedType,
//                     date_from: dateFrom,
//                     date_to: dateTo,
//                     min_salary: minSalary,
//                     max_salary: maxSalary,
//                     experience: experience,
//                 },
//                 preserveState: true,
//                 preserveScroll: preserveScroll,
//                 replace: true,
//             });
//         }, 300), // Задержка 300ms
//         [searchTerm, selectedStatus, selectedType, dateFrom, dateTo, minSalary, maxSalary, experience]
//     );
//
//     const openDetails = (application: Application) => {
//         setSelectedApplication(application);
//         setIsModalOpen(true);
//     };
//
//     const closeDetails = () => {
//         setSelectedApplication(null);
//         setIsModalOpen(false);
//     };
//
//     const totalPages = applications.last_page;
//     const currentPage = applications.current_page;
//     const goForward10 = Math.min(currentPage + 10, totalPages);
//     const goBack10 = Math.max(currentPage - 10, 1);
//
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title={breadcrumbs[0].title} />
//             <h1 className="font-bold text-3xl ml-6 mt-6">Мои отклики</h1>
//             <div className="p-6 space-y-6">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <Card>
//                         <CardContent className="pt-6">
//                             <div className="text-2xl font-bold">{totalCountApplied + totalCountAccepted + totalCountRejected}</div>
//                             <div className="text-sm text-muted-foreground">Всего откликов</div>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="pt-6">
//                             <div className="text-2xl font-bold">{totalCountApplied}</div>
//                             <div className="text-sm text-muted-foreground">Заявлено</div>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="pt-6">
//                             <div className="text-2xl font-bold">{totalCountAccepted}</div>
//                             <div className="text-sm text-muted-foreground">Принято</div>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="pt-6">
//                             <div className="text-2xl font-bold">{totalCountRejected}</div>
//                             <div className="text-sm text-muted-foreground">Отклонено</div>
//                         </CardContent>
//                     </Card>
//                 </div>
//
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Фильтры</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex flex-col md:flex-row gap-4 flex-wrap">
//                             <div className="flex-1">
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                                     <Input
//                                         placeholder="Поиск по позиции или компании..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         onBlur={() => applyFilters(true)} // Дебounced onBlur
//                                         className="pl-10"
//                                     />
//                                 </div>
//                             </div>
//                             <Select value={selectedStatus} onValueChange={(value) => { setSelectedStatus(value); applyFilters(); }}>
//                                 <SelectTrigger className="w-full md:w-48">
//                                     <SelectValue placeholder="Статус" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">Все статусы</SelectItem>
//                                     <SelectItem value="applied">Заявлено</SelectItem>
//                                     <SelectItem value="accepted">Принято</SelectItem>
//                                     <SelectItem value="rejected">Отклонено</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             <Select value={selectedType} onValueChange={(value) => { setSelectedType(value); applyFilters(); }}>
//                                 <SelectTrigger className="w-full md:w-48">
//                                     <SelectValue placeholder="Тип работы" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">Все типы</SelectItem>
//                                     <SelectItem value="full">Полная занятость</SelectItem>
//                                     <SelectItem value="part">Частичная занятость</SelectItem>
//                                     <SelectItem value="contract">Контракт</SelectItem>
//                                     <SelectItem value="remote">Удаленно</SelectItem>
//                                     <SelectItem value="internship">Стажировка</SelectItem>
//                                     <SelectItem value="temporary">Временная работа</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             <Input
//                                 placeholder="Мин. зарплата"
//                                 type="number"
//                                 value={minSalary}
//                                 onChange={(e) => setMinSalary(e.target.value)}
//                                 onBlur={() => applyFilters(true)}
//                                 className="w-full md:w-32"
//                             />
//                             <Input
//                                 placeholder="Макс. зарплата"
//                                 type="number"
//                                 value={maxSalary}
//                                 onChange={(e) => setMaxSalary(e.target.value)}
//                                 onBlur={() => applyFilters(true)}
//                                 className="w-full md:w-32"
//                             />
//                             <DatePickerInput
//                                 value={dateFrom}
//                                 onChange={(value) => { setDateFrom(value); applyFilters(); }}
//                                 placeholder="Дата от"
//                             />
//                             <DatePickerInput
//                                 value={dateTo}
//                                 onChange={(value) => { setDateTo(value); applyFilters(); }}
//                                 placeholder="Дата до"
//                             />
//                             <Input
//                                 placeholder="Опыт работы (напр. '2 года')"
//                                 value={experience}
//                                 onChange={(e) => setExperience(e.target.value)}
//                                 onBlur={() => applyFilters(true)}
//                                 className="w-full md:w-48"
//                             />
//                         </div>
//                     </CardContent>
//                 </Card>
//
//                 <h1 className="text-2xl font-bold">Отклики</h1>
//
//                 {applications.data.length === 0 ? (
//                     <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
//                         <Inbox className="h-16 w-16 text-muted-foreground" />
//                         <span>Пока нет вакансий</span>
//                     </div>
//                 ) : (
//                     <>
//                         {applications.data.map((application: Application, index) => {
//                             const salaryMoney = !(application.vacancy.salary_start === 0 && application.vacancy.salary_end === 0);
//                             const employerName = application.vacancy.employer?.company_name?.trim() ? application.vacancy.employer.company_name : 'Индивидуально';
//                             return (
//                                 <Card key={index} className="transition-shadow hover:shadow-lg">
//                                     <CardHeader>
//                                         <div className="flex items-center space-x-2">
//                                             <CardTitle className="text-lg">{application.vacancy.title}</CardTitle>
//                                             <Badge variant="outline">{getApplicationStatus(application.status ?? '')}</Badge>
//                                         </div>
//                                         <CardDescription>
//                                             <div className="flex items-center space-x-4 text-sm text-muted-foreground">
//                                                 <div className="flex items-center space-x-1">
//                                                     <Building className="h-4 w-4" />
//                                                     <span>{employerName}</span>
//                                                 </div>
//                                                 <span>•</span>
//                                                 <span>{application.vacancy.location}</span>
//                                                 <span>•</span>
//                                                 <span>
//                                                     {application.vacancy.salary_type === 'money'
//                                                         ? salaryMoney
//                                                             ? `${application.vacancy.salary_start} - ${application.vacancy.salary_end} смн.`
//                                                             : 'Договорённость'
//                                                         : 'Договорённость'}
//                                                 </span>
//                                                 <span>•</span>
//                                                 <Badge variant="outline" className="text-xs">
//                                                     {getVacancyType(application.vacancy.type)}
//                                                 </Badge>
//                                             </div>
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-sm text-muted-foreground">
//                                                 Подано: {new Date(application.created_at).toLocaleDateString('ru-RU')}
//                                             </span>
//                                             <div className="flex gap-2">
//                                                 <Button size="sm" variant="outline" onClick={() => openDetails(application)}>
//                                                     <Eye className="h-4 w-4 mr-1" />
//                                                     Детали
//                                                 </Button>
//                                                 <Button size="sm" variant="outline">
//                                                     <MessageCircle className="h-4 w-4 mr-1" />
//                                                     Написать
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             );
//                         })}
//                         {applications.data.length !== 0 && (
//                             <div className="flex flex-wrap items-center gap-2 justify-end">
//                                 {currentPage > 10 && (
//                                     <Link
//                                         href={`${applications.path}?page=${goBack10}`}
//                                         className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//                                     >
//                                         <ChevronsLeft className="w-4 h-4" />
//                                     </Link>
//                                 )}
//                                 {applications.links.map((link: PaginationLink, index: number) => {
//                                     let content: React.ReactNode = <span dangerouslySetInnerHTML={{ __html: link.label }} />;
//                                     if (link.label === '&laquo;' || link.label.toLowerCase().includes('previous')) {
//                                         content = <ChevronLeft className="w-4 h-4" />;
//                                     } else if (link.label === '&raquo;' || link.label.toLowerCase().includes('next')) {
//                                         content = <ChevronRight className="w-4 h-4" />;
//                                     }
//                                     return link.url ? (
//                                         <Link
//                                             key={index}
//                                             href={link.url}
//                                             className={`px-3 py-1 border rounded-md ${
//                                                 link.active
//                                                     ? 'bg-primary text-white border-blue-600'
//                                                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
//                                             }`}
//                                         >
//                                             {content}
//                                         </Link>
//                                     ) : (
//                                         <Button
//                                             key={index}
//                                             disabled
//                                             className="px-3 py-1 border rounded-md bg-gray-100 text-gray-400 border-gray-300"
//                                         >
//                                             {content}
//                                         </Button>
//                                     );
//                                 })}
//                                 {currentPage + 10 <= totalPages && (
//                                     <Link
//                                         href={`${applications.path}?page=${goForward10}`}
//                                         className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//                                     >
//                                         <ChevronsRight className="w-4 h-4" />
//                                     </Link>
//                                 )}
//                             </div>
//                         )}
//                     </>
//                 )}
//                 <ApplicationDetailsModal application={selectedApplication} open={isModalOpen} onClose={closeDetails} />
//             </div>
//         </AppLayout>
//     );
// }

// resources/js/Pages/jobseeker/apply.tsx

import type { BreadcrumbItem as BI } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState, useCallback } from 'react';
import {
    Building,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Clock,
    Eye,
    Inbox,
    MessageCircle,
    Search,
    XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    Application,
    ApplicationPagination,
    PaginationLink,
    VacancyPagination,
} from '@/types/employer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getApplicationStatus, getVacancyType } from '@/lib/employer.data';
import Paginate from '@/components/paginate';
import ApplicationDetailsModal from '@/components/application-detail-modal';
import { DatePickerInput } from '@/components/jobseeker/date-picker-input';
import { debounce } from 'lodash'; // Импортируем lodash для дебouncing

const breadcrumbs: BI[] = [
    {
        title: 'Отклики',
        href: route('vacancies.apply'),
    },
];

export default function Apply({
                                  applications,
                                  totalCountApplied = 0,
                                  totalCountRejected = 0,
                                  totalCountAccepted = 0,
                                  filters = {},
                                  industries = []  // Новый пропс для списка отраслей
                              }: {
    applications: ApplicationPagination;
    totalCountApplied: number;
    totalCountRejected: number;
    totalCountAccepted: number;
    filters: any;
    industries: { id: number; name: string }[];  // Тип для industries
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [minSalary, setMinSalary] = useState(filters.min_salary || '');
    const [maxSalary, setMaxSalary] = useState(filters.max_salary || '');
    const [experience, setExperience] = useState(filters.experience || '');
    const [selectedIndustry, setSelectedIndustry] = useState(filters.industry || 'all');  // Новый state для industry
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Дебounced функция для применения фильтров
    const applyFilters = useCallback(
        debounce((preserveScroll = true) => {
            router.visit(route('vacancies.apply'), {
                data: {
                    search: searchTerm,
                    status: selectedStatus,
                    type: selectedType,
                    date_from: dateFrom,
                    date_to: dateTo,
                    min_salary: minSalary,
                    max_salary: maxSalary,
                    experience: experience,
                    industry: selectedIndustry !== 'all' ? selectedIndustry : null,  // Добавлен industry (null если 'all')
                },
                preserveState: true,
                preserveScroll: preserveScroll,
                replace: true,
            });
        }, 300), // Задержка 300ms
        [searchTerm, selectedStatus, selectedType, dateFrom, dateTo, minSalary, maxSalary, experience, selectedIndustry]
    );

    const openDetails = (application: Application) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const closeDetails = () => {
        setSelectedApplication(null);
        setIsModalOpen(false);
    };

    const totalPages = applications.last_page;
    const currentPage = applications.current_page;
    const goForward10 = Math.min(currentPage + 10, totalPages);
    const goBack10 = Math.max(currentPage - 10, 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <h1 className="font-bold text-3xl ml-6 mt-6">Мои отклики</h1>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{totalCountApplied + totalCountAccepted + totalCountRejected}</div>
                            <div className="text-sm text-muted-foreground">Всего откликов</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{totalCountApplied}</div>
                            <div className="text-sm text-muted-foreground">Заявлено</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{totalCountAccepted}</div>
                            <div className="text-sm text-muted-foreground">Принято</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
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
                        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Поиск по позиции или компании..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onBlur={() => applyFilters(true)} // Дебounced onBlur
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={selectedStatus} onValueChange={(value) => { setSelectedStatus(value); applyFilters(); }}>
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
                            <Select value={selectedType} onValueChange={(value) => { setSelectedType(value); applyFilters(); }}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Тип работы" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все типы</SelectItem>
                                    <SelectItem value="full">Полная занятость</SelectItem>
                                    <SelectItem value="part">Частичная занятость</SelectItem>
                                    <SelectItem value="contract">Контракт</SelectItem>
                                    <SelectItem value="remote">Удаленно</SelectItem>
                                    <SelectItem value="internship">Стажировка</SelectItem>
                                    <SelectItem value="temporary">Временная работа</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Мин. зарплата"
                                type="number"
                                value={minSalary}
                                onChange={(e) => setMinSalary(e.target.value)}
                                onBlur={() => applyFilters(true)}
                                className="w-full md:w-32"
                            />
                            <Input
                                placeholder="Макс. зарплата"
                                type="number"
                                value={maxSalary}
                                onChange={(e) => setMaxSalary(e.target.value)}
                                onBlur={() => applyFilters(true)}
                                className="w-full md:w-32"
                            />
                            <DatePickerInput
                                value={dateFrom}
                                onChange={(value) => { setDateFrom(value); applyFilters(); }}
                                placeholder="Дата от"
                            />
                            <DatePickerInput
                                value={dateTo}
                                onChange={(value) => { setDateTo(value); applyFilters(); }}
                                placeholder="Дата до"
                            />
                            <Input
                                placeholder="Опыт работы (напр. '2 года')"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                onBlur={() => applyFilters(true)}
                                className="w-full md:w-48"
                            />
                            <Select value={selectedIndustry} onValueChange={(value) => { setSelectedIndustry(value); applyFilters(); }}>  {/* Новый Select для industry */}
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Отрасль" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все отрасли</SelectItem>
                                    {industries.map((industry) => (
                                        <SelectItem key={industry.id} value={industry.id.toString()}>
                                            {industry.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <h1 className="text-2xl font-bold">Отклики</h1>

                {applications.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
                        <Inbox className="h-16 w-16 text-muted-foreground" />
                        <span>Пока нет вакансий</span>
                    </div>
                ) : (
                    <>
                        {applications.data.map((application: Application, index) => {
                            const salaryMoney = !(application.vacancy.salary_start === 0 && application.vacancy.salary_end === 0);
                            const employerName = application.vacancy.employer?.company_name?.trim() ? application.vacancy.employer.company_name : 'Индивидуально';
                            return (
                                <Card key={index} className="transition-shadow hover:shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center space-x-2">
                                            <CardTitle className="text-lg">{application.vacancy.title}</CardTitle>
                                            <Badge variant="outline">{getApplicationStatus(application.status ?? '')}</Badge>
                                        </div>
                                        <CardDescription>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <Building className="h-4 w-4" />
                                                    <span>{employerName}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{application.vacancy.location}</span>
                                                <span>•</span>
                                                <span>
                                                    {application.vacancy.salary_type === 'money'
                                                        ? salaryMoney
                                                            ? `${application.vacancy.salary_start} - ${application.vacancy.salary_end} смн.`
                                                            : 'Договорённость'
                                                        : 'Договорённость'}
                                                </span>
                                                <span>•</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {getVacancyType(application.vacancy.type)}
                                                </Badge>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Подано: {new Date(application.created_at).toLocaleDateString('ru-RU')}
                                            </span>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => openDetails(application)}>
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Детали
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                        {applications.data.length !== 0 && (
                            <div className="flex flex-wrap items-center gap-2 justify-end">
                                {currentPage > 10 && (
                                    <Link
                                        href={`${applications.path}?page=${goBack10}`}
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
                                        href={`${applications.path}?page=${goForward10}`}
                                        className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                )}
                <ApplicationDetailsModal application={selectedApplication} open={isModalOpen} onClose={closeDetails} />
            </div>
        </AppLayout>
    );
}
