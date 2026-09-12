<?php
//
//namespace App\Http\Controllers;
//
//use App\Http\Requests\Vacancy\Jobseeker\SaveVacancyRequest;
//use App\Models\JobSeeker\Profile\JobSeekerProfile;
//use App\Models\Recommended;
//use App\Models\Vacancies\Application;
//use App\Models\Vacancies\Favorite;
//use App\Models\Vacancies\Vacancy;
//use Illuminate\Http\Request;
//use Inertia\Inertia;
//
//class DashboardController extends Controller
//{
//    public function index()
//    {
//        $user = auth()->user();
//        $response = [];
//        if ($user->hasRole('jobseeker')) {
//            $jobseeker = JobSeekerProfile::with([
//                'education' => fn($q) => $q->orderBy('sort_order'),
//                'experiences' => fn($q) => $q->orderBy('sort_order'),
//                'skills' => fn($q) => $q->orderBy('sort_order'),
//                'languages' => fn($q) => $q->orderBy('sort_order'),
//                'additions' => fn($q) => $q->orderBy('sort_order'),
//                'links',
//                'user'
//            ])->where('user_id', auth()->id())->first();
//            $hasJobSeeker = $jobseeker !== null;
//
//            $vacancies = Vacancy::with(['employer', 'favorites'])
//                ->orderBy('created_at', 'desc')->where('status','active')
//                ->paginate(5);
//
//            $vacancies->getCollection()->transform(function ($vacancy) use ($user) {
//                $vacancy->isFavorite = false;
//
//                $vacancy->isFavorite = $vacancy->favorites
//                    ->where('user_id', $user->id)
//                    ->where('vacancy_id', $vacancy->id)
//                    ->isNotEmpty();
//
//                return $vacancy;
//            });
//
//            $totalCountApplication = Application::where('job_seeker_profile_id',$jobseeker?->id )->count();
//            $recommendedVacancies = Recommended::where('job_seeker_profile_id', $jobseeker?->id)
//                ->orderBy('score', 'desc')
//                ->with(['vacancy.employer'])
//                ->paginate(5);
//            $response = [
//                'role'=>"jobseeker",
//                'recommended'=>$recommendedVacancies,
//                'jobseeker' => $jobseeker,
//                'hasJobSeeker' => $hasJobSeeker,
//                'vacancies' => $vacancies,
//                'totalCountApplication' => $totalCountApplication
//            ];
//
//        }
//        elseif ($user->hasRole('employer')){
//            $jobseekers = JobSeekerProfile::with([
//                'education' => fn($q) => $q->orderBy('sort_order'),
//                'experiences' => fn($q) => $q->orderBy('sort_order'),
//                'skills' => fn($q) => $q->orderBy('sort_order'),
//                'languages' => fn($q) => $q->orderBy('sort_order'),
//                'additions' => fn($q) => $q->orderBy('sort_order'),
//                'links',
//                'user'
//            ])->orderBy('created_at', 'desc')
//                ->paginate(5);
//
//            $response = [
//                'role'=>"employer",
//                'jobseekers' => $jobseekers
//            ];
//        }
//        return Inertia::render('dashboard',$response);
//    }
//
//}
//namespace App\Http\Controllers;
//
//use App\Http\Requests\Vacancy\Jobseeker\SaveVacancyRequest;
//use App\Models\JobSeeker\Profile\JobSeekerProfile;
//use App\Models\Recommended;
//use App\Models\Vacancies\Application;
//use App\Models\Vacancies\Favorite;
//use App\Models\Vacancies\Vacancy;
//use Illuminate\Http\Request;
//use Inertia\Inertia;
//
//class DashboardController extends Controller
//{
//    public function index(Request $request)
//    {
//        // Validate input parameters
//        $validated = $request->validate([
//            'search' => 'nullable|string|max:255',
//            'location' => 'nullable|string|max:255',
//            'jobType' => 'nullable|array',
//            'jobType.*' => 'in:full,part,remote,contract,internship,temporary',
//            'salaryRange' => 'nullable|array|size:2',
//            'salaryRange.*' => 'integer|min:0',
//            'skills' => 'nullable|array',
//            'skills.*' => 'string|max:255',
//            'sortBy' => 'nullable|in:relevance,date,salary_high,salary_low',
//        ]);
//
//        $user = auth()->user();
//        $response = [];
//
//        if ($user->hasRole('jobseeker')) {
//            $jobseeker = JobSeekerProfile::with([
//                'education' => fn($q) => $q->orderBy('sort_order'),
//                'experiences' => fn($q) => $q->orderBy('sort_order'),
//                'skills' => fn($q) => $q->orderBy('sort_order'),
//                'languages' => fn($q) => $q->orderBy('sort_order'),
//                'additions' => fn($q) => $q->orderBy('sort_order'),
//                'links',
//                'user'
//            ])->where('user_id', auth()->id())->first();
//            $hasJobSeeker = $jobseeker !== null;
//
//            // Extract validated parameters
//            $search = $validated['search'] ?? '';
//            $location = $validated['location'] ?? '';
//            $jobType = $validated['jobType'] ?? [];
//            $salaryRange = $validated['salaryRange'] ?? [0, 9999999];
//            $skills = $validated['skills'] ?? [];
//            $sortBy = $validated['sortBy'] ?? 'relevance';
//
//            // Build query for all vacancies
//            $query = Vacancy::with(['employer', 'favorites'])
//                ->where('status', 'active');
//
//            // Search by title or company name
//            if ($search) {
//                $query->where(function ($q) use ($search) {
//                    $q->where('title', 'like', '%' . $search . '%')
//                        ->orWhereHas('employer', function ($q) use ($search) {
//                            $q->where('company_name', 'like', '%' . $search . '%');
//                        });
//                });
//            }
//
//            // Filter by location
//            if ($location) {
//                $query->where('location', 'like', '%' . $location . '%');
//            }
//
//            // Filter by job type
//            if (!empty($jobType)) {
//                $query->whereIn('type', $jobType);
//            }
//
//            // Filter by salary range
//            if ($salaryRange && is_array($salaryRange) && count($salaryRange) === 2) {
//                $query->where('salary_start', '>=', $salaryRange[0])
//                    ->where('salary_end', '<=', $salaryRange[1]);
//            }
//
//            // Filter by skills (partial match)
//            if (!empty($skills)) {
//                foreach ($skills as $skill) {
//                    $query->whereJsonContains('skills', $skill);
//                }
//            }
//
//            // Sorting for all vacancies
//            switch ($sortBy) {
//                case 'date':
//                    $query->orderBy('created_at', 'desc');
//                    break;
//                case 'salary_high':
//                    $query->orderBy('salary_end', 'desc');
//                    break;
//                case 'salary_low':
//                    $query->orderBy('salary_end', 'asc');
//                    break;
//                case 'relevance':
//                default:
//                    if ($jobseeker) {
//                        $query->leftJoin('recommended', function ($join) use ($jobseeker) {
//                            $join->on('vacancies.id', '=', 'recommended.vacancy_id')
//                                ->where('recommended.job_seeker_profile_id', '=', $jobseeker->id);
//                        })->orderByDesc('recommended.score');
//                    } else {
//                        $query->orderBy('created_at', 'desc');
//                    }
//                    break;
//            }
//
//            // Paginate all vacancies
//            $vacancies = $query->paginate(5);
//
//            // Transform vacancies to include isFavorite
//            $vacancies->getCollection()->transform(function ($vacancy) use ($user) {
//                $vacancy->isFavorite = $vacancy->favorites
//                    ->where('user_id', $user->id)
//                    ->where('vacancy_id', $vacancy->id)
//                    ->isNotEmpty();
//
//                return $vacancy;
//            });
//
//            // Build query for recommended vacancies
//            $recommendedQuery = Recommended::where('job_seeker_profile_id', $jobseeker?->id)
//                ->with(['vacancy.employer'])
//                ->join('vacancies', 'recommended.vacancy_id', '=', 'vacancies.id')
//                ->where('vacancies.status', 'active')
//                ->select('recommended.*');  // Select recommended fields to avoid ambiguity
//
//            // Apply same search to recommended
//            if ($search) {
//                $recommendedQuery->where(function ($q) use ($search) {
//                    $q->where('vacancies.title', 'like', '%' . $search . '%')
//                        ->orWhereHas('vacancy.employer', function ($q) use ($search) {
//                            $q->where('company_name', 'like', '%' . $search . '%');
//                        });
//                });
//            }
//
//            // Apply same filters to recommended
//            if ($location) {
//                $recommendedQuery->where('vacancies.location', 'like', '%' . $location . '%');
//            }
//
//            if (!empty($jobType)) {
//                $recommendedQuery->whereIn('vacancies.type', $jobType);
//            }
//
//            if ($salaryRange && is_array($salaryRange) && count($salaryRange) === 2) {
//                $recommendedQuery->where('vacancies.salary_start', '>=', $salaryRange[0])
//                    ->where('vacancies.salary_end', '<=', $salaryRange[1]);
//            }
//
//            if (!empty($skills)) {
//                foreach ($skills as $skill) {
//                    $recommendedQuery->whereJsonContains('vacancies.skills', $skill);
//                }
//            }
//
//            // Sorting for recommended
//            switch ($sortBy) {
//                case 'date':
//                    $recommendedQuery->orderBy('vacancies.created_at', 'desc');
//                    break;
//                case 'salary_high':
//                    $recommendedQuery->orderBy('vacancies.salary_end', 'desc');
//                    break;
//                case 'salary_low':
//                    $recommendedQuery->orderBy('vacancies.salary_end', 'asc');
//                    break;
//                case 'relevance':
//                default:
//                    $recommendedQuery->orderBy('recommended.score', 'desc');
//                    break;
//            }
//
//            // Paginate recommended vacancies
//            $recommendedVacancies = $recommendedQuery->paginate(5);
//
//            // Transform recommended vacancies to include isFavorite
//            $recommendedVacancies->getCollection()->transform(function ($recommended) use ($user) {
//                $vacancy = $recommended->vacancy;
//                if ($vacancy) {
//                    $vacancy->isFavorite = Favorite::where('user_id', $user->id)
//                        ->where('vacancy_id', $vacancy->id)
//                        ->exists();
//                }
//                return $recommended;
//            });
//
//            $totalCountApplication = Application::where('job_seeker_profile_id', $jobseeker?->id)->count();
//
//            $response = [
//                'role' => 'jobseeker',
//                'recommended' => $recommendedVacancies,
//                'jobseeker' => $jobseeker,
//                'hasJobSeeker' => $hasJobSeeker,
//                'vacancies' => $vacancies,
//                'totalCountApplication' => $totalCountApplication,
//                'filters' => [
//                    'search' => $search,
//                    'location' => $location,
//                    'jobType' => $jobType,
//                    'salaryRange' => $salaryRange,
//                    'skills' => $skills,
//                    'sortBy' => $sortBy,
//                ],
//            ];
//        } elseif ($user->hasRole('employer')) {
//            $jobseekers = JobSeekerProfile::with([
//                'education' => fn($q) => $q->orderBy('sort_order'),
//                'experiences' => fn($q) => $q->orderBy('sort_order'),
//                'skills' => fn($q) => $q->orderBy('sort_order'),
//                'languages' => fn($q) => $q->orderBy('sort_order'),
//                'additions' => fn($q) => $q->orderBy('sort_order'),
//                'links',
//                'user'
//            ])->orderBy('created_at', 'desc')
//                ->paginate(5);
//
//            $response = [
//                'role' => 'employer',
//                'jobseekers' => $jobseekers,
//            ];
//        }
//
//        return Inertia::render('dashboard', $response);
//    }
//}



namespace App\Http\Controllers;

use App\Http\Requests\Vacancy\Jobseeker\SaveVacancyRequest;
use App\Models\CandidateView;
use App\Models\Employer\Employer;
use App\Models\Industry;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\Recommended;
use App\Models\User;
use App\Models\Vacancies\Application;
use App\Models\Vacancies\Favorite;
use App\Models\Vacancies\Vacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'jobType' => 'nullable|array',
            'jobType.*' => 'in:full,part,remote,contract,internship,temporary',
            'salaryRange' => 'nullable|array|size:2',
            'salaryRange.*' => 'integer|min:0',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:255',
            'sortBy' => 'nullable|in:relevance,date,salary_high,salary_low',
            'industry' => 'nullable|integer|exists:industries,id',
            'vacancy' => 'nullable|integer|exists:vacancies,id', // Новый параметр для фильтра по вакансии
            'tab' => 'nullable|in:search,recommended', // Validate tab parameter
        ]);

        $user = auth()->user();
        $response = [];

        if ($user->hasRole('jobseeker')) {
            $jobseeker = JobSeekerProfile::with([
                'education' => fn($q) => $q->orderBy('sort_order'),
                'experiences' => fn($q) => $q->orderBy('sort_order'),
                'skills' => fn($q) => $q->orderBy('sort_order'),
                'languages' => fn($q) => $q->orderBy('sort_order'),
                'additions' => fn($q) => $q->orderBy('sort_order'),
                'links',
                'user',
            ])->where('user_id', auth()->id())->first();
            $hasJobSeeker = $jobseeker !== null;

            $search = $validated['search'] ?? '';
            $location = $validated['location'] ?? '';
            $jobType = $validated['jobType'] ?? [];
            $salaryRange = $validated['salaryRange'] ?? [0, 9999999];
            $skills = $validated['skills'] ?? [];
            $sortBy = $validated['sortBy'] ?? 'relevance';
            $industry = $validated['industry'] ?? null;  // Новый параметр

            // Query for all vacancies
            $query = Vacancy::with(['employer', 'favorites'])
                ->where('status', 'active')
                ->select('vacancies.*'); // Explicitly select all columns to ensure id is included

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhereHas('employer', function ($q) use ($search) {
                            $q->where('company_name', 'like', '%' . $search . '%');
                        });
                });
            }

            if ($location) {
                $query->where('location', 'like', '%' . $location . '%');
            }

            if (!empty($jobType)) {
                $query->whereIn('type', $jobType);
            }

            if ($salaryRange && is_array($salaryRange) && count($salaryRange) === 2) {
                $query->where('salary_start', '>=', $salaryRange[0])
                    ->where('salary_end', '<=', $salaryRange[1]);
            }

            if (!empty($skills)) {
                foreach ($skills as $skill) {
                    $query->whereJsonContains('skills', $skill);
                }
            }

            if ($industry) {  // Добавлен фильтр по industry_id
                $query->where('industry_id', $industry);
            }

            switch ($sortBy) {
                case 'date':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'salary_high':
                    $query->orderBy('salary_end', 'desc');
                    break;
                case 'salary_low':
                    $query->orderBy('salary_end', 'asc');
                    break;
                case 'relevance':
                default:
                    if ($jobseeker) {
                        $query->leftJoin('recommended', function ($join) use ($jobseeker) {
                            $join->on('vacancies.id', '=', 'recommended.vacancy_id')
                                ->where('recommended.job_seeker_profile_id', '=', $jobseeker->id);
                        })->orderByDesc('recommended.score');
                    } else {
                        $query->orderBy('created_at', 'desc');
                    }
                    break;
            }

            $vacancies = $query->paginate(5);

            // Transform vacancies to include isFavorite
            $vacancies->getCollection()->transform(function ($vacancy) use ($user) {
                $vacancy->isFavorite = $vacancy->favorites
                    ->where('user_id', $user->id)
                    ->where('vacancy_id', $vacancy->id)
                    ->isNotEmpty();
                return $vacancy;
            });

            // Query for recommended vacancies
            $recommendedQuery = Recommended::where('job_seeker_profile_id', $jobseeker?->id)
                ->with(['vacancy' => function ($query) {
                    $query->where('status', 'active')
                        ->select('vacancies.*') // Ensure all columns, including id, are selected
                        ->with('employer');
                }])
                ->whereHas('vacancy', function ($query) {
                    $query->where('status', 'active');
                });

            if ($search) {
                $recommendedQuery->where(function ($q) use ($search) {
                    $q->whereHas('vacancy', function ($q) use ($search) {
                        $q->where('title', 'like', '%' . $search . '%')
                            ->orWhereHas('employer', function ($q) use ($search) {
                                $q->where('company_name', 'like', '%' . $search . '%');
                            });
                    });
                });
            }

            if ($location) {
                $recommendedQuery->whereHas('vacancy', function ($q) use ($location) {
                    $q->where('location', 'like', '%' . $location . '%');
                });
            }

            if (!empty($jobType)) {
                $recommendedQuery->whereHas('vacancy', function ($q) use ($jobType) {
                    $q->whereIn('type', $jobType);
                });
            }

            if ($salaryRange && is_array($salaryRange) && count($salaryRange) === 2) {
                $recommendedQuery->whereHas('vacancy', function ($q) use ($salaryRange) {
                    $q->where('salary_start', '>=', $salaryRange[0])
                        ->where('salary_end', '<=', $salaryRange[1]);
                });
            }

            if (!empty($skills)) {
                $recommendedQuery->whereHas('vacancy', function ($q) use ($skills) {
                    foreach ($skills as $skill) {
                        $q->whereJsonContains('skills', $skill);
                    }
                });
            }

            if ($industry) {  // Добавлен фильтр по industry_id для recommended
                $recommendedQuery->whereHas('vacancy', function ($q) use ($industry) {
                    $q->where('industry_id', $industry);
                });
            }

            switch ($sortBy) {
                case 'date':
                    $recommendedQuery->orderByDesc('vacancy.created_at');
                    break;
                case 'salary_high':
                    $recommendedQuery->orderByDesc('vacancy.salary_end');
                    break;
                case 'salary_low':
                    $recommendedQuery->orderBy('vacancy.salary_end');
                    break;
                case 'relevance':
                default:
                    $recommendedQuery->orderByDesc('score');
                    break;
            }

            $recommendedVacancies = $recommendedQuery->paginate(5);

            // Transform recommended vacancies to include isFavorite
            $recommendedVacancies->getCollection()->transform(function ($recommended) use ($user) {
                if ($recommended->vacancy && $recommended->vacancy->id) {
                    $recommended->vacancy->isFavorite = Favorite::where('user_id', $user->id)
                        ->where('vacancy_id', $recommended->vacancy->id)
                        ->exists();
                }
                return $recommended;
            });

            // Log data for debugging
            Log::info('Vacancies Data', ['vacancies' => $vacancies->toArray()]);
            Log::info('Recommended Data', ['recommended' => $recommendedVacancies->toArray()]);

            $totalCountApplication = Application::where('job_seeker_profile_id', $jobseeker?->id)->count();
            $totalCountViews = CandidateView::where('job_seeker_profile_id',$jobseeker?->id)->count();
            $totalCountAllVacancies = $vacancies->toArray()['total'];
            $totalCountRecommendedVacancies = $recommendedVacancies->toArray()['total'];
            $response = [
                'role' => 'jobseeker',
                'recommended' => $recommendedVacancies,
                'jobseeker' => $jobseeker,
                'hasJobSeeker' => $hasJobSeeker,
                'vacancies' => $vacancies,
                'totalCountApplication' => $totalCountApplication,
                'totalCountViews' => $totalCountViews,
                'totalCountAllVacancies' => $totalCountAllVacancies,
                'totalCountRecommendedVacancies' => $totalCountRecommendedVacancies,
                'industries' => Industry::all(['id', 'name']),  // Добавлен список отраслей для Select
                'filters' => [
                    'search' => $search,
                    'location' => $location,
                    'jobType' => $jobType,
                    'salaryRange' => $salaryRange,
                    'skills' => $skills,
                    'sortBy' => $sortBy,
                    'industry' => $industry,  // Добавлен в filters
                ],
            ];
        }
//        elseif ($user->hasRole('employer')) {
//            $search = $validated['search'] ?? '';
//            $industry = $validated['industry'] ?? null;
//
//            $query = JobSeekerProfile::with([
//                'education' => fn($q) => $q->orderBy('sort_order'),
//                'experiences' => fn($q) => $q->orderBy('sort_order'),
//                'skills' => fn($q) => $q->orderBy('sort_order'),
//                'languages' => fn($q) => $q->orderBy('sort_order'),
//                'additions' => fn($q) => $q->orderBy('sort_order'),
//                'links',
//                'user',
//            ]);
//
//            if ($search) {
//                $query->where(function ($q) use ($search) {
//                    // Search in job_seeker_profiles string fields
//                    $q->where('first_name', 'like', '%' . $search . '%')
//                        ->orWhere('last_name', 'like', '%' . $search . '%')
//                        ->orWhere('middle_name', 'like', '%' . $search . '%')
//                        ->orWhere('location', 'like', '%' . $search . '%')
//                        ->orWhere('address', 'like', '%' . $search . '%')
//                        ->orWhere('summary', 'like', '%' . $search . '%')
//                        // Search in related tables
//                        ->orWhereHas('skills', function ($q) use ($search) {
//                            $q->where('name', 'like', '%' . $search . '%');
//                        })
//                        ->orWhereHas('experiences', function ($q) use ($search) {
//                            $q->where('job_title', 'like', '%' . $search . '%')
//                                ->orWhere('company_name', 'like', '%' . $search . '%')
//                                ->orWhere('company_address', 'like', '%' . $search . '%')
//                                ->orWhere('description', 'like', '%' . $search . '%');
//                        })
//                        ->orWhereHas('education', function ($q) use ($search) {
//                            $q->where('institution', 'like', '%' . $search . '%')
//                                ->orWhere('degree', 'like', '%' . $search . '%')
//                                ->orWhere('field_of_study', 'like', '%' . $search . '%')
//                                ->orWhere('description', 'like', '%' . $search . '%');
//                        })
//                        ->orWhereHas('additions', function ($q) use ($search) {
//                            $q->where('title', 'like', '%' . $search . '%')
//                                ->orWhere('description', 'like', '%' . $search . '%');
//                        })
//                        ->orWhereHas('languages', function ($q) use ($search) {
//                            $q->where('name', 'like', '%' . $search . '%');
//                        })
//                        ->orWhereHas('links', function ($q) use ($search) {
//                            $q->where('url', 'like', '%' . $search . '%');
//                        });
//                });
//            }
//
//            if ($industry) {
//                $query->where('industry_id', $industry);
//            }
//
//            $jobseekers = $query->orderBy('created_at', 'desc')->paginate(5);
//
//            $employer = Employer::where('user_id', auth()->id())->first();
//            $employerVacanciesId = $employer ? Vacancy::where('employer_id', $employer->id)->pluck('id')->toArray() : [];
//
//            // Fetch recommended job seekers with all specified relationships
//            $recommendedJobSeekers = Recommended::whereIn('vacancy_id', $employerVacanciesId)
//                ->with([
//                    'jobseeker' => function ($query) {
//                        $query->with([
//                            'education' => fn($q) => $q->orderBy('sort_order'),
//                            'experiences' => fn($q) => $q->orderBy('sort_order'),
//                            'skills' => fn($q) => $q->orderBy('sort_order'),
//                            'languages' => fn($q) => $q->orderBy('sort_order'),
//                            'additions' => fn($q) => $q->orderBy('sort_order'),
//                            'links',
//                            'user',
//                        ]);
//                    },
//                    'vacancy'
//                ])
//                ->orderBy('score', 'desc')
//                ->paginate(5);
//
//
//            $response = [
//                'role' => 'employer',
//                'jobseekers' => $jobseekers,
//                'recommended' => $recommendedJobSeekers,
//                'filters' => [
//                    'search' => $search,
//                    'industry' => $industry
//                ],
//                'vacanciesId'=>$employerVacanciesId,
//                'tab' => request()->input('tab', 'search'),
//            ];
//        }

        elseif ($user->hasRole('employer')) {
            $search = $validated['search'] ?? '';
            $industry = $validated['industry'] ?? null;
            $vacancy = $validated['vacancy'] ?? null; // Новый параметр

            $query = JobSeekerProfile::with([
                'education' => fn($q) => $q->orderBy('sort_order'),
                'experiences' => fn($q) => $q->orderBy('sort_order'),
                'skills' => fn($q) => $q->orderBy('sort_order'),
                'languages' => fn($q) => $q->orderBy('sort_order'),
                'additions' => fn($q) => $q->orderBy('sort_order'),
                'links',
                'user',
            ]);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', '%' . $search . '%')
                        ->orWhere('last_name', 'like', '%' . $search . '%')
                        ->orWhere('middle_name', 'like', '%' . $search . '%')
                        ->orWhere('location', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%')
                        ->orWhere('summary', 'like', '%' . $search . '%')
                        ->orWhereHas('skills', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('experiences', function ($q) use ($search) {
                            $q->where('job_title', 'like', '%' . $search . '%')
                                ->orWhere('company_name', 'like', '%' . $search . '%')
                                ->orWhere('company_address', 'like', '%' . $search . '%')
                                ->orWhere('description', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('education', function ($q) use ($search) {
                            $q->where('institution', 'like', '%' . $search . '%')
                                ->orWhere('degree', 'like', '%' . $search . '%')
                                ->orWhere('field_of_study', 'like', '%' . $search . '%')
                                ->orWhere('description', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('additions', function ($q) use ($search) {
                            $q->where('title', 'like', '%' . $search . '%')
                                ->orWhere('description', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('languages', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('links', function ($q) use ($search) {
                            $q->where('url', 'like', '%' . $search . '%');
                        });
                });
            }

            if ($industry) {
                $query->where('industry_id', $industry);
            }

            $jobseekers = $query->orderBy('created_at', 'desc')->paginate(5);

            $employer = Employer::where('user_id', auth()->id())->first();
            $employerVacanciesId = $employer ? Vacancy::where('employer_id', $employer->id)->pluck('id')->toArray() : [];
            $employerVacancies = $employer ? Vacancy::where('employer_id', $employer->id)->get(['id', 'title'])->toArray() : [];

            $recommendedQuery = Recommended::whereIn('vacancy_id', $employerVacanciesId)
                ->with([
                    'jobseeker' => function ($query) {
                        $query->with([
                            'education' => fn($q) => $q->orderBy('sort_order'),
                            'experiences' => fn($q) => $q->orderBy('sort_order'),
                            'skills' => fn($q) => $q->orderBy('sort_order'),
                            'languages' => fn($q) => $q->orderBy('sort_order'),
                            'additions' => fn($q) => $q->orderBy('sort_order'),
                            'links',
                            'user',
                        ]);
                    },
                    'vacancy'
                ]);

            if ($search) {
                $recommendedQuery->whereHas('jobseeker', function ($q) use ($search) {
                    $q->where('first_name', 'like', '%' . $search . '%')
                        ->orWhere('last_name', 'like', '%' . $search . '%')
                        ->orWhere('middle_name', 'like', '%' . $search . '%')
                        ->orWhere('location', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%')
                        ->orWhere('summary', 'like', '%' . $search . '%')
                        ->orWhereHas('skills', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('experiences', function ($q) use ($search) {
                            $q->where('job_title', 'like', '%' . $search . '%')
                                ->orWhere('company_name', 'like', '%' . $search . '%')
                                ->orWhere('company_address', 'like', '%' . $search . '%')
                                ->orWhere('description', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('education', function ($q) use ($search) {
                            $q->where('institution', 'like', '%' . $search . '%')
                                ->orWhere('degree', 'like', '%' . $search . '%')
                                ->orWhere('field_of_study', 'like', '%' . $search . '%')
                                ->orWhere('description', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('additions', function ($q) use ($search) {
                            $q->where('title', 'like', '%' . $search . '%')
                                ->orWhere('description', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('languages', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('links', function ($q) use ($search) {
                            $q->where('url', 'like', '%' . $search . '%');
                        });
                });
            }

            if ($industry) {
                $recommendedQuery->whereHas('jobseeker', function ($q) use ($industry) {
                    $q->where('industry_id', $industry);
                });
            }

            if ($vacancy) {
                $recommendedQuery->where('vacancy_id', $vacancy); // Фильтр по вакансии
            }

            $recommendedJobSeekers = $recommendedQuery->orderBy('score', 'desc')->paginate(5);

            $response = [
                'role' => 'employer',
                'jobseekers' => $jobseekers,
                'recommended' => $recommendedJobSeekers,
                'filters' => [
                    'search' => $search,
                    'industry' => $industry,
                    'vacancy' => $vacancy,
                ],
                'vacanciesId' => $employerVacanciesId,
                'vacancies' => $employerVacancies, // Передаем список вакансий
                'tab' => $validated['tab'] ?? 'search',
            ];
        }

        return Inertia::render('dashboard', $response);
    }


}
