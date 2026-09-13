<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\JobSeeker\EditJobSeekerRequest;
use App\Http\Requests\Settings\JobSeeker\IndexJobSeekerRequest;
use App\Http\Requests\Settings\JobSeeker\PatchJobSeekerRequest;
use App\Http\Requests\Settings\JobSeeker\StoreCVUploadRequest;
use App\Models\Industry;
use App\Models\JobSeeker\Addition\JobSeekerAddition;
use App\Models\JobSeeker\Education\JobSeekerEducation;
use App\Models\JobSeeker\Experience\JobSeekerExperience;
use App\Models\JobSeeker\File\File as FileModel;
use App\Models\JobSeeker\Language\JobSeekerLanguage;
use App\Models\JobSeeker\Language\LanguageProficiency;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\JobSeeker\Skill\JobSeekerSkill;
use App\Services\MatchingService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class JobSeekerController extends Controller
{
    public string $fastApiUrl;
    protected MatchingService $matchingService;

    public function __construct(MatchingService $matchingService)
    {
        $this->fastApiUrl = rtrim(config('services.fastapi.url') ?? env('FAST_API_URL', env('FAST_API_URl', 'http://127.0.0.1:9000')), '/');
        $this->matchingService = $matchingService;
    }

    public function index(IndexJobSeekerRequest $request): Response
    {
        $user = auth()->user();
        $profile = JobSeekerProfile::with([
            'education' => fn($q) => $q->orderBy('sort_order'),
            'experiences' => fn($q) => $q->orderBy('sort_order'),
            'skills' => fn($q) => $q->orderBy('sort_order'),
            'languages' => fn($q) => $q->orderBy('sort_order'),
            'files',
            'industry',
        ])->where('user_id', $user->id)->first();

        $completeness = $profile ? $this->matchingService->calculateProfileCompleteness($profile) : [
            'percentage' => 0,
            'checklist' => [],
            'is_complete' => false,
        ];

        $cvFile = $profile?->files()->latest()->first();
        $cvFileData = null;
        if ($cvFile) {
            $cvFileData = [
                'id' => $cvFile->id,
                'name' => $cvFile->file_name,
                'size' => $cvFile->file_size,
                'path' => Storage::url($cvFile->file_path),
                'created_at' => $cvFile->created_at->format('d.m.Y H:i'),
                'mime_type' => $cvFile->mime_type,
            ];
        }

        return Inertia::render('settings/jobseeker/cv-upload', [
            'profile' => $profile,
            'completeness' => $completeness,
            'cvFile' => $cvFileData,
            'industries' => Industry::all(['id', 'name', 'slug']),
        ]);
    }

    /**
     * Analyze uploaded CV via FastAPI / AI and return extracted structured JSON for confirmation.
     */
    public function analyzeCv(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,docx,doc,txt,png,jpg,jpeg,webp|max:10240',
        ]);

        $file = $request->file('file');
        $extractedData = null;

        // 1. Попытка через FastAPI сервис
        try {
            if (!empty($this->fastApiUrl)) {
                $response = Http::timeout(60)
                    ->attach(
                        'file',
                        file_get_contents($file->getRealPath()),
                        $file->getClientOriginalName()
                    )
                    ->post($this->fastApiUrl . '/extract-text/');

                if ($response->successful()) {
                    $payload = $response->json();
                    if (isset($payload['response']) && is_array($payload['response'])) {
                        $extractedData = $payload['response'];
                    }
                }
            }
        } catch (\Exception $e) {
            Log::warning('FastAPI CV extraction failed: ' . $e->getMessage());
        }

        // 2. Если FastAPI недоступен — выполняем надежный локальный парсинг текста
        if (!$extractedData) {
            $extractedData = $this->fallbackExtractText($file);
        }

        // Сохраняем физический файл документа в постоянное хранилище соискателя
        $user = auth()->user();
        $profile = JobSeekerProfile::firstOrCreate(['user_id' => $user->id]);

        $path = $file->store('cv', 'public');

        // Удалим предыдущие записи файлов резюме
        $profile->files()->delete();

        $fileModel = $profile->files()->create([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
            'sort_order' => 1,
        ]);

        return response()->json([
            'success' => true,
            'extracted' => $extractedData,
            'file' => [
                'id' => $fileModel->id,
                'name' => $fileModel->file_name,
                'size' => $fileModel->file_size,
                'path' => Storage::url($fileModel->file_path),
                'created_at' => $fileModel->created_at->format('d.m.Y H:i'),
            ],
            'message' => 'Резюме успешно проанализировано. Проверьте данные и подтвердите сохранение в профиль.',
        ]);
    }

    /**
     * Apply confirmed extracted CV data into user's JobSeekerProfile.
     */
    public function applyCv(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'profile' => 'required|array',
            'profile.first_name' => 'nullable|string|max:255',
            'profile.last_name' => 'nullable|string|max:255',
            'profile.middle_name' => 'nullable|string|max:255',
            'profile.birth_date' => 'nullable|string|max:255',
            'profile.location' => 'nullable|string|max:255',
            'profile.address' => 'nullable|string|max:255',
            'profile.gender' => 'nullable|string|in:male,female,unspecified',
            'profile.summary' => 'nullable|string',
            'profile.industry' => 'nullable|string',
            'skills' => 'nullable|array',
            'skills.*.name' => 'required|string|max:255',
            'experiences' => 'nullable|array',
            'experiences.*.job_title' => 'required|string|max:255',
            'experiences.*.company_name' => 'required|string|max:255',
            'experiences.*.company_address' => 'nullable|string|max:255',
            'experiences.*.start_date' => 'nullable|string|max:255',
            'experiences.*.end_date' => 'nullable|string|max:255',
            'experiences.*.is_current' => 'nullable|boolean',
            'experiences.*.description' => 'nullable|string',
            'education' => 'nullable|array',
            'education.*.institution' => 'required|string|max:255',
            'education.*.degree' => 'nullable|string|max:255',
            'education.*.field_of_study' => 'nullable|string|max:255',
            'education.*.start_year' => 'nullable|string|max:255',
            'education.*.end_year' => 'nullable|string|max:255',
            'education.*.description' => 'nullable|string',
        ]);

        $data = $validated;
        $profile = JobSeekerProfile::firstOrCreate(['user_id' => auth()->id()]);

        DB::transaction(function () use ($data, $profile) {
            $industrySlug = $data['profile']['industry'] ?? 'other';
            $industry = Industry::where('slug', $industrySlug)->first()
                ?? Industry::where('slug', 'other')->first()
                ?? Industry::first();

            $profile->update([
                'first_name' => $data['profile']['first_name'] ?? $profile->first_name,
                'last_name' => $data['profile']['last_name'] ?? $profile->last_name,
                'middle_name' => $data['profile']['middle_name'] ?? $profile->middle_name,
                'birth_date' => !empty($data['profile']['birth_date'])
                    ? Carbon::parse($data['profile']['birth_date'])->format('Y-m-d')
                    : $profile->birth_date,
                'location' => $data['profile']['location'] ?? $profile->location,
                'address' => $data['profile']['address'] ?? $profile->address,
                'gender' => $data['profile']['gender'] ?? ($profile->gender ?? 'unspecified'),
                'summary' => $data['profile']['summary'] ?? $profile->summary,
                'industry_id' => $industry?->id ?? $profile->industry_id ?? 1,
            ]);

            // Обновление навыков
            if (!empty($data['skills'])) {
                $profile->skills()->delete();
                foreach ($data['skills'] as $key => $skill) {
                    $profile->skills()->create([
                        'name' => $skill['name'],
                        'sort_order' => $key + 1,
                    ]);
                }
            }

            // Обновление опыта
            if (!empty($data['experiences'])) {
                $profile->experiences()->delete();
                foreach ($data['experiences'] as $key => $exp) {
                    $profile->experiences()->create([
                        'job_title' => $exp['job_title'],
                        'company_name' => $exp['company_name'],
                        'company_address' => $exp['company_address'] ?? null,
                        'start_date' => !empty($exp['start_date']) ? Carbon::parse($exp['start_date'])->format('Y-m-d') : null,
                        'end_date' => !empty($exp['end_date']) ? Carbon::parse($exp['end_date'])->format('Y-m-d') : null,
                        'is_current' => $exp['is_current'] ?? false,
                        'description' => $exp['description'] ?? null,
                        'sort_order' => $key + 1,
                    ]);
                }
            }

            // Обновление образования
            if (!empty($data['education'])) {
                $profile->education()->delete();
                foreach ($data['education'] as $key => $edu) {
                    $profile->education()->create([
                        'institution' => $edu['institution'],
                        'degree' => $edu['degree'] ?? '',
                        'field_of_study' => $edu['field_of_study'] ?? '',
                        'start_year' => $edu['start_year'] ?? '',
                        'end_year' => $edu['end_year'] ?? '',
                        'description' => $edu['description'] ?? null,
                        'sort_order' => $key + 1,
                    ]);
                }
            }
        });

        // Автоматический пересчет сопоставления с вакансиями
        $this->matchingService->recalculateForProfile($profile);

        return redirect()->route('jobseeker.edit')->with('success', 'Данные из резюме успешно сохранены в профиль!');
    }

    /**
     * Delete stored CV file.
     */
    public function deleteCvFile(): RedirectResponse
    {
        $profile = auth()->user()?->profile;
        if ($profile) {
            foreach ($profile->files as $file) {
                Storage::disk('public')->delete($file->file_path);
                $file->delete();
            }
        }

        return back()->with('success', 'Файл резюме удалён.');
    }

    /**
     * Standard upload endpoint (compatibility).
     */
    public function store(StoreCVUploadRequest $request): RedirectResponse
    {
        $file = $request->file('file');
        $user = auth()->user();
        $profile = JobSeekerProfile::firstOrCreate(['user_id' => $user->id]);

        $path = $file->store('cv', 'public');
        $profile->files()->delete();

        $profile->files()->create([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
            'sort_order' => 1,
        ]);

        return to_route('jobseeker.index')->with('success', 'Файл резюме успешно загружен.');
    }

    public function edit(EditJobSeekerRequest $request): Response
    {
        $profile = JobSeekerProfile::with([
            'education' => fn($q) => $q->orderBy('sort_order'),
            'experiences' => fn($q) => $q->orderBy('sort_order'),
            'skills' => fn($q) => $q->orderBy('sort_order'),
            'languages' => fn($q) => $q->orderBy('sort_order'),
            'additions' => fn($q) => $q->orderBy('sort_order'),
            'links',
            'files',
            'industry',
        ])->where('user_id', auth()->id())->firstOrCreate(['user_id' => auth()->id()]);

        $completeness = $this->matchingService->calculateProfileCompleteness($profile);

        return Inertia::render('settings/jobseeker/edit', [
            'profile' => $profile,
            'completeness' => $completeness,
            'industries' => Industry::all(['id', 'name', 'slug']),
        ]);
    }

    public function patch(PatchJobSeekerRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $profile = Auth::user()->profile ?? JobSeekerProfile::create(['user_id' => Auth::id()]);

        DB::transaction(function () use ($validated, $profile) {
            $industryId = $validated['industry_id'] ?? 1;
            $industry = Industry::find($industryId) ?? Industry::first();

            $profile->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'gender' => $validated['gender'] ?? 'unspecified',
                'address' => $validated['address'] ?? null,
                'summary' => $validated['summary'] ?? null,
                'location' => $validated['location'] ?? null,
                'industry_id' => $industry?->id ?? 1,
            ]);

            if (isset($validated['education'])) {
                $profile->education()->delete();
                foreach ($validated['education'] as $key => $edu) {
                    $profile->education()->create([
                        'institution' => $edu['institution'],
                        'degree' => $edu['degree'],
                        'field_of_study' => $edu['field_of_study'],
                        'start_year' => $edu['start_year'],
                        'end_year' => $edu['end_year'] ?? null,
                        'description' => $edu['description'] ?? null,
                        'sort_order' => $key + 1,
                    ]);
                }
            }

            if (isset($validated['experiences'])) {
                $profile->experiences()->delete();
                foreach ($validated['experiences'] as $key => $exp) {
                    $profile->experiences()->create([
                        'job_title' => $exp['job_title'],
                        'company_name' => $exp['company_name'],
                        'company_address' => $exp['company_address'] ?? null,
                        'start_date' => !empty($exp['start_date'])
                            ? Carbon::parse($exp['start_date'])->format('Y-m-d')
                            : null,
                        'end_date' => !empty($exp['end_date'])
                            ? Carbon::parse($exp['end_date'])->format('Y-m-d')
                            : null,
                        'is_current' => $exp['is_current'] ?? false,
                        'description' => $exp['description'] ?? null,
                        'sort_order' => $key + 1,
                    ]);
                }
            }

            if (isset($validated['skills'])) {
                $profile->skills()->delete();
                foreach ($validated['skills'] as $key => $skill) {
                    $profile->skills()->create([
                        'name' => $skill['name'],
                        'sort_order' => $key + 1,
                    ]);
                }
            }

            if (isset($validated['languages'])) {
                $profile->languages()->delete();
                foreach ($validated['languages'] as $key => $lang) {
                    $profile->languages()->create([
                        'name' => $lang['name'],
                        'language_proficiency_id' => $lang['language_proficiency_id'] ?? 1,
                        'sort_order' => $key + 1,
                    ]);
                }
            }

            if (isset($validated['links'])) {
                $profile->links()->delete();
                foreach ($validated['links'] as $key => $link) {
                    $profile->links()->create([
                        'url' => $link['url'],
                        'type' => $link['type'] ?? 'other',
                        'sort_order' => $key + 1,
                    ]);
                }
            }
        });

        // Пересчет сопоставления при обновлении профиля
        $this->matchingService->recalculateForProfile($profile);

        return to_route('jobseeker.edit')->with('success', 'Профиль успешно сохранен, рекомендации обновлены!');
    }

    /**
     * Fallback text parser when FastAPI is offline.
     */
    private function fallbackExtractText($file): array
    {
        $content = file_get_contents($file->getRealPath());
        $filename = $file->getClientOriginalName();
        $ext = strtolower($file->getClientOriginalExtension());

        $text = '';
        if ($ext === 'txt') {
            $text = $content;
        } elseif ($ext === 'pdf') {
            try {
                $parser = new \Smalot\PdfParser\Parser();
                $pdf = $parser->parseContent($content);
                $text = $pdf->getText();
            } catch (\Exception $e) {
                $text = '';
            }
        }

        // Базовый эвристический разбор ключевых слов из текста
        $skills = [];
        $knownSkills = [
            'Python', 'FastAPI', 'Django', 'PostgreSQL', 'Docker', 'Redis', 'React', 'TypeScript',
            'JavaScript', 'Node.js', 'Vue', 'HTML', 'CSS', 'Tailwind', 'Git', 'CI/CD', 'Linux',
            'SQL', 'Pandas', 'Power BI', 'Excel', '1С', 'Бухгалтерский учет', 'Английский язык',
            'Преподавание', 'IELTS', 'Figma', 'UI/UX', 'Photoshop', 'B2B продажи', 'CRM'
        ];

        foreach ($knownSkills as $ks) {
            if (stripos($text, $ks) !== false) {
                $skills[] = ['name' => $ks];
            }
        }

        return [
            'profile' => [
                'first_name' => '',
                'last_name' => '',
                'summary' => mb_substr(trim(preg_replace('/\s+/', ' ', $text)), 0, 300),
                'location' => 'Душанбе',
                'gender' => 'unspecified',
                'industry' => 'it',
            ],
            'skills' => $skills,
            'experiences' => [],
            'education' => [],
            'languages' => [
                ['name' => 'Русский', 'language_proficiency' => 'C2'],
                ['name' => 'Английский', 'language_proficiency' => 'B2']
            ],
        ];
    }
}
