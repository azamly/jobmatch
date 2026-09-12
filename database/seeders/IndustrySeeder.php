<?php

namespace Database\Seeders;

use App\Models\Industry;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industries = [
            ['name' => 'Информационные технологии (IT)', 'slug' => 'it'],
            ['name' => 'Образование', 'slug' => 'education'],
            ['name' => 'Здравоохранение', 'slug' => 'healthcare'],
            ['name' => 'Строительство', 'slug' => 'construction'],
            ['name' => 'Финансы и бухгалтерия', 'slug' => 'finance&accounting'],
            ['name' => 'Производство', 'slug' => 'production'],
            ['name' => 'Логистика и транспорт', 'slug' => 'logistics&transport'],
            ['name' => 'Маркетинг и реклама', 'slug' => 'marketing&ads'],
            ['name' => 'Сельское хозяйство', 'slug' => 'agricultural'],
            ['name' => 'Туризм и гостиницы', 'slug' => 'tourism&hotels'],
            ['name' => 'Государственная служба', 'slug' => 'public_service'],
            ['name' => 'Другое', 'slug' => 'other'],
        ];

        foreach ($industries as $industry) {
            Industry::firstOrCreate(['slug' => $industry['slug']], $industry);
        }
    }
}
