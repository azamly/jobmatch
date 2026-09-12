// Components
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

export default function ForgotPassword({ status }: { status?: string }) {
    const [phone, setPhone] = useState('');
    return (
        <AuthLayout title="Забыли пароль" description="Введите свой адрес электронной почты, чтобы получить ссылку для сброса пароля.">
            <Head title="Забыли пароль" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <Tabs defaultValue="email">
                    <TabsList className="mb-4 flex w-full">
                        <TabsTrigger className="flex-1 text-center" value="email">
                            Электронная почта
                        </TabsTrigger>
                        <TabsTrigger className="flex-1 text-center" value="phone">
                            Номер телефона
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email">
                        <Form method="post" action={route('password.email')}>
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Электронная почта</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            name="email" 
                                            autoComplete="off" 
                                            autoFocus 
                                            placeholder="email@example.com" 
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="my-6 flex items-center justify-start">
                                        <Button className="w-full" disabled={processing}>
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Отправить ссылку для сброса
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </TabsContent>

                    <TabsContent value="phone">
                        <Form method="post" action={route('password.email')}>
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Номер телефона</Label>
                                        <Input 
                                            id="phone" 
                                            type="tel" 
                                            name="phone" 
                                            value={phone}
                                            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                                            autoComplete="off" 
                                            placeholder="+992 (XX) XXX-XX-XX" 
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="my-6 flex items-center justify-start">
                                        <Button className="w-full" disabled={processing}>
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Отправить код для сброса
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </TabsContent>
                </Tabs>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Или вернитесь к</span>
                    <TextLink href={route('login')}>входу</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
