<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vacancies\Vacancy;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VacancyViewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all vacancies
        $vacancies = Vacancy::all()->pluck('id')->toArray();
        if (empty($vacancies)) {
            throw new \Exception('No vacancies found. Please seed vacancies first.');
        }

        // Get all job seeker users (IDs 31–200 based on UserSeeder)
        $jobSeekerUsers = User::whereBetween('id', [31, 200])->pluck('id')->toArray();
        if (empty($jobSeekerUsers)) {
            throw new \Exception('No job seeker users found. Please seed users first.');
        }

        // Generate 500–1000 fake vacancy views
        $totalViews = rand(500, 1000);

        for ($i = 0; $i < $totalViews; $i++) {
            // Randomly decide if the view is by a user or anonymous (30% chance for anonymous)
            $userId = rand(0, 100) < 30 ? null : $jobSeekerUsers[array_rand($jobSeekerUsers)];

            // Random vacancy
            $vacancyId = $vacancies[array_rand($vacancies)];

            // Random timestamp within the last 30 days
            $viewedAt = Carbon::today()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));

            // Create the view
            DB::table('vacancy_views')->insert([
                'vacancy_id' => $vacancyId,
                'user_id' => $userId,
                'viewed_at' => $viewedAt,
            ]);
        }
    }
}
