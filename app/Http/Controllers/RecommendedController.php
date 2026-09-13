<?php

namespace App\Http\Controllers;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\Vacancies\Vacancy;
use App\Services\MatchingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecommendedController extends Controller
{
    public string $fastApiUrl;
    protected MatchingService $matchingService;

    public function __construct(MatchingService $matchingService)
    {
        $this->fastApiUrl = rtrim(config('services.fastapi.url') ?? env('FAST_API_URL', env('FAST_API_URl', 'http://127.0.0.1:9000')), '/');
        $this->matchingService = $matchingService;
    }

    /**
     * Recalculate recommendations for a job seeker.
     */
    public function recommendVacancy($profileId): RedirectResponse
    {
        $profile = JobSeekerProfile::with(['experiences', 'skills', 'education'])->findOrFail($profileId);

        // Используем сервис сопоставления для точного и быстрого расчета
        $this->matchingService->recalculateForProfile($profile);

        return back()->with('success', 'Рекомендованные вакансии успешно обновлены на основе вашего профиля.');
    }

    /**
     * Recalculate candidates for employer vacancies.
     */
    public function recommendUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vacancyIds' => 'required|array|min:1',
            'vacancyIds.*' => 'integer|exists:vacancies,id',
        ]);

        $vacancyIds = $validated['vacancyIds'];
        $vacancies = Vacancy::whereIn('id', $vacancyIds)->get();

        foreach ($vacancies as $vacancy) {
            $this->matchingService->getBestCandidatesForVacancy($vacancy, 10);
        }

        return back()->with('success', 'Список рекомендованных кандидатов обновлен.');
    }
}
