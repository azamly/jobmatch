<?php

namespace App\Http\Controllers;

use App\Models\CandidateView;
use App\Models\Employer\Employer;
use App\Models\Industry;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\Recommended;
use App\Models\Vacancies\Application;
use App\Models\Vacancies\Favorite;
use App\Models\Vacancies\Vacancy;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected MatchingService $matchingService;

    public function __construct(MatchingService $matchingService)
    {
        $this->matchingService = $matchingService;
    }

    public function index(Request $request): Response
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
            'vacancy' => 'nullable|integer|exists:vacancies,id',
            'tab' => 'nullable|in:all,recommended,search',
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
                'files',
                'user',
                'industry',
            ])->where('user_id', auth()->id())->first();

            $hasJobSeeker = $jobseeker !== null;
            $completeness = $jobseeker ? $this->matchingService->calculateProfileCompleteness($jobseeker) : null;

            // Если у соискателя еще нет записей в таблице recommended, рассчитаем их
            if ($jobseeker && Recommended::where('job_seeker_profile_id', $jobseeker->id)->count() === 0) {
                $this->matchingService->recalculateForProfile($jobseeker);
            }

            $search = $validated['search'] ?? '';
            $location = $validated['location'] ?? '';
            $jobType = $validated['jobType'] ?? [];
            $salaryRange = $validated['salaryRange'] ?? [0, 100000];
            $skills = $validated['skills'] ?? [];
            $sortBy = $validated['sortBy'] ?? 'relevance';
            $industry = $validated['industry'] ?? null;

            // Базовый запрос для всех активных вакансий
            $query = Vacancy::with(['employer', 'favorites', 'industry'])
                ->where('status', 'active');

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('description', 'like', '%' . $search . '%')
                        ->orWhere('qualifications', 'like', '%' . $search . '%')
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

            if ($industry) {
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
                    $query->orderBy('salary_start', 'asc');
                    break;
                case 'relevance':
                default:
                    if ($jobseeker) {
                        $query->leftJoin('recommended', function ($join) use ($jobseeker) {
                            $join->on('vacancies.id', '=', 'recommended.vacancy_id')
                                ->where('recommended.job_seeker_profile_id', '=', $jobseeker->id);
                        })->select('vacancies.*')->orderByDesc('recommended.score')->orderByDesc('vacancies.created_at');
                    } else {
                        $query->orderBy('created_at', 'desc');
                    }
                    break;
            }

            $vacancies = $query->paginate(10)->withQueryString();

            // Обогащаем вакансии информацией о совпадении и избранном
            $vacancies->getCollection()->transform(function ($vacancy) use ($user, $jobseeker) {
                $vacancy->isFavorite = $vacancy->favorites
                    ->where('user_id', $user->id)
                    ->isNotEmpty();

                if ($jobseeker) {
                    $vacancy->match = $this->matchingService->calculateMatch($jobseeker, $vacancy);
                    $vacancy->score = $vacancy->match['score'];
                }

                return $vacancy;
            });

            // Рекомендованные вакансии
            $recommendedQuery = Recommended::where('job_seeker_profile_id', $jobseeker?->id)
                ->with(['vacancy.employer', 'vacancy.industry'])
                ->whereHas('vacancy', function ($query) {
                    $query->where('status', 'active');
                });

            if ($search) {
                $recommendedQuery->whereHas('vacancy', function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhereHas('employer', function ($q) use ($search) {
                            $q->where('company_name', 'like', '%' . $search . '%');
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

            if ($industry) {
                $recommendedQuery->whereHas('vacancy', function ($q) use ($industry) {
                    $q->where('industry_id', $industry);
                });
            }

            $recommendedVacancies = $recommendedQuery->orderByDesc('score')->paginate(10)->withQueryString();

            $recommendedVacancies->getCollection()->transform(function ($recommended) use ($user, $jobseeker) {
                if ($recommended->vacancy) {
                    $recommended->vacancy->isFavorite = Favorite::where('user_id', $user->id)
                        ->where('vacancy_id', $recommended->vacancy->id)
                        ->exists();

                    if ($jobseeker) {
                        $recommended->vacancy->match = $this->matchingService->calculateMatch($jobseeker, $recommended->vacancy);
                        $recommended->score = $recommended->vacancy->match['score'];
                    }
                }
                return $recommended;
            });

            $totalCountApplication = Application::where('job_seeker_profile_id', $jobseeker?->id)->count();
            $totalCountViews = CandidateView::where('job_seeker_profile_id', $jobseeker?->id)->count();
            $totalCountAllVacancies = Vacancy::where('status', 'active')->count();
            $totalCountRecommendedVacancies = $recommendedVacancies->total();

            $response = [
                'role' => 'jobseeker',
                'recommended' => $recommendedVacancies,
                'jobseeker' => $jobseeker,
                'hasJobSeeker' => $hasJobSeeker,
                'completeness' => $completeness,
                'vacancies' => $vacancies,
                'totalCountApplication' => $totalCountApplication,
                'totalCountViews' => $totalCountViews,
                'totalCountAllVacancies' => $totalCountAllVacancies,
                'totalCountRecommendedVacancies' => $totalCountRecommendedVacancies,
                'industries' => Industry::all(['id', 'name', 'slug']),
                'filters' => [
                    'search' => $search,
                    'location' => $location,
                    'jobType' => $jobType,
                    'salaryRange' => $salaryRange,
                    'skills' => $skills,
                    'sortBy' => $sortBy,
                    'industry' => $industry,
                ],
            ];
        } elseif ($user->hasRole('employer')) {
            $search = $validated['search'] ?? '';
            $industry = $validated['industry'] ?? null;
            $vacancyId = $validated['vacancy'] ?? null;

            $query = JobSeekerProfile::with([
                'education' => fn($q) => $q->orderBy('sort_order'),
                'experiences' => fn($q) => $q->orderBy('sort_order'),
                'skills' => fn($q) => $q->orderBy('sort_order'),
                'languages' => fn($q) => $q->orderBy('sort_order'),
                'links',
                'user',
                'industry',
            ]);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', '%' . $search . '%')
                        ->orWhere('last_name', 'like', '%' . $search . '%')
                        ->orWhere('summary', 'like', '%' . $search . '%')
                        ->orWhereHas('skills', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            }

            if ($industry) {
                $query->where('industry_id', $industry);
            }

            $jobseekers = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

            $employer = Employer::where('user_id', auth()->id())->first();
            $employerVacancies = $employer ? Vacancy::where('employer_id', $employer->id)->get(['id', 'title', 'skills', 'experience'])->toArray() : [];
            $employerVacanciesId = array_column($employerVacancies, 'id');

            // Рекомендованные кандидаты для выбранной вакансии (или первой активной)
            $targetVacancy = null;
            if ($vacancyId) {
                $targetVacancy = Vacancy::find($vacancyId);
            } elseif (!empty($employerVacancies)) {
                $targetVacancy = Vacancy::find($employerVacancies[0]['id']);
            }

            $recommendedCandidates = $targetVacancy ? $this->matchingService->getBestCandidatesForVacancy($targetVacancy, 10) : collect();

            $response = [
                'role' => 'employer',
                'jobseekers' => $jobseekers,
                'recommendedCandidates' => $recommendedCandidates,
                'targetVacancy' => $targetVacancy,
                'filters' => [
                    'search' => $search,
                    'industry' => $industry,
                    'vacancy' => $vacancyId,
                ],
                'vacanciesId' => $employerVacanciesId,
                'vacancies' => $employerVacancies,
                'tab' => $validated['tab'] ?? 'search',
            ];
        }

        return Inertia::render('dashboard', $response);
    }
}
