import type { BreadcrumbItem as BI } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Archive,
    Briefcase,
    Clock, DollarSign,
    Edit,
    Eye, Folder, Inbox,
    MapPin, MessageSquare,
    Plus,
    Trash2,
    TrendingUp, User2,
    Users, Zap
} from 'lucide-react';
import React, { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Vacancy, VacancyPagination, VacancyWithEmployer } from '@/types/employer';
import { getVacancyType } from '@/lib/employer.data';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import StateCard from '@/components/vacancy/state-card';
import Paginate from '@/components/paginate';



const breadcrumbs: BI[] = [
    {
        title: 'Вакансии',
        href: '/vacancies',
    },
];
export default function IndexVacancyPage({vacancies,totalViews,totalApplications,totalActiveVacancies}:{vacancies:VacancyPagination,totalApplications:number,totalViews:number,totalActiveVacancies:number}){
    const { delete: deleteVacancy } = useForm<Vacancy>();
    function handleDelete(e:FormEvent,vacancyId:number){
        e.preventDefault()
        deleteVacancy(route('vacancies.destroy',vacancyId),{
            onSuccess:()=>{
                toast.success('Вакансия успешно удаленна')
            },
            onError:()=>{
                toast.error('Произошла ошибка во время удаления')
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${breadcrumbs[0].title}`}></Head>
            <div className="@container/main flex flex-1 flex-col p-6 gap-2">
                <div className="flex flex-col gap-4 md:gap-6">
                    <StateCard totalActiveVacancies={totalActiveVacancies} totalApplications={totalApplications} totalViews={totalViews} />
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">Вакансии</span>
                        <Link href={'/vacancies/create'}>
                            <Button>
                                <Plus /> Добавить вакансию
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {vacancies.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
                                <Inbox className="h-16 w-16 text-muted-foreground" />
                                <span>Пока нет вакансий</span>
                                    <Link href={route('vacancies.create')}>
                                        <Button>
                                            <Plus /> Добавить первую вакансию
                                        </Button>
                                    </Link>
                            </div>
                        ) : (
                            <>
                                {vacancies.data.map((vacancy: VacancyWithEmployer) => {
                                const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);
                                return (
                                    <Card key={vacancy.id} className="border-l-4 border-l-primary transition-all duration-300 hover:shadow-xl">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-2 flex items-center gap-3">
                                                        <CardTitle className="text-xl">{vacancy.title}</CardTitle>
                                                        <Badge className={'text-white'} variant={vacancy.status === 'active' ? 'default' : 'secondary'}>
                                                            {vacancy.status === 'active' ? 'Активна' : 'Неактивна'}
                                                        </Badge>
                                                    </div>
                                                                          <CardDescription className="text-base flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                      <Users className="h-4 w-4" />
                                                        {vacancy.applications_count ?? 0} откликов
                                                    </span>
                                                                              <span className="flex items-center gap-1">
                                                      <Eye className="h-4 w-4" />
                                                                                  {vacancy.views_count ?? 0} просмотров
                                                    </span>
                                                                              <span className="flex items-center gap-1">
                                                      <Activity className="h-4 w-4" />
                                                                                  {vacancy.conversions ?? 0}% конверсия
                                                    </span>
                                                                          </CardDescription>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Link href={route('vacancies.show',vacancy.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Просмотр
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('vacancies.edit', vacancy.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Редактировать
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => handleDelete(e, vacancy.id)}
                                                        className="text-red-600 hover:border-red-300 hover:text-red-700"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Удалить
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-muted-foreground">{vacancy.description}</p>

                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {vacancy.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {getVacancyType(vacancy.type)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    {vacancy.salary_type === 'money'
                                                        ? salaryMoney
                                                            ? `${vacancy.salary_start} - ${vacancy.salary_end} смн.`
                                                            : 'Договорённость'
                                                        : 'Договорённость'}{' '}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {vacancy.skills.map((skill,index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/50 p-4 text-sm md:grid-cols-2">
                                                <div>
                                                    <span className="font-medium">Опыт: </span>
                                                    <span className="text-muted-foreground">{vacancy.experience}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Образование: </span>
                                                    <span className="text-muted-foreground">{vacancy.education}</span>
                                                </div>
                                                {/*<div>*/}
                                                {/*    <span className="font-medium">Ср. время отклика: </span>*/}
                                                {/*    <span*/}
                                                {/*        className="text-muted-foreground">{vacancy.analytics.avgResponseTime}</span>*/}
                                                {/*</div>*/}
                                            </div>

                                            <div className="flex items-center justify-between border-t pt-4">
                                                <span className="text-sm text-muted-foreground">
                                                    Опубликовано {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Button asChild variant={'outline'} size={'sm'}>
                                                        <Link href={`/dashboard?vacancy=${vacancy.id}&tab=recommended`}>
                                                            <User2 />
                                                            Рекомендации
                                                        </Link>
                                                    </Button>
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/vacancy-applications?search=&vacancy_id=${vacancy.id}`}>
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            Посмотреть отклики
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                                <div className={'mt-4 flex items-center justify-end'}>
                                    <Paginate data={vacancies} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
