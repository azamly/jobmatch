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
        LanguageProficiency::create(['title'=>'Beginner','level'=>'A1']);
        LanguageProficiency::create(['title'=>'Elementary','level'=>'A2']);
        LanguageProficiency::create(['title'=>'Pre-Intermediate','level'=>'B1']);
        LanguageProficiency::create(['title'=>'Intermediate','level'=>'B2']);
        LanguageProficiency::create(['title'=>'Upper-Intermediate','level'=>'C1']);
        LanguageProficiency::create(['title'=>'Pro','level'=>'C2']);
        LanguageProficiency::create(['title'=>'Native','level'=>'native']);
    }
}
