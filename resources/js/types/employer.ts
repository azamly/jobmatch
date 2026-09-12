import { JobSeekerProfile } from '@/types/jobseeker';

export interface Employer {
    id:number,
    type:"individual"|"company",
    company_name?:string,
    company_address?:string,
    company_website?:string,
    description?:string,
    contact_email?:string,
    contact_phone?:string,
}

export interface Vacancy {
    id:number
    title:string
    industry_id?:number
    salary_type:"money"|"accord"
    salary_start:number
    salary_end:number
    location:string
    description?:string
    benefits?:string
    responsibility?:string
    qualifications?:string
    experience?:string
    education?:string
    skills:string[]
    type:"full"|"part"|"remote"|"contract"|"internship"|"temporary"
    status:"active"|"inactive"
    created_at:Date
}

export interface VacancyWithEmployer extends Vacancy{
    employer?:Employer,
    isFavorite?:boolean,
    views_count?:number,
    conversions?:number,
    applications_count?:number
}

export interface VacancyPagination {
    data:VacancyWithEmployer[],
    links:PaginationLink[],
    current_page:number,
    from:number,
    first_page_url:string,
    last_page:number,
    last_page_url:string,
    next_page_url?:string,
    path:string,
    per_page:number,
    prev_page_url?:string,
    to:number,
    total:number
}

export interface PaginationLink{
    active:boolean,
    label:string,
    page?:number,
    url?:string,
}

export interface VacancyApply {
    description: string
    status?: string
    salary_exception?: number
    get_to_work?: string   // 👈 добавить null
}

export interface Application extends VacancyApply{
    id:number,
    created_at:Date,
    vacancy_id:number
    vacancy:VacancyWithEmployer
    jobseeker:JobSeekerProfile
}

export interface ApplicationPagination{
    data:Application[],
    links:PaginationLink[],
    current_page:number,
    from:number,
    first_page_url:string,
    last_page:number,
    last_page_url:string,
    next_page_url?:string,
    path:string,
    per_page:number,
    prev_page_url?:string,
    to:number,
    total:number
}
export interface Recommended{
    job_seeker_profile_id:number,
    vacancy_id:number,
    id:number,
    score:number,
    vacancy:VacancyWithEmployer,
    jobseeker:JobSeekerProfile
}

export interface RecommendedPagination{
    data:Recommended[],
    links:PaginationLink[],
    current_page:number,
    from:number,
    first_page_url:string,
    last_page:number,
    last_page_url:string,
    next_page_url?:string,
    path:string,
    per_page:number,
    prev_page_url?:string,
    to:number,
    total:number
}
