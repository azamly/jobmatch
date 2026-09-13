import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import {
    File as FileIcon,
    FileText,
    Image as ImageIcon,
    X,
    Upload,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Download,
    Sparkles,
    Check,
    Loader2,
    Eye
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileCompleteness } from '@/types/employer';
import { JobSeekerProfile } from '@/types/jobseeker';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Загрузка резюме (CV)',
        href: '/settings/jobseeker',
    },
];

interface CVFileInfo {
    id: number;
    name: string;
    size: number;
    path: string;
    created_at: string;
    mime_type?: string;
}

interface Props {
    profile?: JobSeekerProfile | null;
    completeness?: ProfileCompleteness | null;
    cvFile?: CVFileInfo | null;
    industries?: { id: number; name: string; slug: string }[];
}

export default function CvUpload({ profile, completeness, cvFile, industries = [] }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [extractedData, setExtractedData] = useState<any | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Валидация размера (макс 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Файл слишком большой. Максимальный размер 10 МБ.');
            e.target.value = '';
            return;
        }

        setSelectedFile(file);
        // Запуск автоматического анализа резюме
        uploadAndAnalyze(file);
    };

    const uploadAndAnalyze = async (file: File) => {
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(route('jobseeker.analyze-cv'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            const data = await res.json();
            if (data.success && data.extracted) {
                setExtractedData(data.extracted);
                setShowConfirmModal(true);
                toast.success('Резюме успешно проанализировано AI!');
            } else {
                toast.error(data.message || 'Ошибка анализа резюме');
            }
        } catch (error) {
            toast.error('Произошла ошибка при загрузке и анализе файла');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApplyExtractedToProfile = () => {
        if (!extractedData) return;
        setIsApplying(true);

        router.post(
            route('jobseeker.apply-cv'),
            extractedData,
            {
                onSuccess: () => {
                    setIsApplying(false);
                    setShowConfirmModal(false);
                    toast.success('Данные успешно добавлены в ваш профиль!');
                },
                onError: () => {
                    setIsApplying(false);
                    toast.error('Ошибка сохранения данных в профиль');
                },
            }
        );
    };

    const handleDeleteCv = () => {
        if (!confirm('Вы уверены, что хотите удалить файл резюме?')) return;

        router.delete(route('jobseeker.cv-file.delete'), {
            onSuccess: () => {
                toast.success('Файл резюме удалён');
            },
            onError: () => toast.error('Ошибка удаления файла'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Загрузка резюме (CV)" />

            <SettingsLayout size="4xl">
                <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <HeadingSmall
                            title="Загрузка резюме (CV)"
                            description="Загрузите ваше резюме в любом формате. Наша система автоматически извлечет данные и подберет лучшие вакансии."
                        />
                        <Button variant="outline" asChild className="shrink-0">
                            <Link href="/settings/jobseeker/edit">
                                <FileText className="mr-2 h-4 w-4" />
                                Редактировать вручную
                            </Link>
                        </Button>
                    </div>

                    {/* Profile Completeness Card */}
                    {completeness && (
                        <Card className="border border-border/80 bg-muted/20">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-base font-bold">
                                            Заполненность профиля: {completeness.percentage}%
                                        </CardTitle>
                                    </div>
                                    <Badge variant={completeness.is_complete ? "default" : "secondary"}>
                                        {completeness.percentage}%
                                    </Badge>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2.5 mt-2 overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            completeness.percentage >= 80 ? "bg-emerald-500" : completeness.percentage >= 50 ? "bg-blue-500" : "bg-amber-500"
                                        )}
                                        style={{ width: `${completeness.percentage}%` }}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                                    {completeness.checklist.map((item) => (
                                        <div
                                            key={item.key}
                                            className={cn(
                                                "flex items-center gap-2 p-2 rounded-md border",
                                                item.completed
                                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                                            )}
                                        >
                                            {item.completed ? (
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                                            )}
                                            <span className="truncate">{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current Uploaded CV File Section */}
                    {cvFile ? (
                        <Card className="border border-border/80">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" /> Текущий файл резюме
                                </CardTitle>
                                <CardDescription>Этот файл используется для подтверждения квалификации и поиска работы</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-muted/40 border">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                            <FileIcon className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate text-foreground">{cvFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(cvFile.size)} • Загружен {cvFile.created_at}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={cvFile.path} target="_blank" rel="noreferrer">
                                                <Download className="h-4 w-4 mr-1.5" /> Скачать
                                            </a>
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDeleteCv}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1.5" /> Удалить
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* Upload New CV Box */}
                    <Card className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                            <div className="p-4 rounded-full bg-primary/10 text-primary">
                                {isAnalyzing ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : (
                                    <Upload className="h-8 w-8" />
                                )}
                            </div>

                            <div className="space-y-1 max-w-sm">
                                <h3 className="font-semibold text-lg text-foreground">
                                    {isAnalyzing ? 'Анализируем ваше резюме...' : 'Загрузите резюме (CV)'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Поддерживаются форматы: PDF, DOCX, DOC, TXT, а также фото резюме (PNG, JPG, JPEG)
                                </p>
                            </div>

                            <input
                                type="file"
                                id="cv-upload-input"
                                className="hidden"
                                accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
                                onChange={handleFileSelect}
                                disabled={isAnalyzing}
                            />

                            <Button asChild disabled={isAnalyzing} className="cursor-pointer">
                                <label htmlFor="cv-upload-input">
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Обработка...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" /> {cvFile ? 'Заменить файл CV' : 'Выбрать файл'}
                                        </>
                                    )}
                                </label>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Extracted Data Preview & Confirmation Modal */}
                <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-lg">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Данные, извлеченные из резюме
                            </DialogTitle>
                            <DialogDescription>
                                Система распознала следующую информацию. Подтвердите добавление данных в ваш профиль.
                            </DialogDescription>
                        </DialogHeader>

                        {extractedData && (
                            <div className="space-y-4 py-2 text-sm">
                                {/* Name and profession */}
                                <div className="p-3 rounded-lg bg-muted/50 border space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase">Основная информация:</span>
                                    <p className="font-bold text-foreground">
                                        {(extractedData.profile?.first_name || '') + ' ' + (extractedData.profile?.last_name || '') || 'Имя не указано'}
                                    </p>
                                    {extractedData.profile?.summary && (
                                        <p className="text-xs text-muted-foreground line-clamp-3">
                                            {extractedData.profile.summary}
                                        </p>
                                    )}
                                </div>

                                {/* Skills */}
                                {extractedData.skills && extractedData.skills.length > 0 && (
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase">Найденные навыки:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {extractedData.skills.map((s: any, idx: number) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                    ✓ {s.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience */}
                                {extractedData.experiences && extractedData.experiences.length > 0 && (
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase">Опыт работы:</span>
                                        <div className="space-y-2">
                                            {extractedData.experiences.map((exp: any, idx: number) => (
                                                <div key={idx} className="p-2.5 rounded border bg-card text-xs space-y-0.5">
                                                    <p className="font-semibold text-foreground">{exp.job_title} — {exp.company_name}</p>
                                                    {exp.description && (
                                                        <p className="text-muted-foreground line-clamp-2">{exp.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {extractedData.education && extractedData.education.length > 0 && (
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase">Образование:</span>
                                        <div className="space-y-2">
                                            {extractedData.education.map((edu: any, idx: number) => (
                                                <div key={idx} className="p-2.5 rounded border bg-card text-xs space-y-0.5">
                                                    <p className="font-semibold text-foreground">{edu.degree} {edu.field_of_study}</p>
                                                    <p className="text-muted-foreground">{edu.institution} ({edu.start_year || ''} - {edu.end_year || ''})</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isApplying}
                            >
                                Отмена
                            </Button>
                            <Button
                                onClick={handleApplyExtractedToProfile}
                                disabled={isApplying}
                            >
                                {isApplying ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" /> Применить к профилю (Add to Profile)
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SettingsLayout>
        </AppLayout>
    );
}
