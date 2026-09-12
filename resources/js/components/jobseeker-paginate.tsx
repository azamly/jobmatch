//
//
// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { JobSeekerPagination } from '@/types/jobseeker';
// import { PaginationLink, RecommendedPagination, VacancyPagination } from '@/types/employer';
// import { Link, usePage } from '@inertiajs/react';
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
//
// type Pagination = JobSeekerPagination | RecommendedPagination | VacancyPagination;
//
// interface PaginateProps {
//     data: Pagination & { tab?: string }; // Добавляем tab в тип
// }
//
// const JobseekerPaginate: React.FC<PaginateProps> = ({ data }) => {
//     // Получаем текущие фильтры из usePage
//     const { filters } = usePage<{ filters: { search?: string; industry?: string | null } }>().props;
//
//     if (!data || !data.links || !data.data || data.data.length === 0) {
//         return null;
//     }
//
//     const totalPages = data.last_page;
//     const currentPage = data.current_page;
//
//     const goForward10 = Math.min(currentPage + 10, totalPages);
//     const goBack10 = Math.max(currentPage - 10, 1);
//
//     // Функция для формирования URL с сохранением текущих параметров
//     const buildUrl = (page: number | string) => {
//         const params = new URLSearchParams();
//         params.set('page', page.toString());
//
//         // Сохраняем текущие фильтры
//         if (filters?.search) {
//             params.set('search', filters.search);
//         }
//         if (filters?.industry) {
//             params.set('industry', filters.industry);
//         }
//
//         // Добавляем параметр tab, если он присутствует
//         if (data.tab) {
//             params.set('tab', data.tab);
//         }
//
//         return `${data.path}?${params.toString()}`;
//     };
//
//     return (
//         <div className="flex flex-wrap items-center gap-2">
//             {/* Кнопка -10 */}
//             {currentPage > 10 && (
//                 <Link
//                     href={buildUrl(goBack10)}
//                     className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     preserveState
//                     preserveScroll
//                 >
//                     <ChevronsLeft className="w-4 h-4" />
//                 </Link>
//             )}
//
//             {data.links.map((link: PaginationLink, index: number) => {
//                 let content: React.ReactNode = link.label;
//
//                 // Заменяем Previous и Next на стрелки
//                 if (link.label === '&laquo;' || link.label.toLowerCase().includes('previous')) {
//                     content = <ChevronLeft className="w-4 h-4" />;
//                 } else if (link.label === '&raquo;' || link.label.toLowerCase().includes('next')) {
//                     content = <ChevronRight className="w-4 h-4" />;
//                 }
//
//                 const pageNumber = link.label === '&laquo;' || link.label.toLowerCase().includes('previous')
//                     ? currentPage - 1
//                     : link.label === '&raquo;' || link.label.toLowerCase().includes('next')
//                         ? currentPage + 1
//                         : parseInt(link.label);
//
//                 return link.url && !isNaN(pageNumber) ? (
//                     <Link
//                         key={index}
//                         href={buildUrl(pageNumber)}
//                         className={`px-3 py-1 border rounded-md ${
//                             link.active
//                                 ? 'bg-primary text-white border-blue-600'
//                                 : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
//                         }`}
//                         preserveState
//                         preserveScroll
//                     >
//                         {content}
//                     </Link>
//                 ) : (
//                     <Button
//                         key={index}
//                         disabled
//                         className="px-3 py-1 border rounded-md bg-gray-100 text-gray-400 border-gray-300"
//                     >
//                         {content}
//                     </Button>
//                 );
//             })}
//
//             {/* Кнопка +10 */}
//             {currentPage + 10 <= totalPages && (
//                 <Link
//                     href={buildUrl(goForward10)}
//                     className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     preserveState
//                     preserveScroll
//                 >
//                     <ChevronsRight className="w-4 h-4" />
//                 </Link>
//             )}
//         </div>
//     );
// };
//
// export default JobseekerPaginate;

import React from 'react';
import { Button } from '@/components/ui/button';
import { JobSeekerPagination } from '@/types/jobseeker';
import { PaginationLink, RecommendedPagination, VacancyPagination } from '@/types/employer';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type Pagination = JobSeekerPagination | RecommendedPagination | VacancyPagination;

interface PaginateProps {
    data: Pagination & { tab?: string };
}

const JobseekerPaginate: React.FC<PaginateProps> = ({ data }) => {
    const { filters } = usePage<{ filters: { search?: string; industry?: string | null; vacancy?: string | null } }>().props;

    if (!data || !data.links || !data.data || data.data.length === 0) {
        return null;
    }

    const totalPages = data.last_page;
    const currentPage = data.current_page;

    const goForward10 = Math.min(currentPage + 10, totalPages);
    const goBack10 = Math.max(currentPage - 10, 1);

    const buildUrl = (page: number | string) => {
        const params = new URLSearchParams();
        params.set('page', page.toString());

        if (filters?.search) {
            params.set('search', filters.search);
        }
        if (filters?.industry) {
            params.set('industry', filters.industry);
        }
        if (filters?.vacancy) {
            params.set('vacancy', filters.vacancy); // Добавляем vacancy
        }
        if (data.tab) {
            params.set('tab', data.tab);
        }

        return `${data.path}?${params.toString()}`;
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {currentPage > 10 && (
                <Link
                    href={buildUrl(goBack10)}
                    className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    preserveState
                    preserveScroll
                >
                    <ChevronsLeft className="w-4 h-4" />
                </Link>
            )}

            {data.links.map((link: PaginationLink, index: number) => {
                let content: React.ReactNode = link.label;

                if (link.label === '&laquo;' || link.label.toLowerCase().includes('previous')) {
                    content = <ChevronLeft className="w-4 h-4" />;
                } else if (link.label === '&raquo;' || link.label.toLowerCase().includes('next')) {
                    content = <ChevronRight className="w-4 h-4" />;
                }

                const pageNumber = link.label === '&laquo;' || link.label.toLowerCase().includes('previous')
                    ? currentPage - 1
                    : link.label === '&raquo;' || link.label.toLowerCase().includes('next')
                        ? currentPage + 1
                        : parseInt(link.label);

                return link.url && !isNaN(pageNumber) ? (
                    <Link
                        key={index}
                        href={buildUrl(pageNumber)}
                        className={`px-3 py-1 border rounded-md ${
                            link.active
                                ? 'bg-primary text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                        preserveState
                        preserveScroll
                    >
                        {content}
                    </Link>
                ) : (
                    <Button
                        key={index}
                        disabled
                        className="px-3 py-1 border rounded-md bg-gray-100 text-gray-400 border-gray-300"
                    >
                        {content}
                    </Button>
                );
            })}

            {currentPage + 10 <= totalPages && (
                <Link
                    href={buildUrl(goForward10)}
                    className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    preserveState
                    preserveScroll
                >
                    <ChevronsRight className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
};

export default JobseekerPaginate;
