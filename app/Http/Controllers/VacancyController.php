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
use App\Models\Industry;
use App\Models\Vacancies\Application;
use App\Models\Vacancies\Favorite;
use App\Models\Vacancies\Vacancy;
use App\Models\Vacancies\VacancyView;
use App\Models\Employer\EmployerView;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VacancyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employer = Employer::where('user_id',auth()->id())->first();
        $vacancies = Vacancy::where('employer_id', $employer->id)
            ->withCount(['views', 'applications'])
            ->orderBy('created_at', 'desc')
            ->paginate(5);
        $totalViews = $vacancies->getCollection()->sum('views_count');
        $totalApplications = $vacancies->getCollection()->sum('applications_count');
        $totalActiveVacancies = Vacancy::where('employer_id', $employer->id)
            ->where('status', 'active') // если используешь статус
            ->count();

        $vacancies->getCollection()->transform(function ($vacancy) {
            $vacancy->conversions = $vacancy->views_count > 0
                ? round(($vacancy->applications_count * 100) / $vacancy->views_count, 2)
                : 0;

            return $vacancy;
        });

        return Inertia::render('employer/vacancies/index',[
            'vacancies' => $vacancies,
            'totalViews' => $totalViews,
            'totalApplications' => $totalApplications,
            'totalActiveVacancies' => $totalActiveVacancies,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('employer/vacancies/create',[]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVacancyRequest $request)
    {
        $validated = $request->validated();
        $auth = auth()->user();
        $employer = Employer::where('user_id',$auth->id)->first();
        if ($employer){
            $validated['employer_id'] = $employer->id;
        }else{
            Log::log('info','Employer errors');
            return back()->withErrors([]);
        }

        $industry = Industry::where('id',(int)$validated['industry_id'])->first();
        $validated['industry_id'] = $industry->id ?? 12;

        Vacancy::create($validated);

        return to_route('vacancies.index');

    }

    /**
     * Display the specified resource.
     */
    public function show(Vacancy $vacancy)
    {
        return Inertia::render('employer/vacancies/show',['vacancy' => $vacancy]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vacancy $vacancy)
    {

        return Inertia::render('employer/vacancies/edit',[
            'vacancy'=>$vacancy
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function patch(PatchVacancyRequest $request,Vacancy $vacancy)
    {
        $validated = $request->validated();
        $auth = auth()->user();
        $employer = Employer::where('user_id',$auth->id)->first();
        if ($employer){
            $validated['employer_id'] = $employer->id;
        }else{
            return back()->withErrors([]);
        }

        $industry = Industry::where('id',(int)$validated['industry_id'])->first();
        $validated['industry_id'] = $industry->id ?? 12;

        $vacancy->update($validated);

        return to_route('vacancies.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DestroyVacancyRequest $request,Vacancy $vacancy)
    {
        $validated = $request->validated();
        $vacancy->delete();

        return to_route('vacancies.index');
    }

    public function more(MoreVacancyRequest $request,Vacancy $vacancy)
    {
        $validated = $request->validated();

        return Inertia::render('jobseeker/show',['vacancy'=>$vacancy]);
    }

    public function save(SaveVacancyRequest $request,Vacancy $vacancy)
    {
        $validated = $request->validated();
        $user = auth()->user();

        if ($validated['save']===true) {
            Favorite::firstOrCreate([
                'user_id' => $user->id,
                'vacancy_id' => $vacancy->id,
            ]);
        } elseif ($validated['save']===false) {
            Favorite::where('user_id', $user->id)
                ->where('vacancy_id', $vacancy->id)
                ->delete();
        }else{
            return back()->withErrors([]);
        }

        return back();
    }

    public function application(ApplicationIndexRequest $request,Vacancy $vacancy)
    {
        $validated = $request->validated();

        return Inertia::render('jobseeker/application',['vacancy'=>$vacancy]);
    }

    public function applicationStore(ApplicationStoreRequest $request,Vacancy $vacancy)
    {
        $validated = $request->validated();

        $profile = auth()->user()?->profile;
        if (!$profile){
            return back()->withErrors(['profile'=>'Для начало вы должны заполнить резюме']);
        }
        Application::create([
            'description'=>$validated['description']??'',
            'salary_exception'=>$validated['salary_exception'] ?? '',
            'get_to_work' => !empty($validated['get_to_work'])
                ? Carbon::parse($validated['get_to_work'])->format('Y-m-d')
                : null,
            'vacancy_id'=>$vacancy->id,
            'job_seeker_profile_id'=>$profile->id,
        ]);
        return back();
    }

    public function view(ViewVacancyRequest $request,Vacancy $vacancy)
    {
        $validated = $request->validated();

        try {
            VacancyView::firstOrCreate([
                'vacancy_id' => $vacancy->id,
                'user_id' => auth()->id(),
            ]);

            // Fix employer profile view on vacancy view by jobseeker
            if ($vacancy->employer_id) {
                EmployerView::firstOrCreate([
                    'employer_id' => $vacancy->employer_id,
                    'user_id' => auth()->id(),
                ]);
            }
        }catch (\Exception $exception){
            return back()->withErrors([]);
        }

        return back();
    }

//    public function apply(ApplyVacancyRequest $request)
//    {
//        $validated = $request->validated();
//        $jobseeker = auth()->user()->profile;
//
//        $query = $jobseeker->applications()
//            ->with('vacancy.employer');
//
//        // Поиск по всем строковым полям (vacancy.title, vacancy.location, employer.company_name, vacancy.description, etc.)
//        if ($search = $request->input('search')) {
//            $query->where(function ($q) use ($search) {
//                $q->where('vacancies.title', 'like', "%{$search}%")
//                    ->orWhere('vacancies.location', 'like', "%{$search}%")
//                    ->orWhere('vacancies.description', 'like', "%{$search}%")
//                    ->orWhere('vacancies.benefits', 'like', "%{$search}%")
//                    ->orWhere('vacancies.responsibility', 'like', "%{$search}%")
//                    ->orWhere('vacancies.qualifications', 'like', "%{$search}%")
//                    ->orWhere('vacancies.experience', 'like', "%{$search}%")
//                    ->orWhere('vacancies.education', 'like', "%{$search}%")
//                    ->orWhereHas('employer', function ($eq) use ($search) {
//                        $eq->where('company_name', 'like', "%{$search}%")
//                            ->orWhere('company_address', 'like', "%{$search}%")
//                            ->orWhere('description', 'like', "%{$search}%");
//                    });
//            });
//        }
//
//        // Фильтр по статусу
//        if ($status = $request->input('status', 'all')) {
//            if ($status !== 'all') {
//                $query->where('applications.status', $status);
//            }
//        }
//
//        // Фильтр по типу работы
//        if ($type = $request->input('type', 'all')) {
//            if ($type !== 'all') {
//                $query->whereHas('vacancy', function ($q) use ($type) {
//                    $q->where('type', $type);
//                });
//            }
//        }
//
//        // Дополнительные фильтры (от себя): по дате подачи (from/to)
//        if ($date_from = $request->input('date_from')) {
//            $query->whereDate('applications.created_at', '>=', $date_from);
//        }
//        if ($date_to = $request->input('date_to')) {
//            $query->whereDate('applications.created_at', '<=', $date_to);
//        }
//
//        // Дополнительные фильтры (от себя): по минимальной/максимальной зарплате (только для salary_type = 'money')
//        if ($min_salary = $request->input('min_salary')) {
//            $query->whereHas('vacancy', function ($q) use ($min_salary) {
//                $q->where('salary_type', 'money')
//                    ->where('salary_start', '>=', (int)$min_salary);
//            });
//        }
//        if ($max_salary = $request->input('max_salary')) {
//            $query->whereHas('vacancy', function ($q) use ($max_salary) {
//                $q->where('salary_type', 'money')
//                    ->where('salary_end', '<=', (int)$max_salary);
//            });
//        }
//
//        // Дополнительный фильтр (от себя): по опыту работы (exact match or partial)
//        if ($experience = $request->input('experience')) {
//            $query->whereHas('vacancy', function ($q) use ($experience) {
//                $q->where('experience', 'like', "%{$experience}%");
//            });
//        }
//
//        $applications = $query->latest()->paginate(5)->withQueryString();
//
//        // Counts остаются общими (не фильтрованными), как в оригинале
//        $totalCountApplied = $jobseeker->applications()->where('status', 'applied')->count();
//        $totalCountRejected = $jobseeker->applications()->where('status', 'rejected')->count();
//        $totalCountAccepted = $jobseeker->applications()->where('status', 'accepted')->count();
//
//        return Inertia::render('jobseeker/apply', [
//            'applications' => $applications,
//            'totalCountApplied' => $totalCountApplied,
//            'totalCountRejected' => $totalCountRejected,
//            'totalCountAccepted' => $totalCountAccepted,
//            'filters' => $request->only(['search', 'status', 'type', 'date_from', 'date_to', 'min_salary', 'max_salary', 'experience']), // Для сохранения фильтров в props
//        ]);
//    }
//    public function saves(SavesVacancyRequest $request)
//    {
//        $validated = $request->validated();
//        $user = auth()->user();
//
//        $vacancyIds = $user->favorites()->pluck('vacancy_id');
//
//        $query = Vacancy::whereIn('id', $vacancyIds)->with('employer');
//
//        // Поиск по всем строковым полям (title, location, description, employer.company_name, etc.)
//        if ($search = $request->input('search')) {
//            $query->where(function ($q) use ($search) {
//                $q->where('title', 'like', "%{$search}%")
//                    ->orWhere('location', 'like', "%{$search}%")
//                    ->orWhere('description', 'like', "%{$search}%")
//                    ->orWhere('benefits', 'like', "%{$search}%")
//                    ->orWhere('responsibility', 'like', "%{$search}%")
//                    ->orWhere('qualifications', 'like', "%{$search}%")
//                    ->orWhere('experience', 'like', "%{$search}%")
//                    ->orWhere('education', 'like', "%{$search}%")
//                    ->orWhereHas('employer', function ($eq) use ($search) {
//                        $eq->where('company_name', 'like', "%{$search}%")
//                            ->orWhere('company_address', 'like', "%{$search}%")
//                            ->orWhere('description', 'like', "%{$search}%");
//                    });
//            });
//        }
//
//        // Фильтр по статусу вакансии (active/inactive, заменил original selectedStatus, так как он не подходит для saves)
//        if ($status = $request->input('status', 'all')) {
//            if ($status !== 'all') {
//                $query->where('status', $status);
//            }
//        }
//
//        // Фильтр по типу работы
//        if ($type = $request->input('type', 'all')) {
//            if ($type !== 'all') {
//                $query->where('type', $type);
//            }
//        }
//
//        // Дополнительные фильтры (от себя): по дате создания вакансии (from/to)
//        if ($date_from = $request->input('date_from')) {
//            $query->whereDate('created_at', '>=', $date_from);
//        }
//        if ($date_to = $request->input('date_to')) {
//            $query->whereDate('created_at', '<=', $date_to);
//        }
//
//        // Дополнительные фильтры (от себя): по минимальной/максимальной зарплате
//        if ($min_salary = $request->input('min_salary')) {
//            $query->where('salary_type', 'money')
//                ->where('salary_start', '>=', (int)$min_salary);
//        }
//        if ($max_salary = $request->input('max_salary')) {
//            $query->where('salary_type', 'money')
//                ->where('salary_end', '<=', (int)$max_salary);
//        }
//
//        // Дополнительный фильтр (от себя): по опыту работы
//        if ($experience = $request->input('experience')) {
//            $query->where('experience', 'like', "%{$experience}%");
//        }
//
//        $vacancies = $query->latest()->paginate(5)->withQueryString();
//
//        // Transform как в оригинале
//        $vacancies->getCollection()->transform(function ($vacancy) use ($user) {
//            $vacancy->isFavorite = $vacancy->favorites
//                ->where('user_id', $user->id)
//                ->where('vacancy_id', $vacancy->id)
//                ->isNotEmpty();
//            return $vacancy;
//        });
//
//        return Inertia::render('jobseeker/saves', [
//            'vacancies' => $vacancies,
//            'filters' => $request->only(['search', 'status', 'type', 'date_from', 'date_to', 'min_salary', 'max_salary', 'experience']),
//        ]);
//    }


    public function apply(ApplyVacancyRequest $request)
    {
        $validated = $request->validated();
        $jobseeker = auth()->user()->profile;

        $query = $jobseeker->applications()
            ->with('vacancy.employer');

        // Поиск по всем строковым полям (vacancy.title, vacancy.location, employer.company_name, vacancy.description, etc.)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('vacancies.title', 'like', "%{$search}%")
                    ->orWhere('vacancies.location', 'like', "%{$search}%")
                    ->orWhere('vacancies.description', 'like', "%{$search}%")
                    ->orWhere('vacancies.benefits', 'like', "%{$search}%")
                    ->orWhere('vacancies.responsibility', 'like', "%{$search}%")
                    ->orWhere('vacancies.qualifications', 'like', "%{$search}%")
                    ->orWhere('vacancies.experience', 'like', "%{$search}%")
                    ->orWhere('vacancies.education', 'like', "%{$search}%")
                    ->orWhereHas('employer', function ($eq) use ($search) {
                        $eq->where('company_name', 'like', "%{$search}%")
                            ->orWhere('company_address', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
            });
        }

        // Фильтр по статусу
        if ($status = $request->input('status', 'all')) {
            if ($status !== 'all') {
                $query->where('applications.status', $status);
            }
        }

        // Фильтр по типу работы
        if ($type = $request->input('type', 'all')) {
            if ($type !== 'all') {
                $query->whereHas('vacancy', function ($q) use ($type) {
                    $q->where('type', $type);
                });
            }
        }

        // Дополнительные фильтры (от себя): по дате подачи (from/to)
        if ($date_from = $request->input('date_from')) {
            $query->whereDate('applications.created_at', '>=', $date_from);
        }
        if ($date_to = $request->input('date_to')) {
            $query->whereDate('applications.created_at', '<=', $date_to);
        }

        // Дополнительные фильтры (от себя): по минимальной/максимальной зарплате (только для salary_type = 'money')
        if ($min_salary = $request->input('min_salary')) {
            $query->whereHas('vacancy', function ($q) use ($min_salary) {
                $q->where('salary_type', 'money')
                    ->where('salary_start', '>=', (int)$min_salary);
            });
        }
        if ($max_salary = $request->input('max_salary')) {
            $query->whereHas('vacancy', function ($q) use ($max_salary) {
                $q->where('salary_type', 'money')
                    ->where('salary_end', '<=', (int)$max_salary);
            });
        }

        // Дополнительный фильтр (от себя): по опыту работы (exact match or partial)
        if ($experience = $request->input('experience')) {
            $query->whereHas('vacancy', function ($q) use ($experience) {
                $q->where('experience', 'like', "%{$experience}%");
            });
        }

        // Новый фильтр по industry_id
        if ($industry = $request->input('industry')) {
            $query->whereHas('vacancy', function ($q) use ($industry) {
                $q->where('industry_id', $industry);
            });
        }

        $applications = $query->latest()->paginate(5)->withQueryString();

        // Counts остаются общими (не фильтрованными), как в оригинале
        $totalCountApplied = $jobseeker->applications()->where('status', 'applied')->count();
        $totalCountRejected = $jobseeker->applications()->where('status', 'rejected')->count();
        $totalCountAccepted = $jobseeker->applications()->where('status', 'accepted')->count();

        return Inertia::render('jobseeker/apply', [
            'applications' => $applications,
            'totalCountApplied' => $totalCountApplied,
            'totalCountRejected' => $totalCountRejected,
            'totalCountAccepted' => $totalCountAccepted,
            'industries' => Industry::all(['id', 'name']),  // Добавлен список отраслей для Select
            'filters' => $request->only(['search', 'status', 'type', 'date_from', 'date_to', 'min_salary', 'max_salary', 'experience', 'industry']), // Добавлен industry
        ]);
    }

    public function saves(SavesVacancyRequest $request)
    {
        $validated = $request->validated();
        $user = auth()->user();

        $vacancyIds = $user->favorites()->pluck('vacancy_id');

        $query = Vacancy::whereIn('id', $vacancyIds)->with('employer');

        // Поиск по всем строковым полям (title, location, description, employer.company_name, etc.)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('benefits', 'like', "%{$search}%")
                    ->orWhere('responsibility', 'like', "%{$search}%")
                    ->orWhere('qualifications', 'like', "%{$search}%")
                    ->orWhere('experience', 'like', "%{$search}%")
                    ->orWhere('education', 'like', "%{$search}%")
                    ->orWhereHas('employer', function ($eq) use ($search) {
                        $eq->where('company_name', 'like', "%{$search}%")
                            ->orWhere('company_address', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
            });
        }

        // Фильтр по статусу вакансии (active/inactive, заменил original selectedStatus, так как он не подходит для saves)
        if ($status = $request->input('status', 'all')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Фильтр по типу работы
        if ($type = $request->input('type', 'all')) {
            if ($type !== 'all') {
                $query->where('type', $type);
            }
        }

        // Дополнительные фильтры (от себя): по дате создания вакансии (from/to)
        if ($date_from = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $date_from);
        }
        if ($date_to = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $date_to);
        }

        // Дополнительные фильтры (от себя): по минимальной/максимальной зарплате
        if ($min_salary = $request->input('min_salary')) {
            $query->where('salary_type', 'money')
                ->where('salary_start', '>=', (int)$min_salary);
        }
        if ($max_salary = $request->input('max_salary')) {
            $query->where('salary_type', 'money')
                ->where('salary_end', '<=', (int)$max_salary);
        }

        // Дополнительный фильтр (от себя): по опыту работы
        if ($experience = $request->input('experience')) {
            $query->where('experience', 'like', "%{$experience}%");
        }

        // Новый фильтр по industry_id
        if ($industry = $request->input('industry')) {
            $query->where('industry_id', $industry);
        }

        $vacancies = $query->latest()->paginate(5)->withQueryString();

        // Transform как в оригинале
        $vacancies->getCollection()->transform(function ($vacancy) use ($user) {
            $vacancy->isFavorite = $vacancy->favorites
                ->where('user_id', $user->id)
                ->where('vacancy_id', $vacancy->id)
                ->isNotEmpty();
            return $vacancy;
        });

        return Inertia::render('jobseeker/saves', [
            'vacancies' => $vacancies,
            'industries' => Industry::all(['id', 'name']),  // Добавлен список отраслей для Select
            'filters' => $request->only(['search', 'status', 'type', 'date_from', 'date_to', 'min_salary', 'max_salary', 'experience', 'industry']), // Добавлен industry
        ]);
    }
}
