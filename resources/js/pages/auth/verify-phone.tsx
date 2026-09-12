import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { formatPhoneNumber } from '@/lib/utils';

interface VerifyPhoneProps {
    status?: string;
    phone?: string;
}

export default function VerifyPhone({ status, phone: initialPhone }: VerifyPhoneProps) {
    const [phone, setPhone] = useState(initialPhone || '');
    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    const handleSendCode = () => {
        setCodeSent(true);
    };

    return (
        <AuthLayout title="Подтверждение телефона" description="Подтвердите свой номер телефона, чтобы получить доступ к дополнительным функциям.">
            <Head title="Подтверждение телефона" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                {!codeSent ? (
                    <Form
                        method="post"
                        action={route('verification.phone.send')}
                        onSuccess={handleSendCode}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2 mb-4">
                                    <Label htmlFor="phone">Номер телефона</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                                        autoComplete="off"
                                        placeholder="+992 (XX) XXX-XX-XX"
                                        readOnly={!!initialPhone}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Отправить код
                                </Button>
                            </>
                        )}
                    </Form>
                ) : (
                    <Form method="post" action={route('verification.phone')}>
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="phone" value={phone} />

                                <div className="grid gap-2">
                                    <Label htmlFor="code">Код подтверждения</Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        name="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        autoComplete="off"
                                        placeholder="Введите код"
                                        maxLength={6}
                                    />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Подтвердить
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCodeSent(false)}
                                        disabled={processing}
                                    >
                                        Отправить код повторно
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </div>
        </AuthLayout>
    );
}
