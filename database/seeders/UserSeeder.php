<?php
////
////namespace Database\Seeders;
////
////use App\Models\Employer\Employer;
////use App\Models\User;
////use Illuminate\Database\Console\Seeds\WithoutModelEvents;
////use Illuminate\Database\Seeder;
////use Illuminate\Support\Facades\Hash;
////
////class UserSeeder extends Seeder
////{
////    /**
////     * Run the database seeds.
////     */
////    public function run(): void
////    {
////        $admin = User::create([
////            'name' => 'Admin',
////            'email' => 'admin@admin.com',
////            'password' => Hash::make('password'),
////        ]);
////        $jobseeker = User::create([
////            'name' => 'Job Seeker',
////            'email' => 'jobseeker@jobseeker.com',
////            'password' => Hash::make('password'),
////        ]);
////        $employer = User::create([
////            'name' => 'Employer',
////            'email' => 'employer@employer.com',
////            'password' => Hash::make('password'),
////        ]);
////        Employer::create([
////            'user_id' => $employer->id,
////        ]);
////        $admin->assignRole('admin');
////        $jobseeker->assignRole('jobseeker');
////        $employer->assignRole('employer');
////    }
////
////}
//
//
//namespace Database\Seeders;
//
//use App\Models\User;
//use Illuminate\Database\Seeder;
//use Illuminate\Support\Facades\Hash;
//
//class UserSeeder extends Seeder
//{
//    /**
//     * Run the database seeds.
//     */
//    public function run(): void
//    {
//
//
//        // Create employer users (IDs 1–7)
//        $employerUsers = [
//            ['id' => 1, 'email' => 'tajikitsolutions@example.tj', 'name' => 'Tajik IT Solutions'],
//            ['id' => 2, 'email' => 'pamireducation@example.tj', 'name' => 'Pamir Education Center'],
//            ['id' => 3, 'email' => 'sihatclinic@example.tj', 'name' => 'Sihat Medical Clinic'],
//            ['id' => 4, 'email' => 'bunyod@example.tj', 'name' => 'Bunyod Construction'],
//            ['id' => 5, 'email' => 'somonifinance@example.tj', 'name' => 'Somoni Finance'],
//            ['id' => 6, 'email' => 'tajikagro@example.tj', 'name' => 'Tajik Agro Co'],
//            ['id' => 7, 'email' => 'pamirtravel@example.tj', 'name' => 'Pamir Travel'],
//        ];
//
//        foreach ($employerUsers as $userData) {
//            $user = User::updateOrCreate(
//                ['id' => $userData['id']],
//                [
//                    'name' => $userData['name'],
//                    'email' => $userData['email'],
//                    'password' => Hash::make('password123'),
//                    'email_verified_at' => now(),
//                ]
//            );
//            $user->assignRole('employer');
//        }
//
//        // Create job seeker users (IDs 8–47 for 35–40 profiles)
//        $maleFirstNames = ['Алишер', 'Фарход', 'Дилшод', 'Рустам', 'Саид', 'Джамшед', 'Фирдавс', 'Хуршед', 'Сафар', 'Икбол'];
//        $femaleFirstNames = ['Зарина', 'Мехрангез', 'Шахло', 'Нодира', 'Гулноз', 'Мавлуда', 'Зухра', 'Парвина', 'Мубина', 'Сабрина'];
//        $maleLastNames = ['Рахимов', 'Саидов', 'Нурматов', 'Мирзоев', 'Абдуллоев', 'Рахмонов', 'Исмоилов', 'Каримов'];
//        $femaleLastNames = ['Холматова', 'Шарипова', 'Кодирова', 'Хайдарова', 'Алиева', 'Гафурова', 'Сафарова', 'Рахимова', 'Саидова', 'Нурматова', 'Мирзоева', 'Абдуллоева', 'Рахмонова', 'Исмоилова', 'Каримова'];
//
//        for ($i = 8; $i <= 47; $i++) {
//            // Randomly decide gender (50% chance for male or female)
//            $isMale = rand(0, 1) === 0;
//            $firstName = $isMale ? $maleFirstNames[array_rand($maleFirstNames)] : $femaleFirstNames[array_rand($femaleFirstNames)];
//            $lastName = $isMale ? $maleLastNames[array_rand($maleLastNames)] : $femaleLastNames[array_rand($femaleLastNames)];
//            $gender = $isMale ? 'male' : 'female';
//
//            $user = User::updateOrCreate(
//                ['id' => $i],
//                [
//                    'name' => $firstName . ' ' . $lastName,
//                    'email' => 'jobseeker' . $i . '@example.tj',
//                    'password' => Hash::make('password123'),
//                    'email_verified_at' => now(),
//                ]
//            );
//            $user->assignRole('jobseeker');
//        }
//    }
//}


namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 30 employer users (IDs 1–30)
        $employerCompanies = [
            'Tajik IT Solutions', 'Pamir Education Center', 'Sihat Medical Clinic',
            'Bunyod Construction', 'Somoni Finance', 'Tajik Agro Co', 'Pamir Travel',
            'Dushanbe Tech Hub', 'Khujand Learning', 'Medical Plus', 'Build Master',
            'Finance Expert', 'Agro Plus', 'Tourism Tajik', 'IT Services Pro',
            'Education Center Elite', 'Health Care Tajik', 'Construction Pro',
            'Banking Solutions', 'Farm Tech', 'Travel Adventures', 'Code Factory',
            'Teaching Excellence', 'Clinical Services', 'Building Future',
            'Accounting Plus', 'Agricultural Solutions', 'Hotel Services',
            'Digital Agency', 'Training Center Pro'
        ];

        foreach ($employerCompanies as $index => $companyName) {
            $userId = $index + 1;
            $user = User::updateOrCreate(
                ['id' => $userId],
                [
                    'name' => $companyName,
                    'email' => strtolower(str_replace(' ', '', $companyName)) . '@example.tj',
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('employer');
        }

        // Create 170 job seeker users (IDs 31–200)
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

        for ($i = 31; $i <= 200; $i++) {
            // Randomly decide gender (50% chance for male or female)
            $isMale = rand(0, 1) === 0;
            $firstName = $isMale
                ? $maleFirstNames[array_rand($maleFirstNames)]
                : $femaleFirstNames[array_rand($femaleFirstNames)];
            $lastName = $isMale
                ? $maleLastNames[array_rand($maleLastNames)]
                : $femaleLastNames[array_rand($femaleLastNames)];

            $user = User::updateOrCreate(
                ['id' => $i],
                [
                    'name' => $firstName . ' ' . $lastName,
                    'email' => 'jobseeker' . $i . '@example.tj',
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('jobseeker');
        }
    }
}
