import type { BreadcrumbItem, SharedData } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { File, FileText, Image as ImageIcon, X, Upload, SaveIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useInitials } from '@/hooks/use-initials';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Настройки резюме (CV)',
        href: '/settings/jobseeker',
    },
];

// Определяем тип файла
function getFileType(file: File) {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (
        file.type === 'application/msword' ||
        file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
        return 'word';
    return 'unknown';
}

// Иконка в зависимости от типа
function FilePreviewIcon({ fileType }: { fileType: string }) {
    const iconClass = 'h-16 w-16 text-muted-foreground';

    switch (fileType) {
        case 'image':
            return <ImageIcon className={iconClass} />;
        case 'pdf':
            return <FileText className={iconClass} />;
        case 'word':
            return <File className={iconClass} />;
        default:
            return <File className={iconClass} />;
    }
}

export default function CvUpload() {
    const { auth } = usePage<SharedData>().props;
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const getInitials = useInitials();

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Проверка размера
        if (file.size > MAX_SIZE) {
            toast.error('Файл слишком большой. Максимум 5MB.');
            e.target.value = '';
            return;
        }

        const type = getFileType(file);
        if (type === 'unknown') {
            toast.error('Неподдерживаемый формат файла.');
            e.target.value = '';
            return;
        }

        setFileName(file.name);

        if (type === 'image') {
            const objectUrl = URL.createObjectURL(file);
            setFilePreview(objectUrl);
            setFileType('image');
        } else {
            // Для PDF и Word — используем иконку
            setFilePreview(URL.createObjectURL(file)); // Можно оставить ссылку, но не отображать как изображение
            setFileType(type);
        }
    };

    const handleCancel = () => {
        if (filePreview) {
            URL.revokeObjectURL(filePreview);
        }
        setFilePreview(null);
        setFileType(null);
        setFileName(null);
        const input = document.getElementById('cv-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handleDeleteAvatar = () => {
        router.delete(route('profile.avatar.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Аватар профиля успешно удалён');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Информация о резюме"
                        description="Загружайте и редактируйте ваше резюме"
                    />
                    <Form
                        method="post"
                        action={route('jobseeker.store')}
                        encType="multipart/form-data"
                        options={{
                            preserveScroll: true
                        }}
                        onSuccess={()=>{
                            // setFilePreview(null);
                            toast.success("Файл успешно обработон")
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="flex flex-col space-y-6 md:flex-row md:items-center md:space-x-6 md:space-y-0">
                                    {/* Превью файла */}
                                    <div className="flex flex-col items-center space-y-4">
                                        {filePreview ? (
                                            <button
                                                type="button"
                                                onClick={() => window.open(filePreview, '_blank')}
                                                className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border bg-muted transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                                                aria-label="Просмотреть файл"
                                            >
                                                {fileType === 'image' ? (
                                                    <img
                                                        src={filePreview}
                                                        alt="CV Preview"
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <FilePreviewIcon fileType={fileType ?? 'word'} />
                                                )}
                                            </button>
                                        ) : (
                                            <></>
                                        )}

                                        {/* Имя файла */}
                                        {fileName && (
                                            <button
                                                type="button"
                                                onClick={() => window.open(filePreview ?? undefined, '_blank')}
                                                className="truncate text-sm font-medium text-primary underline hover:no-underline focus:outline-none"
                                            >
                                                {fileName}
                                            </button>
                                        )}
                                    </div>

                                    {/* Кнопки управления */}
                                    <div className="flex flex-col space-y-2">
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf,.docx"
                                            className="hidden"
                                            name="file"
                                            id="cv-upload"
                                            onChange={handleFileChange}
                                        />

                                        {!filePreview ? (
                                            <div className="flex space-x-2">
                                                <Button asChild variant="outline">
                                                    <label
                                                        htmlFor="cv-upload"
                                                        className="flex cursor-pointer items-center"
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Загрузить резюме
                                                    </label>
                                                </Button>

                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Button asChild variant="outline">
                                                    <label
                                                        htmlFor="cv-upload"
                                                        className="flex cursor-pointer items-center"
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Изменить
                                                    </label>
                                                </Button>
                                                <Button variant="destructive" onClick={handleCancel}>
                                                    <X className="h-4 w-4" />
                                                    Отмена
                                                </Button>
                                            </div>
                                        )}

                                        <p className="text-sm text-muted-foreground truncate" title={"PDF,DOCX,DOC,TXT,IMAGE до 5МБ"}>
                                            PDF, DOCX, DOC, TXT, IMAGE  до 5MB
                                        </p>
                                    </div>
                                </div>
                                {errors.file}
                                <div className="flex items-center gap-4">
                                    <Button type='submit' disabled={processing}> {!processing ? <SaveIcon /> : <Loader2Icon className="animate-spin" />}
                                        {processing ? 'Сохранение...' : 'Сохранить'}</Button>
                                    {/*<Transition*/}
                                    {/*    show={recentlySuccessful}*/}
                                    {/*    enter="transition ease-in-out"*/}
                                    {/*    enterFrom="opacity-0"*/}
                                    {/*    leave="transition ease-in-out"*/}
                                    {/*    leaveTo="opacity-0"*/}
                                    {/*>*/}
                                    {/*    <p className="text-sm text-foreground">Сохранено</p>*/}
                                    {/*</Transition>*/}
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
