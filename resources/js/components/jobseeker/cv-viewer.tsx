import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Languages,
    GraduationCap,
    Briefcase,
    ExternalLink,
    Download,
    Star,
    Link,
} from "lucide-react"
import { JobSeekerProfile } from '@/types/jobseeker';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { getCategoryName, getIndustryName, getLanguageLevel, getLinkIcon } from '@/lib/jobseeker.data';



interface CVViewerProps {
    data: JobSeekerProfile
    showActions?: boolean
}

export function CVViewer({ data, showActions = true }: CVViewerProps) {
    const {auth} = usePage<SharedData>().props
    const getInitials = useInitials();

    const handleDownload = () => {
        // Simulate PDF download
        console.log("Downloading CV as PDF...")
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="mx-auto max-w-4xl bg-background">
            {/* Actions */}
            {showActions && (
                <div className="mb-6 flex justify-end gap-2 print:hidden">
                    <Button variant="outline" onClick={handlePrint}>
                        Печать
                    </Button>
                    <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Скачать PDF
                    </Button>
                </div>
            )}

            {/* Header */}
            <Card className="mb-6">
                <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                        <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 text-4xl font-bold text-primary">
                            <Avatar className="h-32 w-32 overflow-hidden">
                                <AvatarImage
                                    className="rounded-full object-cover"
                                    src={auth.user.avatar ? `/storage/images/${auth.user.avatar}` : undefined}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-4xl text-black dark:bg-neutral-700 dark:text-white">
                                    {data.first_name[0]}
                                    {data.last_name[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1">
                            <h1 className="mb-2 text-4xl font-bold">
                                {data.first_name} {data.last_name} {data.middle_name ?? ''}
                            </h1>
                            <p className="mb-4 text-xl text-muted-foreground">{data.summary}</p>

                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span>{auth.user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{data.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-primary" />
                                    <span>{getIndustryName(data.industry_id)}</span>
                                </div>
                                {data.birth_date && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span>{new Date(data.birth_date).toLocaleDateString('ru-RU')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Skills */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Award className="h-5 w-5" />
                                Навыки
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {skill.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Languages className="h-5 w-5" />
                                Языки
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.languages.map((lang, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="font-medium">{lang.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {getLanguageLevel(lang.language_proficiency_id)}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/*Links*/}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Link className="h-5 w-5" />
                                Ссылки
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.links.map((link, index) => {
                                const Icon = getLinkIcon(link.type);
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-primary" />
                                        <span className="font-light">{link.url}</span>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/*{data.additions && data.additions.length > 0 && (*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader>*/}
                    {/*            <CardTitle className="flex items-center gap-2 text-lg">*/}
                    {/*                <Star className="h-5 w-5" />*/}
                    {/*                Дополнительно*/}
                    {/*            </CardTitle>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardContent className="space-y-4">*/}
                    {/*            {data.additions.map((a, index) => (*/}
                    {/*                <div key={index} className="space-y-1">*/}
                    {/*                    <div className="flex items-start justify-between">*/}
                    {/*                        <h4 className="font-medium text-sm">{a.title}</h4>*/}
                    {/*                    </div>*/}
                    {/*                    <p className="text-xs text-muted-foreground">{getCategoryName(a.addition_category_id)}</p>*/}
                    {/*                    <p className="text-xs text-muted-foreground truncate">{a.description}</p>*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}
                    {/*)}*/}
                </div>

                {/* Right Column */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Experience */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Briefcase className="h-6 w-6" />
                                Опыт работы
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {data.experiences.map((exp, index) => (
                                <div key={index} className="relative">
                                    {index > 0 && <Separator className="mb-6" />}
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">{exp.job_title}</h3>
                                                <p className="font-medium text-primary">
                                                    {exp.company_name} {exp.company_address ? `- ${exp.company_address}` : ''}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {exp.start_date} - {exp.end_date ?? 'Настоящее время'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <GraduationCap className="h-6 w-6" />
                                Образование
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index} className="space-y-2">
                                    {index > 0 && <Separator className="mb-4" />}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">{edu.degree}</h3>
                                            <p className="font-medium text-primary">{edu.institution}</p>
                                        </div>
                                        <Badge variant="outline">
                                            {edu.start_year} - {edu.end_year ?? 'Настоящее время'}
                                        </Badge>
                                    </div>
                                    {edu.description && <p className="text-sm text-muted-foreground">{edu.description}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Projects */}
                    {/*{data.projects && data.projects.length > 0 && (*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader>*/}
                    {/*            <CardTitle className="flex items-center gap-2 text-xl">*/}
                    {/*                <Award className="h-6 w-6" />*/}
                    {/*                Проекты*/}
                    {/*            </CardTitle>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardContent className="space-y-6">*/}
                    {/*            {data.projects.map((project, index) => (*/}
                    {/*                <div key={index} className="space-y-3">*/}
                    {/*                    {index > 0 && <Separator className="mb-6" />}*/}
                    {/*                    <div className="flex justify-between items-start">*/}
                    {/*                        <h3 className="text-lg font-semibold">{project.name}</h3>*/}
                    {/*                        {project.link && (*/}
                    {/*                            <Button variant="outline" size="sm" asChild>*/}
                    {/*                                <a href={project.link} target="_blank" rel="noopener noreferrer">*/}
                    {/*                                    <ExternalLink className="h-4 w-4 mr-2" />*/}
                    {/*                                    Посмотреть*/}
                    {/*                                </a>*/}
                    {/*                            </Button>*/}
                    {/*                        )}*/}
                    {/*                    </div>*/}
                    {/*                    <p className="text-muted-foreground text-sm">{project.description}</p>*/}
                    {/*                    <div className="flex flex-wrap gap-2">*/}
                    {/*                        {project.technologies.map((tech, techIndex) => (*/}
                    {/*                            <Badge key={techIndex} variant="secondary" className="text-xs">*/}
                    {/*                                {tech}*/}
                    {/*                            </Badge>*/}
                    {/*                        ))}*/}
                    {/*                    </div>*/}
                    {/*                    {project.achievements && project.achievements.length > 0 && (*/}
                    {/*                        <ul className="list-disc list-inside space-y-1">*/}
                    {/*                            {project.achievements.map((achievement, achIndex) => (*/}
                    {/*                                <li key={achIndex} className="text-sm text-muted-foreground">*/}
                    {/*                                    {achievement}*/}
                    {/*                                </li>*/}
                    {/*                            ))}*/}
                    {/*                        </ul>*/}
                    {/*                    )}*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
    );
}
