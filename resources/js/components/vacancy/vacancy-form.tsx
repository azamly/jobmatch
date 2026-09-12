"use client";

import { useForm } from "@inertiajs/react";
import { Vacancy } from "@/types/employer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationField from '@/components/vacancy/location-field';
import SkillsInput from '@/components/vacancy/skill-input';
import { industries } from '@/lib/jobseeker.data';
import { Industry } from '@/types/jobseeker';

interface Props {
    data: Vacancy;
    setData: (key: keyof Vacancy, value: any) => void;
}

export default function VacancyForm({ data, setData }: Props) {
    return (
        <>
            {/* Название */}
            <div>
                <Label>
                    Название вакансии <span className="text-red-500">*</span>
                </Label>
                <Input placeholder={'Например: Штукатурщик'} value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label>
                        Тип зарплаты <span className="text-red-500">*</span>
                    </Label>
                    <Select value={data.salary_type} onValueChange={(val) => setData('salary_type', val as 'money' | 'accord')}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="money">Фиксированная</SelectItem>
                            <SelectItem value="accord">Сдельная</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <Label>
                            Зарплата от <span className="text-red-500">*</span>
                        </Label>
                        <Input type="number" value={data.salary_start ?? ''} onChange={(e) => setData('salary_start', Number(e.target.value))} />
                    </div>
                    <div className="flex-1">
                        <Label>
                            Зарплата до <span className="text-red-500">*</span>
                        </Label>
                        <Input type="number" value={data.salary_end ?? ''} onChange={(e) => setData('salary_end', Number(e.target.value))} />
                    </div>
                </div>
            </div>

            {/* Локация */}
            <div className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>
                {/*<Label>*/}
                {/*    Местоположение <span className="text-red-500">*</span>*/}
                {/*</Label>*/}
                {/*<Input*/}
                {/*    value={data.location ?? ""}*/}
                {/*    onChange={(e) => setData("location", e.target.value)}*/}
                {/*/>*/}
                <div>
                    <LocationField value={data.location} onChange={(val) => setData('location', val)} />
                </div>
                <div>
                    <Label>
                        Отрасль <span className="text-red-500">*</span>
                    </Label>
                    <Select value={data.industry_id?.toString()} onValueChange={(value) => setData('industry_id', Number(value))}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите отрасль" />
                        </SelectTrigger>
                        <SelectContent>
                            {industries.map((industry: Industry) => (
                                <SelectItem key={industry.id} value={industry.id.toString()}>
                                    {industry.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label>
                        Описание
                    </Label>
                    <Textarea rows={4} value={data.description ?? ''} onChange={(e) => setData('description', e.target.value)} />
                </div>

                <div>
                    <Label>Бонусы и льготы</Label>
                    <Textarea rows={4} value={data.benefits ?? ''} onChange={(e) => setData('benefits', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label>Обязанности</Label>
                    <Textarea rows={4} value={data.responsibility ?? ''} onChange={(e) => setData('responsibility', e.target.value)} />
                </div>

                <div>
                    <Label>Квалификации</Label>
                    <Textarea rows={4} value={data.qualifications ?? ''} onChange={(e) => setData('qualifications', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label>
                        Опыт <span className="text-red-500">*</span>
                    </Label>
                    <Select value={data.experience} onValueChange={(e) => setData('experience', e)}>
                        <SelectTrigger className={'w-full'}>
                            <SelectValue placeholder="Опыт" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={'Нет опыта'}>Нет опыта</SelectItem>
                            <SelectItem value={'До 1 года'}>До 1 года</SelectItem>
                            <SelectItem value={'От 1 до 3 лет'}>От 1 до 3 лет</SelectItem>
                            <SelectItem value={'От 3 до 5 лет'}>От 3 до 5 лет</SelectItem>
                            <SelectItem value={'Больше 5 лет'}>Больше 5 лет</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>
                        Образование <span className="text-red-500">*</span>
                    </Label>
                    <Select value={data.education} onValueChange={(e) => setData('education', e)}>
                        <SelectTrigger className={'w-full'}>
                            <SelectValue placeholder="Образование" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={'Без образование'}>Без образование</SelectItem>
                            <SelectItem value={'Среднее'}>Среднее</SelectItem>
                            <SelectItem value={'Среднее специальное'}>Среднее специальное</SelectItem>
                            <SelectItem value={'Высшее (бакалавр)'}>Высшее (бакалавр)</SelectItem>
                            <SelectItem value={'Магистр'}>Магистр</SelectItem>
                            <SelectItem value={'Доктор наук'}>Доктор наук</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label>Тип занятости</Label>
                    <Select
                        value={data.type}
                        onValueChange={(val) => setData('type', val as 'full' | 'part' | 'remote' | 'contract' | 'internship' | 'temporary')}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full">Полная занятость</SelectItem>
                            <SelectItem value="part">Частичная</SelectItem>
                            <SelectItem value="remote">Удалённая</SelectItem>
                            <SelectItem value="contract">Контракт</SelectItem>
                            <SelectItem value="internship">Стажировка</SelectItem>
                            <SelectItem value="temporary">Временная</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Статус</Label>
                    <Select value={data.status} onValueChange={(val) => setData('status', val as 'active' | 'inactive')}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Активна</SelectItem>
                            <SelectItem value="inactive">Неактивна</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Навыки */}
            <SkillsInput skills={Array.isArray(data.skills) ? (data.skills as string[]) : []} onChange={(skills) => setData('skills', skills)} />
        </>
    );
}
