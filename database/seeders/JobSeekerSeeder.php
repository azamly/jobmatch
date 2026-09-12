<?php
//
//namespace Database\Seeders;
//
//use App\Models\Industry;
//use App\Models\JobSeeker\Education\JobSeekerEducation;
//use App\Models\JobSeeker\Experience\JobSeekerExperience;
//use App\Models\JobSeeker\Language\JobSeekerLanguage;
//use App\Models\JobSeeker\Language\LanguageProficiency;
//use App\Models\JobSeeker\Profile\JobSeekerProfile;
//use App\Models\JobSeeker\Skill\JobSeekerSkill;
//use App\Models\Vacancies\Application;
//use App\Models\Vacancies\Vacancy;
//use Carbon\Carbon;
//use Illuminate\Database\Seeder;
//
//class JobSeekerSeeder extends Seeder
//{
//    /**
//     * Run the database seeds.
//     */
//    public function run(): void
//    {
//        // Define Tajik names separated by gender
//        $maleFirstNames = ['Алишер', 'Фарход', 'Дилшод', 'Рустам', 'Саид', 'Джамшед', 'Фирдавс', 'Хуршед', 'Сафар', 'Икбол', 'Бехруз', 'Шахриёр', 'Фаррух'];
//        $femaleFirstNames = ['Зарина', 'Мехрангез', 'Шахло', 'Нодира', 'Гулноз', 'Мавлуда', 'Зухра', 'Парвина', 'Мубина', 'Сабрина', 'Нигора', 'Мадина'];
//        $maleLastNames = ['Рахимов', 'Саидов', 'Нурматов', 'Мирзоев', 'Абдуллоев', 'Рахмонов', 'Исмоилов', 'Каримов', 'Азизов', 'Собирзода'];
//        $femaleLastNames = ['Холматова', 'Шарипова', 'Кодирова', 'Хайдарова', 'Алиева', 'Гафурова', 'Сафарова', 'Худойбердиева', 'Джалилова'];
//        $locations = ['Душанбе', 'Худжанд', 'Куляб', 'Бохтар', 'Гиссар', 'Хорог', 'Пенджикент', 'Курган-Тюбе', 'Рашт', 'Исфара'];
//        $genders = ['male', 'female', 'unspecified'];
//
//        // Get all vacancies
//        $vacancies = Vacancy::all()->pluck('id')->toArray();
//        if (count($vacancies) < 20) {
//            throw new \Exception('Not enough vacancies in the database. Please seed vacancies first.');
//        }
//
//        // Randomly assign 1–4 applicants per vacancy, aiming for 35–40 total unique profiles
//        $applicantCounts = [];
//        $totalApplicants = 0;
//        foreach ($vacancies as $vacancyId) {
//            $count = rand(1, 4);
//            $applicantCounts[$vacancyId] = $count;
//            $totalApplicants += $count;
//        }
//
//        // Adjust to ensure total is between 35 and 40
//        while ($totalApplicants < 35) {
//            $vacancyId = $vacancies[array_rand($vacancies)];
//            if ($applicantCounts[$vacancyId] < 4) {
//                $applicantCounts[$vacancyId]++;
//                $totalApplicants++;
//            }
//        }
//        while ($totalApplicants > 40) {
//            $vacancyId = $vacancies[array_rand($vacancies)];
//            if ($applicantCounts[$vacancyId] > 1) {
//                $applicantCounts[$vacancyId]--;
//                $totalApplicants--;
//            }
//        }
//
//        // Track used user IDs to ensure uniqueness
//        $usedUserIds = [];
//        $userId = 8; // Start after employers (1–7)
//
//        foreach ($applicantCounts as $vacancyId => $count) {
//            $vacancy = Vacancy::find($vacancyId);
//            if (!$vacancy) {
//                continue; // Skip if vacancy not found
//            }
//            $industry = Industry::find($vacancy->industry_id);
//            $skills = $vacancy->skills ?? [];
//            $isEnglishRequired = in_array($vacancy->title, ['Преподаватель английского языка', 'Гид по Памиру']);
//
//            for ($i = 0; $i < $count; $i++) {
//                // Ensure unique user ID
//                while (in_array($userId, $usedUserIds) && $userId <= 47) {
//                    $userId++;
//                }
//                if ($userId > 47) {
//                    throw new \Exception('Not enough unique user IDs available for job seekers.');
//                }
//                $usedUserIds[] = $userId;
//
//                // Select gender
//                $gender = $genders[array_rand($genders)];
//
//                // Select name based on gender
//                $firstName = $gender === 'male' ? $maleFirstNames[array_rand($maleFirstNames)] : ($gender === 'female' ? $femaleFirstNames[array_rand($femaleFirstNames)] : $maleFirstNames[array_rand($maleFirstNames)]);
//                $lastName = $gender === 'male' ? $maleLastNames[array_rand($maleLastNames)] : ($gender === 'female' ? $femaleLastNames[array_rand($femaleLastNames)] : $maleLastNames[array_rand($maleLastNames)]);
//
//                // Create job seeker profile
//                $birthDate = Carbon::today()->subYears(rand(20, 40));
//                $profile = JobSeekerProfile::create([
//                    'user_id' => $userId,
//                    'first_name' => $firstName,
//                    'last_name' => $lastName,
//                    'middle_name' => null,
//                    'birth_date' => $birthDate,
//                    'location' => $locations[array_rand($locations)],
//                    'address' => 'ул. ' . ($gender === 'male' ? $maleFirstNames[array_rand($maleFirstNames)] : $femaleFirstNames[array_rand($femaleFirstNames)]) . ', д. ' . rand(1, 100),
//                    'gender' => $gender,
//                    'summary' => 'Мотивированный кандидат с навыками, подходящими для работы в ' . ($industry->name ?? 'различных отраслях') . '. Готов внести вклад в развитие компании.',
//                    'industry_id' => $industry->id ?? Industry::where('slug', 'other')->first()->id,
//                ]);
//
//                // Create education
//                $educationLevel = $vacancy->education ?? 'Среднее';
//                $institution = $educationLevel === 'Высшее' || $educationLevel === 'Высшее техническое' || $educationLevel === 'Высшее экономическое' || $educationLevel === 'Высшее педагогическое' ? 'Таджикский Государственный Университет' : 'Таджикский Техникум';
//                $degree = $educationLevel === 'Высшее' || $educationLevel === 'Высшее техническое' || $educationLevel === 'Высшее экономическое' || $educationLevel === 'Высшее педагогическое' ? 'Бакалавр' : 'Специалист';
//                JobSeekerEducation::create([
//                    'job_seeker_profile_id' => $profile->id,
//                    'institution' => $institution,
//                    'degree' => $degree,
//                    'field_of_study' => $industry->name ?? 'Общее',
//                    'start_year' => $birthDate->copy()->addYears(18)->year,
//                    'end_year' => $birthDate->copy()->addYears(22)->year,
//                    'description' => 'Получил образование в области ' . ($industry->name ?? 'общего профиля') . '.',
//                    'sort_order' => 1,
//                ]);
//
//                // Create work experience
//                $experienceYears = $vacancy->experience === 'Без опыта' ? 0 : rand(1, 5);
//                if ($experienceYears > 0) {
//                    JobSeekerExperience::create([
//                        'job_seeker_profile_id' => $profile->id,
//                        'job_title' => $vacancy->title,
//                        'company_name' => 'Местная компания в ' . $vacancy->location,
//                        'company_address' => 'г. ' . $vacancy->location . ', ул. Сомони, д. ' . rand(1, 50),
//                        'start_date' => Carbon::today()->subYears($experienceYears),
//                        'end_date' => $vacancy->experience === 'Без опыта' ? null : Carbon::today()->subMonths(rand(1, 12)),
//                        'is_current' => $vacancy->experience === 'Без опыта' ? false : (rand(0, 1) ? true : false),
//                        'description' => 'Работа в сфере ' . ($industry->name ?? 'общего профиля') . ', выполнение обязанностей, аналогичных вакансии.',
//                        'sort_order' => 1,
//                    ]);
//                }
//
//                // Create skills
//                foreach ($skills as $index => $skill) {
//                    JobSeekerSkill::create([
//                        'job_seeker_profile_id' => $profile->id,
//                        'name' => $skill,
//                        'sort_order' => $index + 1,
//                    ]);
//                }
//
//                // Create language proficiencies
//                $nativeProficiency = LanguageProficiency::where('level', 'native')->first();
//                if (!$nativeProficiency) {
//                    throw new \Exception('Language proficiency level "native" not found.');
//                }
//                JobSeekerLanguage::create([
//                    'job_seeker_profile_id' => $profile->id,
//                    'name' => 'Таджикский',
//                    'language_proficiency_id' => $nativeProficiency->id,
//                    'sort_order' => 1,
//                ]);
//
//                $russianLevel = in_array($vacancy->title, ['Программист 1С', 'Веб-разработчик', 'Финансовый консультант', 'Специалист по госзакупкам', 'Администратор клиники', 'Администратор гостевого дома']) ? 'C1' : (rand(0, 1) ? 'B2' : 'C1');
//                $russianProficiency = LanguageProficiency::where('level', $russianLevel)->first() ?? LanguageProficiency::where('level', 'B2')->first();
//                if (!$russianProficiency) {
//                    throw new \Exception('Language proficiency level for Russian not found.');
//                }
//                JobSeekerLanguage::create([
//                    'job_seeker_profile_id' => $profile->id,
//                    'name' => 'Русский',
//                    'language_proficiency_id' => $russianProficiency->id,
//                    'sort_order' => 2,
//                ]);
//
//                if ($isEnglishRequired) {
//                    $englishLevel = rand(0, 1) ? 'B2' : 'C1';
//                    $englishProficiency = LanguageProficiency::where('level', $englishLevel)->first() ?? LanguageProficiency::where('level', 'B2')->first();
//                    if (!$englishProficiency) {
//                        throw new \Exception('Language proficiency level for English not found.');
//                    }
//                    JobSeekerLanguage::create([
//                        'job_seeker_profile_id' => $profile->id,
//                        'name' => 'Английский',
//                        'language_proficiency_id' => $englishProficiency->id,
//                        'sort_order' => 3,
//                    ]);
//                }
//
//                // Create application
//                Application::create([
//                    'job_seeker_profile_id' => $profile->id,
//                    'vacancy_id' => $vacancyId,
//                    'status' => 'applied',
//                    'description' => 'Заинтересован в данной вакансии, готов приступить к работе в ближайшее время.',
//                    'salary_exception' => $vacancy->salary_start,
//                    'get_to_work' => Carbon::today()->addDays(rand(7, 30)),
//                ]);
//
//                $userId++;
//            }
//        }
//
//        // Ensure 35–40 profiles by creating additional profiles if needed
//        $currentProfileCount = JobSeekerProfile::count();
//        while ($currentProfileCount < 35) {
//            while (in_array($userId, $usedUserIds) && $userId <= 47) {
//                $userId++;
//            }
//            if ($userId > 47) {
//                break; // Prevent exceeding available user IDs
//            }
//            $usedUserIds[] = $userId;
//
//            $vacancyId = $vacancies[array_rand($vacancies)];
//            $vacancy = Vacancy::find($vacancyId);
//            $industry = Industry::find($vacancy->industry_id);
//            $skills = json_decode($vacancy->skills, true) ?? [];
//            $isEnglishRequired = in_array($vacancy->title, ['Преподаватель английского языка', 'Гид по Памиру']);
//
//            // Select gender
//            $gender = $genders[array_rand($genders)];
//
//            // Select name based on gender
//            $firstName = $gender === 'male' ? $maleFirstNames[array_rand($maleFirstNames)] : ($gender === 'female' ? $femaleFirstNames[array_rand($femaleFirstNames)] : $maleFirstNames[array_rand($maleFirstNames)]);
//            $lastName = $gender === 'male' ? $maleLastNames[array_rand($maleLastNames)] : ($gender === 'female' ? $femaleLastNames[array_rand($femaleLastNames)] : $maleLastNames[array_rand($maleLastNames)]);
//
//            $birthDate = Carbon::today()->subYears(rand(20, 40));
//            $profile = JobSeekerProfile::create([
//                'user_id' => $userId,
//                'first_name' => $firstName,
//                'last_name' => $lastName,
//                'middle_name' => null,
//                'birth_date' => $birthDate,
//                'location' => $locations[array_rand($locations)],
//                'address' => 'ул. ' . ($gender === 'male' ? $maleFirstNames[array_rand($maleFirstNames)] : $femaleFirstNames[array_rand($femaleFirstNames)]) . ', д. ' . rand(1, 100),
//                'gender' => $gender,
//                'summary' => 'Мотивированный кандидат с навыками, подходящими для работы в ' . ($industry->name ?? 'различных отраслях') . '.',
//                'industry_id' => $industry->id ?? Industry::where('slug', 'other')->first()->id,
//            ]);
//
//            // Education
//            $educationLevel = $vacancy->education ?? 'Среднее';
//            $institution = $educationLevel === 'Высшее' || $educationLevel === 'Высшее техническое' || $educationLevel === 'Высшее экономическое' || $educationLevel === 'Высшее педагогическое' ? 'Таджикский Государственный Университет' : 'Таджикский Техникум';
//            $degree = $educationLevel === 'Высшее' || $educationLevel === 'Высшее техническое' || $educationLevel === 'Высшее экономическое' || $educationLevel === 'Высшее педагогическое' ? 'Бакалавр' : 'Специалист';
//            JobSeekerEducation::create([
//                'job_seeker_profile_id' => $profile->id,
//                'institution' => $institution,
//                'degree' => $degree,
//                'field_of_study' => $industry->name ?? 'Общее',
//                'start_year' => $birthDate->copy()->addYears(18)->year,
//                'end_year' => $birthDate->copy()->addYears(22)->year,
//                'description' => 'Получил образование в области ' . ($industry->name ?? 'общего профиля') . '.',
//                'sort_order' => 1,
//            ]);
//
//            // Work experience
//            $experienceYears = $vacancy->experience === 'Без опыта' ? 0 : rand(1, 5);
//            if ($experienceYears > 0) {
//                JobSeekerExperience::create([
//                    'job_seeker_profile_id' => $profile->id,
//                    'job_title' => $vacancy->title,
//                    'company_name' => 'Местная компания в ' . $vacancy->location,
//                    'company_address' => 'г. ' . $vacancy->location . ', ул. Сомони, д. ' . rand(1, 50),
//                    'start_date' => Carbon::today()->subYears($experienceYears),
//                    'end_date' => $vacancy->experience === 'Без опыта' ? null : Carbon::today()->subMonths(rand(1, 12)),
//                    'is_current' => $vacancy->experience === 'Без опыта' ? false : (rand(0, 1) ? true : false),
//                    'description' => 'Работа в сфере ' . ($industry->name ?? 'общего профиля') . ', выполнение обязанностей, аналогичных вакансии.',
//                    'sort_order' => 1,
//                ]);
//            }
//
//            // Skills
//            foreach ($skills as $index => $skill) {
//                JobSeekerSkill::create([
//                    'job_seeker_profile_id' => $profile->id,
//                    'name' => $skill,
//                    'sort_order' => $index + 1,
//                ]);
//            }
//
//            // Languages
//            $nativeProficiency = LanguageProficiency::where('level', 'native')->first();
//            if (!$nativeProficiency) {
//                throw new \Exception('Language proficiency level "native" not found.');
//            }
//            JobSeekerLanguage::create([
//                'job_seeker_profile_id' => $profile->id,
//                'name' => 'Таджикский',
//                'language_proficiency_id' => $nativeProficiency->id,
//                'sort_order' => 1,
//            ]);
//
//            $russianLevel = in_array($vacancy->title, ['Программист 1С', 'Веб-разработчик', 'Финансовый консультант', 'Специалист по госзакупкам', 'Администратор клиники', 'Администратор гостевого дома']) ? 'C1' : (rand(0, 1) ? 'B2' : 'C1');
//            $russianProficiency = LanguageProficiency::where('level', $russianLevel)->first() ?? LanguageProficiency::where('level', 'B2')->first();
//            if (!$russianProficiency) {
//                throw new \Exception('Language proficiency level for Russian not found.');
//            }
//            JobSeekerLanguage::create([
//                'job_seeker_profile_id' => $profile->id,
//                'name' => 'Русский',
//                'language_proficiency_id' => $russianProficiency->id,
//                'sort_order' => 2,
//            ]);
//
//            if ($isEnglishRequired) {
//                $englishLevel = rand(0, 1) ? 'B2' : 'C1';
//                $englishProficiency = LanguageProficiency::where('level', $englishLevel)->first() ?? LanguageProficiency::where('level', 'B2')->first();
//                if (!$englishProficiency) {
//                    throw new \Exception('Language proficiency level for English not found.');
//                }
//                JobSeekerLanguage::create([
//                    'job_seeker_profile_id' => $profile->id,
//                    'name' => 'Английский',
//                    'language_proficiency_id' => $englishProficiency->id,
//                    'sort_order' => 3,
//                ]);
//            }
//
//            // Application
//            Application::create([
//                'job_seeker_profile_id' => $profile->id,
//                'vacancy_id' => $vacancyId,
//                'status' => 'applied',
//                'description' => 'Заинтересован в данной вакансии, готов приступить к работе в ближайшее время.',
//                'salary_exception' => $vacancy->salary_start,
//                'get_to_work' => Carbon::today()->addDays(rand(7, 30)),
//            ]);
//
//            $userId++;
//            $currentProfileCount++;
//        }
//    }
//}


namespace Database\Seeders;

use App\Models\Industry;
use App\Models\JobSeeker\Education\JobSeekerEducation;
use App\Models\JobSeeker\Experience\JobSeekerExperience;
use App\Models\JobSeeker\Language\JobSeekerLanguage;
use App\Models\JobSeeker\Language\LanguageProficiency;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\JobSeeker\Skill\JobSeekerSkill;
use App\Models\Vacancies\Application;
use App\Models\Vacancies\Vacancy;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class JobSeekerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define Tajik names separated by gender
        $maleFirstNames = [
            'Алишер', 'Фарход', 'Дилшод', 'Рустам', 'Саид', 'Джамшед', 'Фирдавс',
            'Хуршед', 'Сафар', 'Икбол', 'Бехруз', 'Шахриёр', 'Фаррух', 'Нуриддин',
            'Абдулло', 'Мирзо', 'Темур', 'Зафар', 'Камол', 'Низом', 'Фируз',
            'Азиз', 'Носир', 'Ориф', 'Равшан', 'Сохиб', 'Умед', 'Ҷавлон',
            'Достон', 'Эрадж', 'Ёдгор', 'Искандар', 'Кодир', 'Латиф', 'Маҳмуд',
            'Навруз', 'Олим', 'Пулод', 'Қосим', 'Раҳим', 'Сирож', 'Толиб'
        ];

        $femaleFirstNames = [
            'Зарина', 'Мехрангез', 'Шахло', 'Нодира', 'Гулноз', 'Мавлуда', 'Зухра',
            'Парвина', 'Мубина', 'Сабрина', 'Нигора', 'Мадина', 'Дилбар', 'Фарзона',
            'Гулрухсор', 'Зебо', 'Лола', 'Малика', 'Нигина', 'Озода', 'Рано',
            'Ситора', 'Тоҳира', 'Фируза', 'Ҳабиба', 'Шамсия', 'Ясмина', 'Барно',
            'Гулшан', 'Дилором', 'Захро', 'Ирода', 'Комила', 'Латофат', 'Меҳри',
            'Нафиса', 'Офтоб', 'Пари', 'Раҳила', 'Саодат', 'Умеда', 'Фароғат'
        ];

        $maleLastNames = [
            'Рахимов', 'Саидов', 'Нурматов', 'Мирзоев', 'Абдуллоев', 'Рахмонов',
            'Исмоилов', 'Каримов', 'Азизов', 'Собирзода', 'Муҳаммадов', 'Юсупов',
            'Ҳасанов', 'Ҳусейнов', 'Алиев', 'Неъматов', 'Сафаров', 'Холов',
            'Шарипов', 'Қодиров', 'Раҳмонов', 'Ҷабборов', 'Назаров', 'Одинаев',
            'Гуломов', 'Давлатов', 'Зоиров', 'Иброҳимов', 'Кабиров', 'Латипов'
        ];

        $femaleLastNames = [
            'Холматова', 'Шарипова', 'Кодирова', 'Хайдарова', 'Алиева', 'Гафурова',
            'Сафарова', 'Худойбердиева', 'Джалилова', 'Рахимова', 'Саидова', 'Нурматова',
            'Мирзоева', 'Абдуллоева', 'Рахмонова', 'Исмоилова', 'Каримова', 'Азизова',
            'Муҳаммадова', 'Юсупова', 'Ҳасанова', 'Ҳусейнова', 'Неъматова', 'Холова',
            'Қодирова', 'Ҷабборова', 'Назарова', 'Одинаева', 'Гуломова', 'Давлатова'
        ];

        $locations = ['Душанбе', 'Худжанд', 'Куляб', 'Бохтар', 'Гиссар', 'Хорог', 'Пенджикент', 'Курган-Тюбе', 'Рашт', 'Исфара'];
        $genders = ['male', 'female', 'unspecified'];

        // Get all vacancies
        $vacancies = Vacancy::all();
        if ($vacancies->count() < 50) {
            throw new \Exception('Not enough vacancies in the database. Please seed vacancies first.');
        }

        $userId = 31; // Start after employers (1–30)
        $totalProfiles = 170; // Create 170 job seekers

        // Assign applications to vacancies (each vacancy gets 1-3 applicants)
        $vacancyApplications = [];
        foreach ($vacancies as $vacancy) {
            $applicantCount = rand(1, 3);
            $vacancyApplications[$vacancy->id] = [
                'vacancy' => $vacancy,
                'count' => $applicantCount,
                'assigned' => 0
            ];
        }

        for ($profileIndex = 0; $profileIndex < $totalProfiles; $profileIndex++) {
            if ($userId > 200) break; // Safety check

            // Select gender
            $gender = $genders[array_rand($genders)];

            // Select name based on gender
            $firstName = $gender === 'male'
                ? $maleFirstNames[array_rand($maleFirstNames)]
                : ($gender === 'female' ? $femaleFirstNames[array_rand($femaleFirstNames)] : $maleFirstNames[array_rand($maleFirstNames)]);
            $lastName = $gender === 'male'
                ? $maleLastNames[array_rand($maleLastNames)]
                : ($gender === 'female' ? $femaleLastNames[array_rand($femaleLastNames)] : $maleLastNames[array_rand($maleLastNames)]);

            // Randomly select a vacancy to apply for
            $vacancyKeys = array_keys($vacancyApplications);
            $selectedVacancyId = null;

            // Find a vacancy that still needs applicants
            foreach ($vacancyKeys as $vacancyId) {
                if ($vacancyApplications[$vacancyId]['assigned'] < $vacancyApplications[$vacancyId]['count']) {
                    $selectedVacancyId = $vacancyId;
                    $vacancyApplications[$vacancyId]['assigned']++;
                    break;
                }
            }

            // If all vacancies are filled, pick a random one
            if (!$selectedVacancyId) {
                $selectedVacancyId = $vacancyKeys[array_rand($vacancyKeys)];
            }

            $vacancy = $vacancyApplications[$selectedVacancyId]['vacancy'];
            $industry = Industry::find($vacancy->industry_id);
            $skills = $vacancy->skills ?? [];
            $isEnglishRequired = in_array($vacancy->title, ['Преподаватель английского языка', 'Гид по Памиру']);

            // Create job seeker profile
            $birthDate = Carbon::today()->subYears(rand(20, 45));
            $profile = JobSeekerProfile::create([
                'user_id' => $userId,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'middle_name' => null,
                'birth_date' => $birthDate,
                'location' => $locations[array_rand($locations)],
                'address' => 'ул. ' . ($gender === 'male' ? $maleFirstNames[array_rand($maleFirstNames)] : $femaleFirstNames[array_rand($femaleFirstNames)]) . ', д. ' . rand(1, 100),
                'gender' => $gender,
                'summary' => 'Мотивированный кандидат с навыками, подходящими для работы в ' . ($industry->name ?? 'различных отраслях') . '. Готов внести вклад в развитие компании.',
                'industry_id' => $industry->id ?? Industry::where('slug', 'other')->first()->id,
            ]);

            // Create education
            $educationLevel = $vacancy->education ?? 'Среднее';
            $institution = in_array($educationLevel, ['Высшее', 'Высшее техническое', 'Высшее экономическое', 'Высшее педагогическое'])
                ? 'Таджикский Государственный Университет'
                : 'Таджикский Техникум';
            $degree = in_array($educationLevel, ['Высшее', 'Высшее техническое', 'Высшее экономическое', 'Высшее педагогическое'])
                ? 'Бакалавр'
                : 'Специалист';

            JobSeekerEducation::create([
                'job_seeker_profile_id' => $profile->id,
                'institution' => $institution,
                'degree' => $degree,
                'field_of_study' => $industry->name ?? 'Общее',
                'start_year' => $birthDate->copy()->addYears(18)->year,
                'end_year' => $birthDate->copy()->addYears(22)->year,
                'description' => 'Получил образование в области ' . ($industry->name ?? 'общего профиля') . '.',
                'sort_order' => 1,
            ]);

            // Create work experience
            $experienceYears = $vacancy->experience === 'Без опыта' ? 0 : rand(1, 5);
            if ($experienceYears > 0) {
                JobSeekerExperience::create([
                    'job_seeker_profile_id' => $profile->id,
                    'job_title' => $vacancy->title,
                    'company_name' => 'Местная компания в ' . $vacancy->location,
                    'company_address' => 'г. ' . $vacancy->location . ', ул. Сомони, д. ' . rand(1, 50),
                    'start_date' => Carbon::today()->subYears($experienceYears),
                    'end_date' => $vacancy->experience === 'Без опыта' ? null : Carbon::today()->subMonths(rand(1, 12)),
                    'is_current' => $vacancy->experience === 'Без опыта' ? false : (rand(0, 1) ? true : false),
                    'description' => 'Работа в сфере ' . ($industry->name ?? 'общего профиля') . ', выполнение обязанностей, аналогичных вакансии.',
                    'sort_order' => 1,
                ]);
            }

            // Create skills
            foreach ($skills as $index => $skill) {
                JobSeekerSkill::create([
                    'job_seeker_profile_id' => $profile->id,
                    'name' => $skill,
                    'sort_order' => $index + 1,
                ]);
            }

            // Create language proficiencies
            $nativeProficiency = LanguageProficiency::where('level', 'native')->first();
            if (!$nativeProficiency) {
                throw new \Exception('Language proficiency level "native" not found.');
            }
            JobSeekerLanguage::create([
                'job_seeker_profile_id' => $profile->id,
                'name' => 'Таджикский',
                'language_proficiency_id' => $nativeProficiency->id,
                'sort_order' => 1,
            ]);

            // Russian language proficiency
            $russianLevel = in_array($vacancy->title, [
                'Программист 1С',
                'Веб-разработчик',
                'Финансовый консультант',
                'Специалист по госзакупкам',
                'Администратор клиники',
                'Администратор гостевого дома',
                'Python разработчик',
                'Системный администратор'
            ]) ? 'C1' : (rand(0, 1) ? 'B2' : 'C1');

            $russianProficiency = LanguageProficiency::where('level', $russianLevel)->first()
                ?? LanguageProficiency::where('level', 'B2')->first();
            if (!$russianProficiency) {
                throw new \Exception('Language proficiency level for Russian not found.');
            }
            JobSeekerLanguage::create([
                'job_seeker_profile_id' => $profile->id,
                'name' => 'Русский',
                'language_proficiency_id' => $russianProficiency->id,
                'sort_order' => 2,
            ]);

            // English language (if required)
            if ($isEnglishRequired) {
                $englishLevel = rand(0, 1) ? 'B2' : 'C1';
                $englishProficiency = LanguageProficiency::where('level', $englishLevel)->first()
                    ?? LanguageProficiency::where('level', 'B2')->first();
                if (!$englishProficiency) {
                    throw new \Exception('Language proficiency level for English not found.');
                }
                JobSeekerLanguage::create([
                    'job_seeker_profile_id' => $profile->id,
                    'name' => 'Английский',
                    'language_proficiency_id' => $englishProficiency->id,
                    'sort_order' => 3,
                ]);
            }

            // Create application
            Application::create([
                'job_seeker_profile_id' => $profile->id,
                'vacancy_id' => $vacancy->id,
                'status' => 'applied',
                'description' => 'Заинтересован в данной вакансии, готов приступить к работе в ближайшее время.',
                'salary_exception' => $vacancy->salary_start,
                'get_to_work' => Carbon::today()->addDays(rand(7, 30)),
            ]);

            $userId++;
        }
    }
}
