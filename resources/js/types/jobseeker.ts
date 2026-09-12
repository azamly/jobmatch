import { Application, PaginationLink } from '@/types/employer';
import { User } from '@/types/index';

export type Gender = 'male' | 'female' | 'unspecified';
export interface Industry {
    id:number
    name:string,
    slug:string
}
export interface JobSeekerProfile {
    id: number;
    user_id: number;
    user?:User;
    industry_id:number;
    industry?:Industry;
    first_name: string;
    last_name: string;
    middle_name?: string;
    birth_date?: string|undefined;
    gender?: Gender;
    location?: string;
    address?: string;
    summary?:string;
    education: Education[];
    experiences: Experience[];
    skills: Skill[];
    languages: Language[];
    additions: Addition[];
    links: Link[];
}
export interface JobSeekerProfileForm {
    id: number;
    user_id: number;
    industry_id:number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    birth_date?: string|undefined;
    gender?: Gender;
    location?: string;
    address?: string;
    summary?:string;
    education: Education[];
    experiences: Experience[];
    skills: Skill[];
    languages: Language[];
    additions: Addition[];
    links: Link[];
}

export interface BaseItem {
    id: number;
    sort_order: number;
}

export interface Education extends BaseItem {
    institution?: string;
    degree?: string;
    field_of_study?: string;
    start_year?: string;
    end_year?: string;
    description?: string;
}

export interface Experience extends BaseItem {
    job_title: string;
    company_name: string;
    company_address: string;
    start_date: string;
    end_date?: string;
    description?: string;
    is_current: boolean;
}

export interface Skill extends BaseItem {
    name: string;
    sort_order: number;
}
export interface Language extends BaseItem {
    name: string;
    language_proficiency_id: number;
}

export type AdditionCategory = 'achievement' | 'project' | 'diploma' | 'portfolio' | 'certificate' | 'resume';

export interface Addition extends BaseItem {
    addition_category_id: number;
    title: string;
    description: string;
}

export interface Link {
    id:number;
    url: string;
    type: string;
}

export interface JobSeekerPagination{
    data:JobSeekerProfile[],
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
