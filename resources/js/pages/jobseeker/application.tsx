import type { BreadcrumbItem as BI } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, Clock, DollarSign, FileText, MapPin, Send } from 'lucide-react';
import React, { FormEvent } from 'react';
import { Vacancy, VacancyApply, VacancyWithEmployer } from '@/types/employer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DatePickerInput } from '@/components/jobseeker/date-picker-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getVacancyType } from '@/lib/employer.data';
import { Badge } from '@/components/ui/badge';
import { useVacancyView } from '@/lib/utils';

const breadcrumbs: BI[] = [
    { title: "Панель управления", href: "/dashboard" },
    { title: "Все вакансии", href: "/dashboard" },
    { title: "Откликнуться", href: "" },
];

export default function ApplicationVacancy({vacancy}:{vacancy:VacancyWithEmployer}){
    const {requestSendToView} = useVacancyView()
    const { data, setData, post,processing } = useForm<VacancyApply>({
        description: '',
        status: 'applied',
        salary_exception: 0,
        get_to_work: ''
    })

    function handleSubmit(e:FormEvent){
        e.preventDefault()
        requestSendToView(vacancy.id)
        post(route('vacancies.application',vacancy.id),{
            onSuccess:()=>{
                toast.success('Ваш запрос успешно отправлен')
                setTimeout(() => {
                    router.visit(route('vacancies.apply'))
                }, 2000)
            },
            onError:(e)=>{
                if (e.profile !== null){
                    toast.info(e.profile)
                }else {
                    toast.error('Произошла ошибка во время отправление')
                }
            }
        })
    }
    const employerName =
        vacancy.employer?.company_name?.trim() ? vacancy.employer.company_name : 'Индивидуально';
    const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title}></Head>
            <h1 className="text-3xl font-bold ml-6 mt-4">Форма отклика</h1>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Send className="h-5 w-5 mr-2" />
                                Форма отклика
                            </CardTitle>
                            <CardDescription>Расскажите о себе и почему вы подходите для этой позиции</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Сопроводительное письмо */}
                                <div className="space-y-2">
                                    <Label htmlFor="coverLetter">
                                        Сопроводительное письмо <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="coverLetter"
                                        placeholder="Расскажите о своем опыте, навыках и мотивации для этой позиции..."
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        rows={6}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Минимум 100 символов. Текущий размер: {data.description.length}
                                    </p>
                                </div>

                                {/* Зарплатные ожидания */}
                                <div className="space-y-2">
                                    <Label htmlFor="expectedSalary">Зарплатные ожидания</Label>
                                    <Input
                                        id="expectedSalary"
                                        placeholder="Например: 20000 смн"
                                        value={data.salary_exception}
                                        type='number'
                                        onChange={(e) => setData("salary_exception", Number(e.target.value))}
                                    />
                                </div>

                                {/* Дата начала работы */}
                                <div className="space-y-2">
                                    <Label htmlFor="availableFrom">Готов приступить к работе</Label>
                                    <DatePickerInput
                                        value={data.get_to_work}
                                        onChange={(val) => setData('get_to_work', val)}
                                    />
                                </div>

                                <Separator />


                                {/* Кнопки */}
                                <div className="flex items-center justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? (
                                            <div className="flex items-center">
                                                <div
                                                    className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Отправка...
                                            </div>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Отправить отклик
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
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
                                    {vacancy.skills?.map((skill) => (
                                        <Badge key={skill} variant="secondary">
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
                                    <Link href={route('vacancies.more',vacancy.id)} onClick={()=> requestSendToView(vacancy.id)}>Читать полностью</Link>
                                </Button>
                            </div>

                            <Button variant="outline" className="w-full bg-transparent" asChild>
                                <Link href={route('vacancies.more',vacancy.id)} onClick={()=> requestSendToView(vacancy.id)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Подробнее о вакансии
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
