import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import {
    AlertCircle, BadgeAlert, BadgeCheck, BadgeIcon,
    Check,
    CheckCircle,
    CheckCircle2,
    CircleAlertIcon, CircleCheckIcon,
    Mail,
    Phone, Shield, ShieldAlert,
    ShieldX,
    Upload,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInitials } from '@/hooks/use-initials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { getRoleLabel } from '@/lib/roles.data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatPhoneNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Настройки профиля',
        href: '/settings/profile',
    },
];

export default function ProfilePage({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const getInitials = useInitials();
    const [phone,setPhone] = useState(auth.user.phone ?? "")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
        }
    };

    const handleCancel = () => {
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview); // чистим память
        }
        setAvatarPreview(null);
        const input = document.getElementById("avatar-upload") as HTMLInputElement;
        if (input) input.value = "";
    };

    const handleDeleteAvatar = () => {
        router.delete(route('profile.avatar.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                setAvatarPreview(null);
                toast.success("Аватар профиля успешно удалён")
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Настройки профиля" />

            <SettingsLayout size={'2xl'}>
                <div className="space-y-6">
                    {auth.user.phone &&
                        (!auth.user.phone_verified_at ? (
                            <Alert className="w-full max-w-md border-yellow-500 bg-yellow-50 text-yellow-500" variant="default">
                                <CircleAlertIcon className="h-5 w-5 text-yellow-500" />
                                <AlertTitle className="text-yellow-500">Ваш номер не подтвержден</AlertTitle>
                                <AlertDescription>
                                    <span>
                                        Перейдите по этой{' '}
                                        <Link href={route('verification.phone.notice')} className="inline text-yellow-500 underline">
                                            ссылке
                                        </Link>{' '}
                                        чтобы подтвердить номер телефона
                                    </span>
                                </AlertDescription>
                            </Alert>
                        ) : (
                            ''
                        ))}

                    {auth.user.email &&
                        (!auth.user.email_verified_at ? (
                            <Alert className="w-full max-w-md border-yellow-500 bg-yellow-50 text-yellow-500" variant="default">
                                <CircleAlertIcon className="h-5 w-5 text-yellow-500" />
                                <AlertTitle className="text-yellow-500">Ваша электронная почта не подтверждена</AlertTitle>
                                <AlertDescription>
                                    <span>
                                        Перейдите по этой{' '}
                                        <Link href={route('verification.notice')} className="inline text-yellow-500 underline">
                                            ссылке
                                        </Link>{' '}
                                        чтобы подтвердить электронную почту
                                    </span>
                                </AlertDescription>
                            </Alert>
                        ) : (
                            ''
                        ))}

                    <HeadingSmall title="Информация об профиле" description="Редактируйте ваши данные" />

                    <Form
                        method="post"
                        action={route('profile.update')}
                        encType="multipart/form-data"
                        options={{
                            preserveScroll: true,
                        }}
                        onSuccess={() => {
                            setAvatarPreview(null);
                            toast.success('Профиль успешно обновлён');
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <input type="hidden" name="_method" value="patch" />
                                <div className="flex items-center space-x-6">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Profile" className="h-32 w-32 rounded-full object-cover" />
                                    ) : (
                                        <Avatar className="h-32 w-32 overflow-hidden">
                                            <AvatarImage
                                                className="rounded-full object-cover"
                                                src={auth.user.avatar ? `/storage/images/${auth.user.avatar}` : undefined}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-4xl text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div className="flex flex-col space-y-2">
                                        <input
                                            type="file"
                                            accept="image/jpg, image/jpeg, image/png"
                                            className="hidden"
                                            name="avatar"
                                            id="avatar-upload"
                                            onChange={handleFileChange}
                                        />

                                        {!avatarPreview ? (
                                            <div className="flex space-x-2">
                                                <Button asChild variant="outline">
                                                    <label htmlFor="avatar-upload" className="flex cursor-pointer items-center">
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Загрузить фото
                                                    </label>
                                                </Button>
                                                {auth.user.avatar ? (
                                                    <Button variant="destructive" onClick={handleDeleteAvatar}>
                                                        <X className="h-4 w-4" />
                                                        Удалить
                                                    </Button>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Button asChild variant="outline">
                                                    <label htmlFor="avatar-upload" className="flex cursor-pointer items-center">
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Изменить
                                                    </label>
                                                </Button>
                                                <Button variant="destructive" onClick={handleCancel}>
                                                    <X className="h-4 w-4" />
                                                    Отмена
                                                </Button>
                                            </div>
                                        )}

                                        <p className="text-sm text-muted-foreground">JPG, PNG до 5MB</p>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Username</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block max-w-xl"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Username"
                                    />

                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Электронная почта</Label>
                                    <div className="flex">
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 mr-2 block max-w-xl"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            autoComplete="username"
                                            placeholder="Электронная почта"
                                        />
                                        <span className="inline-flex items-center">
                                            {auth.user.email_verified_at && <CircleCheckIcon className="text-emerald-600" />}
                                        </span>
                                    </div>

                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Номер телефона</Label>

                                    <Input
                                        id="phone"
                                        type="tel"
                                        className="mt-1 block max-w-xl"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                                        name="phone"
                                        placeholder="+992 (XX) XXX-XX-XX"
                                    />
                                    <span className="inline-flex items-center">
                                        {auth.user.phone_verified_at && <CircleCheckIcon className="text-emerald-600" />}
                                    </span>
                                    <InputError className="mt-2" message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Роль</Label>

                                    <Input
                                        id="role"
                                        type="text"
                                        className="mt-1 block max-w-xl"
                                        defaultValue={getRoleLabel(auth.role)}
                                        placeholder="Роль"
                                        disabled={true}
                                    />
                                </div>

                                {/*{mustVerifyEmail && auth.user.email_verified_at === null && (*/}
                                {/*    <div>*/}
                                {/*        <p className="-mt-4 text-sm text-muted-foreground">*/}
                                {/*            Ваша электронная почта не подтверждена.{' '}*/}
                                {/*            <Link*/}
                                {/*                href={route('verification.send')}*/}
                                {/*                method="post"*/}
                                {/*                as="button"*/}
                                {/*                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"*/}
                                {/*            >*/}
                                {/*                Кликните чтобы отправить ссылку подтверждение на вашу электронную почту*/}
                                {/*            </Link>*/}
                                {/*        </p>*/}

                                {/*        {status === 'verification-link-sent' && (*/}
                                {/*            <div className="mt-2 text-sm font-medium text-green-600">*/}
                                {/*                На ваш электронный адрес была отправлена новая ссылка для подтверждения.*/}
                                {/*            </div>*/}
                                {/*        )}*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                <div className="flex items-center gap-4">
                                    <Button className={'cursor-pointer'} type={'submit'} onSubmit={() => (recentlySuccessful ? setAvatarPreview(null) : undefined)}>
                                        Сохранить {recentlySuccessful}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-foreground">Сохранено</p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
