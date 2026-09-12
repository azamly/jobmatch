// // resources/js/Pages/jobseeker/saves.tsx
//
// import type { BreadcrumbItem as BI, SharedData } from '@/types';
// import AppLayout from '@/layouts/app-layout';
// import { Head, router, usePage } from '@inertiajs/react';
// import React, { useState, useCallback } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Inbox, Search } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { VacancyPagination, VacancyWithEmployer } from '@/types/employer';
// import Paginate from '@/components/paginate';
// import VacancyCard from '@/components/jobseeker/vacancy-card';
// import { debounce } from 'lodash';
// import { DatePickerInput } from '@/components/jobseeker/date-picker-input';
//
// const breadcrumbs: BI[] = [
//     {
//         title: 'Сохранённые',
//         href: route('vacancies.saves'),
//     },
// ];
//
// export default function Saves({ vacancies, filters = {} }: { vacancies: VacancyPagination; filters: any }) {
//     const [searchTerm, setSearchTerm] = useState(filters.search || '');
//     const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
//     const [selectedType, setSelectedType] = useState(filters.type || 'all');
//     const [dateFrom, setDateFrom] = useState(filters.date_from || '');
//     const [dateTo, setDateTo] = useState(filters.date_to || '');
//     const [minSalary, setMinSalary] = useState(filters.min_salary || '');
//     const [maxSalary, setMaxSalary] = useState(filters.max_salary || '');
//     const [experience, setExperience] = useState(filters.experience || '');
//     const { auth } = usePage<SharedData>().props;
//
//     // Дебounced функция для применения фильтров
//     const applyFilters = useCallback(
//         debounce((preserveScroll = true) => {
//             router.visit(route('vacancies.saves'), {
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
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title={breadcrumbs[0].title} />
//             <h1 className="font-bold text-3xl ml-6 mt-6">Сохранённые вакансии</h1>
//             <div className="p-6 space-y-6">
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
//                                     <SelectValue placeholder="Статус вакансии" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">Все статусы</SelectItem>
//                                     <SelectItem value="active">Активные</SelectItem>
//                                     <SelectItem value="inactive">Неактивные</SelectItem>
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
//                 <h1 className="text-2xl font-bold">Вакансии</h1>
//                 {vacancies.data.length === 0 ? (
//                     <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
//                         <Inbox className="h-16 w-16 text-muted-foreground" />
//                         <span>Пока нет сохранённых вакансий</span>
//                     </div>
//                 ) : (
//                     <>
//                         {vacancies.data.map((vacancy: VacancyWithEmployer) => (
//                             <VacancyCard key={vacancy.id} vacancy={vacancy} />
//                         ))}
//                         <div className="mt-4 flex items-center justify-end">
//                             <Paginate data={vacancies} />
//                         </div>
//                     </>
//                 )}
//             </div>
//         </AppLayout>
//     );
// }

// resources/js/Pages/jobseeker/saves.tsx

import type { BreadcrumbItem as BI, SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VacancyPagination, VacancyWithEmployer } from '@/types/employer';
import Paginate from '@/components/paginate';
import VacancyCard from '@/components/jobseeker/vacancy-card';
import { debounce } from 'lodash';
import { DatePickerInput } from '@/components/jobseeker/date-picker-input';

const breadcrumbs: BI[] = [
    {
        title: 'Сохранённые',
        href: route('vacancies.saves'),
    },
];

export default function Saves({ vacancies, filters = {}, industries = [] }: { vacancies: VacancyPagination; filters: any; industries: { id: number; name: string }[] }) {  // Добавлен industries
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [minSalary, setMinSalary] = useState(filters.min_salary || '');
    const [maxSalary, setMaxSalary] = useState(filters.max_salary || '');
    const [experience, setExperience] = useState(filters.experience || '');
    const [selectedIndustry, setSelectedIndustry] = useState(filters.industry || 'all');  // Новый state для industry
    const { auth } = usePage<SharedData>().props;

    // Дебounced функция для применения фильтров
    const applyFilters = useCallback(
        debounce((preserveScroll = true) => {
            router.visit(route('vacancies.saves'), {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <h1 className="font-bold text-3xl ml-6 mt-6">Сохранённые вакансии</h1>
            <div className="p-6 space-y-6">
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
                                    <SelectValue placeholder="Статус вакансии" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все статусы</SelectItem>
                                    <SelectItem value="active">Активные</SelectItem>
                                    <SelectItem value="inactive">Неактивные</SelectItem>
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
                <h1 className="text-2xl font-bold">Вакансии</h1>
                {vacancies.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
                        <Inbox className="h-16 w-16 text-muted-foreground" />
                        <span>Пока нет сохранённых вакансий</span>
                    </div>
                ) : (
                    <>
                        {vacancies.data.map((vacancy: VacancyWithEmployer) => (
                            <VacancyCard key={vacancy.id} vacancy={vacancy} />
                        ))}
                        <div className="mt-4 flex items-center justify-end">
                            <Paginate data={vacancies} />
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
