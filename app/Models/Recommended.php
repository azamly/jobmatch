<?php

namespace App\Models;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\Vacancies\Vacancy;
use Illuminate\Database\Eloquent\Model;

class Recommended extends Model
{
    protected $fillable = [
        'job_seeker_profile_id',
        'vacancy_id',
        'score'
    ];

    public function jobseeker(){
        return $this->belongsTo(JobSeekerProfile::class,'job_seeker_profile_id');
    }

    public function vacancy(){
        return $this->belongsTo(Vacancy::class);
    }
}
