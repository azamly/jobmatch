import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { AlarmCheck, CheckCheckIcon, CheckCircle2, CheckIcon, LoaderCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPhoneNumber } from '@/lib/utils';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [phone, setPhone] = useState("");
    return (
        <AuthLayout title="Войдите в свою учетную запись" description="Введите свои данные ниже, чтобы войти в систему.">
            <Head title="Войти" />

            <Form method="post" action={route('login')} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <Tabs defaultValue="email">
                                <TabsList className="flex w-full mb-4">
                                    <TabsTrigger className="flex-1 text-center" value="email">
                                        Электронная почта
                                    </TabsTrigger>
                                    <TabsTrigger className="flex-1 text-center" value="phone">
                                        Номер телефона
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="email">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Электронная почта</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </TabsContent>
                                <TabsContent value="phone">
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Номер телефона</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            required
                                            value={phone}
                                            autoFocus
                                            onChange={(e) =>  (setPhone(formatPhoneNumber(e.target.value)))}
                                            tabIndex={1}
                                            placeholder="+992 (XX) XXX-XX-XX"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Пароль</Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                            Забыли пароль?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Пароль"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember"  className="accent-red-500"
                                          name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Запомнить меня</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Войти
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            У вас нету аккаунта?{' '}
                            <TextLink href={route('register')} tabIndex={5}>
                                Зарегистрироваться
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
