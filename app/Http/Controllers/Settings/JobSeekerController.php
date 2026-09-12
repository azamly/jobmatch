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
use App\Models\JobSeeker\Language\JobSeekerLanguage;
use App\Models\JobSeeker\Language\LanguageProficiency;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\JobSeeker\Skill\JobSeekerSkill;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpWord\IOFactory;
use Smalot\PdfParser\Parser;

class JobSeekerController extends Controller
{
    public $fastApiUrl;
    public function __construct(){
        $this->fastApiUrl = rtrim(config('services.fastapi.url') ?? env('FAST_API_URL', env('FAST_API_URl', 'http://127.0.0.1:9000')), '/');
    }
    public function index(IndexJobSeekerRequest $request):Response
    {
        $validated = $request->validated();

        return Inertia::render('settings/jobseeker/cv-upload',[]);
    }

    public function store(StoreCVUploadRequest $request):RedirectResponse
    {
        $validated = $request->validated();
        $file = $request->file('file');

        if (empty($this->fastApiUrl)) {
            return back()->withErrors(['file' => 'FastAPI URL не настроен (FAST_API_URL).']);
        }

        $response = Http::timeout(300)
        ->attach(
            'file',
            file_get_contents($file->getRealPath()),
            $file->getClientOriginalName()
        )
            ->post(rtrim($this->fastApiUrl, '/').'/extract-text/');
        if ($response->failed()) {
            $apiError = $response->json('error') ?? $response->body();
            return back()->withErrors(['file' => 'Ошибка FastAPI: '.$apiError]);
        }

        $payload = $response->json();
        if (!isset($payload['response']) || !is_array($payload['response'])) {
            return back()->withErrors(['file' => 'FastAPI вернул пустой или неверный ответ']);
        }

        $data = $payload['response'];

        $db = DB::transaction(function () use ($data) {
            $industrySlug = $data['profile']['industry'] ?? 'other';
            $industry = Industry::where('slug', $industrySlug)->first()
                ?? Industry::where('slug', 'other')->first();
            $industryId = $industry?->id;
            $profile = JobSeekerProfile::firstOrCreate(
                ['user_id' => auth()->id()],
                [
                    'first_name' => $data['profile']['first_name'] ?? '',
                    'last_name' => $data['profile']['last_name'] ?? '',
                    'middle_name' => $data['profile']['middle_name'] ?? '',
                    'birth_date' => !empty($data['profile']['birth_date'])
                        ? Carbon::parse($data['profile']['birth_date'])->format('Y-m-d')
                        : null,
                    'location' => $data['profile']['location'] ?? '',
                    'address' => $data['profile']['address'] ?? '',
                    'gender' => !empty($data['profile']['gender'])
                        ? $data['profile']['gender']
                        : 'unspecified',
                    'summary' => $data['profile']['summary'] ?? '',
                    'industry_id' => $industryId,
                ]
            );

            // Счётчики sort_order
            $nextOrderSkill = $profile->skills()->max('sort_order') + 1;
            $nextOrderEducation = $profile->education()->max('sort_order') + 1;
            $nextOrderExperiences = $profile->experiences()->max('sort_order') + 1;
            $nextOrderLanguage = $profile->languages()->max('sort_order') + 1;

            // 2. Ссылки
            foreach ($data['profile']['links'] ?? [] as $link) {
                $profile->links()->create([
                    'url' => $link['url'],
                    'type' => $link['type'],
                ]);
            }

            // 3. Навыки
            foreach ($data['skills'] ?? [] as $skill) {
                $profile->skills()->create([
                    'job_seeker_profile_id' => $profile->id,
                    'name' => $skill['name'],
                    'sort_order' => $nextOrderSkill ?? 1
                ]);
                $nextOrderSkill++;
            }

            // 4. Образование
            foreach ($data['education'] ?? [] as $edu) {
                $profile->education()->create([
                    'institution' => $edu['institution'],
                    'degree' => $edu['degree'],
                    'field_of_study' => $edu['field_of_study'],
                    'start_year' => !empty($edu['start_year'])
                        ?(string) $edu['start_year']
                        : '',
                    'end_year' => !empty($edu['end_year'])
                        ?(string) $edu['end_year']
                        : '',
                    'description' => $edu['description'] ?? null,
                    'job_seeker_profile_id' => $profile->id,
                    'sort_order' => $nextOrderEducation ?? 1
                ]);
                $nextOrderEducation++;
            }

            // 5. Опыт работы
            foreach ($data['experiences'] ?? [] as $exp) {
                $profile->experiences()->create([
                    'job_title' => $exp['job_title'],
                    'company_name' => $exp['company_name'],
                    'company_address' => $exp['company_address'] ?? '',
                    'start_date' => !empty($exp['start_date'])
                        ? Carbon::parse($exp['start_date'])->format('Y-m-d')
                        : null,
                    'job_seeker_profile_id' => $profile->id,
                    'sort_order' => $nextOrderExperiences ?? 1,
                    'end_date' => !empty($exp['end_date'])
                        ? Carbon::parse($exp['end_date'])->format('Y-m-d')
                        : null,
                    'is_current' => $exp['is_current'] ?? false,
                    'description' => $exp['description'] ?? null,
                ]);
                $nextOrderExperiences++;
            }

            // 6. Языки
            foreach ($data['languages'] ?? [] as $lang) {
                $level = (string) ($lang['language_proficiency'] ?? 'B2');
                $proficiency = LanguageProficiency::whereRaw('LOWER(level) = ?', [strtolower($level)])->first()
                    ?? LanguageProficiency::where('level', 'B2')->first();
                $profile->languages()->create([
                    'job_seeker_profile_id' => $profile->id,
                    'sort_order' => $nextOrderLanguage ?? 1,
                    'name' => $lang['name'],
                    'language_proficiency_id' => $proficiency?->id ?? 1,
                ]);
                $nextOrderLanguage++;
            }

            return response()->json([
                'message' => 'Резюме успешно сохранено',
                'profile_id' => $profile->id
            ]);
        });


        return to_route('jobseeker.index')->with('success', 'Файл успешно обработан');
    }

    public function edit(EditJobSeekerRequest $request):Response
    {
        $validated = $request->validated();

        $profile = JobSeekerProfile::with([
            'education' => fn($q) => $q->orderBy('sort_order'),
            'experiences' => fn($q) => $q->orderBy('sort_order'),
            'skills' => fn($q) => $q->orderBy('sort_order'),
            'languages' => fn($q) => $q->orderBy('sort_order'),
            'additions' => fn($q) => $q->orderBy('sort_order'),
            'links'
        ])->where('user_id', auth()->id())->firstOrFail();

        return Inertia::render('settings/jobseeker/edit', [
            'profile' => $profile
        ]);
    }
    public function patch(PatchJobSeekerRequest $request):RedirectResponse
    {
        $validated = $request->validated();

        $profile = Auth::user()->profile;

        DB::transaction(function () use ($validated, $profile) {
            $industryId = $validated['industry_id'] ?? 12;
            $industry = Industry::where('id', $industryId)->first();
            $industryId = $industry->id;
            $profile->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'gender' => $validated['gender'] ?? 'unspecified',
                'address' => $validated['address'] ?? null,
                'summary' => $validated['summary'] ?? null,
                'location' => $validated['location'] ?? null,
                'industry_id' => $industryId,
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
                        'sort_order' => $key+1
                    ]);
                }
            }

            if (isset($validated['experiences'])) {
                $profile->experiences()->delete();
                foreach ($validated['experiences'] as $key=> $exp) {
                    $profile->experiences()->create([
                        'job_title' => $exp['job_title'],
                        'company_name' => $exp['company_name'],
                        'company_address' => $exp['company_address'],
                        'start_date' => !empty($exp['start_date'])
                            ? Carbon::parse($exp['start_date'])->format('Y-m-d')
                            : null,
                        'end_date' =>!empty($exp['end_date'])
                            ? Carbon::parse($exp['end_date'])->format('Y-m-d')
                            : null,
                        'description' => $exp['description'] ?? null,
                        'sort_order' => $key+1
                    ]);
                }
            }

            if (isset($validated['skills'])) {
                $profile->skills()->delete();
                foreach ($validated['skills'] as $key=>$skill) {
                    $profile->skills()->create([
                        'name' => $skill['name'],
                        'sort_order' => $key+1
                    ]);
                }
            }

            if (isset($validated['languages'])) {
                $profile->languages()->delete();
                foreach ($validated['languages'] as $key=> $lang) {
                    $profile->languages()->create([
                        'name' => $lang['name'],
                        'language_proficiency_id' => $lang['language_proficiency_id'],
                        'sort_order' => $key
                    ]);
                }
            }

            if (isset($validated['links'])) {
                $profile->links()->delete();
                foreach ($validated['links'] as $key=> $link) {
                    $profile->links()->create([
                        'url' => $link['url'],
                        'type' => $link['type'],
                        'sort_order' => $key
                    ]);
                }
            }

            if (isset($validated['additions'])) {
                $profile->additions()->delete();
                foreach ($validated['additions'] as $key=> $addition) {
                    $profile->additions()->create([
                        'title' => $addition['title'],
                        'description' => $addition['description'],
                        'addition_category_id' => $addition['addition_category_id'],
                        'sort_order' => $key
                    ]);
                }
            }
        });

        return to_route('jobseeker.edit')->with('success', 'Данные успешно обновились');
    }
}
