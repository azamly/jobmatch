<?php

namespace App\Models\JobSeeker\Addition;

use App\Models\JobSeeker\File\File;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use App\Models\JobSeeker\Profile\Link;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class JobSeekerAddition extends Model
{
    protected $fillable = [
        'job_seeker_profile_id',
        'addition_category_id',
        'title',
        'description',
        'sort_order'
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(AdditionCategory::class);
    }

    public function file(): MorphTo
    {
        return $this->morphTo(File::class, 'fileable');
    }

    public function links():MorphMany
    {
        return $this->morphMany(Link::class, 'linkable');
    }
}
