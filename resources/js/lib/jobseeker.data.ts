import {
    DotSquareIcon, Facebook,
    FacebookIcon, Github,
    GithubIcon, Instagram,
    InstagramIcon,
    Linkedin,
    LinkedinIcon,
    LucideIcon, Mail,
    MailIcon, SquareDot,
    TwitchIcon, Twitter
} from 'lucide-react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Industry } from '@/types/jobseeker';

export interface ILanguageProficiency{
    id:number;
    title:string;
    level:string
}
export const languageProficiency = [
    {id:1,title:"Beginner - A1"},
    {id:2,title:"Elementary - B2"},
    {id:3,title:"Pre-Intermediate - B1"},
    {id:4,title:"Intermediate - B2"},
    {id:5,title:"Upper-Intermediate - C1"},
    {id:6,title:"Pro - C2"},
    {id:7,title:"Родной"},
]

export const industries: Industry[] = [
    { id: 1, name: 'Информационные технологии (IT)', slug: 'it' },
    { id: 2, name: 'Образование', slug: 'education' },
    { id: 3, name: 'Здравоохранение', slug: 'healthcare' },
    { id: 4, name: 'Строительство', slug: 'construction' },
    { id: 5, name: 'Финансы и бухгалтерия', slug: 'finance&accounting' },
    { id: 6, name: 'Производство', slug: 'production' },
    { id: 7, name: 'Логистика и транспорт', slug: 'logistics&transport' },
    { id: 8, name: 'Маркетинг и реклама', slug: 'marketing&ads' },
    { id: 9, name: 'Сельское хозяйство', slug: 'agricultural' },
    { id: 10, name: 'Туризм и гостиницы', slug: 'tourism&hotels' },
    { id: 11, name: 'Государственная служба', slug: 'public_service' },
    { id: 12, name: 'Другое', slug: 'other' },
];

const industriesMap: Record<number, string> = {
    1: 'Информационные технологии (IT)',
    2: 'Образование',
    3: 'Здравоохранение',
    4: 'Строительство',
    5: 'Финансы и бухгалтерия',
    6: 'Производство',
    7: 'Логистика и транспорт',
    8: 'Маркетинг и реклама',
    9: 'Сельское хозяйство',
    10: 'Туризм и гостиницы',
    11: 'Государственная служба',
    12: 'Другое',
};
const languages:Record<number, string> = {
    1:'Beginner - A1',
    2:'Elementary - B2',
    3:'Pre-Intermediate - B1',
    4:'Intermediate - B2',
    5:'Upper-Intermediate - C1',
    6:'Pro - C2',
    7:'Родной',

}
const categories:Record<number, string> = {
    1:'Резюме',
    2:'Сертификат',
    3:'Портфолио',
    4:'Диплом',
    5:'Проект',
    6:'Достижения',
}
export const additionCategory = [
    {id:1,value:'Резюме'},
    {id:2,value:'Сертификат'},
    {id:3,value:'Портфолио'},
    {id:4,value:'Диплом'},
    {id:5,value:'Проект'},
    {id:6,value:'Достижения'}
]

const linkIcons: Record<string, LucideIcon> = {
    github: Github,
    x: Twitter,
    instagram: Instagram,
    facebook: Facebook,
    linkedin: Linkedin,
    email: Mail,
}

export const getLinkIcon = (id:string):LucideIcon =>{
    return linkIcons[id!] || DotsHorizontalIcon
}

export const getCategoryName = (id: number): string => {
    return categories[id!] || 'Резюме';
};

export const getLanguageLevel = (id:number):string => {
    return languages[id!] || 'Родной'
}

export const getIndustryName = (id:number):string =>{
    return industriesMap[id] || 'Другое'
}
