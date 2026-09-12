import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import AppearanceTabs from '@/components/appearance-tabs';
import DeleteUser from '@/components/delete-user';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Настройки удаление аккаунта',
        href: '/settings/appearance',
    },
];

export default function DestroyAccount() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <SettingsLayout>
                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
