<?php

namespace App\Services;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\Recommended;
use App\Models\Vacancies\Vacancy;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class MatchingService
{
    /**
     * Calculate detailed match score and breakdown between a job seeker profile and a vacancy.
     */
    public function calculateMatch(JobSeekerProfile $profile, Vacancy $vacancy): array
    {
        $profile->loadMissing(['skills', 'experiences', 'education', 'industry']);
        $vacancy->loadMissing(['employer', 'industry']);

        // 1. Сбор навыков соискателя
        $candidateSkills = $profile->skills->pluck('name')->filter()->map(fn($s) => trim($s))->values()->toArray();
        $candidateSkillsLower = array_map('mb_strtolower', $candidateSkills);

        // 2. Сбор навыков вакансии
        $rawVacancySkills = is_array($vacancy->skills) ? $vacancy->skills : [];
        $vacancySkills = array_values(array_filter(array_map('trim', $rawVacancySkills)));
        $vacancySkillsLower = array_map('mb_strtolower', $vacancySkills);

        // Поиск совпавших и недостающих навыков
        $matchedSkills = [];
        $missingSkills = [];

        foreach ($vacancySkills as $vSkill) {
            $vSkillLower = mb_strtolower($vSkill);
            $found = false;

            foreach ($candidateSkills as $cSkill) {
                $cSkillLower = mb_strtolower($cSkill);
                if (
                    $vSkillLower === $cSkillLower ||
                    str_contains($cSkillLower, $vSkillLower) ||
                    str_contains($vSkillLower, $cSkillLower)
                ) {
                    $matchedSkills[] = $vSkill;
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                // Дополнительная проверка по тексту опыта и описанию
                $profileFullText = mb_strtolower($profile->summary . ' ' . $profile->experiences->pluck('description')->join(' ') . ' ' . $profile->experiences->pluck('job_title')->join(' '));
                if (str_contains($profileFullText, $vSkillLower)) {
                    $matchedSkills[] = $vSkill;
                } else {
                    $missingSkills[] = $vSkill;
                }
            }
        }

        $matchedSkills = array_values(array_unique($matchedSkills));
        $missingSkills = array_values(array_unique($missingSkills));

        // 3. Расчет баллов по категориям

        // А) Навыки (максимум 50 баллов)
        $totalVacancySkillsCount = count($vacancySkills);
        if ($totalVacancySkillsCount > 0) {
            $skillsScore = (count($matchedSkills) / $totalVacancySkillsCount) * 50;
        } else {
            $skillsScore = 40; // Если у вакансии явно не перечислены теги навыков
        }

        // Б) Название профессии / Отрасль (максимум 25 баллов)
        $industryScore = 0;
        $isSameIndustry = ($profile->industry_id && $profile->industry_id === $vacancy->industry_id);
        if ($isSameIndustry) {
            $industryScore += 15;
        }

        // Проверка совпадения слов в названии вакансии и описании/профессии соискателя
        $vacancyTitleLower = mb_strtolower($vacancy->title);
        $candidateSummaryLower = mb_strtolower($profile->summary ?? '');
        $candidateJobsLower = mb_strtolower($profile->experiences->pluck('job_title')->join(' '));

        $titleTokens = array_filter(preg_split('/[\s,\-\/]+/', $vacancyTitleLower), fn($w) => mb_strlen($w) > 2);
        $titleMatches = 0;
        foreach ($titleTokens as $token) {
            if (str_contains($candidateSummaryLower, $token) || str_contains($candidateJobsLower, $token) || in_array($token, $candidateSkillsLower)) {
                $titleMatches++;
            }
        }

        if (count($titleTokens) > 0 && $titleMatches > 0) {
            $industryScore += min(10, round(($titleMatches / count($titleTokens)) * 10));
        }

        // В) Опыт работы (максимум 15 баллов)
        $experienceScore = 10;
        $candidateExpYears = $this->calculateCandidateExperienceYears($profile);
        $requiredExpYears = $this->parseRequiredExperienceYears($vacancy->experience);

        $experienceMatch = true;
        if ($requiredExpYears > 0) {
            if ($candidateExpYears >= $requiredExpYears) {
                $experienceScore = 15;
            } elseif ($candidateExpYears >= ($requiredExpYears - 1)) {
                $experienceScore = 10;
            } else {
                $experienceScore = 5;
                $experienceMatch = false;
            }
        } else {
            $experienceScore = 15;
        }

        // Г) Локация и тип занятости (максимум 10 баллов)
        $locationScore = 0;
        $isRemote = ($vacancy->type === 'remote');
        $isSameLocation = (mb_strtolower(trim($profile->location ?? '')) === mb_strtolower(trim($vacancy->location ?? '')));

        if ($isRemote || $isSameLocation || empty($profile->location)) {
            $locationScore = 10;
        } else {
            $locationScore = 4;
        }

        // Итоговый процент соответствия (0 - 100)
        $rawScore = $skillsScore + $industryScore + $experienceScore + $locationScore;
        $scorePercent = (int) min(99, max(15, round($rawScore)));

        // 4. Формирование понятных причин совпадений и предупреждений
        $matchedReasons = [];
        $missingReasons = [];

        foreach (array_slice($matchedSkills, 0, 5) as $skill) {
            $matchedReasons[] = "✓ {$skill}";
        }

        if ($isSameIndustry && $profile->industry?->name) {
            $matchedReasons[] = "✓ Отрасль: {$profile->industry->name}";
        }

        if ($experienceMatch && $candidateExpYears > 0) {
            $matchedReasons[] = "✓ Опыт работы соответствует ({$candidateExpYears} " . $this->pluralYears($candidateExpYears) . ")";
        }

        if ($isRemote) {
            $matchedReasons[] = "✓ Удаленный формат работы";
        } elseif ($isSameLocation && !empty($profile->location)) {
            $matchedReasons[] = "✓ Локация: {$profile->location}";
        }

        // Недостающие требования
        foreach (array_slice($missingSkills, 0, 3) as $skill) {
            $missingReasons[] = "⚠️ Требуется: {$skill}";
        }

        if (!$experienceMatch && $requiredExpYears > $candidateExpYears) {
            $missingReasons[] = "⚠️ Требуется опыт от {$requiredExpYears} " . $this->pluralYears($requiredExpYears);
        }

        return [
            'score' => round($scorePercent / 100, 2), // 0.87
            'score_percent' => $scorePercent,          // 87
            'matched_skills' => $matchedSkills,
            'missing_skills' => $missingSkills,
            'matched_reasons' => $matchedReasons,
            'missing_reasons' => $missingReasons,
            'experience_match' => $experienceMatch,
            'location_match' => $isRemote || $isSameLocation,
            'candidate_exp_years' => $candidateExpYears,
            'required_exp_years' => $requiredExpYears,
        ];
    }

    /**
     * Recalculate and persist recommendations for a given job seeker profile.
     */
    public function recalculateForProfile(JobSeekerProfile $profile): Collection
    {
        $activeVacancies = Vacancy::where('status', 'active')->with('employer', 'industry')->get();
        $results = collect();

        foreach ($activeVacancies as $vacancy) {
            $match = $this->calculateMatch($profile, $vacancy);

            Recommended::updateOrCreate(
                [
                    'job_seeker_profile_id' => $profile->id,
                    'vacancy_id' => $vacancy->id,
                ],
                [
                    'score' => $match['score'],
                ]
            );

            $results->push([
                'vacancy' => $vacancy,
                'match' => $match,
            ]);
        }

        return $results->sortByDesc(fn($item) => $item['match']['score_percent'])->values();
    }

    /**
     * Get best matching candidates for a specific vacancy.
     */
    public function getBestCandidatesForVacancy(Vacancy $vacancy, int $limit = 10): Collection
    {
        $allProfiles = JobSeekerProfile::with(['user', 'skills', 'experiences', 'education', 'industry'])->get();
        $candidates = collect();

        $medals = ['🥇', '🥈', '🥉'];

        foreach ($allProfiles as $profile) {
            $match = $this->calculateMatch($profile, $vacancy);

            $candidates->push([
                'profile' => $profile,
                'user' => $profile->user,
                'match' => $match,
                'score_percent' => $match['score_percent'],
            ]);
        }

        $sorted = $candidates->sortByDesc('score_percent')->values()->take($limit);

        return $sorted->map(function ($candidate, $index) use ($medals) {
            $candidate['medal'] = $medals[$index] ?? '#' . ($index + 1);
            return $candidate;
        });
    }

    /**
     * Calculate Profile Completeness (0-100%) and return checklist.
     */
    public function calculateProfileCompleteness(JobSeekerProfile $profile): array
    {
        $profile->loadMissing(['skills', 'experiences', 'education', 'files', 'user']);

        $items = [
            [
                'key' => 'name',
                'title' => 'Имя и фамилия',
                'completed' => !empty(trim(($profile->first_name ?? '') . ($profile->last_name ?? ''))),
                'weight' => 20,
            ],
            [
                'key' => 'profession',
                'title' => 'Профессия и отрасль',
                'completed' => !empty($profile->summary) || !empty($profile->industry_id),
                'weight' => 15,
            ],
            [
                'key' => 'skills',
                'title' => 'Ключевые навыки',
                'completed' => $profile->skills->count() > 0,
                'weight' => 20,
            ],
            [
                'key' => 'experiences',
                'title' => 'Опыт работы',
                'completed' => $profile->experiences->count() > 0,
                'weight' => 15,
            ],
            [
                'key' => 'education',
                'title' => 'Образование',
                'completed' => $profile->education->count() > 0,
                'weight' => 15,
            ],
            [
                'key' => 'cv',
                'title' => 'Загруженное резюме (CV)',
                'completed' => ($profile->files?->count() ?? 0) > 0,
                'weight' => 15,
            ],
        ];

        $totalScore = 0;
        $checklist = [];

        foreach ($items as $item) {
            if ($item['completed']) {
                $totalScore += $item['weight'];
            }
            $checklist[] = [
                'key' => $item['key'],
                'title' => $item['title'],
                'completed' => $item['completed'],
            ];
        }

        return [
            'percentage' => $totalScore,
            'checklist' => $checklist,
            'is_complete' => $totalScore >= 80,
        ];
    }

    private function calculateCandidateExperienceYears(JobSeekerProfile $profile): int
    {
        $totalMonths = 0;
        foreach ($profile->experiences as $exp) {
            if (!$exp->start_date) continue;

            $start = Carbon::parse($exp->start_date);
            $end = ($exp->is_current || !$exp->end_date) ? Carbon::now() : Carbon::parse($exp->end_date);

            $months = max(1, $start->diffInMonths($end));
            $totalMonths += $months;
        }

        return max(0, (int) round($totalMonths / 12));
    }

    private function parseRequiredExperienceYears(?string $expString): int
    {
        if (empty($expString)) return 0;

        $expLower = mb_strtolower($expString);
        if (str_contains($expLower, 'без опыта') || str_contains($expLower, 'нет')) {
            return 0;
        }

        if (preg_match('/(\d+)\s*(?:год|лет|года|year|years)/u', $expLower, $matches)) {
            return (int) $matches[1];
        }

        if (preg_match('/(\d+)/', $expLower, $matches)) {
            return (int) $matches[1];
        }

        return 0;
    }

    private function pluralYears(int $n): string
    {
        $n10 = $n % 10;
        $n100 = $n % 100;
        if ($n10 == 1 && $n100 != 11) return 'год';
        if ($n10 >= 2 && $n10 <= 4 && ($n100 < 10 || $n100 >= 20)) return 'года';
        return 'лет';
    }
}
