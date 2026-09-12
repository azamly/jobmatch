import type { BreadcrumbItem as BI } from '@/types';
import { Vacancy } from '@/types/employer';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Clock } from 'lucide-react';
import { getVacancyType } from '@/lib/employer.data';

const breadcrumbs: BI[] = [
    { title: "Вакансии", href: "/vacancies" },
    { title: "Просмотр", href: "" },
];

export default function ShowVacancyPage({ vacancy }: { vacancy: Vacancy }) {
    const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Вакансия: ${vacancy.title}`} />

            <h1 className="text-3xl font-bold ml-4 mt-4">Просмотр вакансии</h1>

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
                <Card className="shadow-md max-w-3xl">
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
                            <Badge variant={vacancy.status === "active" ? "default" : "secondary"}>
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
        </AppLayout>
    );
}
