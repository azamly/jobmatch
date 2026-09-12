import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    BookOpen,
    Building,
    Building2Icon, FileSearch,
    Folder,
    IdCardIcon,
    LayoutGrid,
    UploadIcon
} from 'lucide-react';
import AppLogo from './app-logo';
import AppearanceTabs from '@/components/appearance-tabs';
import { employerSidebarItems, jobSeekerSidebarItems } from '@/lib/sidebar.data';


export function AppSidebar() {
    const { role } = usePage<SharedData>().props.auth

    const mainNavItems: NavItem[] =
        role === 'jobseeker' ? [...jobSeekerSidebarItems] :
            role === 'employer' ? [...employerSidebarItems] : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('home')} className="flex items-center gap-3" prefetch>
                                <AppLogo />
                            </Link>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
