<?php

namespace App\Models\Vacancies;

use App\Models\Employer\Employer;
use App\Models\Industry;
use App\Models\Recommended;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    protected $primaryKey = 'id';
    protected $casts = [
        'skills' => 'array',
    ];

    protected $fillable = [
        'title',
        'description',
        'salary_type',
        'salary_start',
        'salary_end',
        'location',
        'benefits',
        'responsibility',
        'qualifications',
        'type',
        'status',
        'education',
        'experience',
        'skills',
        'employer_id',
        'industry_id',
    ];

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function industry(){
        return $this->belongsTo(Industry::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class,'vacancy_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class,'vacancy_id');
    }

    public function views()
    {
        return $this->hasMany(VacancyView::class,'vacancy_id');
    }


    public function toText(): string
    {
        $parts = [];
        $parts[] = "Вакансия: {$this->title}";
        $parts[] = "Описание: {$this->description}";
        $parts[] = "Требования: {$this->qualifications}";
        $parts[] = "Опыт: {$this->experience}";
        $parts[] = "Образование: {$this->education}";
        $parts[] = "Навыки: " . (is_array($this->skills) ? implode(', ', $this->skills) : $this->skills);
        $parts[] = "Локация: {$this->location}";

        return implode("\n", array_filter($parts));
    }

    public function recommended()
    {
        return $this->hasMany(Recommended::class,'vacancy_id');
    }

}
