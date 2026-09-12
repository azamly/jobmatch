<?php

namespace App\Http\Controllers;

use App\Models\Employer\Employer;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\Recommended;
use App\Models\Vacancies\Application;
use App\Models\Vacancies\Vacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecommendedController extends Controller
{
    public $fastApiUrl;
    public function __construct(){
        $this->fastApiUrl = rtrim(config('services.fastapi.url') ?? env('FAST_API_URL', env('FAST_API_URl', 'http://127.0.0.1:9000')), '/');
    }
    public function recommendVacancy($profileId)
    {
        $profile = JobSeekerProfile::with(['experiences', 'skills', 'education'])->findOrFail($profileId);
        $cvText = $profile->toText();

        // Ограничиваем выборку активными вакансиями
        $vacancies = Vacancy::where('status', 'active')->where('industry_id',$profile->industry_id)->get()->map(fn($v) => [
            'id' => $v->id,
            'text' => $v->toText()
        ])->toArray();

        $response = Http::post($this->fastApiUrl.'/match_vacancy', [
            'cv_id' => $profile->id,
            'cv_text' => $cvText,
            'vacancies' => $vacancies,
            'top_n' => 5
        ]);

        if (!$response->successful()) {
            return back()->with('error', 'Не удалось получить рекомендации от сервиса.');
        }

        $data = $response->json();

        foreach ($data['recommendations'] as $recommendation) {
            $rec = Recommended::where('job_seeker_profile_id', $data['cv_id'])
                ->where('vacancy_id', $recommendation['vacancy_id'])
                ->first();

            if (!$rec) {
                Recommended::create([
                    'job_seeker_profile_id' => $data['cv_id'],
                    'vacancy_id' => $recommendation['vacancy_id'],
                    'score' => $recommendation['score'],
                ]);
            } else {
                $rec->score = $recommendation['score'];
                $rec->save();
            }
        }

        return back()->with('success', 'Рекомендации успешно сохранены.');
    }

    public function recommendUser(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'vacancyIds' => 'required|array|min:1',
            'vacancyIds.*' => 'integer|exists:vacancies,id',
        ]);
        $vacancyIds = $validated['vacancyIds'];

        $vacancies = Vacancy::whereIn('id', $vacancyIds)->get();
        foreach ($vacancies as $vacancy) {
            $vacancyText = $vacancy->toText();
            $profiles = JobSeekerProfile::with(['experiences', 'skills', 'education'])->where('industry_id',$vacancy->industry_id)->get()->map(fn($v) => [
                'id' => $v->id,
                'text' => $v->toText()
            ])->toArray();
            $response = Http::post($this->fastApiUrl.'/match_user', [
                'vacancy_id' => $vacancy->id,
                'vacancy_text' => $vacancyText,
                'profiles' => $profiles,
                'top_n' => 5
            ]);

            if (!$response->successful()) {
                return back()->with('error', 'Не удалось получить рекомендации от сервиса.');
            }

            $data = $response->json();
            foreach ($data['recommendations'] as $recommendation) {
                $rec = Recommended::where('job_seeker_profile_id', $recommendation['profile_id'])
                    ->where('vacancy_id', $data['vacancy_id'])
                    ->first();

                if (!$rec) {
                    Recommended::create([
                        'job_seeker_profile_id' => $recommendation['profile_id'] ?? 8,
                        'vacancy_id' => $data['vacancy_id'],
                        'score' => $recommendation['score'],
                    ]);
                } else {
                    $rec->score = $recommendation['score'];
                    $rec->save();
                }
            }
        }
        return back();
    }
}
