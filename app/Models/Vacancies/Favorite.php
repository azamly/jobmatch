<?php

namespace App\Models\Vacancies;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['user_id','vacancy_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class, 'vacancy_id');
    }
}
