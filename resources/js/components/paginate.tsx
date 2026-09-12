import React from 'react';
import { Button } from '@/components/ui/button';
import { PaginationLink, VacancyPagination } from '@/types/employer';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginateProps {
    data: VacancyPagination;
}

const Paginate: React.FC<PaginateProps> = ({ data }) => {
    if (!data || !data.links) return null;

    const totalPages = data.last_page;
    const currentPage = data.current_page;

    const goForward10 = Math.min(currentPage + 10, totalPages);
    const goBack10 = Math.max(currentPage - 10, 1);

    if (!data || !data.links || !data.data || data.data.length === 0) {
        return null;
    }



    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Кнопка -10 */}
            {currentPage > 10 && (
                <Link
                    href={data.path + `?page=${goBack10}`}
                    className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </Link>
            )}

            {data.links.map((link: PaginationLink, index: number) => {
                let content: React.ReactNode = <span dangerouslySetInnerHTML={{ __html: link.label }} />;

                // Заменяем Previous и Next на стрелки
                if (link.label === '&laquo;' || link.label.toLowerCase().includes('previous')) {
                    content = <ChevronLeft className="w-4 h-4" />;
                } else if (link.label === '&raquo;' || link.label.toLowerCase().includes('next')) {
                    content = <ChevronRight className="w-4 h-4" />;
                }

                return link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-1 border rounded-md ${
                            link.active
                                ? 'bg-primary text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
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

            {/* Кнопка +10 */}
            {currentPage + 10 <= totalPages && (
                <Link
                    href={data.path + `?page=${goForward10}`}
                    className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                    <ChevronsRight className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
};

export default Paginate;
