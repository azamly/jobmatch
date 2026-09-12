<?php

namespace Database\Seeders;

use App\Models\Chat\Group;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            LanguageProficiencySeeder::class,
            IndustrySeeder::class,
            VacancySeeder::class,
            JobSeekerSeeder::class,
            VacancyViewsSeeder::class,
        ]);
    }
}
