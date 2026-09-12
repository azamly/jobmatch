<?php

namespace App\Models\JobSeeker\Profile;

use App\Models\Industry;
use App\Models\JobSeeker\Addition\JobSeekerAddition;
use App\Models\JobSeeker\Education\JobSeekerEducation;
use App\Models\JobSeeker\Experience\JobSeekerExperience;
use App\Models\JobSeeker\Language\JobSeekerLanguage;
use App\Models\JobSeeker\Skill\JobSeekerSkill;
use App\Models\Recommended;
use App\Models\User;
use App\Models\Vacancies\Application;
use App\Models\Vacancies\Favorite;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobSeekerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'middle_name',
        'birth_date',
        'gender',
        'location',
        'address',
        'summary',
        'industry_id'
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];
    public function industry(){
        return $this->belongsTo(Industry::class);
    }
    public function links(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Link::class, 'linkable');
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function education():HasMany
    {
        return $this->hasMany(JobSeekerEducation::class,'job_seeker_profile_id');
    }

    public function experiences():HasMany
    {
        return $this->hasMany(JobSeekerExperience::class,'job_seeker_profile_id');
    }

    public function skills():HasMany
    {
        return $this->hasMany(JobSeekerSkill::class,'job_seeker_profile_id');
    }

    public function languages():HasMany
    {
        return $this->hasMany(JobSeekerLanguage::class,'job_seeker_profile_id');
    }

    public function additions():HasMany
    {
        return $this->hasMany(JobSeekerAddition::class,'job_seeker_profile_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }


    public function toText(): string
    {
        $parts = [];
        $parts[] = "Имя: {$this->first_name} {$this->last_name}";
        $parts[] = "Обо мне: {$this->summary}";
        $parts[] = "Локация: {$this->location}";

        foreach ($this->experiences as $exp) {
            $parts[] = "Опыт: {$exp->job_title} в {$exp->company_name}, {$exp->description}";
        }

        foreach ($this->skills as $skill) {
            $parts[] = "Навык: {$skill->name}";
        }

        foreach ($this->education as $edu) {
            $parts[] = "Образование: {$edu->degree} по {$edu->field_of_study} в {$edu->institution}";
        }

        return implode("\n", array_filter($parts));
    }

    public function recommended()
    {
        return $this->hasMany(Recommended::class,'vacancy_id');
    }
}
