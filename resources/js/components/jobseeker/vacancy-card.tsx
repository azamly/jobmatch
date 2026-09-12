import React, { useState } from 'react';
import { VacancyWithEmployer } from '@/types/employer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Bookmark, BookmarkCheck, Building, Clock, DollarSign, Eye, MapPin, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, useVacancyView } from '@/lib/utils';
import { getVacancyType } from '@/lib/employer.data';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
// export default function VacancyCard({ vacancy,setScore=false,score=0 }: { vacancy: VacancyWithEmployer,setScore?:boolean,score?:number }) {
//     const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);
//     const { requestSendToView } = useVacancyView();
//
//     const [isSaved, setIsSaved] = useState(vacancy.isFavorite);
//
//     const employerName = vacancy.employer?.company_name?.trim()
//         ? vacancy.employer.company_name
//         : 'Индивидуально';
//
//     function toggleSaveJob(vacancyId: number) {
//         requestSendToView(vacancyId);
//
//         const newState = !isSaved;
//
//         router.post(route('vacancies.save', vacancyId), { save: newState }, {
//             preserveScroll: true,
//             onSuccess: () => {
//                 setIsSaved(newState);
//                 toast.success(newState ? 'Вакансия успешно сохранена' : 'Вакансия удалена из сохранённых');
//             },
//             onError: () => toast.error('Ошибка при сохранении/удалении вакансии'),
//         });
//     }
//
//     return (
//         <Card className="transition-shadow hover:shadow-lg">
//             <CardHeader>
//                 <div className="flex items-start justify-between">
//                     <div>
//                         <CardTitle className="text-xl">{vacancy.title}</CardTitle>
//                         <CardDescription className="flex items-center gap-2 text-lg font-normal text-foreground">
//                             <Building className="h-4 w-4" />
//                             {employerName}
//                         </CardDescription>
//                     </div>
//
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleSaveJob(vacancy.id)}
//                         className={cn('transition-colors duration-200')}
//                     >
//                         {isSaved ? (
//                             <BookmarkCheck className="h-5 w-5 text-blue-500" />
//                         ) : (
//                             <Bookmark className="h-5 w-5 text-gray-500" />
//                         )}
//                     </Button>
//                 </div>
//             </CardHeader>
//
//             <CardContent className="space-y-4">
//                 <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                         <MapPin className="h-4 w-4" />
//                         {vacancy.location}
//                     </div>
//                     <div className="flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         {getVacancyType(vacancy.type)}
//                     </div>
//                     <div className="flex items-center gap-1">
//                         <DollarSign className="h-4 w-4" />
//                         {vacancy.salary_type === 'money'
//                             ? salaryMoney
//                                 ? `${vacancy.salary_start} - ${vacancy.salary_end} смн.`
//                                 : 'Договорённость'
//                             : 'Договорённость'}
//                     </div>
//                 </div>
//
//                 <p className="text-muted-foreground">{vacancy.description}</p>
//
//                 <div className="flex flex-wrap gap-2">
//                     {vacancy.skills?.map((skill) => (
//                         <Badge key={skill} variant="secondary">
//                             {skill}
//                         </Badge>
//                     ))}
//                 </div>
//
//                 <div className="flex items-center justify-between pt-4">
//                     <span className="text-sm text-muted-foreground">
//                         Опубликовано {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
//                     </span>
//                     <div className="flex gap-2">
//                         <Button asChild variant="outline" size="sm">
//                             <Link
//                                 href={route('vacancies.more', vacancy.id)}
//                                 onClick={() => requestSendToView(vacancy.id)}
//                             >
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 Подробнее
//                             </Link>
//                         </Button>
//                         <Button asChild size="sm">
//                             <Link
//                                 href={route('vacancies.application', vacancy.id)}
//                                 onClick={() => requestSendToView(vacancy.id)}
//                             >
//                                 <SendIcon /> Откликнуться
//                             </Link>
//                         </Button>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }



export default function VacancyCard({
                                        vacancy,
                                        setScore = false,
                                        score = 0
                                    }: {
    vacancy: VacancyWithEmployer;
    setScore?: boolean;
    score?: number; // ожидаем значение от 0 до 1 или 0-100
}) {
    const salaryMoney = !(vacancy.salary_start === 0 && vacancy.salary_end === 0);
    const { requestSendToView } = useVacancyView();
    const [isSaved, setIsSaved] = useState(vacancy.isFavorite);

    const employerName = vacancy.employer?.company_name?.trim()
        ? vacancy.employer.company_name
        : 'Индивидуально';
    function toggleSaveJob(vacancyId: number) {
        requestSendToView(vacancyId);

        const newState = !isSaved;

        router.post(
            route('vacancies.save', vacancyId),
            { save: newState },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaved(newState);
                    toast.success(
                        newState
                            ? 'Вакансия успешно сохранена'
                            : 'Вакансия удалена из сохранённых'
                    );
                },
                onError: () => toast.error('Ошибка при сохранении/удалении вакансии')
            }
        );
    }


    // Конвертируем score в проценты (0-100)
    const scorePercent = Math.round(score * 100);

    return (
        <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">{vacancy.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-lg font-normal text-foreground">
                            <Building className="h-4 w-4" />
                            {employerName}
                        </CardDescription>

                        {/* Показываем процент успеха */}
                        {setScore && (
                            <div className="mt-2 flex flex-col gap-1 w-40">
                                <span className="text-sm text-muted-foreground">
                                    Процент соответствия: {scorePercent}%
                                </span>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${scorePercent}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveJob(vacancy.id)}
                        className={cn('transition-colors duration-200')}
                    >
                        {isSaved ? (
                            <BookmarkCheck className="h-5 w-5 text-blue-500" />
                        ) : (
                            <Bookmark className="h-5 w-5 text-gray-500" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {vacancy.location}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getVacancyType(vacancy.type)}
                    </div>
                    <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {vacancy.salary_type === 'money'
                            ? salaryMoney
                                ? `${vacancy.salary_start} - ${vacancy.salary_end} смн.`
                                : 'Договорённость'
                            : 'Договорённость'}
                    </div>
                </div>

                <p className="text-muted-foreground">{vacancy.description}</p>

                <div className="flex flex-wrap gap-2">

                    {vacancy.skills ? vacancy.skills?.map((skill,index) => (
                        <Badge key={index} variant="secondary">
                            {skill}
                        </Badge>
                    )):''}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground">
                        Опубликовано {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href={vacancy?.id ? route('vacancies.more', vacancy.id) : '#'}
                                onClick={() => requestSendToView(vacancy.id)}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Подробнее
                            </Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link
                                href={vacancy?.id ? route('vacancies.application', vacancy.id) : '#'}
                                onClick={() => requestSendToView(vacancy.id)}
                            >
                                <SendIcon /> Откликнуться
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
