import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPhoneNumber } from '@/lib/utils';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Register() {
    const [phone,setPhone] = useState("")
    const [role, setRole] = useState('jobseeker');

    return (
        <AuthLayout title="Создать учетную запись" description="Введите свои данные ниже, чтобы создать учетную запись">
            <Head title="Регистрация" />
            <Form
                method="post"
                action={route('register')}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <Tabs defaultValue="email">
                                <TabsList className="mb-4 flex w-full">
                                    <TabsTrigger className="flex-1 text-center" value="email">
                                        Электронная почта
                                    </TabsTrigger>
                                    <TabsTrigger className="flex-1 text-center" value="phone">
                                        Номер телефона
                                    </TabsTrigger>
                                </TabsList>
                                <div className="grid gap-2 mb-4">
                                    <Label htmlFor="name">Полное имя</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Полное имя"
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
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
                                            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                                            tabIndex={1}
                                            placeholder="+992 (XX) XXX-XX-XX"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Пароль</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Пароль"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Подтверждение пароля</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Подтверждение пароля"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div>
                                <RadioGroup
                                    value={role}
                                    onValueChange={setRole}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="jobseeker" id="jobseeker" />
                                        <Label htmlFor="jobseeker" className="text-sm font-medium">
                                            Работник
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="employer" id="employer" />
                                        <Label htmlFor="employer" className="text-sm font-medium">
                                            Работодатель
                                        </Label>
                                    </div>
                                </RadioGroup>
                                <input type="hidden" name="role" value={role} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Создать аккаунт
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            У вас уже есть аккаунт?{' '}
                            <TextLink href={route('login')} tabIndex={6}>
                                Войты
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
