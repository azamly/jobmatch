import { FileSearch, FileText, Heart, Inbox, LayoutGrid, MessageCircleIcon, UserIcon } from 'lucide-react';
import { NavItem } from '@/types';

export const jobSeekerSidebarItems: NavItem[] = [
    {
        title: "Панель управления",
        href:'/dashboard',
        icon: LayoutGrid, // классическая иконка для dashboard
    },
    {
        title: "Отклики",
        href: '/vacancy/jobseeker/application',
        icon: FileText, // заявка/документ — хорошо подходит для откликов
    },
    {
        title: "Сохраненные",
        href: '/vacancy/jobseeker/saves',
        icon: Heart, // "избранное/сохранённые"
    },
    {
        title:"Чат",
        href:"/chat",
        icon:MessageCircleIcon,
    },
    {
        title:'Профиль',
        href:"/settings/profile",
        icon:UserIcon
    }
];

export const employerSidebarItems:NavItem[] = [
    {
        title: 'Панель управления',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Вакансии',
        href: '/vacancies',
        icon: FileSearch,
    },
    {
        title:"Отклики",
        href:'/vacancy-applications',
        icon:Inbox
    },
    {
        title:"Чат",
        href:"/chat",
        icon:MessageCircleIcon
    },
    {
        title:'Профиль',
        href:"/settings/profile",
        icon:UserIcon
    }
]
