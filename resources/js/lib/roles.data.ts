import { Building, Crown, FileUser, LucideIcon, UserRound } from 'lucide-react';

// Текстовые метки
const rolesTitle: Record<string, string> = {
    jobseeker: 'Работник',
    employer: 'Работодатель',
    admin: 'Администратор',
};

// Храним сам компонент иконки (не JSX!)
const rolesIcon: Record<string, LucideIcon> = {
    jobseeker: FileUser,
    employer: Building,
    admin: Crown,
};

// Получение текста
export const getRoleLabel = (role: string | null | undefined): string => {
    return rolesTitle[role!] || 'Гость';
};

// Получение компонента иконки
export const getRoleIcon = (role: string | null | undefined): LucideIcon => {
    return rolesIcon[role!] || UserRound; // UserRound — fallback для гостя
};
