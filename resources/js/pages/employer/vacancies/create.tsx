import type { BreadcrumbItem as BI } from "@/types";
import { Head, useForm } from '@inertiajs/react';
import { Vacancy } from "@/types/employer";
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';
import VacancyForm from '@/components/vacancy/vacancy-form';
import { Loader2Icon, SaveIcon } from 'lucide-react';

const breadcrumbs: BI[] = [
    { title: "Вакансии", href: "/vacancies" },
    { title: "Создать", href: "/vacancies/create" },
];

export default function CreateVacancyPage() {
    const { data, setData, post, processing, errors } = useForm<Vacancy>({
        id: 0,
        industry_id:0,
        title: "",
        salary_type: "money",
        salary_start: 0,
        salary_end: 0,
        location: "",
        description: "",
        benefits: "",
        responsibility: "",
        qualifications: "",
        experience: "",
        education: "",
        skills: [] as any,
        type: "full",
        status: "active",
        created_at: new Date(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("vacancies.store"),{
            onSuccess: () => {
                toast.success('Данные добавлены');
            },
            onError: () => {
                toast.error('Ошибка при сохранении данных');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title}></Head>

            <h1 className="mt-4 ml-8 text-3xl font-bold">Добавить вакансию</h1>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-4 p-8">
                {/*/!* Название *!/*/}
                {/*<div>*/}
                {/*    <Label>*/}
                {/*        Название вакансии <span className="text-red-500">*</span>*/}
                {/*    </Label>*/}
                {/*    <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />*/}
                {/*</div>*/}

                {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2">*/}
                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Тип зарплаты <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Select value={data.salary_type} onValueChange={(val) => setData('salary_type', val as 'money' | 'accord')}>*/}
                {/*            <SelectTrigger className="w-full">*/}
                {/*                <SelectValue placeholder="Выберите тип" />*/}
                {/*            </SelectTrigger>*/}
                {/*            <SelectContent>*/}
                {/*                <SelectItem value="money">Фиксированная</SelectItem>*/}
                {/*                <SelectItem value="accord">Сдельная</SelectItem>*/}
                {/*            </SelectContent>*/}
                {/*        </Select>*/}
                {/*    </div>*/}

                {/*    <div className="flex gap-2">*/}
                {/*        <div className="flex-1">*/}
                {/*            <Label>Зарплата от</Label>*/}
                {/*            <Input type="number" value={data.salary_start} onChange={(e) => setData('salary_start', Number(e.target.value))} />*/}
                {/*        </div>*/}
                {/*        <div className="flex-1">*/}
                {/*            <Label>Зарплата до</Label>*/}
                {/*            <Input type="number" value={data.salary_end} onChange={(e) => setData('salary_end', Number(e.target.value))} />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*/!* Локация *!/*/}
                {/*<div>*/}
                {/*    <Label>*/}
                {/*        Местоположение <span className="text-red-500">*</span>*/}
                {/*    </Label>*/}
                {/*    <Input value={data.location} onChange={(e) => setData('location', e.target.value)} />*/}
                {/*</div>*/}

                {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2">*/}
                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Описание <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Textarea rows={4} value={data.description ?? ''} onChange={(e) => setData('description', e.target.value)} />*/}
                {/*    </div>*/}

                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Бонусы и льготы <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Textarea rows={4} value={data.benefits ?? ''} onChange={(e) => setData('benefits', e.target.value)} />*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2">*/}
                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Обязанности <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Textarea rows={4} value={data.responsibility ?? ''} onChange={(e) => setData('responsibility', e.target.value)} />*/}
                {/*    </div>*/}

                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Квалификации <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Textarea rows={4} value={data.qualifications ?? ''} onChange={(e) => setData('qualifications', e.target.value)} />*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2">*/}
                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Опыт <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Select value={data.experience} onValueChange={(e)=>setData('experience',e)}>*/}
                {/*            <SelectTrigger className={'w-full'}>*/}
                {/*                <SelectValue placeholder="Опыт" />*/}
                {/*            </SelectTrigger>*/}
                {/*            <SelectContent>*/}
                {/*                <SelectItem value={'Нет опыта'}>Нет опыта</SelectItem>*/}
                {/*                <SelectItem value={'До 1 года'}>До 1 года</SelectItem>*/}
                {/*                <SelectItem value={'От 1 до 3 лет'}>От 1 до 3 лет</SelectItem>*/}
                {/*                <SelectItem value={'От 3 до 5 лет'}>От 3 до 5 лет</SelectItem>*/}
                {/*                <SelectItem value={'Больше 5 лет'}>Больше 5 лет</SelectItem>*/}
                {/*            </SelectContent>*/}
                {/*        </Select>*/}
                {/*    </div>*/}

                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Образование <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Select value={data.education} onValueChange={(e)=>setData('education',e)}>*/}
                {/*            <SelectTrigger className={'w-full'}>*/}
                {/*                <SelectValue placeholder="Образование" />*/}
                {/*            </SelectTrigger>*/}
                {/*            <SelectContent>*/}
                {/*                <SelectItem value={'Среднее'}>Среднее</SelectItem>*/}
                {/*                <SelectItem value={'Среднее специальное'}>Среднее специальное</SelectItem>*/}
                {/*                <SelectItem value={'Высшее (бакалавр)'}>Высшее (бакалавр)</SelectItem>*/}
                {/*                <SelectItem value={'Магистр'}>Магистр</SelectItem>*/}
                {/*                <SelectItem value={'Доктор наук'}>Доктор наук</SelectItem>*/}
                {/*            </SelectContent>*/}
                {/*        </Select>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2">*/}
                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Тип занятости <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Select*/}
                {/*            value={data.type}*/}
                {/*            onValueChange={(val) => setData('type', val as 'full' | 'part' | 'remote' | 'contract' | 'internship' | 'temporary')}*/}
                {/*        >*/}
                {/*            <SelectTrigger className="w-full">*/}
                {/*                <SelectValue placeholder="Выберите тип" />*/}
                {/*            </SelectTrigger>*/}
                {/*            <SelectContent>*/}
                {/*                <SelectItem value="full">Полная занятость</SelectItem>*/}
                {/*                <SelectItem value="part">Частичная</SelectItem>*/}
                {/*                <SelectItem value="remote">Удалённая</SelectItem>*/}
                {/*                <SelectItem value="contract">Контракт</SelectItem>*/}
                {/*                <SelectItem value="internship">Стажировка</SelectItem>*/}
                {/*                <SelectItem value="temporary">Временная</SelectItem>*/}
                {/*            </SelectContent>*/}
                {/*        </Select>*/}
                {/*    </div>*/}

                {/*    <div>*/}
                {/*        <Label>*/}
                {/*            Статус <span className="text-red-500">*</span>*/}
                {/*        </Label>*/}
                {/*        <Select value={data.status} onValueChange={(val) => setData('status', val as 'active' | 'inactive')}>*/}
                {/*            <SelectTrigger className="w-full">*/}
                {/*                <SelectValue placeholder="Выберите статус" />*/}
                {/*            </SelectTrigger>*/}
                {/*            <SelectContent>*/}
                {/*                <SelectItem value="active">Активна</SelectItem>*/}
                {/*                <SelectItem value="inactive">Неактивна</SelectItem>*/}
                {/*            </SelectContent>*/}
                {/*        </Select>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*/!* Навыки *!/*/}
                {/*<SkillsInput skills={Array.isArray(data.skills) ? (data.skills as string[]) : []} onChange={(skills) => setData('skills', skills)} />*/}
                <VacancyForm data={data} setData={setData} />
                {/* Кнопка */}
                <div className="pt-4">
                    <Button type="submit" disabled={processing}>
                        {!processing ? <SaveIcon /> : <Loader2Icon className="animate-spin" />}
                        {processing ? 'Сохранение...' : 'Создать вакансию'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
