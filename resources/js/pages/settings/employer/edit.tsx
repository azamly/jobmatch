import { Employer } from '@/types/employer';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Edit, Eye, Loader2Icon, SaveIcon, UserIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormEvent, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Доп. информация (CV)',
        href: '/settings/employer',
    },
];
export default function EmployerEditPage({employer}:{employer:Employer}){
    const [isEditing,setIsEditing] = useState(false)
    const { data, setData, patch, processing, errors } = useForm<Employer>(employer);

    function handleSubmit(e:FormEvent){
        e.preventDefault()
        if (!isEditing) return;

        patch(route('employer.patch'), {
            onSuccess: () => {
                toast.success('Данные успешно обновлены');
                setIsEditing(false);
            },
            onError: () => {
                toast.error('Ошибка при сохранении данных');
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <SettingsLayout size={'full'}>
                <form onSubmit={handleSubmit} className={'space-y-6'}>
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Доп. информация" description={'Заполните дополнительные данные'} />
                        <div className="flex gap-3">
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
                                        setIsEditing(false);
                                    }}
                                >
                                    <XIcon />
                                    Отмена
                                </Button>
                            )}
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Информация
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                <div>
                                    <Label htmlFor="companyName">Название компании</Label>
                                    <Input
                                        id="companyName"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name',e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Введите название компании"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location">Местоположение</Label>
                                    <Input
                                        id="location"
                                        value={data.company_address}
                                        onChange={(e) => setData('company_address',e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Введите местоположение компании"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="website">Веб-сайт</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={data.company_website}
                                        onChange={(e) => setData('company_website',e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="https://www.company.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Описание компании</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description',e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Опишите вашу компанию, культуру и ценности..."
                                        rows={6}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Контактная информация
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                <div>
                                    <Label htmlFor="contactEmail">Контактный email</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email',e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="hr@company.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="contactPhone">Контактный телефон</Label>
                                    <Input
                                        id="contactPhone"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone',e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="+7 (999) 123-45-67"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
