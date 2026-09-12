<?php

namespace App\Models\Employer;

use App\Models\JobSeeker\Profile\Link;
use App\Models\User;
use App\Models\Vacancies\Vacancy;
use App\Models\Employer\EmployerView;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employer extends Model
{
    protected $fillable = [
        'company_name',
        'company_address',
        'company_website',
        'description',
        'user_id'
    ];

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function links(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Link::class, 'linkable');
    }

    public function vacancies()
    {
        return $this->hasMany(Vacancy::class);
    }

    public function views()
    {
        return $this->hasMany(EmployerView::class, 'employer_id');
    }
}
