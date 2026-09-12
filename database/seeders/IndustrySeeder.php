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
        Industry::create(['name'=>'Информационные технологии (IT)','slug'=>'it']);
        Industry::create(['name'=>'Образование','slug'=>'education']);
        Industry::create(['name'=>'Здравоохранение','slug'=>'healthcare']);
        Industry::create(['name'=>'Строительство','slug'=>'construction']);
        Industry::create(['name'=>'Финансы и бухгалтерия','slug'=>'finance&accounting']);
        Industry::create(['name'=>'Производство','slug'=>'production']);
        Industry::create(['name'=>'Логистика и транспорт','slug'=>'logistics&transport']);
        Industry::create(['name'=>'Маркетинг и реклама','slug'=>'marketing&ads']);
        Industry::create(['name'=>'Сельское хозяйство','slug'=>'agricultural']);
        Industry::create(['name'=>'Туризм и гостиницы','slug'=>'tourism&hotels']);
        Industry::create(['name'=>'Государственная служба','slug'=>'public_service']);
        Industry::create(['name'=>'Другое','slug'=>'other']);
    }
}
