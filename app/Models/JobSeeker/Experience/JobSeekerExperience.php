<?php

namespace App\Models\JobSeeker\Experience;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobSeekerExperience extends Model
{
    protected $fillable = [
        'job_seeker_profile_id',
        'job_title',
        'company_name',
        'company_address',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'sort_order'
    ];

    public function profile():BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }
}
