<?php

namespace App\Models\Vacancies;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'job_seeker_profile_id',
        'vacancy_id',
        'status',
        'salary_exception',
        'description',
        'get_to_work'
    ];

    public function jobseeker()
    {
        return $this->belongsTo(JobSeekerProfile::class, 'job_seeker_profile_id');
    }

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class, 'vacancy_id');
    }
}
