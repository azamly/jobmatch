<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\Employer\EditEmployerRequest;
use App\Http\Requests\Settings\Employer\PatchEmployerRequest;
use App\Http\Requests\Vacancy\Employer\ApplicationRequest;
use App\Models\Employer\Employer;
use App\Models\Industry;
use App\Models\Recommended;
use App\Models\Vacancies\Application;
use App\Models\Vacancies\Vacancy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class EmployerController extends Controller
{
    public function edit(EditEmployerRequest $request):Response
    {
        $validated = $request->validated();

        $employer = auth()->user()->employer;

        return Inertia::render('settings/employer/edit',['employer'=>$employer]);
    }

    public function patch(PatchEmployerRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = auth()->user();
        $employer = $user->employer;

        if ($employer) {
            $employer->update($validated);
        } else {
            $validated['user_id'] = $user->id;
            Employer::create($validated);
        }

        return to_route('employer.edit');
    }

//    public function vacancyApplication(ApplicationRequest $request)
//    {
//        $user = auth()->user();
//        $applications = Application::whereHas('vacancy', function ($query) use ($user) {
//            $query->where('employer_id', $user->employer->id);
//        })
//            ->with([
//                'vacancy',
//                'jobseeker.education' => fn($q) => $q->orderBy('sort_order'),
//                'jobseeker.experiences' => fn($q) => $q->orderBy('sort_order'),
//                'jobseeker.skills' => fn($q) => $q->orderBy('sort_order'),
//                'jobseeker.languages' => fn($q) => $q->orderBy('sort_order'),
//                'jobseeker.additions' => fn($q) => $q->orderBy('sort_order'),
//                'jobseeker.links',
//                'jobseeker.user'
//            ])
//            ->latest()
//            ->paginate(5);
//
//
//        // Статистика по всем заявкам работодателя
//        $totalAccepted = Application::whereHas('vacancy', function ($query) use ($user) {
//            $query->where('employer_id', $user->employer->id);
//        })->where('status', 'accepted')->count();
//
//        $totalRejected = Application::whereHas('vacancy', function ($query) use ($user) {
//            $query->where('employer_id', $user->employer->id);
//        })->where('status', 'rejected')->count();
//
//        $totalApplied = Application::whereHas('vacancy', function ($query) use ($user) {
//            $query->where('employer_id', $user->employer->id);
//        })->where('status', 'applied')->count();
//        return Inertia::render('employer/applications', [
//            'applications' => $applications,
//            'totalCountAccepted' => $totalAccepted,
//            'totalCountRejected' => $totalRejected,
//            'totalCountApplied' => $totalApplied,
//        ]);
//    }

    public function vacancyApplication(Request $request)
    {
        $user = auth()->user();

        // Get filter parameters
        $search = $request->input('search');
        $status = $request->input('status');
        $vacancyId = $request->input('vacancy_id');

        // Build the query
        $query = Application::whereHas('vacancy', function ($query) use ($user) {
            $query->where('employer_id', $user->employer->id);
        })
            ->with([
                'vacancy',
                'jobseeker.education' => fn($q) => $q->orderBy('sort_order'),
                'jobseeker.experiences' => fn($q) => $q->orderBy('sort_order'),
                'jobseeker.skills' => fn($q) => $q->orderBy('sort_order'),
                'jobseeker.languages' => fn($q) => $q->orderBy('sort_order'),
                'jobseeker.additions' => fn($q) => $q->orderBy('sort_order'),
                'jobseeker.links',
                'jobseeker.user'
            ]);

        // Apply search filter
        if ($search) {
            $query->whereHas('vacancy', function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('company', 'like', '%' . $search . '%');
            });
        }

        // Apply status filter
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Apply vacancy filter
        if ($vacancyId && $vacancyId !== 'all') {
            $query->where('vacancy_id', $vacancyId);
        }

        // Order and paginate
        $applications = $query->latest()->paginate(5)->withQueryString();

        // Statistics
        $totalAccepted = Application::whereHas('vacancy', function ($query) use ($user) {
            $query->where('employer_id', $user->employer->id);
        })->where('status', 'accepted')->count();

        $totalRejected = Application::whereHas('vacancy', function ($query) use ($user) {
            $query->where('employer_id', $user->employer->id);
        })->where('status', 'rejected')->count();

        $totalApplied = Application::whereHas('vacancy', function ($query) use ($user) {
            $query->where('employer_id', $user->employer->id);
        })->where('status', 'applied')->count();

        // Get all vacancies for the filter dropdown
        $vacancies = Vacancy::where('employer_id', $user->employer->id)
            ->select('id', 'title')
            ->get();

        return Inertia::render('employer/applications', [
            'applications' => $applications,
            'totalCountAccepted' => $totalAccepted,
            'totalCountRejected' => $totalRejected,
            'totalCountApplied' => $totalApplied,
            'vacancies' => $vacancies,
            'vacanciesId' => $vacancies->pluck('id')->toArray()
        ]);
    }
    public function applicationStatus(Request $request)
    {
        $request->validate([
            'type'=>'string|required|in:accepted,rejected',
            'application_id'=>'integer|required'
        ]);

        $user = auth()->user();
        $employer = $user->employer;

        $application = Application::where('id',$request->get('application_id'))->first();
        if ($application===null){
            return back()->withErrors([]);
        }

        $application->status = $request->get('type');
        $application->save();

        return back();
    }

}
