import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import JobSeekerDashboard from '@/components/jobseeker/dashboard';
import EmployerDashboard from '@/components/employer/dashboard';
import { Recommended, RecommendedPagination, Vacancy, VacancyPagination, VacancyWithEmployer } from '@/types/employer';
import { JobSeekerPagination, JobSeekerProfile } from '@/types/jobseeker';
import { useEcho } from '@laravel/echo-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Панель управления',
        href: '/dashboard',
    },
];

interface JobseekerProps {
    role: "jobseeker"
    jobseeker: JobSeekerProfile
    hasJobSeeker: boolean
    vacancies: VacancyPagination
    recommended:RecommendedPagination,
    totalCountApplication: number,
    totalCountViews: number,
    totalCountAllVacancies:number,
    totalCountRecommendedVacancies:number,
}

interface EmployerProps {
    role: "employer"
    jobseekers: JobSeekerPagination
    recommended:RecommendedPagination
}

type Props = JobseekerProps | EmployerProps

export default function Dashboard(props: Props) {
    if (props.role === "jobseeker") {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Панель управления" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <JobSeekerDashboard
                        jobseeker={props.jobseeker}
                        hasJobSeeker={props.hasJobSeeker}
                        vacancies={props.vacancies}
                        totalCountApplication={props.totalCountApplication}
                        totalCountViews = {props.totalCountViews}
                        recommended={props.recommended}
                        totalCountAllVacancies={props.totalCountAllVacancies}
                        totalCountRecommendedVacancies={props.totalCountRecommendedVacancies}
                    />
                </div>
            </AppLayout>
        )
    } else if (props.role === "employer" && props.jobseekers) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Панель управления" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <EmployerDashboard jobseekers={props.jobseekers} recommended={props.recommended} />
                </div>
            </AppLayout>
        )
    } else {
        return <div>Нет данных для отображения</div>
    }
}

