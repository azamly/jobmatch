import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, DollarSign, Clock } from "lucide-react"
import { Application } from "@/types/employer"
import { getApplicationStatus, getVacancyType } from "@/lib/employer.data"
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@inertiajs/react';

interface Props {
    application: Application | null
    open: boolean
    onClose: () => void
}

export default function ApplicationDetailsModal({ application, open, onClose }: Props) {
    if (!application) return null

    const employerName =
        application.vacancy.employer?.company_name?.trim() || "Индивидуально"

    const salaryMoney =
        application.vacancy.salary_start > 0 && application.vacancy.salary_end > 0

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{application.vacancy.title}</DialogTitle>
                    <DialogDescription>
                        Статус:{" "}
                        <Badge variant="outline">
                            {getApplicationStatus(application.status ?? "")}
                        </Badge>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Основная информация */}
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {employerName}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {application.vacancy.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            {application.vacancy.salary_type === "money"
                                ? salaryMoney
                                    ? `${application.vacancy.salary_start} - ${application.vacancy.salary_end} смн.`
                                    : "Договорённость"
                                : "Договорённость"}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {getVacancyType(application.vacancy.type)}
                        </div>
                        <Link href={route('vacancies.more',application.vacancy.id)} className={'text-primary'}>Подробнее</Link>
                    </div>
                    <div className="space-y-4 mt-4">
                        {/* Описание */}
                        {application.description && (
                            <div className="mt-4">
                                <h4 className="font-semibold mb-1">Ваше сообщение:</h4>
                                <Textarea value={application.description ?? ''} disabled={true} />
                            </div>
                        )}

                    </div>

                    {/* Дата подачи */}
                    <p className="text-xs text-muted-foreground">
                        Подано:{" "}
                        {new Date(application.created_at).toLocaleDateString("ru-RU")}
                    </p>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} variant="outline">
                        Закрыть
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
