import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email?: string;
    phone?: string;
}

export default function ResetPassword({ token, email, phone }: ResetPasswordProps) {
    return (
        <AuthLayout title="Сбросить пароль" description="Введите новый пароль ниже">
            <Head title="Сбросить пароль" />

            <Form
                method="post"
                action={route('password.store')}
                transform={(data) => ({ ...data, token, email, phone })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        {email ? (
                            <div className="grid gap-2">
                                <Label htmlFor="email">Электронная почта</Label>
                                <Input id="email" type="email" name="email" autoComplete="email" value={email} className="mt-1 block w-full" readOnly />
                                <InputError message={errors.email} className="mt-2" />
                            </div>
                        ) : phone ? (
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Номер телефона</Label>
                                <Input id="phone" type="tel" name="phone" value={phone} className="mt-1 block w-full" readOnly />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>
                        ) : null}

                        <div className="grid gap-2">
                            <Label htmlFor="password">Пароль</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder="Пароль"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Подтверждение пароля</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder="Подтверждение пароля"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <Button type="submit" className="mt-4 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Сбросить пароль
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
