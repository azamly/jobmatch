import type { BreadcrumbItem, SharedData } from '@/types';
import {
    Gender,
    JobSeekerProfile,
    Education,
    Skill,
    Language,
    Link,
    Experience,
    Addition,
    JobSeekerProfileForm, Industry
} from '@/types/jobseeker';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Award, Briefcase, CalendarIcon,
    ChevronDownIcon,
    Edit,
    Eye,
    GraduationCap,
    Languages, Loader2Icon,
    Plus,
    Save, SaveIcon, Trash,
    UserIcon, X,
    XIcon,
    Link as LinkIcon,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { industries, languageProficiency } from '@/lib/jobseeker.data';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DatePickerInput } from '@/components/jobseeker/date-picker-input';
import { CVViewer } from '@/components/jobseeker/cv-viewer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Настройки резюме (CV)',
        href: '/settings/jobseeker/edit',
    },
];

interface Props {
    profile: JobSeekerProfileForm;
    message?: string;
    type?: "success" | 'info' | 'error';
}

export default function EditPage({ profile, message, type }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, patch, processing, errors } = useForm<JobSeekerProfileForm>(profile);
    const [showCVPreview, setShowCVPreview] = useState(false)

    // const grouped = data.additions.reduce((acc, item) => {
    //     if (!acc[item.addition_category_id]) {
    //         acc[item.addition_category_id] = []
    //     }
    //     acc[item.addition_category_id].push(item)
    //     return acc
    // }, {} as Record<number, typeof data.additions>)


    const updateArrayField = <T,>(
        field: keyof JobSeekerProfileForm,
        index: number,
        updates: Partial<T>
    ) => {
        const array = [...(data[field] as T[])];
        array[index] = { ...array[index], ...updates };
        setData(field as any, array);
    };

    const removeArrayItem = (field: keyof JobSeekerProfileForm, index: number, confirmMessage?: string) => {
        if (confirmMessage && !window.confirm(confirmMessage)) return;

        // @ts-ignore
        const array = [...(data[field] as any[])];
        array.splice(index, 1);
        setData(field as any, array);
    };

    const addArrayItem = <T,>(
        field: keyof JobSeekerProfileForm,
        template: T
    ) => {
        const array = [...(data[field] as T[])];
        const newId = array.length > 0 ? Math.max(...array.map(item => (item as any).id)) + 1 : 1;
        setData(field as any, [...array, { ...template, id: newId }]);
    };

    // Специфичные функции
    const removeLanguage = (index: number) => removeArrayItem('languages', index);
    const removeEducation = (index: number) => removeArrayItem('education', index, "Вы уверены, что хотите удалить?");
    const removeExperience = (index: number) => removeArrayItem('experiences', index, "Вы уверены, что хотите удалить?");
    const removeSkill = (index: number) => removeArrayItem('skills', index);
    const removeLink = (index: number) => removeArrayItem('links', index);
    const removeAddition = (index: number) => removeArrayItem('additions', index);

    const addEducation = () => addArrayItem<Education>('education', {
        id: data.education.length+1,
        institution: "",
        degree: "",
        field_of_study: "",
        start_year: "",
        end_year: "",
        description: "",
        sort_order: data.education.length
    });

    const addExperience = ()=>addArrayItem<Experience>('experiences',{
        id:data.experiences.length+1,
        job_title:"",
        company_address:"",
        company_name:"",
        start_date:"",
        end_date:"",
        description:"",
        is_current:false,
        sort_order:data.experiences.length
    })

    const addSkill = () => addArrayItem<Skill>('skills', {
        id: data.skills.length+1,
        name: "",
        sort_order: data.skills.length
    });

    const addLanguage = () => addArrayItem<Language>('languages', {
        id: data.languages.length+1,
        name: "",
        language_proficiency_id: 1,
        sort_order: data.languages.length
    });

    const addLink = () => addArrayItem<Link>('links', {
        id: data.links.length+1,
        url: "",
        type: ""
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isEditing) return;

        patch(route('jobseeker.patch'), {
            onSuccess: () => {
                toast.success('Данные успешно обновлены');
                setIsEditing(false);
            },
            onError: () => {
                toast.error('Ошибка при сохранении данных');
            }
        });
    };

    const [open, setOpen] = useState(false);
    const [newAddition, setNewAddition] = useState({
        addition_category_id: "",
        title: "",
        description: "",
    });

    const grouped = data.additions.reduce((acc, item) => {
        if (!acc[item.addition_category_id]) acc[item.addition_category_id] = [];
        acc[item.addition_category_id].push(item);
        return acc;
    }, {} as Record<number, typeof data.additions>);

    const handleSave = () => {
        const array = [...data.additions];
        const newId =
            array.length > 0 ? Math.max(...array.map((i) => i.id)) + 1 : 1;

        addArrayItem<Addition>('additions', {
                id: newId,
                addition_category_id: Number(newAddition.addition_category_id),
                title: newAddition.title,
                description: newAddition.description,
                sort_order:newId
        })


        setOpen(false);
        setNewAddition({
            addition_category_id: "",
            title: "",
            description: "",
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <SettingsLayout size={'full'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Информация о резюме" description={isEditing ? 'Редактируйте ваше резюме' : 'Просмотр вашего резюме'} />
                        <div className="flex gap-3">
                            <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Предпросмотр CV
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Предпросмотр CV</DialogTitle>
                                    </DialogHeader>
                                    <CVViewer  data={profile} showActions={false} />
                                </DialogContent>
                            </Dialog>
                            {!isEditing && (
                                <Button
                                    type="button"
                                    variant={'outline'}
                                    onClick={() => {
                                        setIsEditing(true);
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Редактировать
                                </Button>
                            )}
                            {isEditing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setData(profile);
                                        setIsEditing(false);
                                    }}
                                >
                                    <XIcon />
                                    Отмена
                                </Button>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm text-blue-800">Режим редактирования включен. После завершения нажмите "Сохранить изменения".</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Profile Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5" />
                                    Личная информация
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label>Имя</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                placeholder="Имя"
                                            />
                                        </div>
                                        <div>
                                            <Label>Фамилия</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                placeholder="Фамилия"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label>Отчество</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={data.middle_name ?? ''}
                                                onChange={(e) => setData('middle_name', e.target.value)}
                                                placeholder="Отчество"
                                            />
                                        </div>
                                        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
                                            <div className="w-full">
                                                <Label htmlFor="date">Дата рождения</Label>
                                                <DatePickerInput
                                                    fromYear={1960}
                                                    toYear={new Date().getFullYear() - 18}
                                                    value={data.birth_date}
                                                    onChange={(val) => setData('birth_date', val)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="w-full">
                                                <Label>Пол</Label>
                                                <Select disabled={!isEditing} value={data.gender} onValueChange={(e: Gender) => setData('gender', e)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Выберите пол" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="male">Мужской</SelectItem>
                                                        <SelectItem value="female">Женский</SelectItem>
                                                        <SelectItem value="unspecified">Не указано</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label>Локация</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={data.location ?? ''}
                                                onChange={(e) => setData('location', e.target.value)}
                                                placeholder="Локация"
                                            />
                                        </div>
                                        <div>
                                            <Label>Адрес</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={data.address ?? ''}
                                                onChange={(e) => setData('address', e.target.value)}
                                                placeholder="Адрес"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Отрасль</Label>
                                        <Select
                                            disabled={!isEditing}
                                            value={(data.industry_id.toString())}
                                            onValueChange={(value) => setData('industry_id', Number(value))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Выберите отрасль" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {industries.map((industry:Industry) => (
                                                    <SelectItem key={industry.id} value={industry.id.toString()}>
                                                        {industry.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Описание</Label>
                                        <Textarea
                                            disabled={!isEditing}
                                            value={data.summary ?? ''}
                                            onChange={(e) => setData('summary', e.target.value)}
                                            placeholder="Дополнительная информация о себе"
                                            rows={6}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education Section */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Образование
                                </CardTitle>
                                {isEditing && (
                                    <Button type="button" onClick={addEducation} size="sm" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Добавить образование
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.education.map((edu, index) => (
                                    <div key={edu.id} className="relative space-y-4 rounded-lg border p-4">
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeEducation(index)}
                                            >
                                                <XIcon className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                        <div className={cn('space-y-4', isEditing ? 'mt-2' : '')}>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label>Учебное заведение</Label>
                                                    <Input
                                                        value={edu.institution || ''}
                                                        onChange={(e) => updateArrayField('education', index, { institution: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder="Название учебного заведения"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
                                                        <div className="w-full">
                                                            <Label>Начало обучения</Label>
                                                            <Input
                                                                value={edu.start_year || ''}
                                                                onChange={(e) => updateArrayField('education', index, { start_year: e.target.value })}
                                                                disabled={!isEditing}
                                                                placeholder="Начало обучения (год)"
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <Label>Конец обучения</Label>
                                                            <Input
                                                                value={edu.end_year || ''}
                                                                onChange={(e) => updateArrayField('education', index, { end_year: e.target.value })}
                                                                disabled={!isEditing}
                                                                placeholder="Конец обучения (год)"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label>Специальность</Label>
                                                    <Input
                                                        value={edu.field_of_study || ''}
                                                        onChange={(e) => updateArrayField('education', index, { field_of_study: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder="Специальность"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Степень</Label>
                                                    <Input
                                                        value={edu.degree || ''}
                                                        onChange={(e) => updateArrayField('education', index, { degree: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder="Степень"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Описание</Label>
                                                <Textarea
                                                    value={edu.description || ''}
                                                    onChange={(e) => updateArrayField('education', index, { description: e.target.value })}
                                                    disabled={!isEditing}
                                                    placeholder="Дополнительная информация об образовании"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/*Work Experience*/}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" />
                                        Опыт работы
                                    </CardTitle>
                                    {isEditing && (
                                        <Button type="button" onClick={addExperience} size="sm" variant="outline">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Добавить опыт
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {data.experiences.map((exp, index) => (
                                    <div key={exp.id} className="relative space-y-4 rounded-lg border bg-muted/20 p-6">
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeExperience(index)}
                                            >
                                                <XIcon className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                        <div className={cn('space-y-4', isEditing ? 'mt-2' : '')}>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label>Компания</Label>
                                                    <Input
                                                        value={exp.company_name ?? ''}
                                                        onChange={(e) => updateArrayField('experiences', index, { company_name: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder="Название компании"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Адрес компании</Label>
                                                    <Input
                                                        value={exp.company_address ?? ''}
                                                        onChange={(e) => updateArrayField('experiences', index, { company_address: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder="Адрес компании"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label>Должность</Label>
                                                    <Input
                                                        value={exp.job_title ?? ''}
                                                        onChange={(e) => updateArrayField('experiences', index, { job_title: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder="Название должности"
                                                    />
                                                </div>
                                                <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
                                                    <div className="w-full">
                                                        <DatePickerInput
                                                            label="Дата начала работы"
                                                            value={exp.start_date ?? null}
                                                            onChange={(val) => updateArrayField('experiences', index, { start_date: val })}
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <DatePickerInput
                                                            label="Дата конца работы"
                                                            value={exp.end_date ?? ''}
                                                            onChange={(val) => updateArrayField('experiences', index, { end_date: val })}
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Описание обязанностей</Label>
                                                <Textarea
                                                    value={exp.description ?? ''}
                                                    onChange={(e) => updateArrayField('experiences', index, { description: e.target.value })}
                                                    disabled={!isEditing}
                                                    placeholder="Опишите ваши обязанности и достижения..."
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                        {/*{!isEditing && exp.achievements && exp.achievements.length > 0 && (*/}
                                        {/*    <div>*/}
                                        {/*        <Label>Ключевые достижения</Label>*/}
                                        {/*        <ul className="mt-2 list-inside list-disc space-y-1">*/}
                                        {/*            {exp.achievements.map((achievement, achIndex) => (*/}
                                        {/*                <li key={achIndex} className="text-sm text-muted-foreground">*/}
                                        {/*                    {achievement}*/}
                                        {/*                </li>*/}
                                        {/*            ))}*/}
                                        {/*        </ul>*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Skills Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Навыки
                                    </CardTitle>
                                    {isEditing && (
                                        <Button onClick={addSkill} type="button" size="sm" variant="outline">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Добавить навык
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill, index) => (
                                        <div key={skill.id} className="flex items-center">
                                            {isEditing ? (
                                                <>
                                                    <Input
                                                        value={skill.name}
                                                        onChange={(e) => updateArrayField('skills', index, { name: e.target.value })}
                                                        className="w-32"
                                                        placeholder="Навык"
                                                    />
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                                                        <XIcon className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <Badge variant="secondary" className="px-3 py-1 text-sm">
                                                    {skill.name}
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Languages Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Languages className="h-5 w-5" />
                                        Языки
                                    </CardTitle>
                                    {isEditing && (
                                        <Button type="button" onClick={addLanguage} size="sm" variant="outline">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Добавить язык
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.languages.map((lang, index) => (
                                    <div key={lang.id} className="relative space-y-4 rounded-lg border p-4">
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeLanguage(index)}
                                            >
                                                <XIcon className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                        <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', isEditing ? 'mt-2' : '')}>
                                            <div>
                                                <Label>Язык</Label>
                                                <Input
                                                    value={lang.name}
                                                    onChange={(e) => updateArrayField('languages', index, { name: e.target.value })}
                                                    disabled={!isEditing}
                                                    placeholder="Название языка"
                                                />
                                            </div>
                                            <div>
                                                <Label>Уровень</Label>
                                                <Select
                                                    disabled={!isEditing}
                                                    value={lang.language_proficiency_id.toString()}
                                                    onValueChange={(e) =>
                                                        updateArrayField('languages', index, { language_proficiency_id: Number(e) })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Выбрать уровень" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Уровни</SelectLabel>
                                                            {languageProficiency.map((l) => (
                                                                <SelectItem key={l.id} value={l.id.toString()}>
                                                                    {l.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Links Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <LinkIcon className="h-5 w-5" />
                                        Ссылки
                                    </CardTitle>
                                    {isEditing && (
                                        <Button size="sm" onClick={addLink} type="button" variant="outline">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Добавить ссылку
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {data.links.map((link, index) => (
                                    <div key={link.id} className="relative rounded-lg border p-4">
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeLink(index)}
                                            >
                                                <XIcon className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                        <div className={cn('grid grid-cols-12 gap-4', isEditing ? 'mt-2' : '')}>
                                            <div className="col-span-12 md:col-span-3">
                                                <Label>Тип ссылки</Label>
                                                <Select
                                                    disabled={!isEditing}
                                                    value={link.type}
                                                    onValueChange={(value) => updateArrayField('links', index, { type: value })}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Выберите тип ссылки" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Типы</SelectLabel>
                                                            <SelectItem value="github">Github</SelectItem>
                                                            <SelectItem value="instagram">Instagram</SelectItem>
                                                            <SelectItem value="facebook">Facebook</SelectItem>
                                                            <SelectItem value="x">X</SelectItem>
                                                            <SelectItem value="linkedin">Linkedin</SelectItem>
                                                            <SelectItem value="email">Email</SelectItem>
                                                            <SelectItem value="phone">Номер</SelectItem>
                                                            <SelectItem value="other">Другое</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-12 md:col-span-9">
                                                <Label>Ссылка</Label>
                                                <Input
                                                    value={link.url}
                                                    onChange={(e) => updateArrayField('links', index, { url: e.target.value })}
                                                    disabled={!isEditing}
                                                    placeholder="URL ссылки"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/*<div className="space-y-4">*/}
                        {/*    <div className="flex items-center justify-between">*/}
                        {/*        <p className="text-2xl font-medium">Дополнительно</p>*/}
                        {/*        {isEditing && (*/}
                        {/*            <Button variant="outline" onClick={() => setOpen(true)}>*/}
                        {/*                <span className="mr-2">+</span> Добавить*/}
                        {/*            </Button>*/}
                        {/*        )}*/}
                        {/*    </div>*/}

                        {/*    /!* Modal *!/*/}
                        {/*    <Dialog open={open} onOpenChange={setOpen}>*/}
                        {/*        <DialogContent>*/}
                        {/*            <DialogHeader>*/}
                        {/*                <DialogTitle>Добавить запись</DialogTitle>*/}
                        {/*            </DialogHeader>*/}
                        {/*            <div className="space-y-4">*/}
                        {/*                <div>*/}
                        {/*                    <Label>Категория</Label>*/}
                        {/*                    <Select*/}
                        {/*                        value={newAddition.addition_category_id}*/}
                        {/*                        onValueChange={(val) => setNewAddition({ ...newAddition, addition_category_id: val })}*/}
                        {/*                    >*/}
                        {/*                        <SelectTrigger className='w-full'>*/}
                        {/*                            <SelectValue placeholder="Выберите категорию" />*/}
                        {/*                        </SelectTrigger>*/}
                        {/*                        <SelectContent>*/}
                        {/*                            <SelectGroup>*/}
                        {/*                                {additionCategory.map((c) => (*/}
                        {/*                                    <SelectItem value={c.id.toString()}>{c.value}</SelectItem>*/}
                        {/*                                ))}*/}
                        {/*                            </SelectGroup>*/}
                        {/*                        </SelectContent>*/}
                        {/*                    </Select>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <Label>Заголовок</Label>*/}
                        {/*                    <Input*/}
                        {/*                        value={newAddition.title}*/}
                        {/*                        onChange={(e) => setNewAddition({ ...newAddition, title: e.target.value })}*/}
                        {/*                        placeholder="Введите заголовок"*/}
                        {/*                    />*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <Label>Описание</Label>*/}
                        {/*                    <Textarea*/}
                        {/*                        value={newAddition.description}*/}
                        {/*                        onChange={(e) =>*/}
                        {/*                            setNewAddition({*/}
                        {/*                                ...newAddition,*/}
                        {/*                                description: e.target.value,*/}
                        {/*                            })*/}
                        {/*                        }*/}
                        {/*                        placeholder="Описание"*/}
                        {/*                        rows={3}*/}
                        {/*                    />*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <DialogFooter>*/}
                        {/*                <Button variant="outline" onClick={() => setOpen(false)}>*/}
                        {/*                    Отмена*/}
                        {/*                </Button>*/}
                        {/*                <Button onClick={handleSave}>Сохранить</Button>*/}
                        {/*            </DialogFooter>*/}
                        {/*        </DialogContent>*/}
                        {/*    </Dialog>*/}

                        {/*    /!* Accordion *!/*/}
                        {/*    <div className="space-y-4">*/}
                        {/*        {Object.entries(grouped).map(([category, items]) => (*/}
                        {/*            <Card key={category} className="rounded-2xl border shadow-md">*/}
                        {/*                <CardHeader>*/}
                        {/*                    <CardTitle className="text-lg font-semibold">{getCategoryName(Number(category))}</CardTitle>*/}
                        {/*                </CardHeader>*/}
                        {/*                <CardContent>*/}
                        {/*                    {items.map((a, index) => (*/}
                        {/*                        <div key={a.id} className="relative rounded-lg border p-4">*/}
                        {/*                            {isEditing && (*/}
                        {/*                                <Button*/}
                        {/*                                    type="button"*/}
                        {/*                                    variant="ghost"*/}
                        {/*                                    size="icon"*/}
                        {/*                                    className="absolute top-2 right-2"*/}
                        {/*                                    onClick={() => removeAddition(index)}*/}
                        {/*                                >*/}
                        {/*                                    <XIcon className="h-4 w-4 text-red-500" />*/}
                        {/*                                </Button>*/}
                        {/*                            )}*/}
                        {/*                            <div className={cn('space-y-4', isEditing ? 'mt-2' : '')}>*/}
                        {/*                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">*/}
                        {/*                                    <div>*/}
                        {/*                                        <Label>Заголовок</Label>*/}
                        {/*                                        <Input*/}
                        {/*                                            disabled={!isEditing}*/}
                        {/*                                            value={a.title}*/}
                        {/*                                            onChange={(e) => updateArrayField('additions', index, { title: e.target.value })}*/}
                        {/*                                            placeholder="Заголовок"*/}
                        {/*                                        />*/}
                        {/*                                    </div>*/}
                        {/*                                    <div>*/}
                        {/*                                        <Label>Категория</Label>*/}
                        {/*                                        <Select*/}
                        {/*                                            disabled={!isEditing}*/}
                        {/*                                            value={a.addition_category_id.toString()}*/}
                        {/*                                            onValueChange={(val) =>*/}
                        {/*                                                updateArrayField('additions', index, { addition_category_id: Number(val) })*/}
                        {/*                                            }*/}
                        {/*                                        >*/}
                        {/*                                            <SelectTrigger className={'w-full'}>*/}
                        {/*                                                <SelectValue placeholder="Выберите категорию" />*/}
                        {/*                                            </SelectTrigger>*/}
                        {/*                                            <SelectContent>*/}
                        {/*                                                <SelectGroup>*/}
                        {/*                                                    {additionCategory.map((c) => (*/}
                        {/*                                                        <SelectItem value={c.id.toString()}>{c.value}</SelectItem>*/}
                        {/*                                                    ))}*/}
                        {/*                                                </SelectGroup>*/}
                        {/*                                            </SelectContent>*/}
                        {/*                                        </Select>*/}
                        {/*                                    </div>*/}
                        {/*                                </div>*/}
                        {/*                                <div>*/}
                        {/*                                    <Label>Описание</Label>*/}
                        {/*                                    <Textarea*/}
                        {/*                                        disabled={!isEditing}*/}
                        {/*                                        value={a.description ?? ''}*/}
                        {/*                                        onChange={(e) => updateArrayField('additions',index,{description:e.target.value})}*/}
                        {/*                                        placeholder="Дополнительная информация о себе"*/}
                        {/*                                        rows={2}*/}
                        {/*                                    />*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}
                        {/*                    ))}*/}
                        {/*                </CardContent>*/}
                        {/*            </Card>*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-4 pt-6">
                            <Button type="submit" disabled={processing}>
                                {!processing ? <SaveIcon /> : <Loader2Icon className="animate-spin" />}
                                {processing ? 'Сохранение...' : 'Сохранить изменения'}
                            </Button>
                        </div>
                    )}
                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
