// //
// // import { AnalyticsCard } from '@/components/jobseeker/analytics-card';
// // import { Link, usePage, router } from '@inertiajs/react';
// // import { Button } from '@/components/ui/button';
// // import {
// //     Building,
// //     ChevronLeft,
// //     ChevronRight,
// //     ChevronsLeft,
// //     ChevronsRight,
// //     Clock,
// //     DollarSign,
// //     Eye,
// //     Heart,
// //     Inbox,
// //     Loader2,
// //     MapPin,
// //     Plus,
// //     Search,
// //     SlidersHorizontal
// // } from 'lucide-react';
// // import { motion } from 'framer-motion';
// // import React, { useState, useEffect, useCallback } from 'react';
// // import { debounce } from 'lodash';
// // import {
// //     PaginationLink,
// //     Recommended,
// //     RecommendedPagination,
// //     Vacancy,
// //     VacancyPagination,
// //     VacancyWithEmployer
// // } from '@/types/employer';
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// // import { CVViewer } from '@/components/jobseeker/cv-viewer';
// // import { JobSeekerProfile } from '@/types/jobseeker';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// // import { getVacancyType } from '@/lib/employer.data';
// // import { Badge } from '@/components/ui/badge';
// // import Paginate from '@/components/paginate';
// // import { cn } from '@/lib/utils';
// // import VacancyCard from '@/components/jobseeker/vacancy-card';
// // import { SharedData } from '@/types';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { Slider } from '@/components/ui/slider';
// // import { toast } from 'sonner';
// //
// // interface FilterState {
// //     search: string;
// //     location: string;
// //     jobType: string[];
// //     salaryRange: [number, number];
// //     skills: string[];
// //     sortBy: string;
// // }
// //
// // export default function JobSeekerDashboard({
// //                                                jobseeker,
// //                                                hasJobSeeker,
// //                                                vacancies,
// //                                                totalCountApplication = 0,
// //                                                recommended
// //                                            }: {
// //     jobseeker: JobSeekerProfile;
// //     hasJobSeeker: boolean;
// //     vacancies: VacancyPagination;
// //     totalCountApplication: number;
// //     recommended: RecommendedPagination;
// // }) {
// //     const [showCVPreview, setShowCVPreview] = useState(false);
// //     const { auth, filters } = usePage<SharedData & { filters: FilterState }>().props;
// //     const totalPages = recommended.last_page;
// //     const currentPage = recommended.current_page;
// //
// //     // Initialize state with fallback to avoid undefined errors
// //     const [searchTerm, setSearchTerm] = useState<string>(filters?.search || '');
// //     const [savedJobs, setSavedJobs] = useState<number[]>([]);
// //     const [showFilters, setShowFilters] = useState(false);
// //     const [activeFilters, setActiveFilters] = useState<FilterState>({
// //         search: filters?.search || '',
// //         location: filters?.location || '',
// //         jobType: filters?.jobType || [],
// //         salaryRange: filters?.salaryRange && Array.isArray(filters.salaryRange) && filters.salaryRange.length === 2
// //             ? filters.salaryRange
// //             : [0, 100000],
// //         skills: filters?.skills || [],
// //         sortBy: filters?.sortBy || 'relevance',
// //     });
// //     const [isSearching, setIsSearching] = useState(false);
// //
// //     // Debounced function to update URL with filters
// //     const updateFilters = useCallback(
// //         debounce((filters: FilterState) => {
// //             // Convert filters to a plain object for Inertia
// //             const params: Record<string, any> = {};
// //             if (filters.search) params.search = filters.search;
// //             if (filters.location) params.location = filters.location;
// //             if (filters.jobType.length) params.jobType = filters.jobType;
// //             if (filters.salaryRange) params.salaryRange = filters.salaryRange;
// //             if (filters.skills.length) params.skills = filters.skills;
// //             params.sortBy = filters.sortBy;
// //
// //             router.get(route('dashboard'), params, {
// //                 preserveState: true,
// //                 preserveScroll: true,
// //                 onSuccess: () => {
// //                     toast.success('Фильтры и поиск применены');
// //                 },
// //                 onError: () => {
// //                     toast.error('Ошибка при применении фильтров или поиска');
// //                 }
// //             });
// //         }, 300),
// //         []
// //     );
// //
// //     // Sync filters with URL
// //     useEffect(() => {
// //         // Update filters with searchTerm included
// //         const updatedFilters = { ...activeFilters, search: searchTerm };
// //         updateFilters(updatedFilters);
// //         // Cleanup debounce on unmount
// //         return () => {
// //             updateFilters.cancel();
// //         };
// //     }, [searchTerm, activeFilters, updateFilters]);
// //
// //     const hasActiveFilters = () => {
// //         return (
// //             activeFilters.search ||
// //             activeFilters.location ||
// //             activeFilters.jobType.length > 0 ||
// //             activeFilters.skills.length > 0 ||
// //             activeFilters.salaryRange[0] !== 0 ||
// //             activeFilters.salaryRange[1] !== 100000 ||
// //             activeFilters.sortBy !== 'relevance'
// //         );
// //     };
// //
// //     const handleResetFilters = () => {
// //         const resetFilters = {
// //             search: '',
// //             location: '',
// //             jobType: [],
// //             salaryRange: [0, 100000] as [number, number],
// //             skills: [],
// //             sortBy: 'relevance',
// //         };
// //         setActiveFilters(resetFilters);
// //         setSearchTerm('');
// //         updateFilters(resetFilters); // Immediately apply reset
// //         toast.info('Фильтры и поиск сброшены');
// //     };
// //
// //     const handleApplyFilters = (filters: FilterState) => {
// //         setActiveFilters(filters);
// //         setShowFilters(false);
// //         updateFilters(filters);
// //         toast.success('Фильтры применены');
// //     };
// //
// //     const goForward10 = Math.min(currentPage + 10, totalPages);
// //     const goBack10 = Math.max(currentPage - 10, 1);
// //
// //     // Common filter and search UI
// //     const renderFilterUI = (dataLength: number) => (
// //         <>
// //             {/* Search and Filter Bar */}
// //             <div className="flex gap-4">
// //                 <div className="relative flex-1">
// //                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
// //                     <Input
// //                         placeholder="Поиск вакансий по названию, компании или навыкам..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         className="pl-10"
// //                     />
// //                 </div>
// //                 <Dialog open={showFilters} onOpenChange={setShowFilters}>
// //                     <DialogTrigger asChild>
// //                         <Button
// //                             variant="outline"
// //                             className={hasActiveFilters() ? 'border-primary text-primary' : ''}
// //                         >
// //                             <SlidersHorizontal className="h-4 w-4 mr-2" />
// //                             Фильтры
// //                             {hasActiveFilters() && (
// //                                 <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
// //                                     !
// //                                 </Badge>
// //                             )}
// //                         </Button>
// //                     </DialogTrigger>
// //                     <DialogContent>
// //                         <DialogHeader>
// //                             <DialogTitle>Фильтры вакансий</DialogTitle>
// //                         </DialogHeader>
// //                         <div className="space-y-4">
// //                             <div>
// //                                 <Label>Местоположение</Label>
// //                                 <Input
// //                                     value={activeFilters.location}
// //                                     onChange={(e) =>
// //                                         setActiveFilters({ ...activeFilters, location: e.target.value })
// //                                     }
// //                                     placeholder="Введите город или регион"
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <Label>Тип занятости</Label>
// //                                 <div className="flex flex-wrap gap-2">
// //                                     {['full', 'part', 'remote', 'contract', 'internship', 'temporary'].map(
// //                                         (type) => (
// //                                             <Button
// //                                                 key={type}
// //                                                 variant={
// //                                                     activeFilters.jobType.includes(type)
// //                                                         ? 'default'
// //                                                         : 'outline'
// //                                                 }
// //                                                 onClick={() =>
// //                                                     setActiveFilters({
// //                                                         ...activeFilters,
// //                                                         jobType: activeFilters.jobType.includes(type)
// //                                                             ? activeFilters.jobType.filter((t) => t !== type)
// //                                                             : [...activeFilters.jobType, type],
// //                                                     })
// //                                                 }
// //                                             >
// //                                                 {getVacancyType(type)}
// //                                             </Button>
// //                                         )
// //                                     )}
// //                                 </div>
// //                             </div>
// //                             <div>
// //                                 <Label>Диапазон зарплаты</Label>
// //                                 <Slider
// //                                     value={activeFilters.salaryRange}
// //                                     onValueChange={(value: [number, number]) =>
// //                                         setActiveFilters({ ...activeFilters, salaryRange: value })
// //                                     }
// //                                     min={0}
// //                                     max={100000}
// //                                     step={500}
// //                                     defaultValue={[0, 100000]}
// //                                 />
// //                                 <div className="flex justify-between text-sm">
// //                                     <span>{activeFilters.salaryRange[0]} смн.</span>
// //                                     <span>100000 смн.</span>
// //                                 </div>
// //                             </div>
// //                             <div>
// //                                 <Label>Навыки</Label>
// //                                 <Input
// //                                     value={activeFilters.skills.join(',')}
// //                                     onChange={(e) =>
// //                                         setActiveFilters({
// //                                             ...activeFilters,
// //                                             skills: e.target.value
// //                                                 ? e.target.value.split(',').map((s) => s.trim()).filter(s => s)
// //                                                 : [],
// //                                         })
// //                                     }
// //                                     placeholder="Введите навыки через запятую"
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <Label>Сортировка</Label>
// //                                 <Select
// //                                     value={activeFilters.sortBy}
// //                                     onValueChange={(value) =>
// //                                         setActiveFilters({ ...activeFilters, sortBy: value })
// //                                     }
// //                                 >
// //                                     <SelectTrigger>
// //                                         <SelectValue placeholder="Выберите сортировку" />
// //                                     </SelectTrigger>
// //                                     <SelectContent>
// //                                         <SelectItem value="relevance">По релевантности</SelectItem>
// //                                         <SelectItem value="date">По дате</SelectItem>
// //                                         <SelectItem value="salary_high">По зарплате (убыв.)</SelectItem>
// //                                         <SelectItem value="salary_low">По зарплате (возр.)</SelectItem>
// //                                     </SelectContent>
// //                                 </Select>
// //                             </div>
// //                             <div className="flex gap-2">
// //                                 <Button onClick={() => handleApplyFilters(activeFilters)}>
// //                                     Применить
// //                                 </Button>
// //                                 <Button variant="outline" onClick={handleResetFilters}>
// //                                     Сбросить
// //                                 </Button>
// //                             </div>
// //                         </div>
// //                     </DialogContent>
// //                 </Dialog>
// //                 {hasActiveFilters() && (
// //                     <Button variant="ghost" onClick={handleResetFilters}>
// //                         Сбросить
// //                     </Button>
// //                 )}
// //             </div>
// //
// //             {/* Active Filters Display */}
// //             {hasActiveFilters() && (
// //                 <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
// //                     <span className="text-sm font-medium">Активные фильтры:</span>
// //                     {activeFilters.search && (
// //                         <Badge variant="secondary">Поиск: {activeFilters.search}</Badge>
// //                     )}
// //                     {activeFilters.location && (
// //                         <Badge variant="secondary">Локация: {activeFilters.location}</Badge>
// //                     )}
// //                     {activeFilters.jobType.map((type) => (
// //                         <Badge key={type} variant="secondary">
// //                             {getVacancyType(type)}
// //                         </Badge>
// //                     ))}
// //                     {activeFilters.salaryRange && (
// //                         <Badge variant="secondary">
// //                             Зарплата: {activeFilters.salaryRange[0]} - {activeFilters.salaryRange[1]} смн.
// //                         </Badge>
// //                     )}
// //                     {activeFilters.skills.map((skill) => (
// //                         <Badge key={skill} variant="secondary">
// //                             {skill}
// //                         </Badge>
// //                     ))}
// //                     <Badge variant="secondary">
// //                         Сортировка:{' '}
// //                         {activeFilters.sortBy === 'relevance'
// //                             ? 'По релевантности'
// //                             : activeFilters.sortBy === 'date'
// //                                 ? 'По дате'
// //                                 : activeFilters.sortBy === 'salary_high'
// //                                     ? 'По зарплате (убыв.)'
// //                                     : 'По зарплате (возр.)'}
// //                     </Badge>
// //                 </div>
// //             )}
// //
// //             {/* Results Count */}
// //             <div className="flex justify-between items-center">
// //                 <p className="text-sm text-muted-foreground">
// //                     Найдено {dataLength}{' '}
// //                     {dataLength === 1 ? 'вакансия' : 'вакансий'}
// //                 </p>
// //                 <div className="text-sm text-muted-foreground">
// //                     Сортировка:{' '}
// //                     {activeFilters.sortBy === 'relevance'
// //                         ? 'По релевантности'
// //                         : activeFilters.sortBy === 'date'
// //                             ? 'По дате'
// //                             : activeFilters.sortBy === 'salary_high'
// //                                 ? 'По зарплате (убыв.)'
// //                                 : 'По зарплате (возр.)'}
// //                 </div>
// //             </div>
// //         </>
// //     );
// //
// //     return (
// //         <>
// //             <div className="@container/main p-2 flex flex-1 flex-col gap-2">
// //                 <div className="flex flex-col gap-4 md:gap-6">
// //                     <AnalyticsCard totalCountApplication={totalCountApplication} totalCountMessages={0} totalCountViewProfile={0} />
// //                     <div className="flex items-center justify-between">
// //                         <span className="text-3xl font-bold">Вакансии</span>
// //                         {hasJobSeeker ? (
// //                             <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
// //                                 <DialogTrigger asChild>
// //                                     <Button variant="outline">
// //                                         <Eye className="h-4 w-4" />
// //                                         Просмотр резюме
// //                                     </Button>
// //                                 </DialogTrigger>
// //                                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
// //                                     <DialogHeader>
// //                                         <DialogTitle>Предпросмотр CV</DialogTitle>
// //                                     </DialogHeader>
// //                                     <CVViewer data={jobseeker} showActions={false} />
// //                                 </DialogContent>
// //                             </Dialog>
// //                         ) : (
// //                             <Link href={route('jobseeker.index')}>
// //                                 <Button>
// //                                     <Plus className="h-4 w-4" /> Заполнить резюме (CV)
// //                                 </Button>
// //                             </Link>
// //                         )}
// //                     </div>
// //                 </div>
// //                 <Tabs defaultValue="all">
// //                     <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
// //                         <TabsTrigger value="all">Все</TabsTrigger>
// //                         <TabsTrigger value="recommended">Рекомендованные</TabsTrigger>
// //                     </TabsList>
// //                     <TabsContent value="all" className="space-y-6">
// //                         {renderFilterUI(vacancies.data.length)}
// //                         {vacancies.data.length === 0 ? (
// //                             <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
// //                                 <Inbox className="h-16 w-16 text-muted-foreground" />
// //                                 <span>Пока нет вакансий</span>
// //                             </div>
// //                         ) : (
// //                             <>
// //                                 {vacancies.data.map((vacancy: VacancyWithEmployer,index) => (
// //                                     <VacancyCard key={index} vacancy={vacancy} />
// //                                 ))}
// //                                 <div className="mt-4 flex items-center justify-end">
// //                                     <Paginate data={vacancies} />
// //                                 </div>
// //                             </>
// //                         )}
// //                     </TabsContent>
// //                     <TabsContent value="recommended" className="space-y-6">
// //                         {renderFilterUI(recommended.data.length)}
// //                         {recommended.data.length === 0 ? (
// //                             <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
// //                                 <Inbox className="h-16 w-16 text-muted-foreground" />
// //                                 <span>Пока нет вакансий</span>
// //                                 <Link
// //                                     href={route('recommended.vacancy', jobseeker ? jobseeker.id : 0)}
// //                                     onClick={() => setIsSearching(true)}
// //                                 >
// //                                     <motion.button
// //                                         disabled={isSearching}
// //                                         whileTap={{ scale: 0.95 }}
// //                                         whileHover={{ scale: 1.05 }}
// //                                         animate={isSearching ? { rotate: 360 } : { rotate: 0 }}
// //                                         transition={{ type: 'spring', stiffness: 300, damping: 20 }}
// //                                         className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
// //                                     >
// //                                         {isSearching && (
// //                                             <span className="animate-spin inline-block">
// //                                                 <Loader2 />
// //                                             </span>
// //                                         )}
// //                                         Начать поиск
// //                                     </motion.button>
// //                                 </Link>
// //                             </div>
// //                         ) : (
// //                             <div className="space-y-6">
// //                                 <div className="flex items-center justify-end mt-4">
// //                                     <Link
// //                                         href={route('recommended.vacancy', jobseeker ? jobseeker.id : 0)}
// //                                         onClick={() => setIsSearching(true)}
// //                                     >
// //                                         <motion.button
// //                                             disabled={isSearching}
// //                                             whileTap={{ scale: 0.95 }}
// //                                             whileHover={{ scale: 1.05 }}
// //                                             animate={isSearching ? { rotate: 360 } : { rotate: 0 }}
// //                                             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
// //                                             className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
// //                                         >
// //                                             {isSearching && (
// //                                                 <span className="animate-spin inline-block">
// //                                                     <Loader2 />
// //                                                 </span>
// //                                             )}
// //                                             Начать поиск
// //                                         </motion.button>
// //                                     </Link>
// //                                 </div>
// //                                 {recommended.data.map((recommend: Recommended,index) => (
// //                                     <VacancyCard
// //                                         key={index}
// //                                         vacancy={recommend.vacancy}
// //                                         setScore={true}
// //                                         score={recommend.score}
// //                                     />
// //                                 ))}
// //                                 {recommended.data.length > 0 && (
// //                                     <div className="flex flex-wrap items-center gap-2 justify-end">
// //                                         {currentPage > 10 && (
// //                                             <Link
// //                                                 href={recommended.path + `?page=${goBack10}`}
// //                                                 className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
// //                                             >
// //                                                 <ChevronsLeft className="w-4 h-4" />
// //                                             </Link>
// //                                         )}
// //                                         {recommended.links.map((link: PaginationLink, index: number) => {
// //                                             let content: React.ReactNode = (
// //                                                 <span dangerouslySetInnerHTML={{ __html: link.label }} />
// //                                             );
// //                                             if (
// //                                                 link.label === '&laquo;' ||
// //                                                 link.label.toLowerCase().includes('previous')
// //                                             ) {
// //                                                 content = <ChevronLeft className="w-4 h-4" />;
// //                                             } else if (
// //                                                 link.label === '&raquo;' ||
// //                                                 link.label.toLowerCase().includes('next')
// //                                             ) {
// //                                                 content = <ChevronRight className="w-4 h-4" />;
// //                                             }
// //                                             return link.url ? (
// //                                                 <Link
// //                                                     key={index}
// //                                                     href={link.url}
// //                                                     className={`px-3 py-1 border rounded-md ${
// //                                                         link.active
// //                                                             ? 'bg-primary text-white border-blue-600'
// //                                                             : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
// //                                                     }`}
// //                                                 >
// //                                                     {content}
// //                                                 </Link>
// //                                             ) : (
// //                                                 <Button
// //                                                     key={index}
// //                                                     disabled
// //                                                     className="px-3 py-1 border rounded-md bg-gray-100 text-gray-400 border-gray-300"
// //                                                 >
// //                                                     {content}
// //                                                 </Button>
// //                                             );
// //                                         })}
// //                                         {currentPage + 10 <= totalPages && (
// //                                             <Link
// //                                                 href={recommended.path + `?page=${goForward10}`}
// //                                                 className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
// //                                             >
// //                                                 <ChevronsRight className="w-4 h-4" />
// //                                             </Link>
// //                                         )}
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         )}
// //                     </TabsContent>
// //                 </Tabs>
// //             </div>
// //         </>
// //     );
// // }
//
// // resources/js/Pages/dashboard.tsx (JobSeekerDashboard)
//
// import { AnalyticsCard } from '@/components/jobseeker/analytics-card';
// import { Link, usePage, router } from '@inertiajs/react';
// import { Button } from '@/components/ui/button';
// import {
//     Building,
//     ChevronLeft,
//     ChevronRight,
//     ChevronsLeft,
//     ChevronsRight,
//     Clock,
//     DollarSign,
//     Eye,
//     Heart,
//     Inbox,
//     Loader2,
//     MapPin,
//     Plus,
//     Search,
//     SlidersHorizontal
// } from 'lucide-react';
// import { motion } from 'framer-motion';
// import React, { useState, useEffect, useCallback } from 'react';
// import { debounce } from 'lodash';
// import {
//     PaginationLink,
//     Recommended,
//     RecommendedPagination,
//     Vacancy,
//     VacancyPagination,
//     VacancyWithEmployer
// } from '@/types/employer';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { CVViewer } from '@/components/jobseeker/cv-viewer';
// import { JobSeekerProfile } from '@/types/jobseeker';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { getVacancyType } from '@/lib/employer.data';
// import { Badge } from '@/components/ui/badge';
// import Paginate from '@/components/paginate';
// import { cn } from '@/lib/utils';
// import VacancyCard from '@/components/jobseeker/vacancy-card';
// import { SharedData } from '@/types';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Slider } from '@/components/ui/slider';
// import { toast } from 'sonner';
// import { industries } from '@/lib/jobseeker.data';
//
// interface FilterState {
//     search: string;
//     location: string;
//     jobType: string[];
//     salaryRange: [number, number];
//     skills: string[];
//     sortBy: string;
//     industry: string | null;  // Добавлен industry (string для 'all' или id as string)
// }
//
// export default function JobSeekerDashboard({
//                                                jobseeker,
//                                                hasJobSeeker,
//                                                vacancies,
//                                                totalCountApplication = 0,
//                                                totalCountViews = 0,
//                                                totalCountAllVacancies = 0,
//                                                totalCountRecommendedVacancies=0,
//                                                recommended,
//                                            }: {
//     jobseeker: JobSeekerProfile;
//     hasJobSeeker: boolean;
//     vacancies: VacancyPagination;
//     totalCountApplication: number;
//     totalCountViews:number;
//     totalCountAllVacancies:number;
//     totalCountRecommendedVacancies:number;
//     recommended: RecommendedPagination;
// }) {
//     const [showCVPreview, setShowCVPreview] = useState(false);
//     const { auth, filters } = usePage<SharedData & { filters: FilterState; industries: { id: number; name: string }[] }>().props;
//     const totalPages = recommended.last_page;
//     const currentPage = recommended.current_page;
//
//     // Initialize state with fallback to avoid undefined errors
//     const [searchTerm, setSearchTerm] = useState<string>(filters?.search || '');
//     const [savedJobs, setSavedJobs] = useState<number[]>([]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [activeFilters, setActiveFilters] = useState<FilterState>({
//         search: filters?.search || '',
//         location: filters?.location || '',
//         jobType: filters?.jobType || [],
//         salaryRange: filters?.salaryRange && Array.isArray(filters.salaryRange) && filters.salaryRange.length === 2
//             ? filters.salaryRange
//             : [0, 100000],
//         skills: filters?.skills || [],
//         sortBy: filters?.sortBy || 'relevance',
//         industry: filters?.industry || null,  // Новый фильтр
//     });
//     const [isSearching, setIsSearching] = useState(false);
//
//     // Debounced function to update URL with filters
//     const updateFilters = useCallback(
//         debounce((filters: FilterState) => {
//             // Convert filters to a plain object for Inertia
//             const params: Record<string, any> = {};
//             if (filters.search) params.search = filters.search;
//             if (filters.location) params.location = filters.location;
//             if (filters.jobType.length) params.jobType = filters.jobType;
//             if (filters.salaryRange) params.salaryRange = filters.salaryRange;
//             if (filters.skills.length) params.skills = filters.skills;
//             params.sortBy = filters.sortBy;
//             if (filters.industry) params.industry = filters.industry;  // Добавлен industry
//
//             router.get(route('dashboard'), params, {
//                 preserveState: true,
//                 preserveScroll: true,
//                 onSuccess: () => {
//                     toast.success('Фильтры и поиск применены');
//                 },
//                 onError: () => {
//                     toast.error('Ошибка при применении фильтров или поиска');
//                 }
//             });
//         }, 300),
//         []
//     );
//
//     // Sync filters with URL
//     useEffect(() => {
//         // Update filters with searchTerm included
//         const updatedFilters = { ...activeFilters, search: searchTerm };
//         updateFilters(updatedFilters);
//         // Cleanup debounce on unmount
//         return () => {
//             updateFilters.cancel();
//         };
//     }, [searchTerm, activeFilters, updateFilters]);
//
//     const hasActiveFilters = () => {
//         return (
//             activeFilters.search ||
//             activeFilters.location ||
//             activeFilters.jobType.length > 0 ||
//             activeFilters.skills.length > 0 ||
//             activeFilters.salaryRange[0] !== 0 ||
//             activeFilters.salaryRange[1] !== 100000 ||
//             activeFilters.sortBy !== 'relevance' ||
//             activeFilters.industry !== null  // Добавлен
//         );
//     };
//
//     const handleResetFilters = () => {
//         const resetFilters = {
//             search: '',
//             location: '',
//             jobType: [],
//             salaryRange: [0, 100000] as [number, number],
//             skills: [],
//             sortBy: 'relevance',
//             industry: null,  // Сброс industry
//         };
//         setActiveFilters(resetFilters);
//         setSearchTerm('');
//         updateFilters(resetFilters); // Immediately apply reset
//         toast.info('Фильтры и поиск сброшены');
//     };
//
//     const handleApplyFilters = (filters: FilterState) => {
//         setActiveFilters(filters);
//         setShowFilters(false);
//         updateFilters(filters);
//         toast.success('Фильтры применены');
//     };
//
//     const goForward10 = Math.min(currentPage + 10, totalPages);
//     const goBack10 = Math.max(currentPage - 10, 1);
//
//     // Common filter and search UI
//     const renderFilterUI = (dataLength: number) => (
//         <>
//             {/* Search and Filter Bar */}
//             <div className="flex gap-4">
//                 <div className="relative flex-1">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                     <Input
//                         placeholder="Поиск вакансий по названию, компании или навыкам..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-10"
//                     />
//                 </div>
//                 <Dialog open={showFilters} onOpenChange={setShowFilters}>
//                     <DialogTrigger asChild>
//                         <Button
//                             variant="outline"
//                             className={hasActiveFilters() ? 'border-primary text-primary' : ''}
//                         >
//                             <SlidersHorizontal className="h-4 w-4 mr-2" />
//                             Фильтры
//                             {hasActiveFilters() && (
//                                 <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
//                                     !
//                                 </Badge>
//                             )}
//                         </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                         <DialogHeader>
//                             <DialogTitle>Фильтры вакансий</DialogTitle>
//                         </DialogHeader>
//                         <div className="space-y-4">
//                             <div>
//                                 <Label>Местоположение</Label>
//                                 <Input
//                                     value={activeFilters.location}
//                                     onChange={(e) =>
//                                         setActiveFilters({ ...activeFilters, location: e.target.value })
//                                     }
//                                     placeholder="Введите город или регион"
//                                 />
//                             </div>
//                             <div>
//                                 <Label>Тип занятости</Label>
//                                 <div className="flex flex-wrap gap-2">
//                                     {['full', 'part', 'remote', 'contract', 'internship', 'temporary'].map(
//                                         (type) => (
//                                             <Button
//                                                 key={type}
//                                                 variant={
//                                                     activeFilters.jobType.includes(type)
//                                                         ? 'default'
//                                                         : 'outline'
//                                                 }
//                                                 onClick={() =>
//                                                     setActiveFilters({
//                                                         ...activeFilters,
//                                                         jobType: activeFilters.jobType.includes(type)
//                                                             ? activeFilters.jobType.filter((t) => t !== type)
//                                                             : [...activeFilters.jobType, type],
//                                                     })
//                                                 }
//                                             >
//                                                 {getVacancyType(type)}
//                                             </Button>
//                                         )
//                                     )}
//                                 </div>
//                             </div>
//                             <div>
//                                 <Label>Диапазон зарплаты</Label>
//                                 <Slider
//                                     value={activeFilters.salaryRange}
//                                     onValueChange={(value: [number, number]) =>
//                                         setActiveFilters({ ...activeFilters, salaryRange: value })
//                                     }
//                                     min={0}
//                                     max={100000}
//                                     step={500}
//                                     defaultValue={[0, 100000]}
//                                 />
//                                 <div className="flex justify-between text-sm">
//                                     <span>{activeFilters.salaryRange[0]} смн.</span>
//                                     <span>100000 смн.</span>
//                                 </div>
//                             </div>
//                             <div>
//                                 <Label>Навыки</Label>
//                                 <Input
//                                     value={activeFilters.skills.join(',')}
//                                     onChange={(e) =>
//                                         setActiveFilters({
//                                             ...activeFilters,
//                                             skills: e.target.value
//                                                 ? e.target.value.split(',').map((s) => s.trim()).filter(s => s)
//                                                 : [],
//                                         })
//                                     }
//                                     placeholder="Введите навыки через запятую"
//                                 />
//                             </div>
//                             <div>  {/* Новый Select для industry */}
//                                 <Label>Отрасль</Label>
//                                 <Select
//                                     value={activeFilters.industry || 'all'}
//                                     onValueChange={(value) =>
//                                         setActiveFilters({ ...activeFilters, industry: value === 'all' ? null : value })
//                                     }
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Выберите отрасль" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="all">Все отрасли</SelectItem>
//                                         {industries.map((industry) => (
//                                             <SelectItem key={industry.id} value={industry.id.toString()}>
//                                                 {industry.name}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div>
//                                 <Label>Сортировка</Label>
//                                 <Select
//                                     value={activeFilters.sortBy}
//                                     onValueChange={(value) =>
//                                         setActiveFilters({ ...activeFilters, sortBy: value })
//                                     }
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Выберите сортировку" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="relevance">По релевантности</SelectItem>
//                                         <SelectItem value="date">По дате</SelectItem>
//                                         <SelectItem value="salary_high">По зарплате (убыв.)</SelectItem>
//                                         <SelectItem value="salary_low">По зарплате (возр.)</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Button onClick={() => handleApplyFilters(activeFilters)}>
//                                     Применить
//                                 </Button>
//                                 <Button variant="outline" onClick={handleResetFilters}>
//                                     Сбросить
//                                 </Button>
//                             </div>
//                         </div>
//                     </DialogContent>
//                 </Dialog>
//                 {hasActiveFilters() && (
//                     <Button variant="ghost" onClick={handleResetFilters}>
//                         Сбросить
//                     </Button>
//                 )}
//             </div>
//
//             {/* Active Filters Display */}
//             {hasActiveFilters() && (
//                 <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
//                     <span className="text-sm font-medium">Активные фильтры:</span>
//                     {activeFilters.search && (
//                         <Badge variant="secondary">Поиск: {activeFilters.search}</Badge>
//                     )}
//                     {activeFilters.location && (
//                         <Badge variant="secondary">Локация: {activeFilters.location}</Badge>
//                     )}
//                     {activeFilters.jobType.map((type) => (
//                         <Badge key={type} variant="secondary">
//                             {getVacancyType(type)}
//                         </Badge>
//                     ))}
//                     {activeFilters.salaryRange && (
//                         <Badge variant="secondary">
//                             Зарплата: {activeFilters.salaryRange[0]} - {activeFilters.salaryRange[1]} смн.
//                         </Badge>
//                     )}
//                     {activeFilters.skills.map((skill) => (
//                         <Badge key={skill} variant="secondary">
//                             {skill}
//                         </Badge>
//                     ))}
//                     {activeFilters.industry && (  // Добавлен для industry
//                         <Badge variant="secondary">
//                             Отрасль: {industries.find(i => i.id.toString() === activeFilters.industry)?.name || ''}
//                         </Badge>
//                     )}
//                     <Badge variant="secondary">
//                         Сортировка:{' '}
//                         {activeFilters.sortBy === 'relevance'
//                             ? 'По релевантности'
//                             : activeFilters.sortBy === 'date'
//                                 ? 'По дате'
//                                 : activeFilters.sortBy === 'salary_high'
//                                     ? 'По зарплате (убыв.)'
//                                     : 'По зарплате (возр.)'}
//                     </Badge>
//                 </div>
//             )}
//
//             {/* Results Count */}
//             <div className="flex justify-between items-center">
//                 <p className="text-sm text-muted-foreground">
//                     Найдено {dataLength}{' '}
//                     {dataLength === 1 ? 'вакансия' : 'вакансий'}
//                 </p>
//                 <div className="text-sm text-muted-foreground">
//                     Сортировка:{' '}
//                     {activeFilters.sortBy === 'relevance'
//                         ? 'По релевантности'
//                         : activeFilters.sortBy === 'date'
//                             ? 'По дате'
//                             : activeFilters.sortBy === 'salary_high'
//                                 ? 'По зарплате (убыв.)'
//                                 : 'По зарплате (возр.)'}
//                 </div>
//             </div>
//         </>
//     );
//
//     return (
//         <>
//             <div className="@container/main p-2 flex flex-1 flex-col gap-2">
//                 <div className="flex flex-col gap-4 md:gap-6">
//                     <AnalyticsCard totalCountApplication={totalCountApplication} totalCountRecommendedVacancies={totalCountRecommendedVacancies} totalCountAllVacancies={totalCountAllVacancies} totalCountViewProfile={totalCountViews} />
//                     <div className="flex items-center justify-between">
//                         <span className="text-3xl font-bold">Вакансии</span>
//                         {hasJobSeeker ? (
//                             <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
//                                 <DialogTrigger asChild>
//                                     <Button variant="outline">
//                                         <Eye className="h-4 w-4" />
//                                         Просмотр резюме
//                                     </Button>
//                                 </DialogTrigger>
//                                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                                     <DialogHeader>
//                                         <DialogTitle>Предпросмотр CV</DialogTitle>
//                                     </DialogHeader>
//                                     <CVViewer data={jobseeker} showActions={false} />
//                                 </DialogContent>
//                             </Dialog>
//                         ) : (
//                             <Link href={route('jobseeker.index')}>
//                                 <Button>
//                                     <Plus className="h-4 w-4" /> Заполнить резюме (CV)
//                                 </Button>
//                             </Link>
//                         )}
//                     </div>
//                 </div>
//                 <Tabs defaultValue="all">
//                     <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
//                         <TabsTrigger value="all">Все</TabsTrigger>
//                         <TabsTrigger value="recommended">Рекомендованные</TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="all" className="space-y-6">
//                         {renderFilterUI(vacancies.data.length)}
//                         {vacancies.data.length === 0 ? (
//                             <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
//                                 <Inbox className="h-16 w-16 text-muted-foreground" />
//                                 <span>Пока нет вакансий</span>
//                             </div>
//                         ) : (
//                             <>
//                                 {vacancies.data.map((vacancy: VacancyWithEmployer,index) => (
//                                     <VacancyCard key={index} vacancy={vacancy} />
//                                 ))}
//                                 <div className="mt-4 flex items-center justify-end">
//                                     <Paginate data={vacancies} />
//                                 </div>
//                             </>
//                         )}
//                     </TabsContent>
//                     <TabsContent value="recommended" className="space-y-6">
//                         {renderFilterUI(recommended.data.length)}
//                         {recommended.data.length === 0 ? (
//                             <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
//                                 <Inbox className="h-16 w-16 text-muted-foreground" />
//                                 <span>Пока нет вакансий</span>
//                                 <Link
//                                     href={route('recommended.vacancy', jobseeker ? jobseeker.id : 0)}
//                                     onClick={() => setIsSearching(true)}
//                                 >
//                                     <motion.button
//                                         disabled={isSearching}
//                                         whileTap={{ scale: 0.95 }}
//                                         whileHover={{ scale: 1.05 }}
//                                         animate={isSearching ? { rotate: 360 } : { rotate: 0 }}
//                                         transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                                         className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
//                                     >
//                                         {isSearching && (
//                                             <span className="animate-spin inline-block">
//                                                 <Loader2 />
//                                             </span>
//                                         )}
//                                         Начать поиск
//                                     </motion.button>
//                                 </Link>
//                             </div>
//                         ) : (
//                             <div className="space-y-6">
//                                 <div className="flex items-center justify-end mt-4">
//                                     <Link
//                                         href={route('recommended.vacancy', jobseeker ? jobseeker.id : 0)}
//                                         onClick={() => setIsSearching(true)}
//                                     >
//                                         <motion.button
//                                             disabled={isSearching}
//                                             whileTap={{ scale: 0.95 }}
//                                             whileHover={{ scale: 1.05 }}
//                                             animate={isSearching ? { rotate: 360 } : { rotate: 0 }}
//                                             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                                             className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
//                                         >
//                                             {isSearching && (
//                                                 <span className="animate-spin inline-block">
//                                                     <Loader2 />
//                                                 </span>
//                                             )}
//                                             Начать поиск
//                                         </motion.button>
//                                     </Link>
//                                 </div>
//                                 {recommended.data.map((recommend: Recommended,index) => (
//                                     <VacancyCard
//                                         key={index}
//                                         vacancy={recommend.vacancy}
//                                         setScore={true}
//                                         score={recommend.score}
//                                     />
//                                 ))}
//                                 {recommended.data.length > 0 && (
//                                     <div className="flex flex-wrap items-center gap-2 justify-end">
//                                         {currentPage > 10 && (
//                                             <Link
//                                                 href={recommended.path + `?page=${goBack10}`}
//                                                 className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//                                             >
//                                                 <ChevronsLeft className="w-4 h-4" />
//                                             </Link>
//                                         )}
//                                         {recommended.links.map((link: PaginationLink, index: number) => {
//                                             let content: React.ReactNode = (
//                                                 <span dangerouslySetInnerHTML={{ __html: link.label }} />
//                                             );
//                                             if (
//                                                 link.label === '&laquo;' ||
//                                                 link.label.toLowerCase().includes('previous')
//                                             ) {
//                                                 content = <ChevronLeft className="w-4 h-4" />;
//                                             } else if (
//                                                 link.label === '&raquo;' ||
//                                                 link.label.toLowerCase().includes('next')
//                                             ) {
//                                                 content = <ChevronRight className="w-4 h-4" />;
//                                             }
//                                             return link.url ? (
//                                                 <Link
//                                                     key={index}
//                                                     href={link.url}
//                                                     className={`px-3 py-1 border rounded-md ${
//                                                         link.active
//                                                             ? 'bg-primary text-white border-blue-600'
//                                                             : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
//                                                     }`}
//                                                 >
//                                                     {content}
//                                                 </Link>
//                                             ) : (
//                                                 <Button
//                                                     key={index}
//                                                     disabled
//                                                     className="px-3 py-1 border rounded-md bg-gray-100 text-gray-400 border-gray-300"
//                                                 >
//                                                     {content}
//                                                 </Button>
//                                             );
//                                         })}
//                                         {currentPage + 10 <= totalPages && (
//                                             <Link
//                                                 href={recommended.path + `?page=${goForward10}`}
//                                                 className="px-3 py-1 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//                                             >
//                                                 <ChevronsRight className="w-4 h-4" />
//                                             </Link>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </TabsContent>
//                 </Tabs>
//             </div>
//         </>
//     );
// }

// resources/js/Pages/dashboard.tsx

import { AnalyticsCard } from '@/components/jobseeker/analytics-card';
import { Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Eye,
    Inbox,
    Loader2,
    Plus,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import {
    Recommended,
    RecommendedPagination,
    VacancyPagination,
    VacancyWithEmployer,
} from '@/types/employer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CVViewer } from '@/components/jobseeker/cv-viewer';
import { JobSeekerProfile } from '@/types/jobseeker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getVacancyType } from '@/lib/employer.data';
import { Badge } from '@/components/ui/badge';
import JobseekerPaginate from '@/components/jobseeker-paginate'; // Updated import
import VacancyCard from '@/components/jobseeker/vacancy-card';
import { SharedData } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { industries } from '@/lib/jobseeker.data';

interface FilterState {
    search: string;
    location: string;
    jobType: string[];
    salaryRange: [number, number];
    skills: string[];
    sortBy: string;
    industry: string | null;
}

export default function JobSeekerDashboard({
                                               jobseeker,
                                               hasJobSeeker,
                                               vacancies,
                                               totalCountApplication = 0,
                                               totalCountViews = 0,
                                               totalCountAllVacancies = 0,
                                               totalCountRecommendedVacancies = 0,
                                               recommended,
                                           }: {
    jobseeker: JobSeekerProfile;
    hasJobSeeker: boolean;
    vacancies: VacancyPagination;
    totalCountApplication: number;
    totalCountViews: number;
    totalCountAllVacancies: number;
    totalCountRecommendedVacancies: number;
    recommended: RecommendedPagination;
}) {
    const [showCVPreview, setShowCVPreview] = useState(false);
    const { filters } = usePage<SharedData & { filters: FilterState; industries: { id: number; name: string }[] }>().props;
    const [searchTerm, setSearchTerm] = useState<string>(filters?.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        search: filters?.search || '',
        location: filters?.location || '',
        jobType: filters?.jobType || [],
        salaryRange: filters?.salaryRange && Array.isArray(filters.salaryRange) && filters.salaryRange.length === 2
            ? filters.salaryRange
            : [0, 100000],
        skills: filters?.skills || [],
        sortBy: filters?.sortBy || 'relevance',
        industry: filters?.industry || null,
    });
    const [isSearching, setIsSearching] = useState(false);

    const updateFilters = useCallback(
        debounce((filters: FilterState) => {
            const params: Record<string, any> = {};
            if (filters.search) params.search = filters.search;
            if (filters.location) params.location = filters.location;
            if (filters.jobType.length) params.jobType = filters.jobType;
            if (filters.salaryRange) params.salaryRange = filters.salaryRange;
            if (filters.skills.length) params.skills = filters.skills;
            if (filters.industry) params.industry = filters.industry;
            params.sortBy = filters.sortBy;


            router.get(route('dashboard'), params, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Фильтры и поиск применены');
                },
                onError: (errors) => {
                    toast.error('Ошибка при применении фильтров или поиска');
                },
            });
        }, 300),
        []
    );

    useEffect(() => {
        const updatedFilters = { ...activeFilters, search: searchTerm };
        updateFilters(updatedFilters);
        return () => {
            updateFilters.cancel();
        };
    }, [searchTerm, activeFilters, updateFilters]);

    const hasActiveFilters = () => {
        return (
            activeFilters.search ||
            activeFilters.location ||
            activeFilters.jobType.length > 0 ||
            activeFilters.skills.length > 0 ||
            activeFilters.salaryRange[0] !== 0 ||
            activeFilters.salaryRange[1] !== 100000 ||
            activeFilters.sortBy !== 'relevance' ||
            activeFilters.industry !== null
        );
    };

    const handleResetFilters = () => {
        const resetFilters = {
            search: '',
            location: '',
            jobType: [],
            salaryRange: [0, 100000] as [number, number],
            skills: [],
            sortBy: 'relevance',
            industry: null,
        };
        setActiveFilters(resetFilters);
        setSearchTerm('');
        updateFilters(resetFilters);
        toast.info('Фильтры и поиск сброшены');
    };

    const handleApplyFilters = (filters: FilterState) => {
        setActiveFilters(filters);
        setShowFilters(false);
        updateFilters(filters);
        toast.success('Фильтры применены');
    };

    const renderFilterUI = (dataLength: number) => (
        <>
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Поиск вакансий по названию, компании или навыкам..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Dialog open={showFilters} onOpenChange={setShowFilters}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className={hasActiveFilters() ? 'border-primary text-primary' : ''}
                        >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Фильтры
                            {hasActiveFilters() && (
                                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    !
                                </Badge>
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Фильтры вакансий</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Местоположение</Label>
                                <Input
                                    value={activeFilters.location}
                                    onChange={(e) =>
                                        setActiveFilters({ ...activeFilters, location: e.target.value })
                                    }
                                    placeholder="Введите город или регион"
                                />
                            </div>
                            <div>
                                <Label>Тип занятости</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['full', 'part', 'remote', 'contract', 'internship', 'temporary'].map(
                                        (type) => (
                                            <Button
                                                key={type}
                                                variant={
                                                    activeFilters.jobType.includes(type)
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                onClick={() =>
                                                    setActiveFilters({
                                                        ...activeFilters,
                                                        jobType: activeFilters.jobType.includes(type)
                                                            ? activeFilters.jobType.filter((t) => t !== type)
                                                            : [...activeFilters.jobType, type],
                                                    })
                                                }
                                            >
                                                {getVacancyType(type)}
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label>Диапазон зарплаты</Label>
                                <Slider
                                    value={activeFilters.salaryRange}
                                    onValueChange={(value: [number, number]) =>
                                        setActiveFilters({ ...activeFilters, salaryRange: value })
                                    }
                                    min={0}
                                    max={100000}
                                    step={500}
                                    defaultValue={[0, 100000]}
                                />
                                <div className="flex justify-between text-sm">
                                    <span>{activeFilters.salaryRange[0]} смн.</span>
                                    <span>100000 смн.</span>
                                </div>
                            </div>
                            <div>
                                <Label>Навыки</Label>
                                <Input
                                    value={activeFilters.skills.join(',')}
                                    onChange={(e) =>
                                        setActiveFilters({
                                            ...activeFilters,
                                            skills: e.target.value
                                                ? e.target.value.split(',').map((s) => s.trim()).filter((s) => s)
                                                : [],
                                        })
                                    }
                                    placeholder="Введите навыки через запятую"
                                />
                            </div>
                            <div>
                                <Label>Отрасль</Label>
                                <Select
                                    value={activeFilters.industry || 'all'}
                                    onValueChange={(value) =>
                                        setActiveFilters({ ...activeFilters, industry: value === 'all' ? null : value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите отрасль" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Все отрасли</SelectItem>
                                        {industries.map((industry) => (
                                            <SelectItem key={industry.id} value={industry.id.toString()}>
                                                {industry.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Сортировка</Label>
                                <Select
                                    value={activeFilters.sortBy}
                                    onValueChange={(value) =>
                                        setActiveFilters({ ...activeFilters, sortBy: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите сортировку" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">По релевантности</SelectItem>
                                        <SelectItem value="date">По дате</SelectItem>
                                        <SelectItem value="salary_high">По зарплате (убыв.)</SelectItem>
                                        <SelectItem value="salary_low">По зарплате (возр.)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => handleApplyFilters(activeFilters)}>Применить</Button>
                                <Button variant="outline" onClick={handleResetFilters}>Сбросить</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {hasActiveFilters() && (
                    <Button variant="ghost" onClick={handleResetFilters}>Сбросить</Button>
                )}
            </div>

            {hasActiveFilters() && (
                <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Активные фильтры:</span>
                    {activeFilters.search && <Badge variant="secondary">Поиск: {activeFilters.search}</Badge>}
                    {activeFilters.location && <Badge variant="secondary">Локация: {activeFilters.location}</Badge>}
                    {activeFilters.jobType.map((type) => (
                        <Badge key={type} variant="secondary">
                            {getVacancyType(type)}
                        </Badge>
                    ))}
                    {activeFilters.salaryRange && (
                        <Badge variant="secondary">
                            Зарплата: {activeFilters.salaryRange[0]} - {activeFilters.salaryRange[1]} смн.
                        </Badge>
                    )}
                    {activeFilters.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                    {activeFilters.industry && (
                        <Badge variant="secondary">
                            Отрасль: {industries.find((i) => i.id.toString() === activeFilters.industry)?.name || ''}
                        </Badge>
                    )}
                    <Badge variant="secondary">
                        Сортировка:{' '}
                        {activeFilters.sortBy === 'relevance'
                            ? 'По релевантности'
                            : activeFilters.sortBy === 'date'
                                ? 'По дате'
                                : activeFilters.sortBy === 'salary_high'
                                    ? 'По зарплате (убыв.)'
                                    : 'По зарплате (возр.)'}
                    </Badge>
                </div>
            )}

            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    Найдено {dataLength}{' '}
                    {dataLength === 1 ? 'вакансия' : 'вакансий'}
                </p>
                <div className="text-sm text-muted-foreground">
                    Сортировка:{' '}
                    {activeFilters.sortBy === 'relevance'
                        ? 'По релевантности'
                        : activeFilters.sortBy === 'date'
                            ? 'По дате'
                            : activeFilters.sortBy === 'salary_high'
                                ? 'По зарплате (убыв.)'
                                : 'По зарплате (возр.)'}
                </div>
            </div>
        </>
    );

    return (
        <div className="@container/main p-2 flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
                <AnalyticsCard
                    totalCountApplication={totalCountApplication}
                    totalCountRecommendedVacancies={totalCountRecommendedVacancies}
                    totalCountAllVacancies={totalCountAllVacancies}
                    totalCountViewProfile={totalCountViews}
                />
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">Вакансии</span>
                    {hasJobSeeker ? (
                        <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Eye className="h-4 w-4" /> Просмотр резюме
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Предпросмотр CV</DialogTitle>
                                </DialogHeader>
                                <CVViewer data={jobseeker} showActions={false} />
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Link href={route('jobseeker.index')}>
                            <Button>
                                <Plus className="h-4 w-4" /> Заполнить резюме (CV)
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
            <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
                    <TabsTrigger value="all">Все</TabsTrigger>
                    <TabsTrigger value="recommended">Рекомендованные</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-6">
                    {renderFilterUI(vacancies.data.length)}
                    {vacancies.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
                            <Inbox className="h-16 w-16 text-muted-foreground" />
                            <span>Пока нет вакансий</span>
                        </div>
                    ) : (
                        <>
                            {vacancies.data.map((vacancy: VacancyWithEmployer, index) => (
                                <VacancyCard key={index} vacancy={vacancy} />
                            ))}
                            <div className="mt-4 flex items-center justify-end">
                                <JobseekerPaginate data={vacancies} />
                            </div>
                        </>
                    )}
                </TabsContent>
                <TabsContent value="recommended" className="space-y-6">
                    {renderFilterUI(recommended.data.length)}
                    {recommended.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
                            <Inbox className="h-16 w-16 text-muted-foreground" />
                            <span>Пока нет вакансий</span>
                            <Link
                                href={route('recommended.vacancy', jobseeker ? jobseeker.id : 0)}
                                onClick={() => setIsSearching(true)}
                            >
                                <motion.button
                                    disabled={isSearching}
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    animate={isSearching ? { rotate: 360 } : { rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                                >
                                    {isSearching && (
                                        <span className="animate-spin inline-block">
                                            <Loader2 />
                                        </span>
                                    )}
                                    Начать поиск
                                </motion.button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-end mt-4">
                                <Link
                                    href={route('recommended.vacancy', jobseeker ? jobseeker.id : 0)}
                                    onClick={() => setIsSearching(true)}
                                >
                                    <motion.button
                                        disabled={isSearching}
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ scale: 1.05 }}
                                        animate={isSearching ? { rotate: 360 } : { rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                                    >
                                        {isSearching && (
                                            <span className="animate-spin inline-block">
                                                <Loader2 />
                                            </span>
                                        )}
                                        Начать поиск
                                    </motion.button>
                                </Link>
                            </div>
                            {recommended.data.map((recommend: Recommended, index) => (
                                <VacancyCard
                                    key={index}
                                    vacancy={recommend.vacancy}
                                    setScore={true}
                                    score={recommend.score}
                                />
                            ))}
                            {recommended.data.length > 0 && (
                                <div className="mt-4 flex items-center justify-end">
                                    <JobseekerPaginate data={recommended} />
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
