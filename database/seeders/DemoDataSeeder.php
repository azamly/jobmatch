<?php

namespace Database\Seeders;

use App\Models\Employer\Employer;
use App\Models\Industry;
use App\Models\JobSeeker\Education\JobSeekerEducation;
use App\Models\JobSeeker\Experience\JobSeekerExperience;
use App\Models\JobSeeker\Language\JobSeekerLanguage;
use App\Models\JobSeeker\Language\LanguageProficiency;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\JobSeeker\Skill\JobSeekerSkill;
use App\Models\User;
use App\Models\Vacancies\Vacancy;
use App\Services\MatchingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the demo data seeder.
     */
    public function run(): void
    {
        // 1. Убедимся, что отрасли и роли существуют
        $this->call([
            RoleSeeder::class,
            LanguageProficiencySeeder::class,
            IndustrySeeder::class,
        ]);

        $itIndustry = Industry::where('slug', 'it')->first();
        $eduIndustry = Industry::where('slug', 'education')->first();
        $finIndustry = Industry::where('slug', 'finance&accounting')->first();
        $mktIndustry = Industry::where('slug', 'marketing&ads')->first();
        $prodIndustry = Industry::where('slug', 'production')->first();
        $constIndustry = Industry::where('slug', 'construction')->first();
        $otherIndustry = Industry::where('slug', 'other')->first();

        // 2. Создание DEMO-работодателей и компаний
        $demoEmployers = [
            [
                'email' => 'techsolutions@demo.jobmatch.tj',
                'name' => 'Tech Solutions HR',
                'company_name' => 'Tech Solutions',
                'company_address' => 'г. Душанбе, пр. Рудаки 127',
                'company_website' => 'https://techsolutions.demo.tj',
                'description' => '[DEMO] Ведущая IT-компания, специализирующаяся на разработке enterprise-систем, облачных решений и мобильных приложений.',
                'contact_email' => 'hr@techsolutions.demo.tj',
                'contact_phone' => '+992 900 11 22 33',
            ],
            [
                'email' => 'softlab@demo.jobmatch.tj',
                'name' => 'SoftLab Team',
                'company_name' => 'SoftLab',
                'company_address' => 'г. Худжанд, ул. Ленина 45',
                'company_website' => 'https://softlab.demo.tj',
                'description' => '[DEMO] Инновационная IT-лаборатория по созданию продуктов в сферах Web, AI и FinTech.',
                'contact_email' => 'careers@softlab.demo.tj',
                'contact_phone' => '+992 927 22 33 44',
            ],
            [
                'email' => 'digitaltj@demo.jobmatch.tj',
                'name' => 'Digital TJ Recruitment',
                'company_name' => 'Digital TJ',
                'company_address' => 'г. Душанбе, ул. Айни 48',
                'company_website' => 'https://digital.demo.tj',
                'description' => '[DEMO] Агентство цифровой трансформации, маркетинга и дизайна для бизнеса.',
                'contact_email' => 'jobs@digital.demo.tj',
                'contact_phone' => '+992 918 33 44 55',
            ],
            [
                'email' => 'smarteducation@demo.jobmatch.tj',
                'name' => 'Smart Education Academy',
                'company_name' => 'Smart Education',
                'company_address' => 'г. Душанбе, ул. Бохтар 15',
                'company_website' => 'https://smarteducation.demo.tj',
                'description' => '[DEMO] Сеть современных образовательных центров и языковых школ.',
                'contact_email' => 'hr@smarteducation.demo.tj',
                'contact_phone' => '+992 985 44 55 66',
            ],
            [
                'email' => 'fintechgroup@demo.jobmatch.tj',
                'name' => 'FinTech Group HR',
                'company_name' => 'FinTech Group',
                'company_address' => 'г. Душанбе, ул. Сомони 22',
                'company_website' => 'https://fintechgroup.demo.tj',
                'description' => '[DEMO] Финансово-технологическая организация, предоставляющая банковские сервисы и электронные платежи.',
                'contact_email' => 'recruitment@fintechgroup.demo.tj',
                'contact_phone' => '+992 935 55 66 77',
            ],
            [
                'email' => 'medialab@demo.jobmatch.tj',
                'name' => 'MediaLab Creative Studio',
                'company_name' => 'MediaLab',
                'company_address' => 'г. Душанбе, ул. Валаматзаде 8',
                'company_website' => 'https://medialab.demo.tj',
                'description' => '[DEMO] Креативная медиастудия и продакшн-агентство полного цикла.',
                'contact_email' => 'hello@medialab.demo.tj',
                'contact_phone' => '+992 901 66 77 88',
            ],
        ];

        $employerModelMap = [];

        foreach ($demoEmployers as $empData) {
            $user = User::updateOrCreate(
                ['email' => $empData['email']],
                [
                    'name' => $empData['name'],
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now(),
                ]
            );

            if (!$user->hasRole('employer')) {
                $user->assignRole('employer');
            }

            $employer = Employer::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'type' => 'company',
                    'company_name' => $empData['company_name'],
                    'company_address' => $empData['company_address'],
                    'company_website' => $empData['company_website'],
                    'description' => $empData['description'],
                    'contact_email' => $empData['contact_email'],
                    'contact_phone' => $empData['contact_phone'],
                ]
            );

            $employerModelMap[$empData['company_name']] = $employer;
        }

        // 3. Создание разностороннего каталога DEMO-вакансий (IT и Другие профессии)
        $demoVacancies = [
            // --- IT ВАКАНСИИ ---
            [
                'company' => 'Tech Solutions',
                'title' => 'Python Backend Developer',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 8000,
                'salary_end' => 14000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Ищем сильного Python Backend разработчика в команду высоконагруженных сервисов. Разработка REST/gRPC API, работа с очередями сообщений и оптимизация запросов к базе данных.',
                'responsibility' => "• Проектирование и разработка масштабируемых сервисов на Python / FastAPI / Django\n• Написание чистого, тестируемого и поддерживаемого кода\n• Оптимизация SQL-запросов и структуры PostgreSQL\n• Участие в код-ревью и проектировании архитектуры микросервисов",
                'qualifications' => "• Опыт коммерческой разработки на Python от 2-х лет\n• Уверенное владение FastAPI или Django/DRF\n• Отличное знание PostgreSQL, Redis, SQLAlchemy / Django ORM\n• Понимание принципов REST API, Docker, Git\n• Базовые знания асинхронного программирования (asyncio)",
                'benefits' => 'Гибкий график, компенсация обучения и курсов, современный офис в центре, ДМС, регулярные тимбилдинги.',
                'experience' => '2 года',
                'education' => 'Высшее техническое',
                'skills' => ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'REST API', 'Git', 'SQLAlchemy'],
            ],
            [
                'company' => 'SoftLab',
                'title' => 'Backend Developer (Node.js / Python)',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 7000,
                'salary_end' => 12000,
                'location' => 'Худжанд',
                'type' => 'remote',
                'status' => 'active',
                'description' => '[DEMO] Разработка серверной части веб-приложений и интеграция с внешними платежными и аналитическими шлюзами.',
                'responsibility' => "• Создание надежных API и серверной логики\n• Интеграция с микросервисами и сторонними API\n• Мониторинг производительности и профилирование систем",
                'qualifications' => "• Опыт работы с Node.js / NestJS или Python / FastAPI\n• Понимание реляционных и NoSQL баз данных (PostgreSQL, MongoDB)\n• Опыт работы с Docker и CI/CD пайплайнами",
                'benefits' => 'Полностью удаленная работа, оплата техники, гибкие часы, участие в профильных конференциях.',
                'experience' => '1-3 года',
                'education' => 'Высшее или неоконченное высшее',
                'skills' => ['Backend', 'Python', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'REST API'],
            ],
            [
                'company' => 'Tech Solutions',
                'title' => 'Frontend Developer (React / TypeScript)',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 6500,
                'salary_end' => 11000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Ищем Frontend-инженера для создания удобных и быстрых пользовательских интерфейсов для веб-платформы.',
                'responsibility' => "• Разработка пользовательских интерфейсов на React, TypeScript и Tailwind CSS\n• Взаимодействие с backend-командой по спецификациям REST API\n• Оптимизация скорости загрузки и отзывчивости UI",
                'qualifications' => "• Уверенный React, TypeScript, HTML5/CSS3\n• Знание Tailwind CSS или других компонентных библиотек\n• Опыт работы с состоянием (Zustand / Redux / React Query)\n• Понимание адаптивной и кроссбраузерной верстки",
                'benefits' => 'Современный стек, комфортный офис, кофе, курсы английского языка, премия по итогам квартала.',
                'experience' => '2 года',
                'education' => 'Высшее техническое',
                'skills' => ['Frontend', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Git'],
            ],
            [
                'company' => 'SoftLab',
                'title' => 'Full Stack Developer',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 8500,
                'salary_end' => 15000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Разработка комплексных веб-приложений от базы данных до клиентского интерфейса.',
                'responsibility' => "• Разработка клиентской и серверной частей сервиса\n• Архитектурное планирование баз данных и взаимодействия компонентов\n• Написание автоматических тестов",
                'qualifications' => "• Опыт full stack разработки (React / Vue + Python / Node.js / PHP)\n• Опыт работы с реляционными СУБД (PostgreSQL, MySQL)\n• Понимание процессов сборки и развертывания",
                'benefits' => 'Возможность гибридного графика работы, участие в опционной программе, карьерный рост.',
                'experience' => '3 года',
                'education' => 'Высшее образование',
                'skills' => ['Full Stack', 'Python', 'React', 'JavaScript', 'PostgreSQL', 'Docker', 'Git', 'REST API'],
            ],
            [
                'company' => 'Digital TJ',
                'title' => 'Mobile Developer (Flutter / React Native)',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 7000,
                'salary_end' => 13000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Разработка и поддержка кроссплатформенных мобильных приложений под iOS и Android.',
                'responsibility' => "• Разработка мобильного клиента на Flutter / Dart или React Native\n• Интеграция с REST API, push-уведомлениями, картами и нативными SDK\n• Публикация и поддержка приложений в App Store и Google Play",
                'qualifications' => "• Опыт разработки мобильных приложений от 2 лет\n• Отличное знание Flutter/Dart или React Native/TypeScript\n• Понимание гайдлайнов Material Design и Human Interface",
                'benefits' => 'Предоставление MacBook Pro и тестовых устройств, свободный дресс-код, страховка.',
                'experience' => '2 года',
                'education' => 'Высшее техническое',
                'skills' => ['Mobile Developer', 'Flutter', 'Dart', 'React Native', 'Mobile Development', 'Git', 'REST API'],
            ],
            [
                'company' => 'Tech Solutions',
                'title' => 'QA Engineer (Manual & Automation)',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 4500,
                'salary_end' => 8000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Контроль качества разрабатываемого ПО, составление тест-планов, ручное и автоматизированное тестирование.',
                'responsibility' => "• Тестирование web и mobile приложений (функциональное, регрессионное, интеграционное)\n• Составление тест-кейсов и чек-листов\n• Написание автотестов на Python / Pytest / Selenium / Cypress",
                'qualifications' => "• Понимание теории тестирования и жизненного цикла ПО\n• Опыт работы с Postman, Swagger, DevTools\n• Базовые навыки программирования (Python или JS) для автотестов\n• Внимательность к деталям и аналитический склад ума",
                'benefits' => 'Обучение автоматизации тестирования за счет компании, дружная команда, уютная зона отдыха.',
                'experience' => '1 год',
                'education' => 'Высшее образование',
                'skills' => ['QA', 'Manual Testing', 'Automation', 'Postman', 'Python', 'Pytest', 'Bug Tracking', 'Git'],
            ],
            [
                'company' => 'Tech Solutions',
                'title' => 'DevOps Engineer',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 9000,
                'salary_end' => 16000,
                'location' => 'Душанбе',
                'type' => 'remote',
                'status' => 'active',
                'description' => '[DEMO] Построение и поддержка надежной серверной инфраструктуры, настройка CI/CD конвейеров, мониторинг и безопасность.',
                'responsibility' => "• Администрирование Linux-серверов\n• Настройка и оптимизация CI/CD (GitLab CI, GitHub Actions)\n• Управление контейнеризацией (Docker, Kubernetes)\n• Настройка мониторинга и логирования (Prometheus, Grafana, ELK)",
                'qualifications' => "• Уверенное администрирование Linux (Ubuntu, Debian)\n• Опыт работы с Docker, Kubernetes, Ansible, Terraform\n• Опыт настройки CI/CD процессов\n• Знание bash/python для автоматизации рутинных задач",
                'benefits' => 'Удаленная работа из любой точки, высокий оклад, гибкий график, бюджет на профильное обучение.',
                'experience' => '2-3 года',
                'education' => 'Высшее техническое',
                'skills' => ['DevOps', 'Linux', 'Docker', 'Kubernetes', 'CI/CD', 'GitLab CI', 'Bash', 'Prometheus'],
            ],
            [
                'company' => 'FinTech Group',
                'title' => 'Data Analyst',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 6000,
                'salary_end' => 10000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Анализ бизнес-метрик, построение интерактивных дашбордов и выявление тенденций для принятия управленческих решений.',
                'responsibility' => "• Сбор, очистка и обработка больших объемов финансовых данных\n• Разработка и поддержка дашбордов в Power BI / Superset / Tableau\n• Написание сложных аналитических SQL-запросов и скриптов на Python",
                'qualifications' => "• Продвинутый уровень SQL (оконные функции, оптимизация)\n• Владение Python (Pandas, NumPy, Matplotlib, Seaborn)\n• Опыт построения BI-дашбордов\n• Умение формулировать гипотезы и делать выводы по данным",
                'benefits' => 'Работа с реальными большими финансовыми данными, комфортный офис, годовые бонусы.',
                'experience' => '1-2 года',
                'education' => 'Высшее экономическое / математическое',
                'skills' => ['Data Analyst', 'SQL', 'Python', 'Pandas', 'Power BI', 'Excel', 'Data Analysis', 'Statistics'],
            ],

            // --- ДРУГИЕ ПРОФЕССИИ (НЕ ТОЛЬКО IT) ---
            [
                'company' => 'Smart Education',
                'title' => 'Учитель английского языка',
                'industry_id' => $eduIndustry?->id ?? 2,
                'salary_type' => 'money',
                'salary_start' => 3500,
                'salary_end' => 6500,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Преподавание английского языка для подростков и взрослых в малых группах и индивидуально по международным методикам.',
                'responsibility' => "• Проведение интерактивных уроков английского языка для уровней Beginner–Advanced\n• Подготовка студентов к экзаменам IELTS / TOEFL\n• Разработка методических материалов и отслеживание успеваемости",
                'qualifications' => "• Уровень английского C1/C2 (желательно наличие сертификата IELTS 7.5+ или CELTA/TEFL)\n• Педагогическое образование или опыт преподавания от 1 года\n• Энергичность, грамотная речь и любовь к обучению",
                'benefits' => 'Оборудованные классы, готовые учебные программы Oxford/Cambridge, методическая поддержка, возможность карьерного роста до Head Teacher.',
                'experience' => '1 год',
                'education' => 'Высшее филологическое / педагогическое',
                'skills' => ['Английский язык', 'Преподавание', 'IELTS', 'Педагогика', 'Коммуникабельность', 'Работа с группами'],
            ],
            [
                'company' => 'Smart Education',
                'title' => 'Учитель математики',
                'industry_id' => $eduIndustry?->id ?? 2,
                'salary_type' => 'money',
                'salary_start' => 3000,
                'salary_end' => 5500,
                'location' => 'Худжанд',
                'type' => 'part',
                'status' => 'active',
                'description' => '[DEMO] Преподавание школьного и олимпиадного курса математики, подготовка учащихся к поступлению в лицеи и вузы.',
                'responsibility' => "• Проведение уроков алгебры и геометрии\n• Подготовка учащихся к вступительным экзаменам и олимпиадам\n• Индивидуальный разбор сложных тем с учениками",
                'qualifications' => "• Высшее математическое или педагогическое образование\n• Глубокое знание школьной программы и олимпиадных задач\n• Умение объяснять сложные математические концепции простым языком",
                'benefits' => 'Гибкий график (подходит для совмещения), стабильная почасовая оплата, премии за успехи учеников.',
                'experience' => '1-2 года',
                'education' => 'Высшее профильное',
                'skills' => ['Математика', 'Алгебра', 'Геометрия', 'Преподавание', 'Подготовка к экзаменам', 'Педагогика'],
            ],
            [
                'company' => 'FinTech Group',
                'title' => 'Главный бухгалтер / Бухгалтер',
                'industry_id' => $finIndustry?->id ?? 5,
                'salary_type' => 'money',
                'salary_start' => 5000,
                'salary_end' => 9000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Ведение бухгалтерского и налогового учета, формирование и сдача отчетности, контроль взаиморасчетов.',
                'responsibility' => "• Полное ведение бухгалтерского учета предприятия в программе 1С:Бухгалтерия\n• Подготовка и своевременная сдача налоговой и статистической отчетности\n• Расчет заработной платы, больничных и отпускных\n• Контроль дебиторской и кредиторской задолженности",
                'qualifications' => "• Высшее экономическое / бухгалтерское образование\n• Опыт работы бухгалтером от 2-х лет\n• Отличное знание 1С 8.3, налогового кодекса и стандартов МСФО\n• Внимательность, ответственность, пунктуальность",
                'benefits' => 'Официальное трудоустройство, стабильная своевременная оплата, оборудованное рабочее место, дружный коллектив.',
                'experience' => '2-3 года',
                'education' => 'Высшее экономическое',
                'skills' => ['Бухгалтерский учет', '1С:Предприятие', 'Налогообложение', 'МСФО', 'Расчет зарплаты', 'Финансовая отчетность'],
            ],
            [
                'company' => 'Digital TJ',
                'title' => 'Маркетолог / Digital Marketer',
                'industry_id' => $mktIndustry?->id ?? 8,
                'salary_type' => 'money',
                'salary_start' => 4500,
                'salary_end' => 8500,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Разработка и реализация маркетинговой стратегии, продвижение бренда в digital-каналах и лидогенерация.',
                'responsibility' => "• Запуск и оптимизация таргетированной и контекстной рекламы (Meta Ads, Google Ads)\n• Анализ целевой аудитории, конкурентов и эффективности рекламных кампаний\n• Разработка контент-планов для соцсетей совместно с дизайнером и копирайтером\n• Работа с веб-аналитикой (Google Analytics, Яндекс.Метрика)",
                'qualifications' => "• Опыт в интернет-маркетинге от 1.5 лет\n• Успешные кейсы запуска рекламных кампаний с измеримым результатом\n• Знание инструментов веб-аналитики и воронок продаж\n• Креативность и аналитический подход",
                'benefits' => 'Интересные проекты, рекламные бюджеты для тестирования гипотез, бонусы за перевыполнение KPI.',
                'experience' => '2 года',
                'education' => 'Высшее (маркетинг/менеджмент/гуманитарное)',
                'skills' => ['Маркетинг', 'Digital Marketing', 'Targeting', 'SMM', 'Google Analytics', 'Реклама', 'Контент-план'],
            ],
            [
                'company' => 'MediaLab',
                'title' => 'UI/UX Дизайнер / Графический дизайнер',
                'industry_id' => $mktIndustry?->id ?? 8,
                'salary_type' => 'money',
                'salary_start' => 5000,
                'salary_end' => 9500,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Проектирование интуитивно понятных интерфейсов веб и мобильных приложений, создание брендинга и визуального контента.',
                'responsibility' => "• Разработка прототипов, UI-китов и дизайн-систем в Figma\n• Проведение UX-исследований и пользовательского тестирования\n• Создание графических материалов, бренд-айдентики и промо-материалов",
                'qualifications' => "• Профессиональное владение Figma, Adobe Photoshop, Adobe Illustrator\n• Наличие портфолио с реализованными проектами (UI/UX и графика)\n• Понимание принципов композиции, типографики и теории цвета\n• Умение аргументировать свои дизайн-решения",
                'benefits' => 'Творческая атмосфера, мощная рабочая станция, свободный график при соблюдении дедлайнов.',
                'experience' => '2 года',
                'education' => 'Высшее или профильные курсы',
                'skills' => ['Дизайн', 'Figma', 'UI/UX', 'Photoshop', 'Illustrator', 'Прототипирование', 'Брендинг'],
            ],
            [
                'company' => 'Digital TJ',
                'title' => 'Менеджер по продажам (B2B / B2C)',
                'industry_id' => $mktIndustry?->id ?? 8,
                'salary_type' => 'money',
                'salary_start' => 3000,
                'salary_end' => 9000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Привлечение новых клиентов, проведение переговоров, презентация продуктов компании и заключение сделок.',
                'responsibility' => "• Обработка входящих заявок и активный поиск потенциальных B2B-клиентов\n• Проведение деловых встреч и презентаций услуг\n• Ведение клиентской базы в CRM-системе (Bitrix24 / amoCRM)\n• Контроль оплаты и сопровождение сделок",
                'qualifications' => "• Опыт работы в активных продажах от 1 года\n• Грамотная устная и письменная речь (таджикский и русский языки обязательно)\n• Навыки преодоления возражений и ведения переговоров\n• Высокая мотивация к заработку (оклад + % от сделок)",
                'benefits' => 'Высокий неограниченный процент с продаж, корпоративная мобильная связь, обучение техникам продаж.',
                'experience' => '1 год',
                'education' => 'Высшее или среднее специальное',
                'skills' => ['Продажи', 'B2B продажи', 'CRM', 'Переговоры', 'Презентации', 'Клиентоориентированность'],
            ],
            [
                'company' => 'Tech Solutions',
                'title' => 'HR Manager / IT Рекрутер',
                'industry_id' => $itIndustry?->id ?? 1,
                'salary_type' => 'money',
                'salary_start' => 4500,
                'salary_end' => 8000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Поиск и подбор персонала, проведение собеседований, адаптация новых сотрудников и развитие корпоративной культуры.',
                'responsibility' => "• Полный цикл рекрутмента: сорсинг, скрининг резюме, проведение интервью\n• Онбординг и адаптация новых членов команды\n• Организация внутренних корпоративных мероприятий и оценка вовлеченности персонала",
                'qualifications' => "• Опыт работы HR-менеджером или рекрутером от 1 года\n• Понимание методик проведения собеседований (STAR, кейс-интервью)\n• Отличные коммуникативные навыки, эмпатия, ответственность",
                'benefits' => 'Возможность развивать HR-бренд технологической компании, бонусы за закрытие ключевых вакансий.',
                'experience' => '1-2 года',
                'education' => 'Высшее (психология / менеджмент / HR)',
                'skills' => ['HR', 'Рекрутинг', 'Собеседования', 'Онбординг', 'Коммуникация', 'Оценка персонала'],
            ],
            [
                'company' => 'Tech Solutions',
                'title' => 'Инженер по автоматизации / Системный инженер',
                'industry_id' => $prodIndustry?->id ?? 6,
                'salary_type' => 'money',
                'salary_start' => 5000,
                'salary_end' => 9500,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Проектирование, монтаж и наладка систем автоматизации, слаботочных сетей и промышленного оборудования.',
                'responsibility' => "• Разработка технических решений по автоматизации технологических процессов\n• Пуско-наладочные работы и техническое обслуживание оборудования\n• Составление проектной и исполнительной документации",
                'qualifications' => "• Высшее техническое образование (инженерия, электроника, АСУ ТП)\n• Знание нормативной технической документации и правил безопасности\n• Опыт работы с контроллерами, датчиками и электросхемами",
                'benefits' => 'Предоставление спецодежды и качественного инструмента, служебный транспорт, надежный соцпакет.',
                'experience' => '2 года',
                'education' => 'Высшее техническое',
                'skills' => ['Инженерия', 'Автоматизация', 'АСУ ТП', 'Электроника', 'Чертежи', 'Пуско-наладка'],
            ],
            [
                'company' => 'Tech Solutions',
                'title' => 'Инженер-электрик / Электромонтажник',
                'industry_id' => $constIndustry?->id ?? 4,
                'salary_type' => 'money',
                'salary_start' => 3500,
                'salary_end' => 6000,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Монтаж, обслуживание и ремонт электросетей, силового оборудования и систем электроснабжения объектов.',
                'responsibility' => "• Прокладка кабельных линий и монтаж распределительных щитов\n• Установка и подключение электрооборудования, освещения, систем защиты\n• Диагностика и оперативное устранение неисправностей в электросетях",
                'qualifications' => "• Профильное образование (электромонтер / инженер-электрик)\n• Наличие группы допуска по электробезопасности (желательно III группа и выше)\n• Знание правил устройства электроустановок (ПУЭ) и техники безопасности",
                'benefits' => 'Стабильная заработная плата, обеспечение спецодеждой и СИЗ, оплачиваемый отпуск.',
                'experience' => '1-3 года',
                'education' => 'Среднее специальное или высшее техническое',
                'skills' => ['Электрика', 'Электромонтаж', 'ПУЭ', 'Чтение схем', 'Электробезопасность', 'Монтаж оборудования'],
            ],
            [
                'company' => 'Smart Education',
                'title' => 'Офис-администратор / Администратор центра',
                'industry_id' => $otherIndustry?->id ?? 12,
                'salary_type' => 'money',
                'salary_start' => 2500,
                'salary_end' => 4500,
                'location' => 'Душанбе',
                'type' => 'full',
                'status' => 'active',
                'description' => '[DEMO] Организация жизнедеятельности офиса, встреча посетителей, консультирование клиентов и ведение первичной документации.',
                'responsibility' => "• Прием входящих звонков и консультирование клиентов по услугам центра\n• Ведение расписания занятий и учет посещаемости учащихся\n• Заказ канцелярии, воды и обеспечение порядка в офисе\n• Выполнение поручений руководителя",
                'qualifications' => "• Уверенный пользователь ПК (MS Office, Google Docs, мессенджеры)\n• Грамотная речь (таджикский и русский языки)\n• Доброжелательность, клиентоориентированность, аккуратность",
                'benefits' => 'Уютный современный офис, бесплатное посещение курсов английского языка, чай/кофе, дружный коллектив.',
                'experience' => 'Без опыта / от 6 месяцев',
                'education' => 'Среднее специальное или высшее',
                'skills' => ['Администрирование', 'Делопроизводство', 'MS Office', 'Консультирование клиентов', 'Коммуникабельность', 'Организованность'],
            ],
        ];

        // Очистим старые демо-вакансии или обновим
        foreach ($demoVacancies as $vData) {
            $companyName = $vData['company'];
            $employer = $employerModelMap[$companyName] ?? null;

            if (!$employer) {
                continue;
            }

            Vacancy::updateOrCreate(
                [
                    'employer_id' => $employer->id,
                    'title' => $vData['title'],
                ],
                [
                    'industry_id' => $vData['industry_id'],
                    'salary_type' => $vData['salary_type'],
                    'salary_start' => $vData['salary_start'],
                    'salary_end' => $vData['salary_end'],
                    'location' => $vData['location'],
                    'type' => $vData['type'],
                    'status' => $vData['status'],
                    'description' => $vData['description'],
                    'responsibility' => $vData['responsibility'],
                    'qualifications' => $vData['qualifications'],
                    'benefits' => $vData['benefits'],
                    'experience' => $vData['experience'],
                    'education' => $vData['education'],
                    'skills' => $vData['skills'],
                ]
            );
        }

        // 4. Создадим несколько тестовых соискателей для демонстрации сопоставления
        $demoJobSeekers = [
            [
                'email' => 'python.dev@demo.jobmatch.tj',
                'name' => 'Алишер Рахимов',
                'first_name' => 'Алишер',
                'last_name' => 'Рахимов',
                'summary' => 'Python Backend разработчик с 2 годами опыта разработки REST API сервисов на FastAPI и Django. Хорошие навыки работы с PostgreSQL, Docker и Redis.',
                'location' => 'Душанбе',
                'gender' => 'male',
                'industry_id' => $itIndustry?->id ?? 1,
                'skills' => ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Git', 'REST API', 'Redis'],
                'experiences' => [
                    [
                        'job_title' => 'Python Developer',
                        'company_name' => 'Tajik Software Group',
                        'company_address' => 'Душанбе',
                        'start_date' => '2023-01-15',
                        'is_current' => true,
                        'description' => 'Разработка бэкенд микросервисов на FastAPI, интеграция платежных шлюзов, оптимизация запросов PostgreSQL.',
                    ]
                ],
                'education' => [
                    [
                        'institution' => 'Таджикский технический университет',
                        'degree' => 'Бакалавр',
                        'field_of_study' => 'Программная инженерия',
                        'start_year' => '2019',
                        'end_year' => '2023',
                        'description' => 'Факультет информационных технологий',
                    ]
                ],
            ],
            [
                'email' => 'teacher.english@demo.jobmatch.tj',
                'name' => 'Зарина Саидова',
                'first_name' => 'Зарина',
                'last_name' => 'Саидова',
                'summary' => 'Преподаватель английского языка с опытом работы более 2 лет. Сертификат IELTS 7.5. Опыт работы со школьниками и взрослыми студентами.',
                'location' => 'Душанбе',
                'gender' => 'female',
                'industry_id' => $eduIndustry?->id ?? 2,
                'skills' => ['Английский язык', 'Преподавание', 'IELTS', 'Педагогика', 'Коммуникабельность'],
                'experiences' => [
                    [
                        'job_title' => 'Преподаватель английского языка',
                        'company_name' => 'Language First Academy',
                        'company_address' => 'Душанбе',
                        'start_date' => '2022-09-01',
                        'is_current' => true,
                        'description' => 'Проведение групповых и индивидуальных уроков General English и подготовки к IELTS.',
                    ]
                ],
                'education' => [
                    [
                        'institution' => 'Российско-Таджикский (Славянский) университет',
                        'degree' => 'Бакалавр',
                        'field_of_study' => 'Английская филология',
                        'start_year' => '2018',
                        'end_year' => '2022',
                        'description' => 'Диплом с отличием',
                    ]
                ],
            ],
            [
                'email' => 'accountant@demo.jobmatch.tj',
                'name' => 'Фарход Каримов',
                'first_name' => 'Фарход',
                'last_name' => 'Каримов',
                'summary' => 'Опытный бухгалтер, ведение 1С:Бухгалтерия 8.3, налоговая отчетность, расчет заработной платы, учет первичных документов.',
                'location' => 'Душанбе',
                'gender' => 'male',
                'industry_id' => $finIndustry?->id ?? 5,
                'skills' => ['Бухгалтерский учет', '1С:Предприятие', 'Налогообложение', 'Расчет зарплаты', 'Финансовая отчетность'],
                'experiences' => [
                    [
                        'job_title' => 'Бухгалтер',
                        'company_name' => 'Somoni Trade',
                        'company_address' => 'Душанбе',
                        'start_date' => '2021-03-01',
                        'is_current' => true,
                        'description' => 'Полный цикл бухгалтерского учета предприятия оптовой торговли.',
                    ]
                ],
                'education' => [
                    [
                        'institution' => 'Таджикский национальный университет',
                        'degree' => 'Бакалавр',
                        'field_of_study' => 'Учет и аудит',
                        'start_year' => '2016',
                        'end_year' => '2020',
                        'description' => 'Экономический факультет',
                    ]
                ],
            ],
        ];

        foreach ($demoJobSeekers as $jsData) {
            $user = User::updateOrCreate(
                ['email' => $jsData['email']],
                [
                    'name' => $jsData['name'],
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now(),
                ]
            );

            if (!$user->hasRole('jobseeker')) {
                $user->assignRole('jobseeker');
            }

            $profile = JobSeekerProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => $jsData['first_name'],
                    'last_name' => $jsData['last_name'],
                    'location' => $jsData['location'],
                    'gender' => $jsData['gender'],
                    'summary' => $jsData['summary'],
                    'industry_id' => $jsData['industry_id'],
                ]
            );

            // Очистим и пересоздадим навыки/опыт для консистентности
            $profile->skills()->delete();
            foreach ($jsData['skills'] as $idx => $sName) {
                JobSeekerSkill::create([
                    'job_seeker_profile_id' => $profile->id,
                    'name' => $sName,
                    'sort_order' => $idx + 1,
                ]);
            }

            $profile->experiences()->delete();
            foreach ($jsData['experiences'] as $idx => $exp) {
                JobSeekerExperience::create([
                    'job_seeker_profile_id' => $profile->id,
                    'job_title' => $exp['job_title'],
                    'company_name' => $exp['company_name'],
                    'company_address' => $exp['company_address'],
                    'start_date' => $exp['start_date'],
                    'is_current' => $exp['is_current'],
                    'description' => $exp['description'],
                    'sort_order' => $idx + 1,
                ]);
            }

            $profile->education()->delete();
            foreach ($jsData['education'] as $idx => $edu) {
                JobSeekerEducation::create([
                    'job_seeker_profile_id' => $profile->id,
                    'institution' => $edu['institution'],
                    'degree' => $edu['degree'],
                    'field_of_study' => $edu['field_of_study'],
                    'start_year' => $edu['start_year'],
                    'end_year' => $edu['end_year'],
                    'description' => $edu['description'],
                    'sort_order' => $idx + 1,
                ]);
            }
        }
    }
}
