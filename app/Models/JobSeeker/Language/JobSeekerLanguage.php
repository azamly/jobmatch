<?php

namespace App\Models\JobSeeker\Language;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobSeekerLanguage extends Model
{
    protected $fillable = [
        'job_seeker_profile_id',
        'name',
        'language_proficiency_id',
        'sort_order'
    ];

    public function languageProficiency():BelongsTo
    {
        return $this->belongsTo(LanguageProficiency::class);
    }

    public function profile():BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }
}
