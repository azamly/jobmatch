import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import {
    Building2Icon,
    KeyIcon,
    KeyRoundIcon,
    LockIcon,
    LucidePersonStanding,
    ShieldIcon,
    TrashIcon,
    UnlockIcon, UploadIcon,
    UserIcon
} from 'lucide-react';

// Статический базовый список — НЕ мутируем его!
const baseSidebarNavItems: NavItem[] = [
    {
        title: 'Профиль',
        href: '/settings/profile',
        icon: UserIcon,
    },
    {
        title: 'Пароль',
        href: '/settings/password',
        icon: ShieldIcon,
    },
    {
        title: 'Удаление',
        href: '/settings/destroy-account',
        icon: TrashIcon,
        className: 'text-destructive',
    },
];

export default function SettingsLayout({ children,size='xl' }: {children:ReactNode,size?:string}) {
    const { role } = usePage<SharedData>().props.auth
    if (typeof window === 'undefined') {
        return null;
    }
    // Динамически формируем пункты меню
    const sidebarNavItems = [...baseSidebarNavItems]; // Копируем базовые

    if (role === 'jobseeker') {
        const profileIndex = sidebarNavItems.findIndex(item =>
            'title' in item && item.title === 'Профиль'
        );

        // Вставляем новый пункт сразу после "Профиль"
        if (profileIndex !== -1) {
            sidebarNavItems.splice(profileIndex + 1, 0, {
                title: 'Резюме (CV)',
                href: '/settings/jobseeker',
                icon: UploadIcon,
            });
        }
    }
    else if(role==='employer'){
        const profileIndex = sidebarNavItems.findIndex(item =>
            'title' in item && item.title === 'Профиль'
        );

        // Вставляем новый пункт сразу после "Профиль"
        if (profileIndex !== -1) {
            sidebarNavItems.splice(profileIndex + 1, 0, {
                title: 'Доп. информация',
                href: '/settings/employer',
                icon: Building2Icon,
            });
        }
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading  title="Настройки" description="Управляйте своим профилем и данными об аккаунте" />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className={`w-full max-w-xl lg:w-48`}>
                    <nav className="flex flex-col space-x-0 space-y-1">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn(
                                    'flex items-center justify-start gap-2',
                                    item.className,
                                    {
                                        'bg-muted': currentPath === item.href,
                                    },{
                                        'bg-muted': (item.href === '/settings/jobseeker' && currentPath === '/settings/jobseeker/edit'),
                                    }
                                )}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className={`flex-1 md:max-w-${size}`}>
                    <section className={`max-w-${size} space-y-12`}>{children}</section>
                </div>
            </div>
        </div>
    );
}
