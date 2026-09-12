<?php

namespace Database\Seeders;

use App\Models\JobSeeker\Addition\AdditionCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdditionCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Резюме', 'slug' => 'resume'],
            ['name' => 'Сертификат', 'slug' => 'certificate'],
            ['name' => 'Портфолио', 'slug' => 'portfolio'],
            ['name' => 'Диплом', 'slug' => 'diploma'],
            ['name' => 'Проект', 'slug' => 'project'],
            ['name' => 'Достижения', 'slug' => 'achievement'],
        ];

        foreach ($categories as $category) {
            AdditionCategory::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
