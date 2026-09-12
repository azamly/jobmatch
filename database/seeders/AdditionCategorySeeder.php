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
        AdditionCategory::create(['name'=>'Резюме','slug'=>'resume']);
        AdditionCategory::create(['name'=>'Сертификат','slug'=>'certificate']);
        AdditionCategory::create(['name'=>'Портфолио','slug'=>'portfolio']);
        AdditionCategory::create(['name'=>'Диплом','slug'=>'diploma']);
        AdditionCategory::create(['name'=>'Проект','slug'=>'project']);
        AdditionCategory::create(['name'=>'Достижения','slug'=>'achievement']);
    }
}
