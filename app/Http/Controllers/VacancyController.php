<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vacancy\DestroyVacancyRequest;
use App\Http\Requests\Vacancy\Jobseeker\ApplicationIndexRequest;
use App\Http\Requests\Vacancy\Jobseeker\ApplicationStoreRequest;
use App\Http\Requests\Vacancy\Jobseeker\ApplyVacancyRequest;
use App\Http\Requests\Vacancy\Jobseeker\MoreVacancyRequest;
use App\Http\Requests\Vacancy\Jobseeker\SavesVacancyRequest;
use App\Http\Requests\Vacancy\Jobseeker\SaveVacancyRequest;
use App\Http\Requests\Vacancy\Jobseeker\ViewVacancyRequest;
use App\Http\Requests\Vacancy\PatchVacancyRequest;
use App\Http\Requests\Vacancy\StoreVacancyRequest;
use App\Models\Employer\Employer;
use App\Models\Employer\EmployerView;
use App\Models\Industry;
use App\Models\Vacancies\Application;
use App\Models\Vacancies\Favorite;
use App\Models\Vacancies\Vacancy;
use App\Models\Vacancies\VacancyView;
use App\Services\MatchingService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class VacancyController extends Controller
{
    protected MatchingService $matchingService;

    public function __construct(MatchingService $matchingService)
    {
        $this->matchingService = $matchingService;
    }

    /**
     * Display a listing of the resource (Employer).
     */
    public function index(): Response
    {
        $employer = Employer::where('user_id', auth()->id())->first();
        if (!$employer) {
            $employer = Employer::create([
                'user_id' => auth()->id(),
                'company_name' => auth()->user()->name,
            ]);
        }

        $vacancies = Vacancy::where('employer_id', $employer->id)
            ->withCount(['views', 'applications'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $totalViews = $vacancies->getCollection()->sum('views_count');
        $totalApplications = $vacancies->getCollection()->sum('applications_count');
        $totalActiveVacancies = Vacancy::where('employer_id', $employer->id)
            ->where('status', 'active')
            ->count();

        $vacancies->getCollection()->transform(function ($vacancy) {
            $vacancy->conversions = $vacancy->views_count > 0
                ? round(($vacancy->applications_count * 100) / $vacancy->views_count, 2)
                : 0;

            return $vacancy;
        });

        return Inertia::render('employer/vacancies/index', [
            'vacancies' => $vacancies,
            'totalViews' => $totalViews,
            'totalApplications' => $totalApplications,
            'totalActiveVacancies' => $totalActiveVacancies,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('employer/vacancies/create', [
            'industries' => Industry::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVacancyRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $auth = auth()->user();
        $employer = Employer::where('user_id', $auth->id)->first();
        if (!$employer) {
            $employer = Employer::create([
                'user_id' => $auth->id,
                'company_name' => $auth->name,
            ]);
        }
        $validated['employer_id'] = $employer->id;

        $industry = Industry::where('id', (int) ($validated['industry_id'] ?? 1))->first();
        $validated['industry_id'] = $industry->id ?? 1;

        $vacancy = Vacancy::create($validated);

        return to_route('vacancies.index')->with('success', 'Вакансия успешно создана');
    }

    /**
     * Display the specified resource for Employer (with AI Match Best Candidates).
     */
    public function show(Vacancy $vacancy): Response
    {
        $vacancy->load(['employer', 'industry', 'applications.jobSeekerProfile.user', 'views']);

        // Получаем лучших кандидатов через MatchingService
        $bestCandidates = $this->matchingService->getBestCandidatesForVacancy($vacancy, 8);

        return Inertia::render('employer/vacancies/show', [
            'vacancy' => $vacancy,
            'bestCandidates' => $bestCandidates,
            'applications' => $vacancy->applications,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vacancy $vacancy): Response
    {
        return Inertia::render('employer/vacancies/edit', [
            'vacancy' => $vacancy,
            'industries' => Industry::all(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function patch(PatchVacancyRequest $request, Vacancy $vacancy): RedirectResponse
    {
        $validated = $request->validated();
        $auth = auth()->user();
        $employer = Employer::where('user_id', $auth->id)->first();
        if ($employer) {
            $validated['employer_id'] = $employer->id;
        }

        $industry = Industry::where('id', (int) ($validated['industry_id'] ?? 1))->first();
        $validated['industry_id'] = $industry->id ?? 1;

        $vacancy->update($validated);

        return to_route('vacancies.index')->with('success', 'Вакансия успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DestroyVacancyRequest $request, Vacancy $vacancy): RedirectResponse
    {
        $vacancy->delete();

        return to_route('vacancies.index')->with('success', 'Вакансия удалена');
    }

    /**
     * View vacancy details for Jobseeker with Match Score Breakdown.
     */
    public function more(MoreVacancyRequest $request, Vacancy $vacancy): Response
    {
        $vacancy->load(['employer', 'industry']);
        $user = auth()->user();
        $profile = $user?->profile;

        $match = null;
        if ($profile) {
            $match = $this->matchingService->calculateMatch($profile, $vacancy);
        }

        $hasApplied = false;
        if ($profile) {
            $hasApplied = Application::where('job_seeker_profile_id', $profile->id)
                ->where('vacancy_id', $vacancy->id)
                ->exists();
        }

        $isFavorite = false;
        if ($user) {
            $isFavorite = Favorite::where('user_id', $user->id)
                ->where('vacancy_id', $vacancy->id)
                ->exists();
        }

        // Фиксируем просмотр вакансии
        if ($user) {
            try {
                VacancyView::firstOrCreate([
                    'vacancy_id' => $vacancy->id,
                    'user_id' => $user->id,
                ]);
                if ($vacancy->employer_id) {
                    EmployerView::firstOrCreate([
                        'employer_id' => $vacancy->employer_id,
                        'user_id' => $user->id,
                    ]);
                }
            } catch (\Exception $e) {
                // Ignore view counter errors
            }
        }

        return Inertia::render('jobseeker/show', [
            'vacancy' => $vacancy,
            'match' => $match,
            'hasApplied' => $hasApplied,
            'isFavorite' => $isFavorite,
        ]);
    }

    /**
     * Quick Apply for Jobseeker.
     */
    public function quickApply(Request $request, Vacancy $vacancy): RedirectResponse
    {
        $user = auth()->user();
        $profile = $user?->profile;

        if (!$profile) {
            return redirect()->route('jobseeker.index')->with('error', 'Пожалуйста, заполните ваш профиль или загрузите CV перед откликом.');
        }

        $existing = Application::where('job_seeker_profile_id', $profile->id)
            ->where('vacancy_id', $vacancy->id)
            ->first();

        if ($existing) {
            return back()->with('info', 'Вы уже откликнулись на эту вакансию.');
        }

        Application::create([
            'job_seeker_profile_id' => $profile->id,
            'vacancy_id' => $vacancy->id,
            'status' => 'applied',
            'description' => $request->input('description', 'Быстрый отклик через профиль JobMatch'),
            'salary_exception' => $request->input('salary_exception', ''),
            'get_to_work' => Carbon::now()->addDays(7)->format('Y-m-d'),
        ]);

        return back()->with('success', 'Ваш отклик успешно отправлен работодателю!');
    }

    public function save(SaveVacancyRequest $request, Vacancy $vacancy): RedirectResponse
    {
        $validated = $request->validated();
        $user = auth()->user();

        if ($validated['save'] === true) {
            Favorite::firstOrCreate([
                'user_id' => $user->id,
                'vacancy_id' => $vacancy->id,
            ]);
        } elseif ($validated['save'] === false) {
            Favorite::where('user_id', $user->id)
                ->where('vacancy_id', $vacancy->id)
                ->delete();
        }

        return back();
    }

    public function application(ApplicationIndexRequest $request, Vacancy $vacancy): Response
    {
        $vacancy->load(['employer', 'industry']);
        $profile = auth()->user()?->profile;
        $match = $profile ? $this->matchingService->calculateMatch($profile, $vacancy) : null;

        return Inertia::render('jobseeker/application', [
            'vacancy' => $vacancy,
            'match' => $match,
        ]);
    }

    public function applicationStore(ApplicationStoreRequest $request, Vacancy $vacancy): RedirectResponse
    {
        $validated = $request->validated();
        $profile = auth()->user()?->profile;
        if (!$profile) {
            return back()->withErrors(['profile' => 'Сначала заполните профиль или загрузите резюме']);
        }

        Application::updateOrCreate(
            [
                'job_seeker_profile_id' => $profile->id,
                'vacancy_id' => $vacancy->id,
            ],
            [
                'description' => $validated['description'] ?? '',
                'salary_exception' => $validated['salary_exception'] ?? '',
                'get_to_work' => !empty($validated['get_to_work'])
                    ? Carbon::parse($validated['get_to_work'])->format('Y-m-d')
                    : null,
                'status' => 'applied',
            ]
        );

        return redirect()->route('vacancies.apply')->with('success', 'Отклик успешно отправлен!');
    }

    public function view(ViewVacancyRequest $request, Vacancy $vacancy): RedirectResponse
    {
        try {
            VacancyView::firstOrCreate([
                'vacancy_id' => $vacancy->id,
                'user_id' => auth()->id(),
            ]);

            if ($vacancy->employer_id) {
                EmployerView::firstOrCreate([
                    'employer_id' => $vacancy->employer_id,
                    'user_id' => auth()->id(),
                ]);
            }
        } catch (\Exception $exception) {
            // Ignore
        }

        return back();
    }

    /**
     * Jobseeker My Applications list.
     */
    public function apply(ApplyVacancyRequest $request): Response
    {
        $user = auth()->user();
        $jobseeker = $user?->profile;

        if (!$jobseeker) {
            return Inertia::render('jobseeker/apply', [
                'applications' => [
                    'data' => [],
                    'total' => 0,
                    'current_page' => 1,
                    'last_page' => 1,
                    'links' => [],
                ],
                'totalCountApplied' => 0,
                'totalCountRejected' => 0,
                'totalCountAccepted' => 0,
                'industries' => Industry::all(['id', 'name']),
                'filters' => [],
            ]);
        }

        $query = $jobseeker->applications()
            ->with(['vacancy.employer', 'vacancy.industry']);

        if ($search = $request->input('search')) {
            $query->whereHas('vacancy', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('employer', function ($eq) use ($search) {
                        $eq->where('company_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status', 'all')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        if ($type = $request->input('type', 'all')) {
            if ($type !== 'all') {
                $query->whereHas('vacancy', function ($q) use ($type) {
                    $q->where('type', $type);
                });
            }
        }

        $applications = $query->latest()->paginate(10)->withQueryString();

        $totalCountApplied = $jobseeker->applications()->where('status', 'applied')->count();
        $totalCountRejected = $jobseeker->applications()->where('status', 'rejected')->count();
        $totalCountAccepted = $jobseeker->applications()->where('status', 'accepted')->count();

        return Inertia::render('jobseeker/apply', [
            'applications' => $applications,
            'totalCountApplied' => $totalCountApplied,
            'totalCountRejected' => $totalCountRejected,
            'totalCountAccepted' => $totalCountAccepted,
            'industries' => Industry::all(['id', 'name']),
            'filters' => $request->only(['search', 'status', 'type', 'date_from', 'date_to']),
        ]);
    }

    public function saves(SavesVacancyRequest $request): Response
    {
        $user = auth()->user();
        $vacancyIds = $user->favorites()->pluck('vacancy_id');

        $query = Vacancy::whereIn('id', $vacancyIds)->with(['employer', 'industry']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('employer', function ($eq) use ($search) {
                        $eq->where('company_name', 'like', "%{$search}%");
                    });
            });
        }

        $vacancies = $query->latest()->paginate(10)->withQueryString();

        $vacancies->getCollection()->transform(function ($vacancy) use ($user) {
            $vacancy->isFavorite = true;
            return $vacancy;
        });

        return Inertia::render('jobseeker/saves', [
            'vacancies' => $vacancies,
            'industries' => Industry::all(['id', 'name']),
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }
}
