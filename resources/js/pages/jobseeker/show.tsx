import type { BreadcrumbItem as BI } from '@/types';
import { Vacancy, VacancyWithEmployer } from '@/types/employer';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Clock, Building2, Calendar, FileText } from 'lucide-react';
import { getVacancyType } from '@/lib/employer.data';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useVacancyView } from '@/lib/utils';

const breadcrumbs: BI[] = [
    { title: "Панель управления", href: "/dashboard" },
    { title: "Все вакансии", href: "/dashboard" },
    { title: "Просмотр", href: "" },
];

export default function MoreVacancyPage({ vacancy }: { vacancy: VacancyWithEmployer }) {
    const {requestSendToView} = useVacancyView()
    const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);
    const employerName =
        vacancy.employer?.company_name?.trim() ? vacancy.employer.company_name : 'Индивидуально';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Вакансия: ${vacancy.title}`} />

            <h1 className="text-3xl font-bold ml-4 mt-4">Просмотр вакансии</h1>
                <div className={'p-6 grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    <div className="lg:col-span-2 flex h-full flex-1 flex-col rounded-xl overflow-x-auto ">
                        <Card className="shadow-md max-w-4xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">{vacancy.title}</CardTitle>
                                <CardDescription className="flex flex-wrap gap-4 text-muted-foreground">
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
                                            : 'Договорённость'}
                                    </div>
                                    <Badge variant='outline'
                                           className={vacancy.status === 'active' ? 'text-emerald-600' : 'text-red-600'}>
                                        {vacancy.status === "active" ? "Активна" : "Неактивна"}
                                    </Badge>
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Описание */}
                                {vacancy.description && (
                                    <div>
                                        <h2 className="font-semibold">Описание</h2>
                                        <p className="text-muted-foreground">{vacancy.description}</p>
                                    </div>
                                )}

                                {/* Обязанности */}
                                {vacancy.responsibility && (
                                    <div>
                                        <h2 className="font-semibold">Обязанности</h2>
                                        <p className="text-muted-foreground">{vacancy.responsibility}</p>
                                    </div>
                                )}

                                {/* Требования / Квалификация */}
                                {vacancy.qualifications && (
                                    <div>
                                        <h2 className="font-semibold">Квалификация</h2>
                                        <p className="text-muted-foreground">{vacancy.qualifications}</p>
                                    </div>
                                )}

                                {/* Опыт */}
                                {vacancy.experience && (
                                    <div>
                                        <h2 className="font-semibold">Опыт</h2>
                                        <p className="text-muted-foreground">{vacancy.experience}</p>
                                    </div>
                                )}

                                {/* Образование */}
                                {vacancy.education && (
                                    <div>
                                        <h2 className="font-semibold">Образование</h2>
                                        <p className="text-muted-foreground">{vacancy.education}</p>
                                    </div>
                                )}

                                {/* Бонусы */}
                                {vacancy.benefits && (
                                    <div>
                                        <h2 className="font-semibold">Преимущества</h2>
                                        <p className="text-muted-foreground">{vacancy.benefits}</p>
                                    </div>
                                )}

                                {/* Навыки */}
                                {vacancy.skills.length > 0 && (
                                    <div>
                                        <h2 className="font-semibold mb-2">Навыки</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {vacancy.skills.map((skill, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Дата публикации */}
                                <div className="text-sm text-muted-foreground pt-4 border-t">
                                    Опубликовано {new Date(vacancy.created_at).toLocaleDateString("ru-RU")}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                                        <CardDescription className="flex items-center space-x-2 mt-1">
                                            <Building2 className="h-4 w-4" />
                                            <span>{employerName}</span>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm">
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{vacancy.location}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="font-medium text-primary">{vacancy.salary_type === 'money'
                                            ? salaryMoney
                                                ? `${vacancy.salary_start} - ${vacancy.salary_end} смн.`
                                                : 'Договорённость'
                                            : 'Договорённость'}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{getVacancyType(vacancy.type)}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Опубликовано {new Date(vacancy.created_at).toLocaleDateString("ru-RU")}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-semibold mb-2">Ключевые навыки</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {vacancy.skills?.map((skill,index) => (
                                            <Badge key={index} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-semibold mb-2">Краткое описание</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{vacancy.description}</p>
                                    <Button variant="link" className="p-0 h-auto text-xs mt-1" asChild>
                                        <Link href={route('vacancies.more', vacancy.id)}
                                              onClick={() => requestSendToView(vacancy.id)}>Читать полностью</Link>
                                    </Button>
                                </div>

                                <Button variant="outline" className="w-full bg-transparent" asChild>
                                    <Link href={route('vacancies.more', vacancy.id)}
                                          onClick={() => requestSendToView(vacancy.id)}>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Подробнее о вакансии
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
        </AppLayout>
    );
}
