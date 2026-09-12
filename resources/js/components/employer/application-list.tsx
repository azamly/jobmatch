// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Eye, MessageCircle, Star } from "lucide-react";
// import type { Application } from "@/types/employer";
// import { Link } from '@inertiajs/react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { CVViewer } from '@/components/jobseeker/cv-viewer';
// import { useState } from 'react'; // твой тип
//
// // Можно потом вынести в отдельный файл
// const statusConfig: Record<
//     string,
//     { label: string; color: string; icon: React.ElementType }
// > = {
//     applied: { label: "Заявлено", color: "bg-blue-100 text-blue-700", icon: Eye },
//     accepted: { label: "Принято", color: "bg-green-100 text-green-700", icon: Eye },
//     rejected: { label: "Отклонено", color: "bg-red-100 text-red-700", icon: Eye }
// };
//
// export function ApplicationCard({ application}: { application: Application }) {
//     const jobseeker = application.jobseeker;
//     const StatusIcon = statusConfig[application.status ?? "applied"].icon;
//     const [showCVPreview, setShowCVPreview] = useState(false)
//     return (
//         <Card className="transition-colors">
//             <CardContent className="">
//                 <div className="flex items-start justify-between">
//                     {/* Левая часть */}
//                     <div className="flex items-start space-x-4">
//                         <Avatar>
//                             <AvatarImage
//                                 className="rounded-full object-cover"
//                                 src={jobseeker.user.avatar ? `/storage/images/${jobseeker.user.avatar}` : undefined}
//                                 alt={jobseeker.user.name}
//                             />
//                             <AvatarFallback>
//                                 {jobseeker.first_name[0]}
//                                 {jobseeker.last_name[0]}
//                             </AvatarFallback>
//                         </Avatar>
//
//                         <div className="flex-1">
//                             <div className="flex items-center space-x-2">
//                                 <h3 className="font-semibold">
//                                     {jobseeker.first_name} {jobseeker.last_name}
//                                 </h3>
//                             </div>
//
//                             {jobseeker.location && <p className="text-sm text-muted-foreground">{jobseeker.location}</p>}
//
//                             <div className="mt-2">
//                                 <Link className="font-medium text-primary" href={route('vacancies.show', application.vacancy.id)}>
//                                     {application.vacancy.title}
//                                 </Link>
//                                 <p className="text-sm text-muted-foreground">
//                                     Опыт: {jobseeker.experiences.length > 0 ? jobseeker.experiences[0].job_title : 'Не указан'} • Зарплата:{' '}
//                                     {application.salary_exception
//                                         ? application.salary_exception
//                                         : `${application.vacancy.salary_start}–${application.vacancy.salary_end}`}
//                                 </p>
//                             </div>
//
//                             <div className="mt-2 flex flex-wrap gap-1">
//                                 {jobseeker.skills.map((skill) => (
//                                     <Badge key={skill.id} variant="secondary" className="text-xs">
//                                         {skill.name}
//                                     </Badge>
//                                 ))}
//                             </div>
//                             {application.description && (
//                                 <p className="mt-2 max-w-full text-sm text-muted-foreground break-words">
//                                     {application.description}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Правая часть */}
//                     <div className="flex flex-col items-end space-y-2">
//                         <Badge   className={`${statusConfig[application.status ?? 'applied'].color} hover:bg-inherit`}>
//                             <StatusIcon className="mr-1 h-3 w-3" />
//                             {statusConfig[application.status ?? 'applied'].label}
//                         </Badge>
//                         <p className="text-xs text-muted-foreground">{new Date(application.created_at).toLocaleDateString('ru-RU')}</p>
//                         <div className="flex space-x-2">
//                             <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
//                                 <DialogTrigger asChild>
//                                     <Button variant="outline">
//                                         <Eye className="h-4 w-4 mr-2" />
//                                         Просмотр CV
//                                     </Button>
//                                 </DialogTrigger>
//                                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                                     <DialogHeader>
//                                         <DialogTitle>Просмотр CV</DialogTitle>
//                                     </DialogHeader>
//                                     <CVViewer  data={application.jobseeker} showActions={false} />
//                                 </DialogContent>
//                             </Dialog>
//                             <Button size="sm" variant="outline">
//                                 <MessageCircle className="mr-1 h-4 w-4" />
//                                 Написать
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, MessageCircle, XCircle } from 'lucide-react';
import type { Application } from "@/types/employer";
import { Link, router, usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CVViewer } from '@/components/jobseeker/cv-viewer';
import { useState } from 'react';
import { toast } from 'sonner';
import { SharedData } from '@/types';

const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ElementType }
> = {
    applied: { label: "Заявлено", color: "bg-blue-100 text-blue-700", icon: Eye },
    accepted: { label: "Принято", color: "bg-green-100 text-green-700", icon: Eye },
    rejected: { label: "Отклонено", color: "bg-red-100 text-red-700", icon: Eye }
};

export function ApplicationCard({ application }: { application: Application }) {
    const jobseeker = application.jobseeker;
    const StatusIcon = statusConfig[application.status ?? "applied"].icon;
    const [showCVPreview, setShowCVPreview] = useState(false);
    const userID = usePage<SharedData>().props.auth.user.id

    const handleSendRequest = (type:"accepted"|"rejected")=>{
        router.post(route('application-status'),{type:type,application_id:application.id},  {
            onSuccess: () => toast.success(`Заявка ${type === 'accepted' ? 'принята' : 'отклонена'}`),
            onError: () => toast.error('Ошибка при обновлении статуса')
        })
    }

    return (
        <Card className="transition-colors">
            <CardContent className="">
                <div className="flex items-start justify-between">
                    {/* Левая часть */}
                    <div className="flex items-start space-x-4">
                        <Avatar>
                            <AvatarImage
                                className="rounded-full object-cover"
                                src={jobseeker.user ? (jobseeker.user.avatar ? `/storage/images/${jobseeker.user.avatar}` : undefined):""}
                                alt={jobseeker.user ? jobseeker.user.name : ''}
                            />
                            <AvatarFallback>
                                {jobseeker.first_name[0]}
                                {jobseeker.last_name[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">
                                    {jobseeker.first_name} {jobseeker.last_name}
                                </h3>
                            </div>

                            {jobseeker.location && <p className="text-sm text-muted-foreground">{jobseeker.location}</p>}

                            <div className="mt-2">
                                <Link className="font-medium text-primary" href={route('vacancies.show', application.vacancy.id)}>
                                    {application.vacancy.title}
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                    Опыт: {jobseeker.experiences.length > 0 ? jobseeker.experiences[0].job_title : 'Не указан'} • Зарплата:{' '}
                                    {application.salary_exception
                                        ? application.salary_exception
                                        : `${application.vacancy.salary_start}–${application.vacancy.salary_end}`}
                                </p>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1">
                                {jobseeker.skills.map((skill) => (
                                    <Badge key={skill.id} variant="secondary" className="text-xs">
                                        {skill.name}
                                    </Badge>
                                ))}
                            </div>

                            {application.description && (
                                <p className="mt-2 max-w-sm md:max-w-lg lg:max-w-2xl text-sm text-muted-foreground overflow-wrap break-word">
                                    {application.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Правая часть */}
                    <div className="flex flex-col items-end space-y-2">
                            <div className={'flex items-center justify-start gap-2'}>
                                {application.status === 'applied' && (
                                    <>
                                        <Button onClick={()=> handleSendRequest('accepted')} className={'bg-green-300'}><CheckCircle2/></Button>
                                        <Button onClick={()=>handleSendRequest('rejected')} className={'bg-red-300'}><XCircle/></Button>
                                    </>
                                )}
                                <Badge className={`${statusConfig[application.status ?? 'applied'].color} hover:bg-inherit`}>
                                    <StatusIcon className="mr-1 h-3 w-3" />
                                    {statusConfig[application.status ?? 'applied'].label}
                                </Badge>
                            </div>
                        <p className="text-xs text-muted-foreground">{new Date(application.created_at).toLocaleDateString('ru-RU')}</p>
                        <div className="flex space-x-2">
                            <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Просмотр CV
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Просмотр CV</DialogTitle>
                                    </DialogHeader>
                                    <CVViewer data={application.jobseeker} showActions={false} />
                                </DialogContent>
                            </Dialog>
                            <Button asChild size="sm" variant="outline">
                                <Link href={route('chat.conversation',application.jobseeker.user?.id)}>
                                    <MessageCircle className="mr-1 h-4 w-4" />
                                    Написать
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
