// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout title="Подтверждение электронной почты" description="Пожалуйста, подтвердите свой адрес электронной почты, перейдя по ссылке, которую мы только что отправили вам по электронной почте.">
            <Head title="Подтверждение электронной почты" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    На адрес электронной почты, указанный вами при регистрации, была отправлена новая ссылка для подтверждения.
                </div>
            )}

            <Form method="post" action={route('verification.send')} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Повторно отправить подтверждающее письмо
                        </Button>

                        <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                            Выйти
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
