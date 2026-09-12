// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Eye, MessageCircle, Bookmark, BookmarkCheck } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { CVViewer } from '@/components/jobseeker/cv-viewer';
// import { useState } from 'react';
// import { JobSeekerProfile } from '@/types/jobseeker';
// import { usePage } from '@inertiajs/react';
// import { SharedData } from '@/types';
//
// export function JobseekerCard({ jobseeker }: { jobseeker: JobSeekerProfile }) {
//     const [showCVPreview, setShowCVPreview] = useState(false);
//     const [isFavorite, setIsFavorite] = useState(false);
//     return (
//         <Card className="relative transition-colors">
//             {/* Кнопка избранного в правом верхнем углу */}
//             <button
//                 onClick={() => setIsFavorite(!isFavorite)}
//                 className="absolute top-2 right-2 rounded-full p-2 hover:bg-gray-100 transition"
//             >
//                 {isFavorite ? (
//                     <BookmarkCheck className="h-5 w-5 text-blue-600" />
//                 ) : (
//                     <Bookmark className="h-5 w-5 text-gray-500" />
//                 )}
//             </button>
//
//             <CardContent className="space-y-4">
//                 <div className="flex items-start space-x-4">
//                     {/* Аватар */}
//                     <Avatar>
//                         <AvatarImage
//                             className="rounded-full object-cover"
//                             src={jobseeker.user.avatar ? `/storage/images/${jobseeker.user.avatar}` : undefined}
//                             alt={jobseeker.user.name}
//                         />
//                         <AvatarFallback>
//                             {jobseeker.first_name[0]}
//                             {jobseeker.last_name[0]}
//                         </AvatarFallback>
//                     </Avatar>
//
//                     {/* Данные */}
//                     <div className="flex-1">
//                         <div className="flex items-center space-x-2">
//                             <h3 className="font-semibold">
//                                 {jobseeker.first_name} {jobseeker.last_name}
//                             </h3>
//                         </div>
//
//                         {jobseeker.location && (
//                             <p className="text-sm text-muted-foreground">
//                                 {jobseeker.location}
//                             </p>
//                         )}
//
//                         <div className="mt-2">
//                             <p className="text-sm text-muted-foreground">
//                                 Опыт: {jobseeker.experiences.length > 0 ? jobseeker.experiences[0].job_title : 'Не указан'}
//                             </p>
//                         </div>
//
//                         <div className="mt-2 flex flex-wrap gap-1">
//                             {jobseeker.skills.map((skill) => (
//                                 <Badge key={skill.id} variant="secondary" className="text-xs">
//                                     {skill.name}
//                                 </Badge>
//                             ))}
//                         </div>
//
//                         {jobseeker.summary && (
//                             <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
//                                 {jobseeker.summary}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Футер с кнопками */}
//                 <div className="flex justify-end gap-2">
//                     <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
//                         <DialogTrigger asChild>
//                             <Button variant="outline">
//                                 <Eye className="h-4 w-4 mr-2" />
//                                 Просмотр CV
//                             </Button>
//                         </DialogTrigger>
//                         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                             <DialogHeader>
//                                 <DialogTitle>Просмотр CV</DialogTitle>
//                             </DialogHeader>
//                             <CVViewer data={jobseeker} showActions={false} />
//                         </DialogContent>
//                     </Dialog>
//                     <Button size="sm" variant="outline">
//                         <MessageCircle className="mr-1 h-4 w-4" />
//                         Связаться
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CVViewer } from '@/components/jobseeker/cv-viewer';
import { useState } from 'react';
import { JobSeekerProfile } from '@/types/jobseeker';
import { VacancyWithEmployer } from '@/types/employer';
import { Link } from '@inertiajs/react';

export function JobseekerCard({
                                    vacancy,
                                  jobseeker,
                                  score = 0,           // число от 0 до 1
                                  showScore = false    // включение отображения процента
                              }: { vacancy?:VacancyWithEmployer,jobseeker: JobSeekerProfile; score?: number; showScore?: boolean }) {
    const [showCVPreview, setShowCVPreview] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Преобразуем score в проценты
    const scorePercent = Math.round(score * 100);
    // Определяем цвет бейджа по проценту
    let scoreColor = "bg-gray-100 text-gray-700";
    if (scorePercent >= 80) scoreColor = "bg-green-100 text-green-700";
    else if (scorePercent >= 50) scoreColor = "bg-yellow-100 text-yellow-700";
    else if (scorePercent > 0) scoreColor = "bg-red-100 text-red-700";

    return (
        <Card className="relative transition-colors">
            {/* Кнопка избранного */}
            <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-2 right-2 rounded-full p-2 hover:bg-gray-100 transition"
            >
                {isFavorite ? (
                    <BookmarkCheck className="h-5 w-5 text-blue-600" />
                ) : (
                    <Bookmark className="h-5 w-5 text-gray-500" />
                )}
            </button>

            <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                    {/* Аватар */}
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

                    {/* Данные */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">
                                {jobseeker.first_name} {jobseeker.last_name} {vacancy ? ' - ':''} <Link className={'text-primary'}>{vacancy?.title}</Link>
                            </h3>

                            {/* Бейдж с процентом score */}
                            {showScore && scorePercent > 0 && (
                                <Badge className={`text-xs ${scoreColor}`}>
                                    {scorePercent}%
                                </Badge>
                            )}
                        </div>

                        {jobseeker.location && (
                            <p className="text-sm text-muted-foreground">
                                {jobseeker.location}
                            </p>
                        )}

                        <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                                Опыт: {jobseeker.experiences.length > 0 ? jobseeker.experiences[0].job_title : 'Не указан'}
                            </p>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                            {jobseeker.skills.map((skill) => (
                                <Badge key={skill.id} variant="secondary" className="text-xs">
                                    {skill.name}
                                </Badge>
                            ))}
                        </div>

                        {jobseeker.summary && (
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                {jobseeker.summary}
                            </p>
                        )}
                    </div>
                </div>

                {/* Футер с кнопками */}
                <div className="flex justify-end gap-2">
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
                            <CVViewer data={jobseeker} showActions={false} />
                        </DialogContent>
                    </Dialog>
                    <Button asChild size="sm" variant="outline">
                        <Link href={route('chat.conversation',jobseeker.user?.id)}>
                            <MessageCircle className="mr-1 h-4 w-4" />
                            Написать
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
