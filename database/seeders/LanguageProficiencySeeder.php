<?php

namespace Database\Seeders;

use App\Models\JobSeeker\Language\LanguageProficiency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LanguageProficiencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            ['title' => 'Beginner', 'level' => 'A1'],
            ['title' => 'Elementary', 'level' => 'A2'],
            ['title' => 'Pre-Intermediate', 'level' => 'B1'],
            ['title' => 'Intermediate', 'level' => 'B2'],
            ['title' => 'Upper-Intermediate', 'level' => 'C1'],
            ['title' => 'Pro', 'level' => 'C2'],
            ['title' => 'Native', 'level' => 'native'],
        ];

        foreach ($levels as $item) {
            LanguageProficiency::firstOrCreate(['level' => $item['level']], $item);
        }
    }
}
