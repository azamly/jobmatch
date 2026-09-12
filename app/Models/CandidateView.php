<?php

namespace App\Models;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use Illuminate\Database\Eloquent\Model;

class CandidateView extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'job_seeker_profile_id',
        'user_id',
        'viewed_at'
    ];

    protected $dates = ['viewed_at'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function jobSeekerProfile()
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }

}
